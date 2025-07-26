import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Camera, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { NotificationToast } from "@/components/NotificationToast";
import { ImageUpload } from "@/components/ImageUpload";

export default function ProductManagement() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    nameHindi: "",
    category: "",
    price: "",
    unit: "",
    stockLevel: "",
    description: "",
    descriptionHindi: "",
    imageUrl: ""
  });

  if (!user || user.role !== "supplier") {
    setLocation("/login");
    return null;
  }

  // Mock products data
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Potatoes",
      nameHindi: "आलू",
      category: "perishable",
      price: "20.00",
      unit: "kg",
      stockLevel: 100,
      description: "Fresh farm potatoes",
      descriptionHindi: "ताज़े खेत के आलू",
      freshnessStatus: "fresh",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop"
    },
    {
      id: "2",
      name: "Green Chili",
      nameHindi: "हरी मिर्च",
      category: "perishable",
      price: "80.00",
      unit: "kg",
      stockLevel: 25,
      description: "Fresh green chilies",
      descriptionHindi: "ताज़ी हरी मिर्च",
      freshnessStatus: "fresh",
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
    },
    {
      id: "3",
      name: "Chaat Masala",
      nameHindi: "चाट मसाला",
      category: "non_perishable",
      price: "300.00",
      unit: "kg",
      stockLevel: 50,
      description: "Premium chaat masala blend",
      descriptionHindi: "प्रीमियम चाट मसाला मिश्रण",
      freshnessStatus: "blurred",
      imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop"
    }
  ]);

  const getFreshnessColor = (status: string) => {
    switch (status) {
      case "fresh":
        return "bg-green-100 text-green-800";
      case "blurred":
        return "bg-amber-100 text-amber-800";
      case "low_quality":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getFreshnessIcon = (status: string) => {
    switch (status) {
      case "fresh":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "blurred":
      case "low_quality":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    return category === "perishable" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
  };

  const getCategoryText = (category: string) => {
    return category === "perishable" ? "जल्दी खराब" : "लंबे समय तक";
  };

  const handleSubmitProduct = () => {
    if (!newProduct.name || !newProduct.nameHindi || !newProduct.price || !newProduct.unit) {
      setToast({ show: true, message: "Please fill all required fields" });
      return;
    }

    const productData = {
      ...newProduct,
      id: Date.now().toString(),
      stockLevel: parseInt(newProduct.stockLevel) || 0,
      freshnessStatus: "fresh"
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
      setEditingProduct(null);
      setToast({ show: true, message: "Product updated successfully!" });
    } else {
      setProducts(prev => [...prev, productData]);
      setToast({ show: true, message: "Product added successfully!" });
    }

    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      nameHindi: "",
      category: "",
      price: "",
      unit: "",
      stockLevel: "",
      description: "",
      descriptionHindi: "",
      imageUrl: ""
    });
  };

  const handleEditProduct = (product: any) => {
    setNewProduct({
      name: product.name,
      nameHindi: product.nameHindi,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stockLevel: product.stockLevel.toString(),
      description: product.description,
      descriptionHindi: product.descriptionHindi,
      imageUrl: product.imageUrl
    });
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setToast({ show: true, message: "Product deleted successfully!" });
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      nameHindi: "",
      category: "",
      price: "",
      unit: "",
      stockLevel: "",
      description: "",
      descriptionHindi: "",
      imageUrl: ""
    });
    setEditingProduct(null);
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
                onClick={() => setLocation("/supplier-dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-neutral-800">
                {t("productManagement")}
              </h1>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-emerald-600">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("addProduct")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : t("addProduct")}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nameHindi">Product Name (Hindi) *</Label>
                      <Input
                        id="nameHindi"
                        value={newProduct.nameHindi}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, nameHindi: e.target.value }))}
                        placeholder="आलू"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Product Name (English) *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Potatoes"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="perishable">Perishable (जल्दी खराब)</SelectItem>
                          <SelectItem value="non_perishable">Non-Perishable (लंबे समय तक)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit *</Label>
                      <Select value={newProduct.unit} onValueChange={(value) => setNewProduct(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="L">Liter (L)</SelectItem>
                          <SelectItem value="mL">Milliliter (mL)</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="packets">Packets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price per unit (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="20"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stockLevel">Stock Level *</Label>
                      <Input
                        id="stockLevel"
                        type="number"
                        value={newProduct.stockLevel}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, stockLevel: e.target.value }))}
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="descriptionHindi">Description (Hindi)</Label>
                    <Textarea
                      id="descriptionHindi"
                      value={newProduct.descriptionHindi}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, descriptionHindi: e.target.value }))}
                      placeholder="ताज़े खेत के आलू"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description (English)</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Fresh farm potatoes"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label>Product Image</Label>
                    <ImageUpload
                      onImageUploaded={(url) => setNewProduct(prev => ({ ...prev, imageUrl: url }))}
                      currentImageUrl={newProduct.imageUrl}
                      buttonText="उत्पाद की फोटो अपलोड करें"
                      uploadPath="products"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      AI will automatically detect freshness
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button onClick={handleSubmitProduct} className="bg-primary hover:bg-emerald-600">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Products</p>
                  <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Fresh Products</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {products.filter(p => p.freshnessStatus === "fresh").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Low Stock</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {products.filter(p => p.stockLevel < 30).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="shadow-lg">
              <CardContent className="p-6">
                <img 
                  src={product.imageUrl} 
                  alt={product.nameHindi}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-800">{product.nameHindi}</h3>
                  <Badge className={`${getFreshnessColor(product.freshnessStatus)} flex items-center text-xs font-medium`}>
                    {getFreshnessIcon(product.freshnessStatus)}
                    {product.freshnessStatus === "fresh" ? t("fresh") : 
                     product.freshnessStatus === "blurred" ? t("blurred") : 
                     t("lowQuality")}
                  </Badge>
                </div>
                
                <p className="text-sm text-neutral-600 mb-2">{product.name}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(product.category)}>
                    {getCategoryText(product.category)}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Price:</span>
                    <span className="font-medium">₹{product.price}/{product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Stock:</span>
                    <span className={`font-medium ${product.stockLevel < 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stockLevel} {product.unit}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                No Products Added
              </h3>
              <p className="text-neutral-500 mb-6">
                Start by adding your first product to the inventory.
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-emerald-600"
              >
                Add First Product
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
