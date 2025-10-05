import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, X, Palette } from "lucide-react";
import { UploadFile } from "@/integrations/Core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PRESET_COLORS = [
  { name: "Professional Blue", primary: "#3b82f6", secondary: "#1e40af" },
  { name: "Elegant Purple", primary: "#8b5cf6", secondary: "#6d28d9" },
  { name: "Modern Green", primary: "#10b981", secondary: "#059669" },
  { name: "Bold Red", primary: "#ef4444", secondary: "#dc2626" },
  { name: "Classic Black", primary: "#000000", secondary: "#374151" },
  { name: "Warm Orange", primary: "#f97316", secondary: "#ea580c" },
];

const TEMPLATES = [
  { id: "classic", name: "Classic", description: "Traditional and professional" },
  { id: "modern", name: "Modern", description: "Clean and contemporary" },
  { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  { id: "bold", name: "Bold", description: "Eye-catching design" },
];

export const BrandingMemory = {
  save: (settings) => {
    try {
      localStorage.setItem('invoice_branding', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving branding:', error);
    }
  },
  
  load: () => {
    try {
      const branding = localStorage.getItem('invoice_branding');
      return branding ? JSON.parse(branding) : {
        logo: null,
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        template: "classic"
      };
    } catch (error) {
      console.error('Error loading branding:', error);
      return {
        logo: null,
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        template: "classic"
      };
    }
  }
};

export default function BrandingSettings({ open, onOpenChange }) {
  const [branding, setBranding] = useState(BrandingMemory.load());
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setBranding(BrandingMemory.load());
    }
  }, [open]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      const newBranding = { ...branding, logo: file_url };
      setBranding(newBranding);
      BrandingMemory.save(newBranding);
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    }
    setIsUploading(false);
  };

  const handleRemoveLogo = () => {
    const newBranding = { ...branding, logo: null };
    setBranding(newBranding);
    BrandingMemory.save(newBranding);
  };

  const handleColorChange = (field, value) => {
    const newBranding = { ...branding, [field]: value };
    setBranding(newBranding);
    BrandingMemory.save(newBranding);
  };

  const handlePresetColor = (preset) => {
    const newBranding = {
      ...branding,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    };
    setBranding(newBranding);
    BrandingMemory.save(newBranding);
  };

  const handleTemplateChange = (templateId) => {
    const newBranding = { ...branding, template: templateId };
    setBranding(newBranding);
    BrandingMemory.save(newBranding);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invoice Branding & Templates</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>

          {/* Template Selection */}
          <TabsContent value="template" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    branding.template === template.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <div className="aspect-[4/3] bg-gray-100 rounded mb-3 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-300">
                      {template.name[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logo Upload */}
          <TabsContent value="logo" className="space-y-4">
            <div>
              <Label>Company Logo</Label>
              <p className="text-sm text-gray-500 mb-4">
                Upload your company logo to appear on invoices
              </p>
              
              {branding.logo ? (
                <div className="relative inline-block">
                  <img
                    src={branding.logo}
                    alt="Logo"
                    className="h-24 w-auto border rounded"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG up to 5MB
                  </p>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                </div>
              )}
              
              {isUploading && (
                <p className="text-sm text-gray-600 mt-2">Uploading logo...</p>
              )}
            </div>
          </TabsContent>

          {/* Color Customization */}
          <TabsContent value="colors" className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Color Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetColor(preset)}
                    className="p-3 rounded-lg border-2 hover:border-gray-400 transition-all text-left"
                    style={{
                      borderColor:
                        branding.primaryColor === preset.primary &&
                        branding.secondaryColor === preset.secondary
                          ? preset.primary
                          : "#e5e7eb",
                    }}
                  >
                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <span className="text-sm font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="block mb-3">Preview</Label>
              <div className="bg-white p-6 rounded border">
                <div
                  className="h-2 rounded mb-4"
                  style={{ backgroundColor: branding.primaryColor }}
                />
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: branding.secondaryColor }}
                  >
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">INVOICE</div>
                    <div className="text-sm text-gray-600">#INV-0001</div>
                  </div>
                </div>
                <div
                  className="text-sm font-semibold px-3 py-1 rounded inline-block text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Sample Badge
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}