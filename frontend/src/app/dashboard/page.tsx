'use client'

import { Suspense, useEffect, useState } from "react"
import { ArrowLeft, Shield, TrendingUp, Wallet, History } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import CreditDashboard from "@/components/CreditDashboard"
import TransactionHistory from "@/components/TransactionHistory"
import { fetchAccruedInterest, aptos, fetchReputationLevel } from "@/lib/aptos"  // 🔹 Added aptos import

// export const metadata = {
//   title: "Credit Dashboard - Web3 Credit Platform",
//   description: "Manage your decentralized credit, view transaction history, and monitor your credit score in real-time.",
//   keywords: ["Web3 credit", "DeFi lending", "credit dashboard", "blockchain finance"],
// }

const REPUTATION_MODULE_ADDR =
  "0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd" // 🔹 Replace with deployed ReputationNFT address

interface DashboardStats {
  totalCredit: string
  activeLoans: number
  creditScore: number
  reputation: string
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function StatsCards({ stats }: { stats: DashboardStats }) {
  const statItems = [
    {
      title: "Total Assets Held",
      value: 1,
      description: "",
      icon: Wallet,
    },
    {
      title: "Total Interest",
      value: stats.activeLoans.toString(),
      description: "No interest accrued",
      icon: TrendingUp,
      trend: "neutral" as const,
    },
    {
      title: "Highest Credit Line",
      value: "$300",
      description: "",
      icon: Shield,
    },
    {
      title: "Reputation Level",
      value: "1(Bronze)", // 🔹 Dynamic reputation
      // value: stats.reputation, // 🔹 Dynamic reputation
      description: "On-chain reputation",
      icon: History,
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Card 
            key={item.title}
            className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold font-heading text-foreground">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {item.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="h-6 w-px bg-border" />
        
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Dashboard</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
          Connected
        </Badge>
      </div>
    </div>
  )
}

function QuickActions() {
  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="font-heading">Quick Actions</CardTitle>
        <CardDescription>
          Manage your credit and loans efficiently
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all duration-300">
          <Wallet className="mr-2 h-4 w-4" />
          Request Credit Increase
        </Button>
        <Button variant="outline" className="w-full justify-start hover:bg-secondary/50 transition-all duration-300">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Credit Report
        </Button>
        <Button variant="outline" className="w-full justify-start hover:bg-secondary/50 transition-all duration-300">
          <Shield className="mr-2 h-4 w-4" />
          Update Identity Verification
        </Button>
      </CardContent>
    </Card>
  )
}

function ReputationCard({ reputation }: { reputation: string }) { // 🔹 Reputation passed as prop
  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="font-heading">Reputation System</CardTitle>
        <CardDescription>
          Your on-chain reputation score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Level</span>
            <Badge className="bg-accent/20 text-accent border-accent/30">
              {reputation} {/* 🔹 Dynamic reputation */}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to next level</span>
              <span className="text-foreground">85%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{ width: "85%" }}
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Complete 3 more successful transactions to reach the next tier
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [interest, setInterest] = useState<number>(0)
  const [reputation, setReputation] = useState<string>("Loading...") // 🔹 State for reputation

  useEffect(() => {
    async function loadData() {
      try {
        const userAddress = "0xYOUR_USER_ADDRESS" // 🔹 Replace with wallet address from connected account
        
        // Fetch interest
        const interestRaw = await fetchAccruedInterest(userAddress)
        setInterest(interestRaw / 1e6)

        // Fetch reputation from ReputationNFT
        // const resp: any = await aptos.view({
        //   payload: {
        //     function: `${REPUTATION_MODULE_ADDR}::ReputationNFT::get`,
        //     functionArguments: [userAddress],
        //   },
        // })

        // if (resp && resp[0]) {
        //   setReputation(resp[0] as string) // assuming get returns string tier
        // } else {
        //   setReputation("Unranked")
        // }
        const repLevel = await fetchReputationLevel(userAddress);
        if (repLevel > 0) {
          // Map numeric levels to human-readable tiers
          const tier =
            repLevel === 1 ? "Bronze" :
            repLevel === 2 ? "Silver" :
            repLevel === 3 ? "Gold" :
            "Platinum"

          setReputation(tier)
        } else {
          setReputation("Unranked")
        }


      } catch (err) {
        console.error("Failed to fetch data:", err)
        setReputation("Error")
      }
    }
    loadData()
  }, [])

  const dashboardStats: DashboardStats = {
    totalCredit: "$25,000",
    activeLoans: interest,
    creditScore: 850,
    reputation, // 🔹 Now dynamic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader />
          
          <div className="space-y-8">
            {/* Stats Overview */}
            <section>
              <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                Portfolio Overview
              </h2>
              <Suspense fallback={<DashboardSkeleton />}>
                <StatsCards stats={dashboardStats} />
              </Suspense>
            </section>

            {/* Main Content Grid */}
            <section className="grid gap-8 lg:grid-cols-3">
              {/* Primary Dashboard */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                    Credit Management
                  </h2>
                  <Suspense 
                    fallback={
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-8">
                          <Skeleton className="h-64 w-full" />
                        </CardContent>
                      </Card>
                    }
                  >
                    <CreditDashboard />
                  </Suspense>
                </div>
                
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
                    Recent Transactions
                  </h2>
                  <Suspense 
                    fallback={
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-8">
                          <Skeleton className="h-96 w-full" />
                        </CardContent>
                      </Card>
                    }
                  >
                    <TransactionHistory />
                  </Suspense>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <QuickActions />
                <ReputationCard reputation={reputation} /> {/* 🔹 Pass dynamic rep */}
                
                {/* Market Insights */}
                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
                  <CardHeader>
                    <CardTitle className="font-heading">Market Insights</CardTitle>
                    <CardDescription>
                      Real-time DeFi lending rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average APR</span>
                      <span className="font-semibold text-green-400">4.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value Locked</span>
                      <span className="font-semibold">$2.1B</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Lenders</span>
                      <span className="font-semibold">12,456</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}



// 'use client'

// import { Suspense, useEffect, useState } from "react"
// import { ArrowLeft, Shield, TrendingUp, Wallet, History } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import CreditDashboard from "@/components/CreditDashboard"
// import TransactionHistory from "@/components/TransactionHistory"
// import { fetchAccruedInterest } from "@/lib/aptos" 

// // export const metadata = {
// //   title: "Credit Dashboard - Web3 Credit Platform",
// //   description: "Manage your decentralized credit, view transaction history, and monitor your credit score in real-time.",
// //   keywords: ["Web3 credit", "DeFi lending", "credit dashboard", "blockchain finance"],
// // }

// interface DashboardStats {
//   totalCredit: string
//   activeLoans: number
//   creditScore: number
//   reputation: string
// }

// function DashboardSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <Skeleton className="h-4 w-20" />
//               <Skeleton className="h-4 w-4" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-8 w-24 mb-2" />
//               <Skeleton className="h-3 w-32" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <Skeleton className="h-96 w-full rounded-lg" />
//         </div>
//         <div className="space-y-4">
//           <Skeleton className="h-48 w-full rounded-lg" />
//           <Skeleton className="h-32 w-full rounded-lg" />
//         </div>
//       </div>
//     </div>
//   )
// }

// function StatsCards({ stats }: { stats: DashboardStats }) {
//   const statItems = [
//     {
//       title: "Total Assets Held",
//       value: 1,
//       description: "",
//       icon: Wallet,
//       // trend: "up" as const,
//     },
//     {
//       title: "Total Interest",
//       value: stats.activeLoans.toString(),
//       description: "No interest accrued",
//       icon: TrendingUp,
//       trend: "neutral" as const,
//     },
//     {
//       title: "Highest Credit Line",
//       value: "$300",
//       description: "",
//       icon: Shield,
//       // trend: "up" as const,
//     },
//     {
//       title: "Reputation Level",
//       value: stats.reputation,
//       description: "Top 10% of users",
//       icon: History,
//       trend: "up" as const,
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {statItems.map((item, index) => {
//         const Icon = item.icon
//         return (
//           <Card 
//             key={item.title}
//             className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
//             style={{
//               animationDelay: `${index * 100}ms`,
//             }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 {item.title}
//               </CardTitle>
//               <Icon className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="text-2xl font-bold font-heading text-foreground">
//                 {item.value}
//               </div>
//               <p className="text-xs text-muted-foreground flex items-center gap-1">
//                 {item.trend === "up" && (
//                   <TrendingUp className="h-3 w-3 text-green-400" />
//                 )}
//                 {item.description}
//               </p>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// function DashboardHeader() {
//   return (
//     <div className="flex items-center justify-between mb-8">
//       <div className="flex items-center gap-4">
//         <Link href="/">
//           <Button variant="ghost" size="sm" className="gap-2 hover:bg-secondary/50 transition-colors">
//             <ArrowLeft className="h-4 w-4" />
//             Back to Home
//           </Button>
//         </Link>
        
//         <div className="h-6 w-px bg-border" />
        
//         <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
//           <Link href="/" className="hover:text-foreground transition-colors">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="text-foreground">Dashboard</span>
//         </nav>
//       </div>

//       <div className="flex items-center gap-3">
//         <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
//           <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
//           Connected
//         </Badge>
//       </div>
//     </div>
//   )
// }

// function QuickActions() {
//   return (
//     <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
//       <CardHeader>
//         <CardTitle className="font-heading">Quick Actions</CardTitle>
//         <CardDescription>
//           Manage your credit and loans efficiently
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all duration-300">
//           <Wallet className="mr-2 h-4 w-4" />
//           Request Credit Increase
//         </Button>
//         <Button variant="outline" className="w-full justify-start hover:bg-secondary/50 transition-all duration-300">
//           <TrendingUp className="mr-2 h-4 w-4" />
//           View Credit Report
//         </Button>
//         <Button variant="outline" className="w-full justify-start hover:bg-secondary/50 transition-all duration-300">
//           <Shield className="mr-2 h-4 w-4" />
//           Update Identity Verification
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

// function ReputationCard() {
//   return (
//     <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
//       <CardHeader>
//         <CardTitle className="font-heading">Reputation System</CardTitle>
//         <CardDescription>
//           Your on-chain reputation score
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">Current Level</span>
//             <Badge className="bg-accent/20 text-accent border-accent/30">
//               Diamond
//             </Badge>
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Progress to next level</span>
//               <span className="text-foreground">85%</span>
//             </div>
//             <div className="w-full bg-secondary rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
//                 style={{ width: "85%" }}
//               />
//             </div>
//           </div>
          
//           <div className="text-xs text-muted-foreground">
//             Complete 3 more successful transactions to reach the next tier
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default function DashboardPage() {
//   const [interest, setInterest] = useState<number>(0);

//   useEffect(() => {
//     async function loadInterest() {
//       try {
//         const userAddress =
//           "0xYOUR_USER_ADDRESS" // 🔹 Replace with wallet address from connected account
//         const interestRaw = await fetchAccruedInterest(userAddress)
//         setInterest(interestRaw / 1e6) // scale USDC decimals
//       } catch (err) {
//         console.error("Failed to fetch interest:", err)
//       }
//     }
//     loadInterest()
//   }, [])
//   const dashboardStats: DashboardStats = {
//     totalCredit: "$25,000",
//     activeLoans: interest,
//     creditScore: 850,
//     reputation: "Diamond",
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
//       {/* Animated background gradient */}
//       <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
//       <div className="relative z-10">
//         <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <DashboardHeader />
          
//           <div className="space-y-8">
//             {/* Stats Overview */}
//             <section>
//               <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
//                 Portfolio Overview
//               </h2>
//               <Suspense fallback={<DashboardSkeleton />}>
//                 <StatsCards stats={dashboardStats} />
//               </Suspense>
//             </section>

//             {/* Main Content Grid */}
//             <section className="grid gap-8 lg:grid-cols-3">
//               {/* Primary Dashboard */}
//               <div className="lg:col-span-2 space-y-8">
//                 <div>
//                   <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
//                     Credit Management
//                   </h2>
//                   <Suspense 
//                     fallback={
//                       <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//                         <CardContent className="p-8">
//                           <Skeleton className="h-64 w-full" />
//                         </CardContent>
//                       </Card>
//                     }
//                   >
//                     <CreditDashboard />
//                   </Suspense>
//                 </div>
                
//                 <div>
//                   <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
//                     Recent Transactions
//                   </h2>
//                   <Suspense 
//                     fallback={
//                       <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//                         <CardContent className="p-8">
//                           <Skeleton className="h-96 w-full" />
//                         </CardContent>
//                       </Card>
//                     }
//                   >
//                     <TransactionHistory />
//                   </Suspense>
//                 </div>
//               </div>

//               {/* Sidebar */}
//               <div className="space-y-6">
//                 <QuickActions />
//                 <ReputationCard />
                
//                 {/* Market Insights */}
//                 <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
//                   <CardHeader>
//                     <CardTitle className="font-heading">Market Insights</CardTitle>
//                     <CardDescription>
//                       Real-time DeFi lending rates
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Average APR</span>
//                       <span className="font-semibold text-green-400">4.2%</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Total Value Locked</span>
//                       <span className="font-semibold">$2.1B</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Active Lenders</span>
//                       <span className="font-semibold">12,456</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// import { Suspense } from "react"
// import { ArrowLeft, Shield, TrendingUp, Wallet, History } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import CreditDashboard from "@/components/CreditDashboard"
// import TransactionHistory from "@/components/TransactionHistory"

// export const metadata = {
//   title: "Credit Dashboard - Web3 Credit Platform",
//   description: "Manage your decentralized credit, view transaction history, and monitor your credit score in real-time.",
//   keywords: ["Web3 credit", "DeFi lending", "credit dashboard", "blockchain finance"],
// }

// interface DashboardStats {
//   totalCredit: string
//   activeLoans: number
//   creditScore: number
//   reputation: string
// }

// function DashboardSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <Skeleton className="h-4 w-20" />
//               <Skeleton className="h-4 w-4" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-8 w-24 mb-2" />
//               <Skeleton className="h-3 w-32" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <Skeleton className="h-96 w-full rounded-lg" />
//         </div>
//         <div className="space-y-4">
//           <Skeleton className="h-48 w-full rounded-lg" />
//           <Skeleton className="h-32 w-full rounded-lg" />
//         </div>
//       </div>
//     </div>
//   )
// }

// function StatsCards({ stats }: { stats: DashboardStats }) {
//   const statItems = [
//     {
//       title: "Total Credit Available",
//       value: stats.totalCredit,
//       description: "+12% from last month",
//       icon: Wallet,
//       trend: "up" as const,
//     },
//     {
//       title: "Total Interest",
//       value: stats.activeLoans.toString(),
//       description: "Currently borrowed",
//       icon: TrendingUp,
//       trend: "neutral" as const,
//     },
//     {
//       title: "Credit Score",
//       value: stats.creditScore.toString(),
//       description: "Excellent standing",
//       icon: Shield,
//       trend: "up" as const,
//     },
//     {
//       title: "Reputation Level",
//       value: stats.reputation,
//       description: "Top 10% of users",
//       icon: History,
//       trend: "up" as const,
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {statItems.map((item, index) => {
//         const Icon = item.icon
//         return (
//           <Card 
//             key={item.title}
//             className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
//             style={{
//               animationDelay: `${index * 100}ms`,
//             }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 {item.title}
//               </CardTitle>
//               <Icon className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="text-2xl font-bold font-heading text-foreground">
//                 {item.value}
//               </div>
//               <p className="text-xs text-muted-foreground flex items-center gap-1">
//                 {item.trend === "up" && (
//                   <TrendingUp className="h-3 w-3 text-green-400" />
//                 )}
//                 {item.description}
//               </p>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// function DashboardHeader() {
//   return (
//     <div className="flex items-center justify-between mb-8">
//       <div className="flex items-center gap-4">
//         <Link href="/">
//           <Button variant="ghost" size="sm" className="gap-2 hover:bg-secondary/50 transition-colors">
//             <ArrowLeft className="h-4 w-4" />
//             Back to Home
//           </Button>
//         </Link>
        
//         <div className="h-6 w-px bg-border" />
        
//         <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
//           <Link href="/" className="hover:text-foreground transition-colors">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="text-foreground">Dashboard</span>
//         </nav>
//       </div>

//       <div className="flex items-center gap-3">
//         <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
//           <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
//           Connected
//         </Badge>
//       </div>
//     </div>
//   )
// }

// function QuickActions() {
//   return (
//     <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
//       <CardHeader>
//         <CardTitle className="font-heading">Quick Actions</CardTitle>
//         <CardDescription>
//           Manage your credit and loans efficiently
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all duration-300">
//           <Wallet className="mr-2 h-4 w-4" />
//           Request Credit Increase
//         </Button>
//         <Button variant="outline" className="w-full justify-start hover:bg-secondary/50 transition-all duration-300">
//           <TrendingUp className="mr-2 h-4 w-4" />
//           View Credit Report
//         </Button>
//         <Button variant="outline" className="w-full justify-start hover:bg-secondary/50 transition-all duration-300">
//           <Shield className="mr-2 h-4 w-4" />
//           Update Identity Verification
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

// function ReputationCard() {
//   return (
//     <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
//       <CardHeader>
//         <CardTitle className="font-heading">Reputation System</CardTitle>
//         <CardDescription>
//           Your on-chain reputation score
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">Current Level</span>
//             <Badge className="bg-accent/20 text-accent border-accent/30">
//               Diamond
//             </Badge>
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Progress to next level</span>
//               <span className="text-foreground">85%</span>
//             </div>
//             <div className="w-full bg-secondary rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
//                 style={{ width: "85%" }}
//               />
//             </div>
//           </div>
          
//           <div className="text-xs text-muted-foreground">
//             Complete 3 more successful transactions to reach the next tier
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default function DashboardPage() {
//   const dashboardStats: DashboardStats = {
//     totalCredit: "$25,000",
//     activeLoans: 2,
//     creditScore: 850,
//     reputation: "Diamond",
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
//       {/* Animated background gradient */}
//       <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
//       <div className="relative z-10">
//         <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <DashboardHeader />
          
//           <div className="space-y-8">
//             {/* Stats Overview */}
//             <section>
//               <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
//                 Portfolio Overview
//               </h2>
//               <Suspense fallback={<DashboardSkeleton />}>
//                 <StatsCards stats={dashboardStats} />
//               </Suspense>
//             </section>

//             {/* Main Content Grid */}
//             <section className="grid gap-8 lg:grid-cols-3">
//               {/* Primary Dashboard */}
//               <div className="lg:col-span-2 space-y-8">
//                 <div>
//                   <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
//                     Credit Management
//                   </h2>
//                   <Suspense 
//                     fallback={
//                       <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//                         <CardContent className="p-8">
//                           <Skeleton className="h-64 w-full" />
//                         </CardContent>
//                       </Card>
//                     }
//                   >
//                     <CreditDashboard />
//                   </Suspense>
//                 </div>
                
//                 <div>
//                   <h2 className="text-2xl font-heading font-bold mb-6 text-foreground">
//                     Recent Transactions
//                   </h2>
//                   <Suspense 
//                     fallback={
//                       <Card className="bg-card/50 backdrop-blur-sm border-border/50">
//                         <CardContent className="p-8">
//                           <Skeleton className="h-96 w-full" />
//                         </CardContent>
//                       </Card>
//                     }
//                   >
//                     <TransactionHistory />
//                   </Suspense>
//                 </div>
//               </div>

//               {/* Sidebar */}
//               <div className="space-y-6">
//                 <QuickActions />
//                 <ReputationCard />
                
//                 {/* Market Insights */}
//                 <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50">
//                   <CardHeader>
//                     <CardTitle className="font-heading">Market Insights</CardTitle>
//                     <CardDescription>
//                       Real-time DeFi lending rates
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Average APR</span>
//                       <span className="font-semibold text-green-400">4.2%</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Total Value Locked</span>
//                       <span className="font-semibold">$2.1B</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Active Lenders</span>
//                       <span className="font-semibold">12,456</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
