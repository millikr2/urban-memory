import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Download, FileText, Loader2 } from "lucide-react";

interface StatementDownloadProps {
  accountId: string;
  accountName: string;
}

export function StatementDownload({ accountId, accountName }: StatementDownloadProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [statementType, setStatementType] = useState<string>("monthly");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!selectedMonth && statementType === "monthly") {
      return;
    }

    setIsDownloading(true);
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock PDF content
    const content = generateMockStatement();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${accountName}_statement_${statementType === 'monthly' && selectedMonth ? selectedMonth : 'annual'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setIsDownloading(false);
  };

  const generateMockStatement = () => {
    const currentDate = new Date().toLocaleDateString();
    const statementDate = selectedMonth ? selectedMonth : 'Annual Statement';
    
    return `BANK STATEMENT - ${accountName}

Statement Period: ${statementDate}
Generated on: ${currentDate}

ACCOUNT SUMMARY
================
Account Name: ${accountName}
Account ID: ${accountId}

This is a mock statement for demonstration purposes.
In a real application, this would contain:
- Account balance information
- Complete transaction history
- Interest earned (if applicable)
- Fees and charges
- Account terms and conditions

Thank you for banking with us!`;
  };

  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthDisplay = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      months.push({ key: monthKey, display: monthDisplay });
    }
    return months;
  };

  const isDownloadDisabled = statementType === "monthly" && !selectedMonth;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={20} />
          Download Statements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>Statement Type</label>
          <Select value={statementType} onValueChange={setStatementType}>
            <SelectTrigger>
              <SelectValue placeholder="Select statement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Statement</SelectItem>
              <SelectItem value="quarterly">Quarterly Statement</SelectItem>
              <SelectItem value="annual">Annual Statement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {statementType === "monthly" && (
          <div className="space-y-2">
            <label>Select Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {generateMonthOptions().map((month) => (
                  <SelectItem key={month.key} value={month.key}>
                    {month.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-4">
          <Button 
            onClick={handleDownload} 
            disabled={isDownloadDisabled || isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Statement
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Statements are available for up to 7 years</p>
          <p>• Downloads are in text format for demo purposes</p>
          <p>• Monthly statements include all transactions for the selected month</p>
        </div>
      </CardContent>
    </Card>
  );
}