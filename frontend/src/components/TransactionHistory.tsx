"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, ArrowUpDown, ExternalLink, Loader2, AlertCircle, TrendingUp, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: number;
  userId: number;
  transactionType: 'borrow' | 'repay' | 'interest';
  amount: number;
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface TransactionHistoryProps {
  className?: string;
  userId?: number;
}

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
    case 'pending':
      return 'bg-accent/20 text-accent border-accent/30';
    case 'failed':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    default:
      return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
};

const getTypeColor = (type: Transaction['transactionType']) => {
  switch (type) {
    case 'borrow':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'repay':
      return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
    case 'interest':
      return 'bg-accent/20 text-accent border-accent/30';
    default:
      return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
};

export default function TransactionHistory({ 
  className = "", 
  userId = 1 
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'borrow' | 'repay' | 'interest'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(20);

  const fetchTransactions = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const params = new URLSearchParams({
        userId: userId.toString(),
        limit: limit.toString(),
        sort: sortBy,
        order: sortOrder
      });

      if (filterType !== 'all') {
        params.append('transactionType', filterType);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data);
      setHasMore(data.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        userId: userId.toString(),
        limit: limit.toString(),
        offset: transactions.length.toString(),
        sort: sortBy,
        order: sortOrder
      });

      if (filterType !== 'all') {
        params.append('transactionType', filterType);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch more transactions');
      }

      const data = await response.json();
      setTransactions(prev => [...prev, ...data]);
      setHasMore(data.length === limit);
    } catch (err) {
      toast.error('Failed to load more transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId, sortBy, sortOrder, filterType, filterStatus]);

  const handleSort = (field: 'createdAt' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleRefresh = () => {
    fetchTransactions(true);
  };

  const copyTransactionHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Transaction hash copied to clipboard");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <TrendingUp className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
          ? 'Try adjusting your filters to see more results.'
          : 'Start your DeFi journey by borrowing or lending assets. Your transaction history will appear here.'
        }
      </p>
      {!(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
        <Button className="bg-primary hover:bg-primary/90">
          Get Started
        </Button>
      )}
    </motion.div>
  );

  const LoadingState = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Failed to load transactions</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {error || "Something went wrong while fetching your transaction history. Please try again."}
      </p>
      <Button variant="outline" onClick={handleRefresh}>
        Try Again
      </Button>
    </motion.div>
  );

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Transaction History
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-muted"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Input
            placeholder="Search by hash or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs bg-input border-border"
          />
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="borrow">Borrow</SelectItem>
                <SelectItem value="repay">Repay</SelectItem>
                <SelectItem value="interest">Interest</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-36 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && transactions.length === 0 ? (
          <LoadingState />
        ) : error && transactions.length === 0 ? (
          <ErrorState />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('createdAt')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('amount')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(transaction.transactionType)}>
                            {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-medium">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyTransactionHash(transaction.transactionHash)}
                            className="h-auto p-1 text-muted-foreground hover:text-primary font-mono text-sm"
                          >
                            {formatHash(transaction.transactionHash)}
                            <Copy className="ml-2 h-3 w-3" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              <AnimatePresence>
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-muted/20 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getTypeColor(transaction.transactionType)}>
                              {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(transaction.status)}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <span className="font-mono text-lg font-semibold">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyTransactionHash(transaction.transactionHash)}
                          className="h-auto p-0 text-muted-foreground hover:text-primary w-full justify-start font-mono text-sm"
                        >
                          {formatHash(transaction.transactionHash)}
                          <Copy className="ml-2 h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMoreTransactions}
                  disabled={isLoading}
                  className="bg-card/50 backdrop-blur-sm border-border/50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Transactions'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}