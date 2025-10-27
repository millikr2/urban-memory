import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  CheckCircle, 
  HelpCircle,
  Send
} from "lucide-react";

const mockTickets = [
  {
    id: "TKT001",
    subject: "Account Statement Question",
    status: "open",
    priority: "medium",
    created: "2024-12-18",
    lastUpdate: "2024-12-18",
    category: "Account Inquiry",
  },
  {
    id: "TKT002",
    subject: "Card Replacement Request",
    status: "in-progress",
    priority: "high",
    created: "2024-12-17",
    lastUpdate: "2024-12-18",
    category: "Card Services",
  },
  {
    id: "TKT003",
    subject: "Online Banking Login Issue",
    status: "resolved",
    priority: "low",
    created: "2024-12-15",
    lastUpdate: "2024-12-16",
    category: "Technical Support",
  },
];

const faqItems = [
  {
    question: "How do I reset my online banking password?",
    answer: "You can reset your password by clicking 'Forgot Password' on the login page. You'll receive an email with reset instructions.",
    category: "Account Access",
  },
  {
    question: "What are your customer service hours?",
    answer: "Our customer service is available 24/7 for urgent matters. General support is available Monday-Friday 8AM-8PM EST.",
    category: "Contact Info",
  },
  {
    question: "How do I report a lost or stolen card?",
    answer: "Call our 24/7 card services line at 1-800-XXX-XXXX immediately. You can also report it through online banking.",
    category: "Card Services",
  },
  {
    question: "What fees does my checking account have?",
    answer: "Most of our checking accounts have no monthly fees when you maintain a minimum balance. Check your account terms for specific details.",
    category: "Fees & Charges",
  },
];

export function CustomerSupport() {
  const [activeTab, setActiveTab] = useState("contact");
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    contactMethod: "email",
  });
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: "agent", message: "Hello! How can I help you today?", time: "9:00 AM" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    // Reset form
    setContactForm({
      subject: "",
      category: "",
      priority: "medium",
      description: "",
      contactMethod: "email",
    });
  };

  const handleChatSend = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatHistory.length + 1,
      sender: "user",
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory([...chatHistory, newMessage]);
    setChatMessage("");

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: chatHistory.length + 2,
        sender: "agent",
        message: "Thank you for your message. Let me look into that for you. This is a demo response.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 mb-2">
          <HelpCircle size={24} />
          Customer Support
        </h1>
        <p className="text-muted-foreground">
          Get help with your account and banking needs
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium mb-1">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-2">24/7 Support</p>
            <p className="font-mono text-sm">1-800-XXX-XXXX</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium mb-1">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-2">Quick answers</p>
            <p className="text-sm">Available now</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium mb-1">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-2">Detailed help</p>
            <p className="text-sm">24-48 hour response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          {submitSuccess ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-medium mb-2">Support Request Submitted</h3>
                <p className="text-muted-foreground mb-4">
                  We've received your request and will respond within 24-48 hours.
                </p>
                <Button onClick={() => setSubmitSuccess(false)}>
                  Submit Another Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={contactForm.category} onValueChange={(value) => setContactForm({...contactForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Inquiry</SelectItem>
                          <SelectItem value="cards">Card Services</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="loans">Loans & Credit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={contactForm.priority} onValueChange={(value) => setContactForm({...contactForm, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                      <Select value={contactForm.contactMethod} onValueChange={(value) => setContactForm({...contactForm, contactMethod: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="either">Either</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your inquiry or issue"
                      rows={5}
                      value={contactForm.description}
                      onChange={(e) => setContactForm({...contactForm, description: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle size={20} />
                Live Chat Support
                <Badge variant="secondary" className="ml-auto">Online</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 border rounded-lg p-4 mb-4 overflow-y-auto space-y-3">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                />
                <Button onClick={handleChatSend} size="sm">
                  <Send size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div>
            <h2 className="mb-4">Support Tickets</h2>
            <div className="space-y-4">
              {mockTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <Badge className={getStatusColor(ticket.status)} variant="secondary">
                            {ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ticket ID: {ticket.id} • Category: {ticket.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(ticket.created).toLocaleDateString()} • 
                          Last Update: {new Date(ticket.lastUpdate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div>
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{item.question}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}