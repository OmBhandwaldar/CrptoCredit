

"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Moon,
  Sun,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface NavigationHeaderProps {
  className?: string;
}

export default function NavigationHeader({
  className = ""
}: NavigationHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const { account, connected, connect, disconnect } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleConnectWallet = async () => {
    try {
      await connect("Petra"); // 👈 explicitly connect Petra
      toast.success("Wallet connected successfully");
    } catch (err) {
      console.error("Connect error:", err);
      toast.error("Failed to connect wallet");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (err) {
      console.error("Disconnect error:", err);
      toast.error("Failed to disconnect wallet");
    }
  };

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address.toString());
      toast.success("Address copied to clipboard");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
    >
      <div
        className={`backdrop-blur-xl transition-all duration-300 ${
        // className={`backdrop-blur-xl border-b transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 border-primary/20 shadow-lg shadow-primary/5"
            : "bg-background/60 border-border/50"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md bg-background/20 backdrop-blur-sm border border-foreground/20" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-sm -z-10" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-bold text-foreground">
                    CryptoCredit
                  </h1>
                  {/* <p className="text-xs text-muted-foreground font-medium">
                    Premium Credit Platform
                  </p> */}
                </div>
              </motion.div>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary transition-colors gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </nav>

            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="relative overflow-hidden border border-border/50 hover:border-primary/50 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-colors"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: isDarkMode ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDarkMode ? (
                      <Moon className="h-4 w-4 text-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-accent" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>

              {/* Wallet Connection */}
              {!connected || !account ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleConnectWallet}
                    className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl border border-primary/20 hover:border-primary/40 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative">Connect Wallet</span>
                  </Button>
                </motion.div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Button
                        variant="outline"
                        className="relative overflow-hidden bg-card/80 hover:bg-card border-primary/30 hover:border-primary/50 text-foreground font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span className="font-mono text-sm">
                            {formatAddress(account.address.toString())}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl shadow-background/20 rounded-xl p-2"
                  >
                    <div className="px-3 py-2 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground">
                        Connected Wallet
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {account.address.toString()}
                      </p>
                    </div>
                    <DropdownMenuItem
                      onClick={handleCopyAddress}
                      className="flex items-center gap-3 py-3 hover:bg-accent/10 hover:text-accent cursor-pointer rounded-lg mt-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Address</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-3 py-3 hover:bg-accent/10 hover:text-accent cursor-pointer rounded-lg"
                    >
                      <a
                        href={`https://explorer.aptoslabs.com/account/${account.address}?network=testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View on Explorer</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    <DropdownMenuItem
                      onClick={handleDisconnect}
                      className="flex items-center gap-3 py-3 hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg text-muted-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "motion/react";
// import {
//   Moon,
//   Sun,
//   ChevronDown,
//   Copy,
//   ExternalLink,
//   LogOut,
//   BarChart3
// } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";

// interface NavigationHeaderProps {
//   className?: string;
// }

// export default function NavigationHeader({
//   className = ""
// }: NavigationHeaderProps) {
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleThemeToggle = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle("dark");
//   };

//   const handleConnectWallet = async () => {
//     if (!(window as any).aptos) {
//       toast.error("Petra Wallet not installed");
//       return;
//     }

//     try {
//       const response = await (window as any).aptos.connect();
//       setWalletAddress(response.address);
//       toast.success("Wallet connected successfully");
//     } catch (err) {
//       console.error("Connect error:", err);
//       toast.error("Failed to connect wallet");
//     }
//   };

//   const handleDisconnect = async () => {
//     if ((window as any).aptos) {
//       try {
//         await (window as any).aptos.disconnect();
//         setWalletAddress(null);
//         toast.success("Wallet disconnected");
//       } catch (err) {
//         console.error("Disconnect error:", err);
//         toast.error("Failed to disconnect wallet");
//       }
//     }
//   };

//   const handleCopyAddress = () => {
//     if (walletAddress) {
//       navigator.clipboard.writeText(walletAddress);
//       toast.success("Address copied to clipboard");
//     }
//   };

//   const formatAddress = (address: string) => {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   return (
//     <motion.header
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
//     >
//       <div
//         className={`backdrop-blur-xl border-b transition-all duration-300 ${
//           isScrolled
//             ? "bg-background/80 border-primary/20 shadow-lg shadow-primary/5"
//             : "bg-background/60 border-border/50"
//         }`}
//       >
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Logo/Brand */}
//             <Link href="/">
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 className="flex items-center gap-3 cursor-pointer"
//               >
//                 <div className="relative">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                     <div className="w-6 h-6 rounded-md bg-background/20 backdrop-blur-sm border border-foreground/20" />
//                   </div>
//                   <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-sm -z-10" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-heading font-bold text-foreground">
//                     CryptoCredit
//                   </h1>
//                   <p className="text-xs text-muted-foreground font-medium">
//                     Premium Credit Platform
//                   </p>
//                 </div>
//               </motion.div>
//             </Link>

//             {/* Navigation Menu */}
//             <nav className="hidden md:flex items-center gap-6">
//               <Link href="/dashboard">
//                 <Button
//                   variant="ghost"
//                   className="text-muted-foreground hover:text-primary transition-colors gap-2"
//                 >
//                   <BarChart3 className="h-4 w-4" />
//                   Dashboard
//                 </Button>
//               </Link>
//             </nav>

//             {/* Navigation Actions */}
//             <div className="flex items-center gap-4">
//               {/* Theme Toggle */}
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleThemeToggle}
//                   className="relative overflow-hidden border border-border/50 hover:border-primary/50 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-colors"
//                 >
//                   <motion.div
//                     initial={false}
//                     animate={{ rotate: isDarkMode ? 0 : 180 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     {isDarkMode ? (
//                       <Moon className="h-4 w-4 text-foreground" />
//                     ) : (
//                       <Sun className="h-4 w-4 text-accent" />
//                     )}
//                   </motion.div>
//                 </Button>
//               </motion.div>

//               {/* Wallet Connection */}
//               {!walletAddress ? (
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button
//                     onClick={handleConnectWallet}
//                     className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl border border-primary/20 hover:border-primary/40 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
//                   >
//                     <motion.div
//                       className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
//                       initial={{ x: "-100%" }}
//                       whileHover={{ x: "100%" }}
//                       transition={{ duration: 0.6 }}
//                     />
//                     <span className="relative">Connect Wallet</span>
//                   </Button>
//                 </motion.div>
//               ) : (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <motion.div whileHover={{ scale: 1.02 }}>
//                       <Button
//                         variant="outline"
//                         className="relative overflow-hidden bg-card/80 hover:bg-card border-primary/30 hover:border-primary/50 text-foreground font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
//                           <span className="font-mono text-sm">
//                             {formatAddress(walletAddress)}
//                           </span>
//                           <ChevronDown className="h-4 w-4 opacity-50" />
//                         </div>
//                       </Button>
//                     </motion.div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     align="end"
//                     className="w-64 bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl shadow-background/20 rounded-xl p-2"
//                   >
//                     <div className="px-3 py-2 border-b border-border/50">
//                       <p className="text-sm font-medium text-foreground">
//                         Connected Wallet
//                       </p>
//                       <p className="text-xs text-muted-foreground font-mono mt-1">
//                         {walletAddress}
//                       </p>
//                     </div>
//                     <DropdownMenuItem
//                       onClick={handleCopyAddress}
//                       className="flex items-center gap-3 py-3 hover:bg-accent/10 hover:text-accent cursor-pointer rounded-lg mt-2"
//                     >
//                       <Copy className="h-4 w-4" />
//                       <span>Copy Address</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="flex items-center gap-3 py-3 hover:bg-accent/10 hover:text-accent cursor-pointer rounded-lg">
//                       <ExternalLink className="h-4 w-4" />
//                       <span>View on Explorer</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator className="bg-border/50 my-2" />
//                     <DropdownMenuItem
//                       onClick={handleDisconnect}
//                       className="flex items-center gap-3 py-3 hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg text-muted-foreground"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       <span>Disconnect</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.header>
//   );
// }
