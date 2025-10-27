import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { SimpleAccountDashboard } from "./components/AccountDashboard";
import { FundTransfer } from "./components/FundTransfer";
import { BillPay } from "./components/BillPay";
import { CustomerSupport } from "./components/CustomerSupport";
import { HamburgerMenu } from "./components/Menu";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case "accounts":
        return <SimpleAccountDashboard />;
      case "transfer":
        return <FundTransfer />;
      case "billpay":
        return <BillPay />;
      case "support":
        return <CustomerSupport />;
      default:
        return <HomePage onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      {currentPage !== "home" &&  (
        <nav className="bg-white border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HamburgerMenu onNavigate={handleNavigate} />
              <button 
                onClick={() => handleNavigate("home")}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EB</span>
                </div>
                <span className="font-medium">EasyBank</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavigate("home")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </button>
              <button 
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Page Content */}
      <main className={currentPage !== "home" ? "p-4" : ""}>
        {renderCurrentPage()}
      </main>
    </div>
  );
}