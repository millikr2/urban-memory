import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Search, ArrowUpDown, X, CalendarIcon, Filter, Download } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  category: string;
  balance: number;
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats);
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || transaction.type === filterType;
      const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
      const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
      
      // Date filtering
      const transactionDate = new Date(transaction.date);
      const matchesDateFrom = !dateFrom || transactionDate >= dateFrom;
      const matchesDateTo = !dateTo || transactionDate <= dateTo;
      
      // Amount filtering
      const matchesMinAmount = !minAmount || Math.abs(transaction.amount) >= parseFloat(minAmount);
      const matchesMaxAmount = !maxAmount || Math.abs(transaction.amount) <= parseFloat(maxAmount);
      
      return matchesSearch && matchesType && matchesCategory && matchesStatus && 
             matchesDateFrom && matchesDateTo && matchesMinAmount && matchesMaxAmount;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterStatus, sortOrder, dateFrom, dateTo, minAmount, maxAmount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filterType !== "all" || filterCategory !== "all" || filterStatus !== "all" || 
           dateFrom !== undefined || dateTo !== undefined || minAmount !== "" || maxAmount !== "" || searchTerm !== "";
  }, [filterType, filterCategory, filterStatus, dateFrom, dateTo, minAmount, maxAmount, searchTerm]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
    setFilterStatus("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setMinAmount("");
    setMaxAmount("");
  };

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount", "Balance", "Status"];
    const rows = filteredAndSortedTransactions.map(t => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.balance.toFixed(2),
      t.status
    ]);
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `easybank-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Transaction History
            <Badge variant="outline">{filteredAndSortedTransactions.length} of {transactions.length}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={filteredAndSortedTransactions.length === 0}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="space-y-4 pt-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search by description, category, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Row 1 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="shrink-0"
              >
                <ArrowUpDown size={16} />
              </Button>
            </div>

            {/* Filters Row 2 - Date and Amount Range */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[200px] justify-start">
                    <CalendarIcon size={16} className="mr-2" />
                    {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[200px] justify-start">
                    <CalendarIcon size={16} className="mr-2" />
                    {dateTo ? format(dateTo, "MMM dd, yyyy") : "To Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="number"
                placeholder="Min Amount"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full sm:w-32"
              />

              <Input
                type="number"
                placeholder="Max Amount"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full sm:w-32"
              />
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <X size={14} className="cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {filterType !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {filterType}
                    <X size={14} className="cursor-pointer" onClick={() => setFilterType("all")} />
                  </Badge>
                )}
                {filterCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {filterCategory}
                    <X size={14} className="cursor-pointer" onClick={() => setFilterCategory("all")} />
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {filterStatus}
                    <X size={14} className="cursor-pointer" onClick={() => setFilterStatus("all")} />
                  </Badge>
                )}
                {dateFrom && (
                  <Badge variant="secondary" className="gap-1">
                    From: {format(dateFrom, "MMM dd, yyyy")}
                    <X size={14} className="cursor-pointer" onClick={() => setDateFrom(undefined)} />
                  </Badge>
                )}
                {dateTo && (
                  <Badge variant="secondary" className="gap-1">
                    To: {format(dateTo, "MMM dd, yyyy")}
                    <X size={14} className="cursor-pointer" onClick={() => setDateTo(undefined)} />
                  </Badge>
                )}
                {minAmount && (
                  <Badge variant="secondary" className="gap-1">
                    Min: ${minAmount}
                    <X size={14} className="cursor-pointer" onClick={() => setMinAmount("")} />
                  </Badge>
                )}
                {maxAmount && (
                  <Badge variant="secondary" className="gap-1">
                    Max: ${maxAmount}
                    <X size={14} className="cursor-pointer" onClick={() => setMaxAmount("")} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell className={`text-right ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'default' : 
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}