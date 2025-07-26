import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, AlertTriangle, Plus, Camera, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { NotificationToast } from "@/components/NotificationToast";
import { ImageUpload } from "@/components/ImageUpload";

export default function ComplaintCenter() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    orderId: "",
    imageUrl: ""
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  // Mock complaints data
  const complaints = [
    {
      id: "C001",
      title: "देर से डिलिवरी",
      description: "आलू की डिलिवरी दो घंटे देर से आई",
      status: "open",
      createdAt: "2024-01-26T10:00:00Z",
      orderId: "ORD001",
      response: null,
      imageUrl: null
    },
    {
      id: "C002", 
      title: "खराब गुणवत्ता",
      description: "प्याज की गुणवत्ता अच्छी नहीं थी",
      status: "resolved",
      createdAt: "2024-01-25T14:30:00Z",
      orderId: "ORD002",
      response: "माफी चाहते हैं। अगली डिलिवरी में बेहतर गुणवत्ता का ध्यान रखेंगे।",
      imageUrl: null
    },
    {
      id: "C003",
      title: "गलत मात्रा",
      description: "5kg चाट मसाला ऑर्डर किया था, केवल 3kg मिला",
      status: "in_progress",
      createdAt: "2024-01-24T09:15:00Z",
      orderId: "ORD003",
      response: "समस्या की जांच की जा रही है।",
      imageUrl: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-neutral-100 text-neutral-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return t("open");
      case "in_progress":
        return "In Progress";
      case "resolved":
        return t("resolved");
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const handleSubmitComplaint = () => {
    if (!newComplaint.title || !newComplaint.description) {
      setToast({ show: true, message: "Please fill all required fields" });
      return;
    }

    // Mock submission
    setToast({ show: true, message: "Complaint submitted successfully!" });
    setIsDialogOpen(false);
    setNewComplaint({ title: "", description: "", orderId: "", imageUrl: "" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/vendor-dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-neutral-800">
                {t("complaintCenter")}
              </h1>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("newComplaint")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t("newComplaint")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">शिकायत का शीर्षक *</Label>
                    <Input
                      id="title"
                      value={newComplaint.title}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="शिकायत का संक्षिप्त विवरण"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="orderId">Order ID (वैकल्पिक)</Label>
                    <Input
                      id="orderId"
                      value={newComplaint.orderId}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, orderId: e.target.value }))}
                      placeholder="ORD001"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">विस्तृत विवरण *</Label>
                    <Textarea
                      id="description"
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="समस्या का विस्तृत विवरण दें..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>फोटो अपलोड करें (वैकल्पिक)</Label>
                    <ImageUpload
                      onImageUploaded={(url) => setNewComplaint(prev => ({ ...prev, imageUrl: url }))}
                      currentImageUrl={newComplaint.imageUrl}
                      buttonText="समस्या का फोटो चुनें"
                      uploadPath="complaints"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button onClick={handleSubmitComplaint} className="bg-red-600 hover:bg-red-700">
                      Submit Complaint
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">शिकायत केंद्र</h3>
                <p className="text-sm text-blue-700">
                  डिलिवरी या उत्पाद की गुणवत्ता में कोई समस्या हो तो यहाँ शिकायत दर्ज करें। 
                  हम 24-48 घंटों में जवाब देने की कोशिश करते हैं।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(complaint.status)}>
                      {getStatusText(complaint.status)}
                    </Badge>
                    <span className="text-xs text-neutral-500">#{complaint.id}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-neutral-700 mb-2">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>📅 {formatDate(complaint.createdAt)}</span>
                      {complaint.orderId && <span>📦 Order: {complaint.orderId}</span>}
                    </div>
                  </div>
                  
                  {complaint.response && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-semibold text-green-800 text-sm mb-1">
                        आपूर्तिकर्ता का जवाब:
                      </h4>
                      <p className="text-green-700 text-sm">{complaint.response}</p>
                    </div>
                  )}
                  
                  {complaint.status === "open" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-700 text-sm">
                        ⏳ आपकी शिकायत की समीक्षा की जा रही है। जल्द ही जवाब मिलेगा।
                      </p>
                    </div>
                  )}
                  
                  {complaint.status === "in_progress" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 text-sm">
                        🔄 समस्या का समाधान किया जा रहा है।
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {complaints.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                कोई शिकायत नहीं
              </h3>
              <p className="text-neutral-500 mb-6">
                अभी तक कोई शिकायत दर्ज नहीं की गई है।
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                पहली शिकायत दर्ज करें
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <NotificationToast
        show={toast.show}
        message={toast.message}
        onHide={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}
