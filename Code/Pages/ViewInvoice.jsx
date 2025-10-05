import React, { useState, useEffect } from "react";
import { Invoice } from "@/entities/Invoice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { BrandingMemory } from "../components/invoice/BrandingSettings";
import { getTemplateComponent } from "../components/invoice/InvoiceTemplates";

export default function ViewInvoice() {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branding] = useState(BrandingMemory.load());

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const invoiceId = urlParams.get('id');
      
      if (!invoiceId) {
        setError('No invoice ID provided');
        setIsLoading(false);
        return;
      }

      const invoices = await Invoice.list();
      const foundInvoice = invoices.find(inv => inv.id === invoiceId);
      
      if (!foundInvoice) {
        setError('Invoice not found');
        setIsLoading(false);
        return;
      }

      setInvoice(foundInvoice);
    } catch (err) {
      setError('Failed to load invoice');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Invoice not found'}</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = getTemplateComponent(branding.template);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <Button onClick={handlePrint} className="bg-black text-white hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Download / Print
          </Button>
        </div>

        <Card className="print:shadow-none overflow-hidden">
          <TemplateComponent invoice={invoice} branding={branding} />
        </Card>
      </div>
    </div>
  );
}