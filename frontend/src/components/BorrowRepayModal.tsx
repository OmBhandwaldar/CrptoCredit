"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { X, DollarSign, Clock, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface BorrowRepayModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "borrow" | "repay"
  availableBalance?: number
  currentDebt?: number
  interestRate?: number
  loanTerms?: {
    duration: string
    dueDate: string
    minAmount: number
    maxAmount: number
  }
}

export default function BorrowRepayModal({
  isOpen,
  onClose,
  mode,
  availableBalance = 10000,
  currentDebt = 2500,
  interestRate = 8.5,
  loanTerms = {
    duration: "30 days",
    dueDate: "Dec 15, 2024",
    minAmount: 100,
    maxAmount: 25000
  }
}: BorrowRepayModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const isBorrow = mode === "borrow"
  const maxAmount = isBorrow ? loanTerms.maxAmount : currentDebt
  const minAmount = isBorrow ? loanTerms.minAmount : 1

  // Reset state when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setAmount("")
      setError("")
      setIsSuccess(false)
      setIsLoading(false)
    }
  }, [isOpen, mode])

  const validateAmount = (value: string): string => {
    const numValue = parseFloat(value)
    
    if (!value || isNaN(numValue)) {
      return "Please enter a valid amount"
    }
    
    if (numValue < minAmount) {
      return `Minimum amount is $${minAmount.toLocaleString()}`
    }
    
    if (numValue > maxAmount) {
      return `Maximum amount is $${maxAmount.toLocaleString()}`
    }
    
    if (!isBorrow && numValue > availableBalance) {
      return "Insufficient balance"
    }
    
    return ""
  }

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal points
    const sanitized = value.replace(/[^0-9.]/g, "")
    setAmount(sanitized)
    
    if (error) {
      const validationError = validateAmount(sanitized)
      if (!validationError) setError("")
    }
  }

  const handleSubmit = async () => {
    const validationError = validateAmount(amount)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)
      
      // Auto close after success animation
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError("Transaction failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleMaxAmount = () => {
    const max = isBorrow ? Math.min(loanTerms.maxAmount, availableBalance) : currentDebt
    setAmount(max.toString())
    setError("")
  }

  const calculateInterest = () => {
    const principal = parseFloat(amount) || 0
    return (principal * (interestRate / 100) * 30) / 365 // Daily interest for 30 days
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      Transaction Successful!
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {isBorrow ? "Loan approved and funds transferred" : "Repayment processed successfully"}
                    </p>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="text-2xl font-heading font-bold text-primary">
                        {formatCurrency(parseFloat(amount))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isBorrow ? "Borrowed" : "Repaid"}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isBorrow ? "bg-primary/20" : "bg-accent/20"}`}>
                          <DollarSign className={`w-5 h-5 ${isBorrow ? "text-primary" : "text-accent"}`} />
                        </div>
                        <div>
                          <h2 className="text-lg font-heading font-semibold">
                            {isBorrow ? "Borrow Funds" : "Repay Loan"}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {isBorrow ? "Get instant liquidity" : "Reduce your debt"}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Balance/Debt Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">
                            {isBorrow ? "Available Balance" : "Current Debt"}
                          </div>
                          <div className="text-lg font-heading font-semibold">
                            {formatCurrency(isBorrow ? availableBalance : currentDebt)}
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">
                            Interest Rate
                          </div>
                          <div className="text-lg font-heading font-semibold text-primary">
                            {interestRate}% APR
                          </div>
                        </div>
                      </div>

                      {/* Amount Input */}
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-medium">
                          Amount
                        </Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="text"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className={`text-lg font-heading pl-8 ${error ? "border-destructive" : ""}`}
                          />
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleMaxAmount}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                          >
                            MAX
                          </Button>
                        </div>
                        
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm text-destructive"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                          </motion.div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          Range: {formatCurrency(minAmount)} - {formatCurrency(maxAmount)}
                        </div>
                      </div>

                      {/* Loan Details */}
                      {isBorrow && amount && !error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-muted/20 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Loan Details
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Principal</span>
                              <span>{formatCurrency(parseFloat(amount))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Interest (30 days)</span>
                              <span>{formatCurrency(calculateInterest())}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-medium">
                              <span>Total to Repay</span>
                              <span>{formatCurrency(parseFloat(amount) + calculateInterest())}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Terms */}
                      <div className="bg-muted/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm font-medium mb-3">
                          <Clock className="w-4 h-4 text-accent" />
                          {isBorrow ? "Loan Terms" : "Payment Info"}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span>{loanTerms.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Date</span>
                            <span>{loanTerms.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={handleSubmit}
                        disabled={!amount || !!error || isLoading}
                        className="w-full h-12 text-base font-medium"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `${isBorrow ? "Borrow" : "Repay"} ${amount ? formatCurrency(parseFloat(amount)) : ""}`
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}