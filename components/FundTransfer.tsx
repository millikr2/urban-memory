import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ArrowLeftRight, CheckCircle, AlertTriangle, Users, CreditCard, Search, User } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const mockAccounts = [
  {
    id: "1",
    name: "Primary Checking",
    type: "Checking Account",
    balance: 5420.50,
    accountNumber: "1234567890",
  },
  {
    id: "2",
    name: "High Yield Savings",
    type: "Savings Account",
    balance: 15750.25,
    accountNumber: "0987654321",
  },
  {
    id: "3",
    name: "Investment Account",
    type: "Investment Account",
    balance: 32580.00,
    accountNumber: "1111222233334444",
  },
];

const mockEasyBankUsers = [
  {
    id: "user1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    accountNumber: "****5678",
    verified: true,
  },
  {
    id: "user2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    accountNumber: "****9012",
    verified: true,
  },
  {
    id: "user3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@gmail.com",
    phone: "+1 (555) 456-7890",
    accountNumber: "****3456",
    verified: true,
  },
  {
    id: "user4",
    name: "David Thompson",
    email: "david.thompson@outlook.com",
    phone: "+1 (555) 789-0123",
    accountNumber: "****7890",
    verified: true,
  },
];

export function FundTransfer() {
  const [transferMode, setTransferMode] = useState("internal"); // "internal" or "external"
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [transferType, setTransferType] = useState("immediate");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>(null);
  
  // External transfer states
  const [recipientSearch, setRecipientSearch] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAccountBalance = (accountId: string) => {
    const account = mockAccounts.find(acc => acc.id === accountId);
    return account ? account.balance : 0;
  };

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find(acc => acc.id === accountId);
    return account ? account.name : "";
  };

  const searchRecipients = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API search delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = mockEasyBankUsers.filter(user => 
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.phone.includes(query) ||
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const selectRecipient = (recipient: any) => {
    setSelectedRecipient(recipient);
    setRecipientSearch(`${recipient.name} (${recipient.email})`);
    setSearchResults([]);
  };

  const clearRecipient = () => {
    setSelectedRecipient(null);
    setRecipientSearch("");
    setSearchResults([]);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromAccount || !amount) {
      return;
    }

    // Validation for internal transfers
    if (transferMode === "internal" && (!toAccount || fromAccount === toAccount)) {
      return;
    }

    // Validation for external transfers
    if (transferMode === "external" && !selectedRecipient) {
      return;
    }

    const transferAmount = parseFloat(amount);
    const availableBalance = getAccountBalance(fromAccount);

    if (transferAmount > availableBalance) {
      return;
    }

    setIsTransferring(true);

    // Simulate transfer processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const details = {
      from: getAccountName(fromAccount),
      to: transferMode === "internal" ? getAccountName(toAccount) : `${selectedRecipient.name} (${selectedRecipient.email})`,
      amount: transferAmount,
      memo: memo || (transferMode === "external" ? "Money Transfer" : "Fund Transfer"),
      date: new Date(),
      confirmationNumber: `TXN${Date.now()}`,
      transferMode,
      recipient: transferMode === "external" ? selectedRecipient : null,
    };

    setTransferDetails(details);
    setTransferSuccess(true);
    setIsTransferring(false);

    // Reset form
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setMemo("");
    clearRecipient();
  };

  const startNewTransfer = () => {
    setTransferSuccess(false);
    setTransferDetails(null);
  };

  if (transferSuccess && transferDetails) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle size={24} />
              Transfer Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(transferDetails.amount)}
              </div>
              <p className="text-muted-foreground">has been transferred</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Account</Label>
                <p className="font-medium">{transferDetails.from}</p>
              </div>
              <div className="space-y-2">
                <Label>To Account</Label>
                <p className="font-medium">{transferDetails.to}</p>
              </div>
              <div className="space-y-2">
                <Label>Memo</Label>
                <p className="font-medium">{transferDetails.memo}</p>
              </div>
              <div className="space-y-2">
                <Label>Confirmation Number</Label>
                <p className="font-medium">{transferDetails.confirmationNumber}</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button onClick={startNewTransfer}>
                Make Another Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 mb-2">
          <ArrowLeftRight size={24} />
          Transfer Funds
        </h1>
        <p className="text-muted-foreground">
          Transfer money between your accounts or to other EasyBank customers
        </p>
      </div>

      <Tabs value={transferMode} onValueChange={setTransferMode}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="internal" className="flex items-center gap-2">
            <CreditCard size={16} />
            Between My Accounts
          </TabsTrigger>
          <TabsTrigger value="external" className="flex items-center gap-2">
            <Users size={16} />
            To EasyBank Customer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="internal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Internal Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">From Account</Label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex justify-between w-full">
                              <span>{account.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {formatCurrency(account.balance)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fromAccount && (
                      <p className="text-sm text-muted-foreground">
                        Available: {formatCurrency(getAccountBalance(fromAccount))}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toAccount">To Account</Label>
                    <Select value={toAccount} onValueChange={setToAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.filter(acc => acc.id !== fromAccount).map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex justify-between w-full">
                              <span>{account.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {formatCurrency(account.balance)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Transfer Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Input
                    id="memo"
                    type="text"
                    placeholder="Enter a description for this transfer"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferType">Transfer Type</Label>
                  <Select value={transferType} onValueChange={setTransferType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate Transfer</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {fromAccount === toAccount && fromAccount && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please select different accounts for source and destination.
                    </AlertDescription>
                  </Alert>
                )}

                {amount && fromAccount && parseFloat(amount) > getAccountBalance(fromAccount) && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Transfer amount exceeds available balance in the source account.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isTransferring ||
                    !fromAccount ||
                    !toAccount ||
                    !amount ||
                    fromAccount === toAccount ||
                    !!(amount && fromAccount && parseFloat(amount) > getAccountBalance(fromAccount))
                  }
                >
                  {isTransferring ? "Processing Transfer..." : "Transfer Funds"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Money to EasyBank Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fromAccount">From Account</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex justify-between w-full">
                            <span>{account.name}</span>
                            <span className="text-muted-foreground ml-2">
                              {formatCurrency(account.balance)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fromAccount && (
                    <p className="text-sm text-muted-foreground">
                      Available: {formatCurrency(getAccountBalance(fromAccount))}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      type="text"
                      placeholder="Enter email address or phone number"
                      value={recipientSearch}
                      onChange={(e) => {
                        setRecipientSearch(e.target.value);
                        searchRecipients(e.target.value);
                      }}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>

                  {isSearching && (
                    <p className="text-sm text-muted-foreground">Searching EasyBank customers...</p>
                  )}

                  {searchResults.length > 0 && (
                    <div className="border rounded-lg p-2 space-y-2 max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                          onClick={() => selectRecipient(user)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {user.accountNumber}
                            </Badge>
                            {user.verified && (
                              <Badge variant="default" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedRecipient && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <User size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-green-800">{selectedRecipient.name}</p>
                            <p className="text-xs text-green-600">{selectedRecipient.email}</p>
                            <p className="text-xs text-green-600">{selectedRecipient.accountNumber}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearRecipient}>
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Transfer Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo">Message (Optional)</Label>
                  <Input
                    id="memo"
                    type="text"
                    placeholder="Enter a message for the recipient"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>

                {amount && fromAccount && parseFloat(amount) > getAccountBalance(fromAccount) && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Transfer amount exceeds available balance in the source account.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isTransferring ||
                    !fromAccount ||
                    !selectedRecipient ||
                    !amount ||
                    !!(amount && fromAccount && parseFloat(amount) > getAccountBalance(fromAccount))
                  }
                >
                  {isTransferring ? "Processing Transfer..." : "Send Money"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Internal transfers between your accounts are processed immediately</p>
        <p>• External transfers to EasyBank customers are typically processed within minutes</p>
        <p>• All transfers are secured with bank-level encryption</p>
        <p>• Both you and the recipient will receive confirmation notifications</p>
      </div>
    </div>
  );
}