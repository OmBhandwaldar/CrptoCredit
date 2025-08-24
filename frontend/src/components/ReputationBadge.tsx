"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Award, Crown, Shield, Star, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type CreditTier = "bronze" | "silver" | "gold";

interface ReputationBadgeProps {
  tier: CreditTier;
  progress?: number;
  totalLoans?: number;
  successfulRepayments?: number;
  className?: string;
  onUpgrade?: (newTier: CreditTier) => void;
}

const tierConfig = {
  bronze: {
    name: "Bronze",
    icon: Shield,
    colors: {
      primary: "from-amber-800 to-amber-600",
      secondary: "from-amber-900/20 to-amber-800/20",
      border: "border-amber-600/50",
      glow: "shadow-amber-500/20",
      text: "text-amber-200",
    },
    benefits: [
      "Access to basic loans up to $5,000",
      "Standard interest rates",
      "24/7 customer support",
    ],
    nextMilestone: "Complete 5 successful repayments to reach Silver",
    requiredRepayments: 5,
  },
  silver: {
    name: "Silver",
    icon: Award,
    colors: {
      primary: "from-slate-400 to-slate-300",
      secondary: "from-slate-500/20 to-slate-400/20",
      border: "border-slate-400/50",
      glow: "shadow-slate-400/20",
      text: "text-slate-200",
    },
    benefits: [
      "Access to loans up to $15,000",
      "Reduced interest rates (-2%)",
      "Priority customer support",
      "Extended repayment terms",
    ],
    nextMilestone: "Complete 15 successful repayments to reach Gold",
    requiredRepayments: 15,
  },
  gold: {
    name: "Gold",
    icon: Crown,
    colors: {
      primary: "from-yellow-500 to-yellow-400",
      secondary: "from-yellow-600/20 to-yellow-500/20",
      border: "border-yellow-500/50",
      glow: "shadow-yellow-500/20",
      text: "text-yellow-200",
    },
    benefits: [
      "Access to premium loans up to $50,000",
      "Lowest interest rates (-5%)",
      "Dedicated account manager",
      "Flexible repayment options",
      "Exclusive investment opportunities",
    ],
    nextMilestone: "Maximum tier reached!",
    requiredRepayments: 15,
  },
};

export default function ReputationBadge({
  tier,
  progress = 0,
  totalLoans = 0,
  successfulRepayments = 0,
  className = "",
  onUpgrade,
}: ReputationBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = tierConfig[tier];
  const Icon = config.icon;
  
  const progressPercentage = Math.min(
    (successfulRepayments / config.requiredRepayments) * 100,
    100
  );

  const handleUpgrade = () => {
    if (tier === "bronze" && successfulRepayments >= 5) {
      onUpgrade?.("silver");
    } else if (tier === "silver" && successfulRepayments >= 15) {
      onUpgrade?.("gold");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`relative inline-flex items-center gap-3 ${className}`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Main Badge Container */}
            <motion.div
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl
                bg-gradient-to-r ${config.colors.secondary}
                backdrop-blur-sm border ${config.colors.border}
                shadow-lg ${config.colors.glow}
                hover:shadow-xl transition-all duration-300
              `}
              animate={{
                boxShadow: isHovered
                  ? `0 8px 32px -4px ${config.colors.glow.includes('amber') ? 'rgba(245, 158, 11, 0.3)' : 
                      config.colors.glow.includes('slate') ? 'rgba(148, 163, 184, 0.3)' : 
                      'rgba(234, 179, 8, 0.3)'}`
                  : `0 4px 16px -2px ${config.colors.glow.includes('amber') ? 'rgba(245, 158, 11, 0.2)' : 
                      config.colors.glow.includes('slate') ? 'rgba(148, 163, 184, 0.2)' : 
                      'rgba(234, 179, 8, 0.2)'}`
              }}
            >
              {/* Glassmorphism Effect */}
              <div className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm" />
              
              {/* Badge Icon */}
              <motion.div
                className={`
                  relative z-10 p-2 rounded-lg bg-gradient-to-br ${config.colors.primary}
                  shadow-inner
                `}
                animate={{ rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="h-5 w-5 text-background" />
              </motion.div>

              {/* Badge Content */}
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-semibold font-heading ${config.colors.text}`}>
                    {config.name}
                  </span>
                  <motion.div
                    animate={{ scale: isHovered ? 1.2 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Star className={`h-4 w-4 ${config.colors.text}`} />
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {successfulRepayments}/{config.requiredRepayments} repayments
                  </span>
                  {tier !== "gold" && (
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-16">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${config.colors.primary} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Upgrade Indicator */}
              {((tier === "bronze" && successfulRepayments >= 5) || 
                (tier === "silver" && successfulRepayments >= 15)) && (
                <motion.button
                  onClick={handleUpgrade}
                  className="relative z-10 ml-2 p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 
                           border border-primary/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TrendingUp className="h-4 w-4 text-primary" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        
        <TooltipContent
          side="bottom"
          className="max-w-xs p-4 bg-card/95 backdrop-blur-sm border border-border/50"
        >
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground font-heading">
                {config.name} Tier Benefits
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Total Loans: {totalLoans} | Success Rate: {totalLoans > 0 ? Math.round((successfulRepayments / totalLoans) * 100) : 0}%
              </p>
            </div>
            
            <ul className="space-y-1">
              {config.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
            
            {tier !== "gold" && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  <strong>Next Milestone:</strong> {config.nextMilestone}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${config.colors.primary} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}