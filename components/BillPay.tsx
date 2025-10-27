import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { CreditCard, Plus, Trash2, CheckCircle, Calendar as CalendarIcon, Edit, RefreshCw, Clock } from "lucide-react";
import { format } from "date-fns";

const mockAccounts = [
  {
    id: "1",
    name: "Primary Checking",
    balance: 5420.50,
  },
  {
    id: "2",
    name: "High Yield Savings",
    balance: 15750.25,
  },
];

const mockPayees = [
  {
    id: "1",
    name: "Electric Company",
    accountNumber: "****4521",
    category: "Utilities",
    autopay: true,
    lastPayment: "2024-12-15",
    amount: 125.50,
  },
  {
    id: "2",
    name: "Internet Provider",
    accountNumber: "****7890",
    category: "Utilities",
    autopay: false,
    lastPayment: "2024-12-10",
    amount: 89.99,
  },
  {
    id: "3",
    name: "Credit Card - Visa",
    accountNumber: "****3456",
    category: "Credit Cards",
    autopay: true,
    lastPayment: "2024-12-20",
    amount: 450.00,
  },
];

interface ScheduledPayment {
  id: string;
  payeeId: string;
  payeeName: string;
  accountId: string;
  accountName: string;
  amount: number;
  startDate: Date;
  frequency: "one-time" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually";
  endDate?: Date;
  endType?: "never" | "date" | "occurrences";
  occurrences?: number;
  memo: string;
  status: "active" | "paused" | "completed";
  nextPaymentDate: Date;
  remainingPayments?: number;
}

export function BillPay() {
  const [activeTab, setActiveTab] = useState("pay");
  const [selectedPayee, setSelectedPayee] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [memo, setMemo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  // Recurring payment fields
  const [paymentType, setPaymentType] = useState<"one-time" | "recurring">("one-time");
  const [frequency, setFrequency] = useState<"weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually">("monthly");
  const [endType, setEndType] = useState<"never" | "date" | "occurrences">("never");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [occurrences, setOccurrences] = useState("");
  
  // Scheduled payments management
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    {
      id: "sch1",
      payeeId: "1",
      payeeName: "Electric Company",
      accountId: "1",
      accountName: "Primary Checking",
      amount: 125.50,
      startDate: new Date("2025-01-05"),
      frequency: "monthly",
      memo: "Monthly electric bill",
      status: "active",
      nextPaymentDate: new Date("2025-01-05"),
      remainingPayments: undefined,
    },
    {
      id: "sch2",
      payeeId: "3",
      payeeName: "Credit Card - Visa",
      accountId: "1",
      accountName: "Primary Checking",
      amount: 450.00,
      startDate: new Date("2024-12-25"),
      frequency: "monthly",
      memo: "Credit card payment",
      status: "active",
      nextPaymentDate: new Date("2025-01-25"),
      remainingPayments: undefined,
    },
    {
      id: "sch3",
      payeeId: "2",
      payeeName: "Internet Provider",
      accountId: "2",
      accountName: "High Yield Savings",
      amount: 89.99,
      startDate: new Date("2024-12-28"),
      frequency: "one-time",
      memo: "December internet bill",
      status: "active",
      nextPaymentDate: new Date("2024-12-28"),
      remainingPayments: 1,
    },
  ]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<ScheduledPayment | null>(null);

  // Add New Payee Form
  const [newPayee, setNewPayee] = useState({
    name: "",
    accountNumber: "",
    category: "",
    address: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayee || !selectedAccount || !amount || !paymentDate) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const payee = mockPayees.find(p => p.id === selectedPayee);
    const account = mockAccounts.find(a => a.id === selectedAccount);

    if (paymentType === "one-time") {
      const details = {
        payee: payee?.name,
        account: account?.name,
        amount: parseFloat(amount),
        date: format(paymentDate, "MMM dd, yyyy"),
        memo: memo || "Bill Payment",
        confirmationNumber: `PAY${Date.now()}`,
        type: "one-time",
      };

      setPaymentDetails(details);
    } else {
      // Create recurring payment
      const newScheduledPayment: ScheduledPayment = {
        id: `sch${Date.now()}`,
        payeeId: selectedPayee,
        payeeName: payee?.name || "",
        accountId: selectedAccount,
        accountName: account?.name || "",
        amount: parseFloat(amount),
        startDate: paymentDate,
        frequency: frequency,
        endDate: endType === "date" ? endDate : undefined,
        occurrences: endType === "occurrences" ? parseInt(occurrences) : undefined,
        memo: memo || "Recurring bill payment",
        status: "active",
        nextPaymentDate: paymentDate,
        remainingPayments: endType === "occurrences" ? parseInt(occurrences) : undefined,
      };
      
      setScheduledPayments([...scheduledPayments, newScheduledPayment]);
      
      const details = {
        payee: payee?.name,
        account: account?.name,
        amount: parseFloat(amount),
        date: format(paymentDate, "MMM dd, yyyy"),
        frequency: frequency,
        endType: endType,
        endDate: endType === "date" && endDate ? format(endDate, "MMM dd, yyyy") : undefined,
        occurrences: endType === "occurrences" ? occurrences : undefined,
        memo: memo || "Recurring bill payment",
        confirmationNumber: `REC${Date.now()}`,
        type: "recurring",
      };

      setPaymentDetails(details);
    }
    
    setPaymentSuccess(true);
    setIsProcessing(false);

    // Reset form
    setSelectedPayee("");
    setSelectedAccount("");
    setAmount("");
    setPaymentDate(new Date());
    setMemo("");
    setPaymentType("one-time");
    setFrequency("monthly");
    setEndType("never");
    setEndDate(undefined);
    setOccurrences("");
  };

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add to the payees list
    setNewPayee({ name: "", accountNumber: "", category: "", address: "" });
    setActiveTab("pay");
  };

  const startNewPayment = () => {
    setPaymentSuccess(false);
    setPaymentDetails(null);
  };
  
  const handleDeletePayment = (id: string) => {
    setPaymentToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeletePayment = () => {
    if (paymentToDelete) {
      setScheduledPayments(scheduledPayments.filter(p => p.id !== paymentToDelete));
      setPaymentToDelete(null);
    }
    setDeleteDialogOpen(false);
  };
  
  const handleEditPayment = (payment: ScheduledPayment) => {
    setPaymentToEdit(payment);
    setEditDialogOpen(true);
  };
  
  const saveEditedPayment = () => {
    if (paymentToEdit) {
      setScheduledPayments(scheduledPayments.map(p => 
        p.id === paymentToEdit.id ? paymentToEdit : p
      ));
    }
    setEditDialogOpen(false);
    setPaymentToEdit(null);
  };
  
  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      "one-time": "One-time",
      "weekly": "Weekly",
      "bi-weekly": "Bi-weekly",
      "monthly": "Monthly",
      "quarterly": "Quarterly",
      "annually": "Annually",
    };
    return labels[freq] || freq;
  };

  if (paymentSuccess && paymentDetails) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle size={24} />
              {paymentDetails.type === "one-time" ? "Payment Scheduled Successfully" : "Recurring Payment Created"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(paymentDetails.amount)}
              </div>
              <p className="text-muted-foreground">
                {paymentDetails.type === "one-time" ? "payment scheduled" : "recurring payment"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payee</Label>
                <p className="font-medium">{paymentDetails.payee}</p>
              </div>
              <div className="space-y-2">
                <Label>From Account</Label>
                <p className="font-medium">{paymentDetails.account}</p>
              </div>
              <div className="space-y-2">
                <Label>{paymentDetails.type === "one-time" ? "Payment Date" : "First Payment"}</Label>
                <p className="font-medium">{paymentDetails.date}</p>
              </div>
              <div className="space-y-2">
                <Label>Confirmation Number</Label>
                <p className="font-medium">{paymentDetails.confirmationNumber}</p>
              </div>
              {paymentDetails.type === "recurring" && (
                <>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <p className="font-medium">{getFrequencyLabel(paymentDetails.frequency)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>End Condition</Label>
                    <p className="font-medium">
                      {paymentDetails.endType === "never" ? "Never ends" : 
                       paymentDetails.endType === "date" ? `Until ${paymentDetails.endDate}` :
                       `${paymentDetails.occurrences} payments`}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="text-center pt-4 space-y-2">
              <Button onClick={startNewPayment} className="w-full sm:w-auto">
                Make Another Payment
              </Button>
              {paymentDetails.type === "recurring" && (
                <Button onClick={() => { startNewPayment(); setActiveTab("scheduled"); }} variant="outline" className="w-full sm:w-auto sm:ml-2">
                  View Scheduled Payments
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 mb-2">
          <CreditCard size={24} />
          Bill Pay
        </h1>
        <p className="text-muted-foreground">
          Pay bills, schedule payments, and manage your payees
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pay">Pay Bills</TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-1">
            <Clock size={14} />
            Scheduled
            {scheduledPayments.filter(p => p.status === "active").length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {scheduledPayments.filter(p => p.status === "active").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payees">Manage Payees</TabsTrigger>
          <TabsTrigger value="add">Add Payee</TabsTrigger>
        </TabsList>

        <TabsContent value="pay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Type Selection */}
                <div className="space-y-3">
                  <Label>Payment Type</Label>
                  <RadioGroup value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="font-normal cursor-pointer">One-time payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recurring" id="recurring" />
                      <Label htmlFor="recurring" className="font-normal cursor-pointer">Recurring payment</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payee">Select Payee</Label>
                    <Select value={selectedPayee} onValueChange={setSelectedPayee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a payee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPayees.map((payee) => (
                          <SelectItem key={payee.id} value={payee.id}>
                            {payee.name} ({payee.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account">From Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({formatCurrency(account.balance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount</Label>
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
                    <Label>{paymentType === "one-time" ? "Payment Date" : "First Payment Date"}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon size={16} className="mr-2" />
                          {paymentDate ? format(paymentDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={paymentDate}
                          onSelect={setPaymentDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Recurring Payment Options */}
                {paymentType === "recurring" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="flex items-center gap-2">
                      <RefreshCw size={16} />
                      Recurring Payment Settings
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly (every 2 weeks)</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly (every 3 months)</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>End Condition</Label>
                      <RadioGroup value={endType} onValueChange={(value: any) => setEndType(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="never" />
                          <Label htmlFor="never" className="font-normal cursor-pointer">Never ends</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="date" id="endDate" />
                          <Label htmlFor="endDate" className="font-normal cursor-pointer">End on specific date</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="occurrences" id="occurrences" />
                          <Label htmlFor="occurrences" className="font-normal cursor-pointer">End after number of payments</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {endType === "date" && (
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon size={16} className="mr-2" />
                              {endDate ? format(endDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              disabled={(date) => paymentDate ? date <= paymentDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {endType === "occurrences" && (
                      <div className="space-y-2">
                        <Label>Number of Payments</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter number of payments"
                          value={occurrences}
                          onChange={(e) => setOccurrences(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Input
                    id="memo"
                    type="text"
                    placeholder="Enter a description for this payment"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isProcessing || !selectedPayee || !selectedAccount || !amount || !paymentDate}
                >
                  {isProcessing ? "Processing..." : paymentType === "one-time" ? "Schedule Payment" : "Create Recurring Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2>Scheduled Payments</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your upcoming and recurring payments
                </p>
              </div>
              <Badge variant="outline">
                {scheduledPayments.filter(p => p.status === "active").length} Active
              </Badge>
            </div>
            
            {scheduledPayments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No Scheduled Payments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled payments yet.
                  </p>
                  <Button onClick={() => setActiveTab("pay")}>
                    Schedule a Payment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {scheduledPayments.map((payment) => (
                  <Card key={payment.id} className={payment.status === "paused" ? "opacity-60" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{payment.payeeName}</h3>
                                <Badge variant={payment.frequency === "one-time" ? "outline" : "secondary"}>
                                  {getFrequencyLabel(payment.frequency)}
                                </Badge>
                                <Badge variant={payment.status === "active" ? "default" : "secondary"}>
                                  {payment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                From: {payment.accountName}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(payment.amount)}</div>
                              {payment.frequency !== "one-time" && payment.remainingPayments && (
                                <p className="text-xs text-muted-foreground">
                                  {payment.remainingPayments} payments left
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Next Payment: </span>
                              <span className="font-medium">{format(payment.nextPaymentDate, "MMM dd, yyyy")}</span>
                            </div>
                            {payment.endDate && (
                              <div>
                                <span className="text-muted-foreground">Ends: </span>
                                <span className="font-medium">{format(payment.endDate, "MMM dd, yyyy")}</span>
                              </div>
                            )}
                            {!payment.endDate && payment.frequency !== "one-time" && (
                              <div>
                                <span className="text-muted-foreground">Ends: </span>
                                <span className="font-medium">Never</span>
                              </div>
                            )}
                          </div>

                          {payment.memo && (
                            <p className="text-sm text-muted-foreground">{payment.memo}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPayment(payment)}
                        >
                          <Edit size={14} className="mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeletePayment(payment.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payees" className="space-y-6">
          <div>
            <h2 className="mb-4">Your Registered Payees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPayees.map((payee) => (
                <Card key={payee.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{payee.name}</h3>
                          {payee.autopay && (
                            <Badge variant="secondary" className="text-xs">
                              AutoPay
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Account: {payee.accountNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Category: {payee.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last Payment: {new Date(payee.lastPayment).toLocaleDateString()} 
                          • {formatCurrency(payee.amount)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Add New Payee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPayee} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payeeName">Payee Name</Label>
                    <Input
                      id="payeeName"
                      type="text"
                      placeholder="Enter payee name"
                      value={newPayee.name}
                      onChange={(e) => setNewPayee({...newPayee, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      placeholder="Enter account number"
                      value={newPayee.accountNumber}
                      onChange={(e) => setNewPayee({...newPayee, accountNumber: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newPayee.category} onValueChange={(value) => setNewPayee({...newPayee, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="credit-cards">Credit Cards</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="loans">Loans</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Payee Address (Optional)</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter payee address"
                    value={newPayee.address}
                    onChange={(e) => setNewPayee({...newPayee, address: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Payee
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Payments are processed on the scheduled date</p>
        <p>• Same-day payments must be scheduled before 5:00 PM EST</p>
        <p>• You'll receive email confirmations for all payments</p>
      </div>

      {/* Delete Payment Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this payment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePayment}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Payment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>
              Update the details of this scheduled payment.
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            {paymentToEdit && (
              <form onSubmit={saveEditedPayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payee">Select Payee</Label>
                    <Select value={paymentToEdit.payeeId} onValueChange={(value: any) => setPaymentToEdit({...paymentToEdit, payeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a payee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPayees.map((payee) => (
                          <SelectItem key={payee.id} value={payee.id}>
                            {payee.name} ({payee.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account">From Account</Label>
                    <Select value={paymentToEdit.accountId} onValueChange={(value: any) => setPaymentToEdit({...paymentToEdit, accountId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({formatCurrency(account.balance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={paymentToEdit.amount}
                      onChange={(e) => setPaymentToEdit({...paymentToEdit, amount: parseFloat(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{paymentToEdit.frequency === "one-time" ? "Payment Date" : "First Payment Date"}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon size={16} className="mr-2" />
                          {paymentToEdit.nextPaymentDate ? format(paymentToEdit.nextPaymentDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={paymentToEdit.nextPaymentDate}
                          onSelect={(date) => setPaymentToEdit({...paymentToEdit, nextPaymentDate: date as Date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Recurring Payment Options */}
                {paymentToEdit.frequency !== "one-time" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="flex items-center gap-2">
                      <RefreshCw size={16} />
                      Recurring Payment Settings
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select value={paymentToEdit.frequency} onValueChange={(value: any) => setPaymentToEdit({...paymentToEdit, frequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly (every 2 weeks)</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly (every 3 months)</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>End Condition</Label>
                      <RadioGroup value={paymentToEdit.endType} onValueChange={(value: any) => setPaymentToEdit({...paymentToEdit, endType: value})}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="never" />
                          <Label htmlFor="never" className="font-normal cursor-pointer">Never ends</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="date" id="endDate" />
                          <Label htmlFor="endDate" className="font-normal cursor-pointer">End on specific date</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="occurrences" id="occurrences" />
                          <Label htmlFor="occurrences" className="font-normal cursor-pointer">End after number of payments</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentToEdit.endType === "date" && (
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon size={16} className="mr-2" />
                              {paymentToEdit.endDate ? format(paymentToEdit.endDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={paymentToEdit.endDate}
                              onSelect={(date) => setPaymentToEdit({...paymentToEdit, endDate: date as Date})}
                              initialFocus
                              disabled={(date) => paymentToEdit.nextPaymentDate ? date <= paymentToEdit.nextPaymentDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {paymentToEdit.endType === "occurrences" && (
                      <div className="space-y-2">
                        <Label>Number of Payments</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter number of payments"
                          value={paymentToEdit.occurrences?.toString()}
                          onChange={(e) => setPaymentToEdit({...paymentToEdit, occurrences: parseInt(e.target.value)})}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="memo">Memo (Optional)</Label>
                  <Input
                    id="memo"
                    type="text"
                    placeholder="Enter a description for this payment"
                    value={paymentToEdit.memo}
                    onChange={(e) => setPaymentToEdit({...paymentToEdit, memo: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                >
                  Save Changes
                </Button>
              </form>
            )}
          </CardContent>
          <DialogFooter>
            <Button onClick={() => setEditDialogOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}