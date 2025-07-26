import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { uploadImage, validateImageFile } from "@/lib/imageUpload";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  buttonText?: string;
  uploadPath: string;
  className?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  currentImageUrl, 
  buttonText = "Upload Image", 
  uploadPath,
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
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
      
      // Notify parent component
      onImageUploaded(downloadURL);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        </div>
      ) : null}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
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