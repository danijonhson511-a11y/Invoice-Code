import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Edit, Plus, Link as LinkIcon, Copy, Check, Palette } from "lucide-react";
import { getCurrencySymbol } from "./CurrencySelector";
import { Invoice } from "@/entities/Invoice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import BrandingSettings, { BrandingMemory } from "./BrandingSettings";
import { getTemplateComponent } from "./InvoiceTemplates";

export default function InvoicePreview({ invoice, onEdit, onNewInvoice }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showBrandingDialog, setShowBrandingDialog] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [branding, setBranding] = useState(BrandingMemory.load());

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    try {
      let invoiceId = invoice.id;
      if (!invoiceId) {
        const saved = await Invoice.create(invoice);
        invoiceId = saved.id;
      }
      
      const link = `${window.location.origin}${window.location.pathname.replace('/Generator', '')}/ViewInvoice?id=${invoiceId}`;
      setShareableLink(link);
      setShowLinkDialog(true);
    } catch (error) {
      console.error("Error generating link:", error);
      alert('Failed to generate link. Please try again.');
    }
    setIsGeneratingLink(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleBrandingChange = () => {
    setBranding(BrandingMemory.load());
  };

  const TemplateComponent = getTemplateComponent(branding.template);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
        <h2 className="text-white text-2xl font-bold">Your Invoice is Ready</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onNewInvoice}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
          <Button
            onClick={() => {
              setShowBrandingDialog(true);
              handleBrandingChange();
            }}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleGenerateLink}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            disabled={isGeneratingLink}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-white text-black hover:bg-white/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download / Print
          </Button>
        </div>
      </div>

      {/* Invoice Card with Template */}
      <Card className="print:shadow-none overflow-hidden">
        <TemplateComponent invoice={invoice} branding={branding} />
      </Card>

      {/* Branding Settings Dialog */}
      <BrandingSettings
        open={showBrandingDialog}
        onOpenChange={(open) => {
          setShowBrandingDialog(open);
          if (!open) handleBrandingChange();
        }}
      />

      {/* Share Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Invoice Link</DialogTitle>
            <DialogDescription>
              Share this link with your client. They can view and print the invoice from their browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1"
              />
              <Button size="icon" onClick={copyLink}>
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              💡 <strong>Tip:</strong> Copy this link and send it to your client via email, messaging app, or any communication method you prefer.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}