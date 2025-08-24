// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { fetchCreditAccount } from "@/lib/aptos";

// interface CreditData {
//   walletAddress: string;
//   creditLimit: number;
//   borrowedAmount: number;
//   utilizationPercentage: number;
//   dueDate: string;
//   isOverdue: boolean;
//   isKycVerified: boolean;
//   usdcBalance: number;
// }

// export default function CreditDashboard() {
//   const [creditData, setCreditData] = useState<CreditData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true);
//       try {
//         const userAddr =
//           "0x1fffeaab08b46f61bc2aa1b9425cbdc3692713456f80327f6d4c4bc1f0964391"; // recipient2
//         const account = await fetchCreditAccount(userAddr);
//         setCreditData(account);
//       } catch (err) {
//         console.error("Error loading data:", err);
//         toast.error("Failed to load blockchain data");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   const handleBorrow = () => {
//     toast.info("Borrow transaction coming soon 🚀");
//   };

//   const handleRepay = () => {
//     toast.info("Repay transaction coming soon 🔄");
//   };

//   if (isLoading) {
//     return <div className="p-6 text-lg">Loading blockchain data...</div>;
//   }

//   if (!creditData) {
//     return <div className="p-6 text-red-500">No data available.</div>;
//   }

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {/* Credit Limit */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Credit Limit</h2>
//             <p className="text-2xl font-bold">
//               ${creditData.creditLimit.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Borrowed Amount */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Borrowed Amount</h2>
//             <p className="text-2xl font-bold">
//               ${creditData.borrowedAmount.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Utilization */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Utilization</h2>
//             <p className="text-2xl font-bold">
//               {creditData.utilizationPercentage}%
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Due Date */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Due Date</h2>
//             <p className="text-xl font-bold">
//               {new Date(creditData.dueDate).toLocaleDateString()}
//             </p>
//             {creditData.isOverdue && (
//               <p className="text-red-500 text-sm">⚠ Overdue</p>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* KYC Status */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">KYC Status</h2>
//             <p className="text-xl font-bold">
//               {creditData.isKycVerified ? "✅ Verified" : "❌ Not Verified"}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Wallet Balance */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Available USDC</h2>
//             <p className="text-2xl font-bold">
//               ${creditData.usdcBalance.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Actions */}
//       <div className="col-span-1 md:col-span-2 lg:col-span-3 flex gap-4 justify-center mt-6">
//         <Button
//           className="rounded-2xl px-6 py-3 bg-green-600 hover:bg-green-700"
//           onClick={handleBorrow}
//         >
//           Borrow
//         </Button>
//         <Button
//           className="rounded-2xl px-6 py-3 bg-blue-600 hover:bg-blue-700"
//           onClick={handleRepay}
//         >
//           Repay
//         </Button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { fetchCreditAccount, aptos } from "@/lib/aptos";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";

// interface CreditData {
//   walletAddress: string;
//   creditLimit: number;
//   borrowedAmount: number;
//   utilizationPercentage: number;
//   dueDate: string;
//   isOverdue: boolean;
//   isKycVerified: boolean;
//   usdcBalance: number;
// }

// export default function CreditDashboard() {
//   const [creditData, setCreditData] = useState<CreditData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { account, signAndSubmitTransaction } = useWallet();

//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true);
//       try {
//         const userAddr =
//           "0x1fffeaab08b46f61bc2aa1b9425cbdc3692713456f80327f6d4c4bc1f0964391"; // recipient2
//         const accountData = await fetchCreditAccount(userAddr);
//         setCreditData(accountData);
//       } catch (err) {
//         console.error("Error loading data:", err);
//         toast.error("Failed to load blockchain data");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   const handleRepay = async () => {
//     if (!account) {
//       toast.error("Connect your wallet first ⚠️");
//       console.log('no acc');
//       return;
//     }
//         // sender: account.address.toString(),

//     try {
//       const response = await signAndSubmitTransaction({
//         sender: account.address,
//         data: {
//           function:
//             "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd::CreditManager::repay",
//           functionArguments: [1000000], // Repay 1 USDC (6 decimals)
//         },
//       });

//       await aptos.waitForTransaction({ transactionHash: response.hash });

//       toast.success("Repay successful ✅");
//     } catch (err) {
//       console.error("Repay failed:", err);
//       toast.error("Repay transaction failed ❌");
//     }
//   };


//   // const handleBorrow = () => {
//   //   toast.info("Borrow transaction coming soon 🚀");
//   // };

//   const handleBorrow = async () => {
//   if (!account) {
//     console.log('no acc from handleBorrow')
//     toast.error("Connect your wallet first ⚠️");
//     return;
//   }

//   try {
//     const response = await fetch("/api/borrow", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userAddress: account.address.toString(),
//         amount: 1000000, // 1 USDC (6 decimals)
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       toast.success(`Borrow successful ✅ Txn: ${data.hash}`);
//     } else {
//       console.log('error from response.ok in handle borrow')
//       toast.error(`Borrow failed ❌: ${data.error}`);
//     }
//   } catch (err) {
//     console.error("Borrow failed:", err);
//     toast.error("Borrow transaction failed ❌");
//   }
// };

//   if (isLoading) {
//     return <div className="p-6 text-lg">Loading blockchain data...</div>;
//   }

//   if (!creditData) {
//     return <div className="p-6 text-red-500">No data available.</div>;
//   }

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {/* Credit Limit */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Credit Limit</h2>
//             <p className="text-2xl font-bold">
//               ${creditData.creditLimit.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Borrowed Amount */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Borrowed Amount</h2>
//             <p className="text-2xl font-bold">
//               ${creditData.borrowedAmount.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Utilization */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Utilization</h2>
//             <p className="text-2xl font-bold">
//               {creditData.utilizationPercentage}%
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Due Date */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Due Date</h2>
//             <p className="text-xl font-bold">
//               {new Date(creditData.dueDate).toLocaleDateString()}
//             </p>
//             {creditData.isOverdue && (
//               <p className="text-red-500 text-sm">⚠ Overdue</p>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* KYC Status */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">KYC Status</h2>
//             <p className="text-xl font-bold">
//               {creditData.isKycVerified ? "✅ Verified" : "❌ Not Verified"}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Wallet Balance */}
//       <motion.div whileHover={{ scale: 1.05 }}>
//         <Card className="shadow-lg rounded-2xl">
//           <CardContent className="p-6">
//             <h2 className="text-lg font-semibold">Available USDC</h2>
//             <p className="text-2xl font-bold">
//               ${creditData.usdcBalance.toFixed(2)}
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Actions */}
//       <div className="col-span-1 md:col-span-2 lg:col-span-3 flex gap-4 justify-center mt-6">
//         <Button
//           className="rounded-2xl px-6 py-3 bg-green-600 hover:bg-green-700"
//           onClick={handleBorrow}
//         >
//           Borrow
//         </Button>
//         <Button
//           className="rounded-2xl px-6 py-3 bg-blue-600 hover:bg-blue-700"
//           onClick={handleRepay}
//         >
//           Repay
//         </Button>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { fetchCreditAccount, aptos } from "@/lib/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface CreditData {
  walletAddress: string;
  creditLimit: number;
  borrowedAmount: number;
  utilizationPercentage: number;
  dueDate: string;
  isOverdue: boolean;
  isKycVerified: boolean;
  usdcBalance: number;
}

export default function CreditDashboard() {
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { account, signAndSubmitTransaction } = useWallet();

  // dialog + input states
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [inputAmount, setInputAmount] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const userAddr =
          "0x1fffeaab08b46f61bc2aa1b9425cbdc3692713456f80327f6d4c4bc1f0964391"; // hardcoded for now
        const accountData = await fetchCreditAccount(userAddr);
        setCreditData(accountData);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load blockchain data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // ---- Borrow ----
  const handleBorrowConfirm = async () => {
    if (!account || !creditData) return;

    const amount = Number(inputAmount) * 1e6; // convert to 6 decimals

    if (amount <= 0) {
      setInputError("Enter a valid amount");
      return;
    }
    if (amount > creditData.usdcBalance * 1e6) {
      setInputError("Amount exceeds your available credit");
      return;
    }

    try {
      const response = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: account.address.toString(),
          amount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Borrow successful ✅ Txn: ${data.hash}`);
        setBorrowDialogOpen(false);
      } else {
        setInputError(`Borrow failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Borrow failed:", err);
      setInputError("Borrow transaction failed");
    }
  };

  // ---- Repay ----
  // const handleRepayConfirm = async () => {
  //   if (!account || !creditData) return;

  //   const amount = Number(inputAmount) * 1e6; // convert to 6 decimals

  //   if (amount <= 0) {
  //     setInputError("Enter a valid amount");
  //     return;
  //   }
  //   if (amount > creditData.borrowedAmount * 1e6) {
  //     setInputError("You can’t repay more than you borrowed");
  //     return;
  //   }

  //   try {
  //     const response = await signAndSubmitTransaction({
  //       sender: account.address,
  //       data: {
  //         function:
  //           "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd::CreditManager::repay",
  //         functionArguments: [amount],
  //       },
  //     });

  //     await aptos.waitForTransaction({ transactionHash: response.hash });
  //     toast.success("Repay successful ✅");
  //     setRepayDialogOpen(false);
  //   } catch (err) {
  //     console.error("Repay failed:", err);
  //     setInputError("Repay transaction failed");
  //   }
  // };
  const handleRepayConfirm = async () => {
  if (!account || !creditData) return;

  const amount = Number(inputAmount) * 1e6; // convert to 6 decimals

  if (amount <= 0) {
    setInputError("Enter a valid amount");
    return;
  }
  if (amount > creditData.borrowedAmount * 1e6) {
    setInputError("You can’t repay more than you borrowed");
    return;
  }

  try {
    // 1) User signs the repay transaction
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function:
          "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd::CreditManager::repay",
        functionArguments: [amount],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });

    // 2) Check locally if this repay clears the full debt
    const paidOff = amount >= creditData.borrowedAmount * 1e6;

    if (paidOff) {
      // 3) Notify backend to increment reputation
      await fetch("/api/repay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: account.address.toString(),
          paidOff: true,
        }),
      });
    }

    toast.success("Repay successful ✅");
    setRepayDialogOpen(false);
  } catch (err) {
    console.error("Repay failed:", err);
    setInputError("Repay transaction failed");
  }
};


  if (isLoading) {
    return <div className="p-6 text-lg">Loading blockchain data...</div>;
  }

  if (!creditData) {
    return <div className="p-6 text-red-500">No data available.</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Credit Limit */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Credit Limit</h2>
            <p className="text-2xl font-bold">
              ${creditData.creditLimit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Borrowed Amount */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Borrowed Amount</h2>
            <p className="text-2xl font-bold">
              ${creditData.borrowedAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Utilization */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Utilization</h2>
            <p className="text-2xl font-bold">
              {creditData.utilizationPercentage}%
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Due Date */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Due Date</h2>
            <p className="text-xl font-bold">
              {new Date(creditData.dueDate).toLocaleDateString()}
            </p>
            {creditData.isOverdue && (
              <p className="text-red-500 text-sm">⚠ Overdue</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* KYC Status */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">KYC Status</h2>
            <p className="text-xl font-bold">
              {creditData.isKycVerified ? "✅ Verified" : "❌ Not Verified"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Balance */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Available USDC</h2>
            <p className="text-2xl font-bold">
              ${creditData.usdcBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex gap-4 justify-center mt-6">
        <Button
          className="rounded-2xl px-6 py-3 bg-green-600 hover:bg-green-700"
          onClick={() => {
            setInputAmount("");
            setInputError("");
            setBorrowDialogOpen(true);
          }}
        >
          Borrow
        </Button>
        <Button
          className="rounded-2xl px-6 py-3 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setInputAmount("");
            setInputError("");
            setRepayDialogOpen(true);
          }}
        >
          Repay
        </Button>
      </div>

      {/* Borrow Dialog */}
      <Dialog open={borrowDialogOpen} onOpenChange={setBorrowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow USDC</DialogTitle>
          </DialogHeader>
          {inputError && <p className="text-red-500 text-sm mb-2">{inputError}</p>}
          <Input
            type="number"
            placeholder="Amount in USDC"
            value={inputAmount}
            onChange={(e) => {
              setInputAmount(e.target.value);
              setInputError("");
            }}
          />
          <DialogFooter>
            <Button onClick={handleBorrowConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repay Dialog */}
      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repay USDC</DialogTitle>
          </DialogHeader>
          {inputError && <p className="text-red-500 text-sm mb-2">{inputError}</p>}
          <Input
            type="number"
            placeholder="Amount in USDC"
            value={inputAmount}
            onChange={(e) => {
              setInputAmount(e.target.value);
              setInputError("");
            }}
          />
          <DialogFooter>
            <Button onClick={handleRepayConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
