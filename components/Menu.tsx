import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu, Download, ArrowLeftRight, Receipt, HelpCircle } from "lucide-react";

const bankingFeatures = [
  {
    title: "Transaction Search",
    description: "Search & filter transaction history",
    icon: Download,
    color: "text-blue-600",
    action: "accounts"
  },
  {
    title: "Internal Transfers",
    description: "Free between your accounts",
    icon: ArrowLeftRight,
    color: "text-green-600",
    action: "transfer"
  },
  {
    title: "Bill Pay Service",
    description: "Schedule and manage payments",
    icon: Receipt,
    color: "text-purple-600",
    action: "billpay"
  },
  {
    title: "24/7 Support",
    description: "Chat, email, or phone",
    icon: HelpCircle,
    color: "text-orange-600",
    action: "support"
  },
];

interface HamburgerMenuProps {
  onNavigate: (page: string) => void;
}

export function HamburgerMenu({ onNavigate }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (action: string) => {
    onNavigate(action);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Banking Features</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {bankingFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.action}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => handleNavigation(feature.action)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent size={20} className={feature.color} />
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Access
                </Button>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}