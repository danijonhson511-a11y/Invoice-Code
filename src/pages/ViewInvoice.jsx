import React, { useState, useEffect } from "react";
import { Invoice } from "@/entities/Invoice";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import InvoicePreview from "../components/invoice/InvoicePreview";

export default function ViewInvoice() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id");
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!invoiceId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await Invoice.get(invoiceId);
        setInvoice(data);
      } catch (error) {
        console.error("Error loading invoice:", error);
      }
      setIsLoading(false);
    };

    loadInvoice();
  }, [invoiceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-white">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Invoice not found</p>
          <Link to={createPageUrl("Dashboard")}>
            <Button className="bg-[#4c6fff] hover:bg-[#3d5fe6] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <InvoicePreview
          invoice={invoice}
          onEdit={() => {}}
          onNewInvoice={() => {}}
        />
      </div>
    </div>
  );
}
