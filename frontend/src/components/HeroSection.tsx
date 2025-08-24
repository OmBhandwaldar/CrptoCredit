// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Zap } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useKyc } from "@/contexts/KycContext";

// interface HeroSectionProps {
//   className?: string;
// }

// export default function HeroSection({ className }: HeroSectionProps) {
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState<"kyc" | "wallet">("kyc");

//   const { setKycCompleted, setWalletConnected } = useKyc();

//   const handleVerify = () => {
//     setKycCompleted(true);
//     setStep("wallet");
//   };

//   const handleConnectWallet = async () => {
//     try {
//       if ((window as any).aptos) {
//         const response = await (window as any).aptos.connect();
//         console.log("Connected account:", response.address);
//         setWalletConnected(true);
//         setOpen(false); // close dialog after wallet connect
//       } else {
//         alert("Petra wallet not found!");
//       }
//     } catch (err) {
//       console.error("Wallet connection failed", err);
//     }
//   };

//   return (
//     <section
//       className={`relative min-h-screen bg-background flex items-center justify-center overflow-hidden ${className}`}
//     >
//       {/* Floating decorative elements */}
//       <motion.div
//         animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute top-1/4 left-1/4 text-accent opacity-20"
//       >
//         <Sparkles size={24} />
//       </motion.div>

//       <motion.div
//         animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
//         className="absolute top-1/3 right-1/3 text-primary opacity-30"
//       >
//         <Zap size={20} />
//       </motion.div>

//       <motion.div
//         animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
//         className="absolute bottom-1/3 left-1/5 text-accent opacity-25"
//       >
//         <Sparkles size={16} />
//       </motion.div>

//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

//       {/* Content */}
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 max-w-4xl mx-auto px-6 text-center"
//       >
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6"
//         >
//           Reimagining{" "}
//           <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             Credit
//           </span>{" "}
//           in Web3
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
//         >
//           Unlock the future of decentralized lending credit assessment,
//           transparent protocols, and seamless blockchain integration for the
//           next generation of finance.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="flex flex-col sm:flex-row gap-6 justify-center items-center"
//         >
//           <Button
//             size="lg"
//             onClick={() => setOpen(true)}
//             className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-4 h-auto text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             Upgrade Yourself With Credit
//             <ArrowRight className="ml-2 h-5 w-5" />
//           </Button>
//         </motion.div>
//       </motion.div>

//       {/* Dialog Box */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">Quick KYC</DialogTitle>
//           </DialogHeader>

//           <AnimatePresence mode="wait">
//             {step === "kyc" && (
//               <motion.div
//                 key="kyc-step"
//                 initial={{ x: "100%", opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: "-100%", opacity: 0 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//                 className="flex flex-col gap-4"
//               >
//                 <h3 className="text-lg font-semibold">Verify your documents</h3>
//                 <div className="flex flex-col gap-3">
//                   <Input placeholder="Select Country" />
//                   <Input placeholder="Enter Identification Number" />
//                 </div>
//                 <Button onClick={handleVerify} className="mt-4">
//                   Verify
//                 </Button>
//               </motion.div>
//             )}

//             {step === "wallet" && (
//               <motion.div
//                 key="wallet-step"
//                 initial={{ x: "-100%", opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: "100%", opacity: 0 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//                 className="flex flex-col gap-4"
//               >
//                 <h3 className="text-lg font-semibold">Connect Wallet</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Connect wallet for crypto address checks and further transactions.
//                 </p>
//                 <Button onClick={handleConnectWallet} className="mt-2">
//                   Connect Petra Wallet
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }



//--------------------------------------------------------
// "use client";

// import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Zap } from "lucide-react";
// import { motion, AnimatePresence, easeInOut } from "framer-motion";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";

// interface HeroSectionProps {
//   className?: string;
//   onKycComplete?: () => void; // to notify NavigationHeader
// }

// export default function HeroSection({ className, onKycComplete }: HeroSectionProps) {
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState<"kyc" | "wallet">("kyc");
//   const [country, setCountry] = useState("");
//   const [idNumber, setIdNumber] = useState("");
//   const [errors, setErrors] = useState<{ country?: string; id?: string }>({});
//   const { connect, connected, account } = useWallet();

//   const handleVerify = () => {
//     const errs: typeof errors = {};
//     if (!country) errs.country = "Country is required";
//     if (!idNumber) errs.id = "Identification number is required";
//     setErrors(errs);

//     if (Object.keys(errs).length === 0) {
//       setStep("wallet");
//     }
//   };

//   const handleConnectWallet = async () => {
//     try {
//       await connect("Petra");
//       if (connected && account) {
//         onKycComplete?.();
//         setOpen(false);
//       }
//     } catch (err) {
//       console.error("Wallet connection failed", err);
//     }
//   };

//   // Animations
//   const slideVariants = {
//     initial: { x: "100%", opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//     exit: { x: "-100%", opacity: 0 },
//     transition: { duration: 0.4, ease: "easeInOut" },
//   };

//   return (
//     <section
//       className={`relative min-h-screen bg-background flex items-center justify-center overflow-hidden ${className}`}
//     >
//       {/* Floating decorative elements */}
//       <motion.div
//         animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute top-1/4 left-1/4 text-accent opacity-20"
//       >
//         <Sparkles size={24} />
//       </motion.div>
//       <motion.div
//         animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
//         className="absolute top-1/3 right-1/3 text-primary opacity-30"
//       >
//         <Zap size={20} />
//       </motion.div>
//       <motion.div
//         animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
//         className="absolute bottom-1/3 left-1/5 text-accent opacity-25"
//       >
//         <Sparkles size={16} />
//       </motion.div>

//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

//       {/* Content */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 max-w-4xl mx-auto px-6 text-center"
//       >
//         <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
//           Reimagining{" "}
//           <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             Credit
//           </span>{" "}
//           in Web3
//         </h1>

//         <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
//           Unlock the future of decentralized lending credit assessment,
//           transparent protocols, and seamless blockchain integration for the
//           next generation of finance.
//         </p>

//         <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//           <Button
//             size="lg"
//             onClick={() => setOpen(true)}
//             className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-4 h-auto text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             Upgrade Yourself With Credit
//             <ArrowRight className="ml-2 h-5 w-5" />
//           </Button>
//         </motion.div>

//         {/* Badges */}
//         <div className="mt-16 flex justify-center items-center gap-8 text-sm text-muted-foreground">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-accent rounded-full"></div>
//             <span>Decentralized</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-primary rounded-full"></div>
//             <span>Seamless</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
//             <span>Transparent</span>
//           </div>
//         </div>
//       </motion.div>

//       {/* KYC Modal */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {step === "kyc" ? "Quick KYC" : "Connect Wallet"}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="relative min-h-[200px] overflow-hidden">
//             <AnimatePresence mode="wait">
//               {step === "kyc" && (
//                 <motion.div
//                   key="kyc-step1"
//                   initial={{ x: "100%", opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   exit={{ x: "-100%", opacity: 0 }}
//                   transition={{ duration: 0.6, ease: easeInOut }}
//                   className="flex flex-col gap-6"
//                 >
//                   <h2 className="text-lg font-semibold">Verify your documents</h2>
//                   <div>
//                     <label className="text-sm">Select Country</label>
//                     <Input
//                       value={country}
//                       onChange={(e) => setCountry(e.target.value)}
//                       placeholder="Enter your country"
//                     />
//                     {errors.country && (
//                       <p className="text-red-500 text-xs mt-1">{errors.country}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="text-sm">Identification Number</label>
//                     <Input
//                       value={idNumber}
//                       onChange={(e) => setIdNumber(e.target.value)}
//                       placeholder="Enter ID number"
//                     />
//                     {errors.id && (
//                       <p className="text-red-500 text-xs mt-1">{errors.id}</p>
//                     )}
//                   </div>
//                   <Button onClick={handleVerify}>Verify</Button>
//                 </motion.div>
//               )}

//               {step === "wallet" && (
//                 <motion.div
//                   key="kyc-step1"
//                   initial={{ x: "100%", opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   exit={{ x: "-100%", opacity: 0 }}
//                   transition={{ duration: 0.6, ease: easeInOut }}
//                   className="flex flex-col gap-6"
//                 >
//                   <h2 className="text-lg font-semibold">
//                     Connect Wallet for crypto address checks
//                   </h2>
//                   {!connected || !account ? (
//                     <Button onClick={handleConnectWallet}>Connect Petra</Button>
//                   ) : (
//                     <div className="text-center space-y-4">
//                       <p className="text-green-600 font-semibold">
//                         KYC Completed
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         Wallet connected: {account.address.toString()}
//                       </p>
//                       <button>Done</button>
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }
//---------------------------------
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { mintReputationNFT } from "@/lib/aptos"; // ✅ adjust import path if needed

interface HeroSectionProps {
  className?: string;
  onKycComplete?: () => void; // to notify NavigationHeader
}

export default function HeroSection({
  className,
  onKycComplete,
}: HeroSectionProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"kyc" | "wallet">("kyc");
  const [country, setCountry] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [errors, setErrors] = useState<{ country?: string; id?: string }>({});
  const { connect, connected, account, signAndSubmitTransaction  } = useWallet();
  // const { connect, connected, account } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    const errs: typeof errors = {};
    if (!country) errs.country = "Country is required";
    if (!idNumber) errs.id = "Identification number is required";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setStep("wallet");
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connect("Petra");
      if (connected && account) {
        onKycComplete?.();
        setOpen(false);
      }
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  // const handleMintNFT = async () => {
  //   if (!account) return;
  //   try {
  //     setLoading(true);
  //     await mintReputationNFT(account); // ✅ Mint NFT on-chain
  //     onKycComplete?.(); // notify parent
  //     setOpen(false); // close modal
  //   } catch (err) {
  //     console.error("Minting failed:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleMintNFT = async () => {
  try {
    setLoading(true);
    const txHash = await mintReputationNFT(signAndSubmitTransaction);
    console.log("Mint Tx:", txHash);
    onKycComplete?.();
    setOpen(false);
  } catch (err) {
    console.error("Minting failed:", err);
  } finally {
    setLoading(false);
  }
};

  // Animations
  const slideVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" },
  };

  return (
    <section
      className={`relative min-h-screen bg-background flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 text-accent opacity-20"
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/3 right-1/3 text-primary opacity-30"
      >
        <Zap size={20} />
      </motion.div>
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-1/3 left-1/5 text-accent opacity-25"
      >
        <Sparkles size={16} />
      </motion.div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
          Reimagining{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Credit
          </span>{" "}
          in Web3
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Unlock the future of decentralized lending credit assessment,
          transparent protocols, and seamless blockchain integration for the
          next generation of finance.
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-4 h-auto text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Upgrade Yourself With Credit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Badges */}
        <div className="mt-16 flex justify-center items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Decentralized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Seamless</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
            <span>Transparent</span>
          </div>
        </div>
      </motion.div>

      {/* KYC Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === "kyc" ? "Quick KYC" : "Connect Wallet"}
            </DialogTitle>
          </DialogHeader>

          <div className="relative min-h-[200px] overflow-hidden">
            <AnimatePresence mode="wait">
              {step === "kyc" && (
                <motion.div
                  key="kyc-step1"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: easeInOut }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-lg font-semibold">
                    Verify your documents
                  </h2>
                  <div>
                    <label className="text-sm">Select Country</label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter your country"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Identification Number</label>
                    <Input
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Enter ID number"
                    />
                    {errors.id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.id}
                      </p>
                    )}
                  </div>
                  <Button onClick={handleVerify}>Verify</Button>
                </motion.div>
              )}

              {step === "wallet" && (
                <motion.div
                  key="kyc-step2"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: easeInOut }}
                  className="flex flex-col gap-6"
                >
                  <h2 className="text-lg font-semibold">
                    Connect Wallet for crypto address checks
                  </h2>
                  {!connected || !account ? (
                    <Button onClick={handleConnectWallet}>Connect Petra</Button>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-green-600 font-semibold">
                        KYC Completed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Wallet connected: {account.address.toString()}
                      </p>
                      <Button
                        onClick={handleMintNFT}
                        disabled={loading}
                        className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition"
                      >
                        {loading ? "Minting NFT..." : "Done"}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}




// "use client";

// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Zap } from "lucide-react";

// interface HeroSectionProps {
//   className?: string;
// }

// export default function HeroSection({ className }: HeroSectionProps) {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: [0.22, 1, 0.36, 1]
//       }
//     }
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.02,
//       transition: { duration: 0.2, ease: "easeOut" }
//     },
//     tap: { scale: 0.98 }
//   };

//   const floatingVariants = {
//     animate: {
//       y: [-10, 10, -10],
//       rotate: [0, 5, -5, 0],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   return (
//     <section
//       className={`relative min-h-screen bg-background flex items-center justify-center overflow-hidden ${className}`}
//     >
//       {/* Floating decorative elements */}
//       <motion.div
//         variants={floatingVariants}
//         animate="animate"
//         className="absolute top-1/4 left-1/4 text-accent opacity-20"
//         style={{ animationDelay: "0s" }}
//       >
//         <Sparkles size={24} />
//       </motion.div>

//       <motion.div
//         variants={floatingVariants}
//         animate="animate"
//         className="absolute top-1/3 right-1/3 text-primary opacity-30"
//         style={{ animationDelay: "2s" }}
//       >
//         <Zap size={20} />
//       </motion.div>

//       <motion.div
//         variants={floatingVariants}
//         animate="animate"
//         className="absolute bottom-1/3 left-1/5 text-accent opacity-25"
//         style={{ animationDelay: "4s" }}
//       >
//         <Sparkles size={16} />
//       </motion.div>

//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

//       {/* Content */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 max-w-4xl mx-auto px-6 text-center"
//       >
//         <motion.h1
//           variants={itemVariants}
//           className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6"
//         >
//           Reimagining{" "}
//           <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             Credit
//           </span>{" "}
//           in Web3
//         </motion.h1>

//         <motion.p
//           variants={itemVariants}
//           className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
//         >
//           Unlock the future of decentralized lending credit assessment,
//           transparent protocols, and seamless blockchain integration for the
//           next generation of finance.
//         </motion.p>

//         <motion.div
//           variants={itemVariants}
//           className="flex flex-col sm:flex-row gap-6 justify-center items-center"
//         >
//           <motion.div
//             variants={buttonVariants}
//             whileHover="hover"
//             whileTap="tap"
//           >
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-4 h-auto text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               Upgrade Yourself ith Credit
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </motion.div>

//           {/* <motion.div
//             variants={buttonVariants}
//             whileHover="hover"
//             whileTap="tap"
//           >
//             <Button
//               variant="outline"
//               size="lg"
//               className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 h-auto text-lg rounded-lg transition-all duration-300"
//             >
//               Learn More
//             </Button>
//           </motion.div> */}
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           className="mt-16 flex justify-center items-center gap-8 text-sm text-muted-foreground"
//         >
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-accent rounded-full"></div>
//             <span>Decentralized</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-primary rounded-full"></div>
//             <span>Seamless</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
//             <span>Transparent</span>
//           </div>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }
