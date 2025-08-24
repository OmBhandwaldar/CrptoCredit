// app/api/repay/route.ts
import { NextResponse } from "next/server";
import { aptos } from "@/lib/aptos";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

// .env
// ADMIN_PRIVATE_KEY=0x...           (Ed25519 private key hex, with 0x)
// REPUTATION_MODULE_ADDR=0x...       (publisher address of ReputationNFT)

const REPUTATION_MODULE_ADDR = process.env.REPUTATION_MODULE_ADDR!;
const ADMIN_PRIVATE_KEY_HEX = process.env.ADMIN_PRIVATE_KEY!;

const admin = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(ADMIN_PRIVATE_KEY_HEX),
});

export async function POST(req: Request) {
  try {
    const { userAddress, paidOff } = await req.json();

    if (!userAddress) {
      return NextResponse.json({ error: "userAddress is required" }, { status: 400 });
    }

    // If the frontend says it's a full payoff, increment on-chain count.
    if (paidOff) {
      const txn = await aptos.transaction.build.simple({
        sender: admin.accountAddress, // NOT string; pass the accountAddress object
        data: {
          function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::increment_repay_count`,
          functionArguments: [userAddress],
        },
      });

      const submitted = await aptos.signAndSubmitTransaction({ signer: admin, transaction: txn });
      await aptos.waitForTransaction({ transactionHash: submitted.hash });

      return NextResponse.json({
        ok: true,
        incremented: true,
        reputationTxn: submitted.hash,
      });
    } else {
      // Not a full payoff; no reputation change.
      return NextResponse.json({ ok: true, incremented: false });
    }
  } catch (err: any) {
    console.error("repay backend error:", err);
    return NextResponse.json({ error: err?.message ?? "internal error" }, { status: 500 });
  }
}
