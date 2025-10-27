import { useState } from "react";
import { AccountCard } from "./AccountCard";
import { TransactionHistory } from "./TransactionHistory";
import { StatementDownload } from "./StatementDownload";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Building2, CreditCard, TrendingUp, RefreshCw, FileText } from "lucide-react";

// hardcoding data
const mockAccounts = [
  {
    id: "1",
    name: "Primary Checking",
    type: "Checking Account",
    balance: 5420.50,
    accountNumber: "1234567890",
    status: "active" as const,
  },
  {
    id: "2",
    name: "High Yield Savings",
    type: "Savings Account",
    balance: 15750.25,
    accountNumber: "0987654321",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Credit Card",
    type: "Credit Card",
    balance: -1250.75,
    accountNumber: "5555444433332222",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Investment Account",
    type: "Investment Account",
    balance: 32580.00,
    accountNumber: "1111222233334444",
    status: "active" as const,
  },
];

const mockTransactions = [
  {
    id: "1",
    date: "2024-12-18",
    description: "Direct Deposit - Salary",
    amount: 3500.00,
    type: "credit" as const,
    category: "Income",
    balance: 5420.50,
    status: "completed" as const,
  },
  {
    id: "2",
    date: "2024-12-17",
    description: "Grocery Store Purchase",
    amount: 127.85,
    type: "debit" as const,
    category: "Groceries",
    balance: 1920.50,
    status: "completed" as const,
  },
  {
    id: "3",
    date: "2024-12-16",
    description: "Online Transfer to Savings",
    amount: 500.00,
    type: "debit" as const,
    category: "Transfer",
    balance: 2048.35,
    status: "completed" as const,
  },
  {
    id: "4",
    date: "2024-12-15",
    description: "Gas Station",
    amount: 65.20,
    type: "debit" as const,
    category: "Transportation",
    balance: 2548.35,
    status: "completed" as const,
  },
  {
    id: "5",
    date: "2024-12-14",
    description: "Restaurant Payment",
    amount: 45.50,
    type: "debit" as const,
    category: "Dining",
    balance: 2613.55,
    status: "completed" as const,
  },
  {
    id: "6",
    date: "2024-12-13",
    description: "Freelance Payment",
    amount: 750.00,
    type: "credit" as const,
    category: "Income",
    balance: 2659.05,
    status: "pending" as const,
  },
  {
    id: "7",
    date: "2024-12-12",
    description: "Subscription Service",
    amount: 15.99,
    type: "debit" as const,
    category: "Entertainment",
    balance: 1909.05,
    status: "completed" as const,
  },
  {
    id: "8",
    date: "2024-12-11",
    description: "ATM Withdrawal",
    amount: 100.00,
    type: "debit" as const,
    category: "Cash",
    balance: 1925.04,
    status: "completed" as const,
  },
  {
    id: "9",
    date: "2024-12-10",
    description: "Online Shopping - Amazon",
    amount: 89.99,
    type: "debit" as const,
    category: "Shopping",
    balance: 2025.04,
    status: "completed" as const,
  },
  {
    id: "10",
    date: "2024-12-09",
    description: "Electric Bill Payment",
    amount: 125.50,
    type: "debit" as const,
    category: "Utilities",
    balance: 2115.03,
    status: "completed" as const,
  },
  {
    id: "11",
    date: "2024-12-08",
    description: "Coffee Shop",
    amount: 5.75,
    type: "debit" as const,
    category: "Dining",
    balance: 2240.53,
    status: "completed" as const,
  },
  {
    id: "12",
    date: "2024-12-07",
    description: "Gym Membership",
    amount: 49.99,
    type: "debit" as const,
    category: "Health & Fitness",
    balance: 2246.28,
    status: "completed" as const,
  },
  {
    id: "13",
    date: "2024-12-06",
    description: "Mobile Phone Bill",
    amount: 75.00,
    type: "debit" as const,
    category: "Utilities",
    balance: 2296.27,
    status: "completed" as const,
  },
  {
    id: "14",
    date: "2024-12-05",
    description: "Dividend Payment",
    amount: 125.00,
    type: "credit" as const,
    category: "Income",
    balance: 2371.27,
    status: "completed" as const,
  },
  {
    id: "15",
    date: "2024-12-04",
    description: "Insurance Premium",
    amount: 250.00,
    type: "debit" as const,
    category: "Insurance",
    balance: 2246.27,
    status: "completed" as const,
  },
  {
    id: "16",
    date: "2024-12-03",
    description: "Pharmacy Purchase",
    amount: 32.50,
    type: "debit" as const,
    category: "Healthcare",
    balance: 2496.27,
    status: "completed" as const,
  },
  {
    id: "17",
    date: "2024-12-02",
    description: "Movie Tickets",
    amount: 28.00,
    type: "debit" as const,
    category: "Entertainment",
    balance: 2528.77,
    status: "completed" as const,
  },
  {
    id: "18",
    date: "2024-12-01",
    description: "Rent Payment",
    amount: 1500.00,
    type: "debit" as const,
    category: "Housing",
    balance: 2556.77,
    status: "completed" as const,
  },
  {
    id: "19",
    date: "2024-11-30",
    description: "Refund - Online Return",
    amount: 45.00,
    type: "credit" as const,
    category: "Refund",
    balance: 4056.77,
    status: "completed" as const,
  },
  {
    id: "20",
    date: "2024-11-29",
    description: "Gas Station",
    amount: 52.30,
    type: "debit" as const,
    category: "Transportation",
    balance: 4011.77,
    status: "completed" as const,
  },
  {
    id: "21",
    date: "2024-11-28",
    description: "Grocery Store Purchase",
    amount: 156.24,
    type: "debit" as const,
    category: "Groceries",
    balance: 4064.07,
    status: "completed" as const,
  },
  {
    id: "22",
    date: "2024-11-27",
    description: "Restaurant - Dinner",
    amount: 87.50,
    type: "debit" as const,
    category: "Dining",
    balance: 4220.31,
    status: "completed" as const,
  },
  {
    id: "23",
    date: "2024-11-26",
    description: "Car Payment",
    amount: 425.00,
    type: "debit" as const,
    category: "Transportation",
    balance: 4307.81,
    status: "completed" as const,
  },
  {
    id: "24",
    date: "2024-11-25",
    description: "Client Payment",
    amount: 1200.00,
    type: "credit" as const,
    category: "Income",
    balance: 4732.81,
    status: "pending" as const,
  },
  {
    id: "25",
    date: "2024-11-24",
    description: "Streaming Service",
    amount: 12.99,
    type: "debit" as const,
    category: "Entertainment",
    balance: 3532.81,
    status: "completed" as const,
  },
  {
    id: "26",
    date: "2024-11-23",
    description: "Book Store",
    amount: 34.50,
    type: "debit" as const,
    category: "Shopping",
    balance: 3545.80,
    status: "completed" as const,
  },
  {
    id: "27",
    date: "2024-11-22",
    description: "Transfer Failed - Insufficient Funds",
    amount: 1000.00,
    type: "debit" as const,
    category: "Transfer",
    balance: 3580.30,
    status: "failed" as const,
  },
  {
    id: "28",
    date: "2024-11-21",
    description: "Internet Bill",
    amount: 79.99,
    type: "debit" as const,
    category: "Utilities",
    balance: 3580.30,
    status: "completed" as const,
  },
  {
    id: "29",
    date: "2024-11-20",
    description: "Parking Fee",
    amount: 15.00,
    type: "debit" as const,
    category: "Transportation",
    balance: 3660.29,
    status: "completed" as const,
  },
  {
    id: "30",
    date: "2024-11-19",
    description: "Interest Earned",
    amount: 25.50,
    type: "credit" as const,
    category: "Income",
    balance: 3675.29,
    status: "completed" as const,
  },
];

export function SimpleAccountDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0]);

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Account Management</h1>
          <p className="text-muted-foreground">
            Manage your accounts, view transactions, and download statements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw size={14} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Balance</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="tracking-tight">{formatCurrency(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                Across {mockAccounts.length} accounts
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Accounts</CardTitle>
            <Badge variant="default">{mockAccounts.filter(acc => acc.status === 'active').length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="tracking-tight">All Active</div>
              <p className="text-xs text-muted-foreground">
                No issues detected
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Recent Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="tracking-tight">{mockTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Items</CardTitle>
            <Badge variant="secondary">{mockTransactions.filter(t => t.status === 'pending').length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="tracking-tight">0 Pending</div>
              <p className="text-xs text-muted-foreground">
                No pending items
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Cards */}
      <div>
        <h2 className="mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      {/* Transactions and Statements */}
      <div>
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <TrendingUp size={16} />
              Transaction Search
            </TabsTrigger>
            <TabsTrigger value="statements" className="flex items-center gap-2">
              <FileText size={16} />
              Download Statements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <TransactionHistory transactions={mockTransactions} />
          </TabsContent>
          
          <TabsContent value="statements">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-4">Select Account for Statements</h3>
                <div className="space-y-2">
                  {mockAccounts.map((account) => (
                    <Card 
                      key={account.id} 
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedAccount.id === account.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedAccount(account)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.type}</p>
                            <p className="text-xs text-muted-foreground">
                              ...{account.accountNumber.slice(-4)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(account.balance)}</p>
                            <Badge 
                              variant={selectedAccount.id === account.id ? "default" : "outline"} 
                              className="text-xs"
                            >
                              {selectedAccount.id === account.id ? "Selected" : "Select"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <StatementDownload 
                  accountId={selectedAccount.id}
                  accountName={selectedAccount.name}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}