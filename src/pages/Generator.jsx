import React, { useState, useRef } from "react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/integrations/Core";
import { Invoice } from "@/entities/Invoice";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ImageGeneration } from "@/components/ui/ai-image-generation";
import InvoicePreview from "../components/invoice/InvoicePreview";
import InvoiceEdit from "../components/invoice/InvoiceEdit";
import { InvoiceMemory } from "../components/invoice/InvoiceMemory";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showGeneratingAnimation, setShowGeneratingAnimation] = useState(false);
  const hasLoadedDraft = useRef(false);

  React.useEffect(() => {
    if (!hasLoadedDraft.current) {
      const draft = InvoiceMemory.loadDraft();
      if (draft) {
        setGeneratedInvoice(draft);
      }
      hasLoadedDraft.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (generatedInvoice) {
      InvoiceMemory.saveDraft(generatedInvoice);
    } else {
      InvoiceMemory.clearDraft();
    }
  }, [generatedInvoice]);

  const generateInvoice = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setShowGeneratingAnimation(true);

    try {
      const result = await InvokeLLM({
        prompt: `Extract invoice details from this description: "${prompt}"

        Generate a complete invoice with:
        - Invoice number (format: INV-XXXX where X is random digit)
        - Client name and details
        - Invoice date (use today's date if not specified)
        - Due date (default 30 days from invoice date if not specified)
        - Currency (detect from context or default to USD)
        - Line items with description, quantity, rate, and calculated amount
        - Subtotal, tax (default 0% if not mentioned), and total
        - Payment terms (default "Net 30" if not specified)
        - Surcharges if mentioned (regional fees, processing fees, etc.)

        Be creative but professional. If information is missing, make reasonable assumptions.`,
        response_json_schema: Invoice.schema()
      });

      if (result.items) {
        let subtotal = 0;
        result.items = result.items.map(item => {
          const amount = (item.quantity || 0) * (item.rate || 0);
          subtotal += amount;
          return { ...item, amount };
        });

        result.subtotal = subtotal;
        result.tax_amount = subtotal * (result.tax_rate || 0) / 100;

        let surchargeTotal = 0;
        if (result.surcharges && Array.isArray(result.surcharges)) {
          result.surcharges.forEach(surcharge => {
            if (surcharge.type === 'percentage') {
              surchargeTotal += subtotal * (surcharge.amount || 0) / 100;
            } else {
              surchargeTotal += (surcharge.amount || 0);
            }
          });
        }

        result.total = result.subtotal + result.tax_amount + surchargeTotal;
        result.currency = result.currency || 'USD';
        result.status = 'draft';
      }

      setTimeout(() => {
        setGeneratedInvoice(result);
        setShowGeneratingAnimation(false);
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating invoice:", error);
      setIsGenerating(false);
      setShowGeneratingAnimation(false);
    }
  };

  const handleSave = async (invoiceData) => {
    try {
      await Invoice.create(invoiceData);
      setGeneratedInvoice(invoiceData);
      setIsEditing(false);
      InvoiceMemory.clearDraft();
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleNewInvoice = () => {
    setPrompt("");
    setGeneratedInvoice(null);
    setIsEditing(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <WebGLShader />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <Link to={createPageUrl("Landing")}>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-white text-3xl md:text-4xl font-bold">PayLance</h1>
            <div className="w-20" />
          </div>

          {!generatedInvoice && !showGeneratingAnimation ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 relative">
                <div className="absolute inset-0 -m-8 bg-black/60 backdrop-blur-md rounded-3xl -z-10" />

                <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
                  Describe Your Invoice
                </h2>
                <p className="text-white/60 text-lg">
                  Tell us about your invoice in plain English. AI will handle the rest.
                </p>
              </div>

              <div className="space-y-4 relative">
                <div className="absolute inset-0 -m-6 bg-black/60 backdrop-blur-md rounded-3xl -z-10" />

                <div className="relative">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Create an invoice for Acme Corp for $2,500 for web development services. Include homepage design ($800), backend API ($1,200), and deployment ($500). Due in 30 days."
                    className="min-h-[200px] text-lg bg-black/80 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 resize-none focus:bg-black/90"
                    disabled={isGenerating}
                  />
                </div>

                <Button
                  onClick={generateInvoice}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-white/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Invoice...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Invoice
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-12 relative">
                <div className="absolute inset-0 -m-6 bg-black/60 backdrop-blur-md rounded-3xl -z-10" />

                <p className="text-white/40 text-sm text-center mb-4">QUICK EXAMPLES</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Invoice TechStart Inc for consulting work: 10 hours at $150/hr, due in 15 days",
                    "Bill Green Energy Solutions $5,000 for solar panel installation. Include materials ($3,000) and labor ($2,000). Net 60 terms.",
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example)}
                      className="p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all text-left"
                    >
                      <p className="text-white/70 text-sm">{example}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : showGeneratingAnimation ? (
            <div className="max-w-5xl mx-auto">
              <ImageGeneration>
                <div className="bg-white p-8 md:p-12 min-h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Preparing your invoice...</p>
                  </div>
                </div>
              </ImageGeneration>
            </div>
          ) : (
            <div>
              {isEditing ? (
                <InvoiceEdit
                  invoice={generatedInvoice}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <InvoicePreview
                  invoice={generatedInvoice}
                  onEdit={handleEdit}
                  onNewInvoice={handleNewInvoice}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
