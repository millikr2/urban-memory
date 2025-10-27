import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
  status: "active" | "inactive";
}

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    return `****${accountNumber.slice(-4)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="tracking-tight">{account.name}</h3>
          <p className="text-muted-foreground">
            {maskAccountNumber(account.accountNumber)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={account.status === "active" ? "default" : "secondary"}>
            {account.status}
          </Badge>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-muted rounded"
          >
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-muted-foreground">{account.type}</p>
          <div className="space-y-1">
            <p className="text-muted-foreground">Available Balance</p>
            <p className="text-2xl tracking-tight">
              {showBalance ? formatCurrency(account.balance) : "••••••"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}