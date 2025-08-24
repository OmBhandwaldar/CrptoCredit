// // lib/aptos.ts
// import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// // Configure Aptos client (using TESTNET — switch to MAINNET later if needed)
// const config = new AptosConfig({ network: Network.DEVNET });
// export const aptos = new Aptos(config);

// export async function fetchCreditAccount(userAddress: string) {
//   const contractAddress =
//     "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd";
//   const moduleName = "CreditManager";
//   const functionName = "get_account";

//   try {
//     const response = await aptos.view({
//       payload: {
//         function: `${contractAddress}::${moduleName}::${functionName}`,
//         functionArguments: [userAddress],
//       },
//     });

//     // Response is array of strings/booleans
//     const [creditLimitRaw, borrowedRaw, dueDateRaw, reputationRaw, kycRaw] =
//       response as any[];

//     const creditLimit = Number(creditLimitRaw);
//     const borrowed = Number(borrowedRaw);

//     return {
//       walletAddress: userAddress,
//       creditLimit: creditLimit / 1e6, // assuming USDC has 6 decimals
//       borrowedAmount: borrowed / 1e6,
//       utilizationPercentage: creditLimit
//         ? Math.round((borrowed / creditLimit) * 100)
//         : 0,
//       dueDate: new Date(Number(dueDateRaw) * 1000).toISOString(),
//       isOverdue: Number(dueDateRaw) * 1000 < Date.now(),
//       isKycVerified: Boolean(kycRaw),
//       usdcBalance: (creditLimit - borrowed) / 1e6,
//     };
//   } catch (e) {
//     console.error("Failed to fetch account from contract:", e);
//     throw e;
//   }
// }





import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// import { EntryFunctionPayload } from "@aptos-labs/ts-sdk";
// Configure Aptos client (using DEVNET for now)
const config = new AptosConfig({ network: Network.DEVNET });
export const aptos = new Aptos(config);

const REPUTATION_MODULE_ADDR =
  "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd"; // replace with your addr

// export async function mintReputationNFT(signAndSubmitTransaction: any) {
//   try {
//     const payload: InputTransactionData = {
//       data: {
//         function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::mint`,
//         functionArguments: [],
//       },
//     };

//     // Use wallet adapter’s signer
//     const response = await signAndSubmitTransaction(payload);

//     // Wait for confirmation
//     await aptos.waitForTransaction({ transactionHash: response.hash });

//     console.log("✅ ReputationNFT minted!", response.hash);
//     return response.hash;
//   } catch (err) {
//     console.error("❌ Mint failed:", err);
//     throw err;
//   }
// }
// export async function mintReputationNFT(signAndSubmitTransaction: any) {
//   try {
//     const payload: InputTransactionData = {
//       type: "entry_function_payload",
//       function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::mint`,
//       typeArguments: [],
//       functionArguments: [],
//     };

//     const response = await signAndSubmitTransaction({ payload });
//     await aptos.waitForTransaction({ transactionHash: response.hash });

//     console.log("✅ ReputationNFT minted!", response.hash);
//     return response.hash;
//   } catch (err) {
//     console.error("❌ Mint failed:", err);
//     throw err;
//   }
// }

export async function mintReputationNFT(signAndSubmitTransaction: any) {
  try {
    const payload: InputTransactionData = {
      data: {
        function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::mint`,
        functionArguments: [],
      },
    };

    // Send via wallet adapter
    const response = await signAndSubmitTransaction(payload);

    // Wait for confirmation
    await aptos.waitForTransaction({ transactionHash: response.hash });

    console.log("✅ ReputationNFT minted!", response.hash);
    return response.hash;
  } catch (err) {
    console.error("❌ Mint failed:", err);
    throw err;
  }
}
export async function fetchReputationLevel(userAddress: string) {
  try {
    const payload = {
      function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::get` as `${string}::${string}::${string}`,
      functionArguments: [REPUTATION_MODULE_ADDR, userAddress],
    };

    const simulation = await aptos.view({
      payload,
    });

    const level = Number(simulation[0]);
    console.log("Reputation level for", userAddress, ":", level);
    return level;
  } catch (e) {
    console.error("Failed to fetch reputation level:", e);
    return 0;
  }
}



export async function fetchCreditAccount(userAddress: string) {
  const contractAddress =
    "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd";
  const moduleName = "CreditManager";
  const functionName = "get_account";

  try {
    const response = await aptos.view({
      payload: {
        function: `${contractAddress}::${moduleName}::${functionName}`,
        functionArguments: [userAddress],
      },
    });

    // Response: [creditLimit, borrowed, dueDate, reputation, kycVerified]
    const [creditLimitRaw, borrowedRaw, dueDateRaw, , kycRaw] =
      response as any[];

    const creditLimit = Number(creditLimitRaw);
    const borrowed = Number(borrowedRaw);

    return {
      walletAddress: userAddress,
      creditLimit: creditLimit / 1e6, // USDC = 6 decimals
      borrowedAmount: borrowed / 1e6,
      utilizationPercentage: creditLimit
        ? Math.round((borrowed / creditLimit) * 100)
        : 0,
      dueDate: new Date(Number(dueDateRaw) * 1000).toISOString(),
      isOverdue: Number(dueDateRaw) * 1000 < Date.now(),
      isKycVerified: Boolean(kycRaw),
      usdcBalance: (creditLimit - borrowed) / 1e6,
    };
  } catch (e) {
    console.error("Failed to fetch account from contract:", e);
    throw e;
  }
}

//-------------------------------
// lib/aptos.ts
// import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// // Configure Aptos client (using DEVNET for now)
// const config = new AptosConfig({ network: Network.DEVNET });
// export const aptos = new Aptos(config);
// const REPUTATION_MODULE_ADDR = "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd"; // replace with your addr

// export async function mintReputationNFT(account: any) {
//   try {
//     const txn = await aptos.transaction.build.simple({
//       sender: account.address(),
//       data: {
//         function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::mint`,
//         functionArguments: [],
//       },
//     });

//     const pendingTxn = await aptos.signAndSubmitTransaction({ signer: account, transaction: txn });
//     await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });

//     console.log("✅ ReputationNFT minted!");
//   } catch (err) {
//     console.error("❌ Mint failed:", err);
//   }
// }
// export async function fetchCreditAccount(userAddress: string) {
//   const contractAddress =
//     "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd";
//   const moduleName = "CreditManager";
//   const functionName = "get_account";

//   try {
//     const response = await aptos.view({
//       payload: {
//         function: `${contractAddress}::${moduleName}::${functionName}`,
//         functionArguments: [userAddress],
//       },
//     });

//     // Response: [creditLimit, borrowed, dueDate, reputation, kycVerified]
//     const [creditLimitRaw, borrowedRaw, dueDateRaw, , kycRaw] =
//       response as any[];

//     const creditLimit = Number(creditLimitRaw);
//     const borrowed = Number(borrowedRaw);

//     return {
//       walletAddress: userAddress,
//       creditLimit: creditLimit / 1e6, // USDC = 6 decimals
//       borrowedAmount: borrowed / 1e6,
//       utilizationPercentage: creditLimit
//         ? Math.round((borrowed / creditLimit) * 100)
//         : 0,
//       dueDate: new Date(Number(dueDateRaw) * 1000).toISOString(),
//       isOverdue: Number(dueDateRaw) * 1000 < Date.now(),
//       isKycVerified: Boolean(kycRaw),
//       usdcBalance: (creditLimit - borrowed) / 1e6,
//     };
//   } catch (e) {
//     console.error("Failed to fetch account from contract:", e);
//     throw e;
//   }
// }


export async function fetchAccruedInterest(userAddress: string): Promise<number> {
  const functionName = "compute_interest";
    const contractAddress =
    "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd";
  const moduleName = "CreditManager";

  try {
    const response = await aptos.view({
      payload: {
        function: `${contractAddress}::${moduleName}::${functionName}`,
        functionArguments: [userAddress],
      },
    });

    // response will be an array like [u64]
    const interestRaw = response[0] as string | number | bigint;

    // Convert to number of tokens (assuming interest is in USDC with 6 decimals like borrowed)
    return Number(interestRaw) / 1e6;
  } catch (e) {
    console.error("Failed to fetch accrued interest:", e);
    return 0;
  }
}