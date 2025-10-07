import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard as Edit, Plus, Printer } from "lucide-react";
import { getCurrencySymbol } from "./CurrencySelector";
import { format, parseISO } from "date-fns";

export default function InvoicePreview({ invoice, onEdit, onNewInvoice }) {
  const currencySymbol = getCurrencySymbol(invoice.currency || "USD");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <Button onClick={onEdit} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button onClick={handlePrint} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={onNewInvoice} className="bg-white text-black hover:bg-white/90">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 print:shadow-none">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">#{invoice.invoice_number}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Date: {invoice.invoice_date && format(parseISO(invoice.invoice_date), "MMM dd, yyyy")}</p>
            {invoice.due_date && (
              <p className="text-gray-600">Due: {format(parseISO(invoice.due_date), "MMM dd, yyyy")}</p>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">BILL TO</h2>
          <div className="text-gray-900">
            <p className="font-semibold text-lg">{invoice.client_name}</p>
            {invoice.client_email && <p className="text-gray-600">{invoice.client_email}</p>}
            {invoice.client_address && <p className="text-gray-600">{invoice.client_address}</p>}
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-3 text-sm font-semibold text-gray-900">DESCRIPTION</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-900">QTY</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-900">RATE</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-900">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 text-gray-900">{item.description}</td>
                <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                <td className="py-4 text-right text-gray-900">{currencySymbol}{item.rate?.toFixed(2)}</td>
                <td className="py-4 text-right text-gray-900">{currencySymbol}{item.amount?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{currencySymbol}{invoice.subtotal?.toFixed(2)}</span>
            </div>
            {invoice.tax_rate > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                <span className="text-gray-900">{currencySymbol}{invoice.tax_amount?.toFixed(2)}</span>
              </div>
            )}
            {invoice.surcharges?.map((surcharge, index) => (
              <div key={index} className="flex justify-between py-2">
                <span className="text-gray-600">{surcharge.description}:</span>
                <span className="text-gray-900">{currencySymbol}{surcharge.amount?.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">{currencySymbol}{invoice.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">NOTES</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {invoice.payment_terms && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">PAYMENT TERMS</h3>
            <p className="text-gray-700">{invoice.payment_terms}</p>
          </div>
        )}
      </div>
    </div>
  );
}
