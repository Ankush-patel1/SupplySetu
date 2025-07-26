import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/imageUpload";
import { analyzeImageFreshness, FreshnessResult } from "@/lib/aiServices";

interface ImageUploadProps {
  onImageUploaded: (url: string, freshnessResult?: FreshnessResult) => void;
  currentImageUrl?: string;
  buttonText?: string;
  uploadPath: string;
  className?: string;
  enableAIAnalysis?: boolean;
}

export function ImageUpload({ 
  onImageUploaded, 
  currentImageUrl, 
  buttonText = "Upload Image", 
  uploadPath,
  className = "",
  enableAIAnalysis = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [freshnessResult, setFreshnessResult] = useState<FreshnessResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate the file
      validateImageFile(file);
      
      // Create preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      
      // Upload to Firebase
      setIsUploading(true);
      const downloadURL = await uploadImage(file, uploadPath);
      setIsUploading(false);
      
      // AI Analysis for freshness (if enabled)
      let analysisResult: FreshnessResult | undefined;
      if (enableAIAnalysis) {
        setIsAnalyzing(true);
        try {
          analysisResult = await analyzeImageFreshness(downloadURL);
          setFreshnessResult(analysisResult);
        } catch (error) {
          console.error("AI analysis error:", error);
        } finally {
          setIsAnalyzing(false);
        }
      }
      
      // Notify parent component
      onImageUploaded(downloadURL, analysisResult);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
      setPreviewUrl(currentImageUrl || null);
      setIsUploading(false);
      setIsAnalyzing(false);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFreshnessResult(null);
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFreshnessIcon = (status: string) => {
    switch (status) {
      case 'fresh':
        return <CheckCircle className="h-3 w-3" />;
      case 'moderate':
        return <AlertTriangle className="h-3 w-3" />;
      case 'poor':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getFreshnessColor = (status: string) => {
    switch (status) {
      case 'fresh':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-neutral-200"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-100 hover:bg-red-200"
          >
            <X className="h-3 w-3 text-red-600" />
          </Button>
          
          {/* AI Analysis Results */}
          {enableAIAnalysis && isAnalyzing && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                <span className="text-xs text-blue-600">AI analyzing freshness...</span>
              </div>
            </div>
          )}
          
          {enableAIAnalysis && freshnessResult && (
            <div className="absolute bottom-2 left-2 right-2">
              <Badge className={`${getFreshnessColor(freshnessResult.status)} flex items-center gap-1 text-xs font-medium`}>
                {getFreshnessIcon(freshnessResult.status)}
                {freshnessResult.status.toUpperCase()} ({Math.round(freshnessResult.confidence * 100)}%)
              </Badge>
            </div>
          )}
        </div>
      ) : null}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || isAnalyzing}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            AI Analyzing...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
      
      <p className="text-xs text-neutral-500">
        Supported: JPEG, PNG, WebP • Max size: 5MB
      </p>
    </div>
  );
}