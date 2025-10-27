import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HamburgerMenu } from "./Menu";
import { 
  Building2, 
  CreditCard, 
  ArrowLeftRight, 
  Receipt, 
  HelpCircle, 
  Eye, 
  EyeOff,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  lastLogin: "2024-12-18T09:30:00Z"
};

const mockAccounts = [
  {
    id: "1",
    name: "Primary Checking",
    type: "Checking Account",
    balance: 5420.50,
    accountNumber: "1234567890",
    icon: Building2,
  },
  {
    id: "2",
    name: "High Yield Savings",
    type: "Savings Account", 
    balance: 15750.25,
    accountNumber: "0987654321",
    icon: Building2,
  },
  {
    id: "3",
    name: "Credit Card",
    type: "Credit Card",
    balance: -1250.75,
    accountNumber: "5555444433332222",
    icon: CreditCard,
  },
];

const quickActions = [
  {
    title: "View Accounts",
    description: "Check balances and transaction history",
    icon: Building2,
    color: "bg-blue-500",
    action: "accounts"
  },
  {
    title: "Transfer Funds",
    description: "Move money between your accounts",
    icon: ArrowLeftRight,
    color: "bg-green-500", 
    action: "transfer"
  },
  {
    title: "Pay Bills",
    description: "Pay bills to registered payees",
    icon: Receipt,
    color: "bg-purple-500",
    action: "billpay"
  },
  {
    title: "Get Support",
    description: "Contact customer service",
    icon: HelpCircle,
    color: "bg-orange-500",
    action: "support"
  },
];

const recentActivity = [
  {
    id: "1",
    description: "Direct Deposit - Salary",
    amount: 3500.00,
    type: "credit",
    date: "2024-12-18",
    account: "Primary Checking"
  },
  {
    id: "2", 
    description: "Grocery Store Purchase",
    amount: 127.85,
    type: "debit", 
    date: "2024-12-17",
    account: "Primary Checking"
  },
  {
    id: "3",
    description: "Credit Card Payment",
    amount: 450.00,
    type: "debit",
    date: "2024-12-16", 
    account: "Primary Checking"
  },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function HomePage({ onNavigate, onLogout }: HomePageProps) {
  const [balancesVisible, setBalancesVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatAccountNumber = (accountNumber: string) => {
    return `****${accountNumber.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HamburgerMenu onNavigate={onNavigate} />
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">EasyBank</h1>
              <p className="text-sm text-muted-foreground">Personal Banking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="font-medium">Welcome, {mockUser.firstName}</p>
              <p className="text-sm text-muted-foreground">
                Last login: {new Date(mockUser.lastLogin).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Account Overview</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalancesVisible(!balancesVisible)}
                  >
                    {balancesVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                    <p className="text-sm opacity-90">Total Balance</p>
                    <p className="text-3xl font-bold">
                      {balancesVisible ? formatCurrency(totalBalance) : "••••••"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockAccounts.map((account) => {
                      const IconComponent = account.icon;
                      return (
                        <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                             onClick={() => onNavigate('accounts')}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{account.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatAccountNumber(account.accountNumber)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium text-sm ${account.balance < 0 ? 'text-red-600' : ''}`}>
                              {balancesVisible ? formatCurrency(account.balance) : "••••••"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={action.action}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-center gap-2"
                        onClick={() => onNavigate(action.action)}
                      >
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <IconComponent size={20} className="text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium">{action.title}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('accounts')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <TrendingUp size={16} className={
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      } />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.account} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium text-sm ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}