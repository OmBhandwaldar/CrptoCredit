// import type { NextApiRequest, NextApiResponse } from "next";
// import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

// // Configure Aptos client
// const config = new AptosConfig({ network: Network.DEVNET });
// const aptos = new Aptos(config);

// // Load admin account securely (⚠️ never expose in frontend)
// const privateKeyHex = process.env.ADMIN_PRIVATE_KEY as string;
// const privateKey = new Ed25519PrivateKey(privateKeyHex);
// const admin = Account.fromPrivateKey({ privateKey });

// const MODULE_ADDRESS =
//   "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { userAddress, amount } = req.body;

//     if (!userAddress || !amount) {
//       return res.status(400).json({ error: "Missing userAddress or amount" });
//     }

//     // Build transaction
//     const txn = await aptos.transaction.build.simple({
//       sender: admin.accountAddress.toString(),
//       data: {
//         function: `${MODULE_ADDRESS}::CreditManager::disburse`,
//         functionArguments: [userAddress, amount],
//       },
//     });

//     // Sign & submit
//     const signedTxn = await aptos.signAndSubmitTransaction({
//       signer: admin,
//       transaction: txn,
//     });

//     await aptos.waitForTransaction({ transactionHash: signedTxn.hash });

//     res.status(200).json({ hash: signedTxn.hash });
//   } catch (err) {
//     console.error("Borrow API failed:", err);
//     res.status(500).json({ error: "Borrow transaction failed" });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const privateKeyHex = process.env.ADMIN_PRIVATE_KEY as string;
const privateKey = new Ed25519PrivateKey(privateKeyHex);
const admin = Account.fromPrivateKey({ privateKey });

const MODULE_ADDRESS =
  "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd";

export async function POST(req: NextRequest) {
  try {
    const { userAddress, amount } = await req.json();

    if (!userAddress || !amount) {
      return NextResponse.json({ error: "Missing userAddress or amount" }, { status: 400 });
    }

    const txn = await aptos.transaction.build.simple({
      sender: admin.accountAddress.toString(),
      data: {
        function: `${MODULE_ADDRESS}::CreditManager::disburse`,
        functionArguments: [userAddress, amount],
      },
    });

    const signedTxn = await aptos.signAndSubmitTransaction({
      signer: admin,
      transaction: txn,
    });

    await aptos.waitForTransaction({ transactionHash: signedTxn.hash });

    return NextResponse.json({ hash: signedTxn.hash }, { status: 200 });
  } catch (err) {
    console.error("Borrow API failed:", err);
    return NextResponse.json({ error: "Borrow transaction failed" }, { status: 500 });
  }
}
