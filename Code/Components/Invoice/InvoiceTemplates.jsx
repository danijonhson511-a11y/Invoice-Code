import React from "react";
import { format } from "date-fns";
import { getCurrencySymbol } from "./CurrencySelector";

// Classic Template
export function ClassicTemplate({ invoice, branding }) {
  const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
  
  const calculateSurchargeAmount = (surcharge) => {
    if (surcharge.type === 'percentage') {
      return invoice.subtotal * surcharge.amount / 100;
    }
    return surcharge.amount;
  };

  return (
    <div className="bg-white p-8 md:p-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-12 pb-6 border-b-2" style={{ borderColor: branding.primaryColor }}>
        <div>
          {branding.logo && (
            <img src={branding.logo} alt="Logo" className="h-16 w-auto mb-4" />
          )}
          <h1 className="text-4xl font-bold mb-2" style={{ color: branding.primaryColor }}>INVOICE</h1>
          <p className="text-gray-600">#{invoice.invoice_number}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 space-y-1">
            <div><span className="font-medium">Date:</span> {invoice.invoice_date && format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</div>
            <div><span className="font-medium">Due:</span> {invoice.due_date && format(new Date(invoice.due_date), "MMM dd, yyyy")}</div>
            <div><span className="font-medium">Currency:</span> {invoice.currency || "USD"}</div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-12">
        <p className="text-sm font-semibold mb-2" style={{ color: branding.secondaryColor }}>BILL TO</p>
        <div className="text-gray-900">
          <p className="font-bold text-lg">{invoice.client_name}</p>
          {invoice.client_email && <p className="text-sm text-gray-600">{invoice.client_email}</p>}
          {invoice.client_address && <p className="text-sm text-gray-600 mt-1">{invoice.client_address}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: branding.primaryColor + '15' }}>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: branding.primaryColor }}>Description</th>
              <th className="text-right py-3 px-4 font-semibold w-20" style={{ color: branding.primaryColor }}>Qty</th>
              <th className="text-right py-3 px-4 font-semibold w-28" style={{ color: branding.primaryColor }}>Rate</th>
              <th className="text-right py-3 px-4 font-semibold w-32" style={{ color: branding.primaryColor }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">{item.description}</td>
                <td className="py-4 px-4 text-right text-gray-900">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-gray-900">{currencySymbol}{item.rate.toFixed(2)}</td>
                <td className="py-4 px-4 text-right text-gray-900 font-medium">{currencySymbol}{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-80 space-y-2">
          <div className="flex justify-between py-2 text-gray-900">
            <span>Subtotal</span>
            <span className="font-medium">{currencySymbol}{invoice.subtotal?.toFixed(2)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between py-2 text-gray-900">
              <span>Tax ({invoice.tax_rate}%)</span>
              <span className="font-medium">{currencySymbol}{invoice.tax_amount?.toFixed(2)}</span>
            </div>
          )}
          {invoice.surcharges?.map((surcharge, index) => (
            <div key={index} className="flex justify-between py-2 text-gray-900">
              <span>{surcharge.description} {surcharge.type === 'percentage' ? `(${surcharge.amount}%)` : ''}</span>
              <span className="font-medium">{currencySymbol}{calculateSurchargeAmount(surcharge).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between py-3 border-t-2 text-lg font-bold text-white px-4" style={{ backgroundColor: branding.primaryColor }}>
            <span>Total</span>
            <span>{currencySymbol}{invoice.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.payment_terms) && (
        <div className="border-t pt-8 space-y-4">
          {invoice.payment_terms && (
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: branding.secondaryColor }}>PAYMENT TERMS</p>
              <p className="text-sm text-gray-900">{invoice.payment_terms}</p>
            </div>
          )}
          {invoice.notes && (
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: branding.secondaryColor }}>NOTES</p>
              <p className="text-sm text-gray-900">{invoice.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Modern Template
export function ModernTemplate({ invoice, branding }) {
  const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
  
  const calculateSurchargeAmount = (surcharge) => {
    if (surcharge.type === 'percentage') {
      return invoice.subtotal * surcharge.amount / 100;
    }
    return surcharge.amount;
  };

  return (
    <div className="bg-white">
      {/* Header with Color Block */}
      <div className="p-8 md:p-12 text-white" style={{ backgroundColor: branding.primaryColor }}>
        <div className="flex justify-between items-start">
          <div>
            {branding.logo && (
              <img src={branding.logo} alt="Logo" className="h-12 w-auto mb-4 brightness-0 invert" />
            )}
            <h1 className="text-5xl font-bold mb-2">INVOICE</h1>
            <p className="text-white/80">#{invoice.invoice_number}</p>
          </div>
          <div className="text-right text-white/90">
            <div className="space-y-1">
              <div>{invoice.invoice_date && format(new Date(invoice.invoice_date), "MMMM dd, yyyy")}</div>
              <div>Due: {invoice.due_date && format(new Date(invoice.due_date), "MMM dd, yyyy")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {/* Bill To */}
        <div className="mb-12 bg-gray-50 p-6 rounded-lg">
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: branding.secondaryColor }}>Bill To</p>
          <div>
            <p className="font-bold text-xl mb-1">{invoice.client_name}</p>
            {invoice.client_email && <p className="text-gray-600">{invoice.client_email}</p>}
            {invoice.client_address && <p className="text-gray-600 mt-1">{invoice.client_address}</p>}
          </div>
        </div>

        {/* Items */}
        <div className="mb-12">
          <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b-2 font-semibold text-sm uppercase tracking-wider" style={{ borderColor: branding.primaryColor, color: branding.secondaryColor }}>
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          {invoice.items?.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-200">
              <div className="col-span-6 font-medium">{item.description}</div>
              <div className="col-span-2 text-right text-gray-600">{item.quantity}</div>
              <div className="col-span-2 text-right text-gray-600">{currencySymbol}{item.rate.toFixed(2)}</div>
              <div className="col-span-2 text-right font-semibold">{currencySymbol}{item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{currencySymbol}{invoice.subtotal?.toFixed(2)}</span>
            </div>
            {invoice.tax_rate > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax ({invoice.tax_rate}%)</span>
                <span className="font-medium">{currencySymbol}{invoice.tax_amount?.toFixed(2)}</span>
              </div>
            )}
            {invoice.surcharges?.map((surcharge, index) => (
              <div key={index} className="flex justify-between text-gray-600">
                <span>{surcharge.description}</span>
                <span className="font-medium">{currencySymbol}{calculateSurchargeAmount(surcharge).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t-2 text-2xl font-bold" style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}>
              <span>Total</span>
              <span>{currencySymbol}{invoice.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(invoice.notes || invoice.payment_terms) && (
          <div className="mt-12 pt-8 border-t space-y-4">
            {invoice.payment_terms && (
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: branding.secondaryColor }}>Payment Terms</p>
                <p className="text-gray-700">{invoice.payment_terms}</p>
              </div>
            )}
            {invoice.notes && (
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: branding.secondaryColor }}>Notes</p>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Minimal Template
export function MinimalTemplate({ invoice, branding }) {
  const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
  
  const calculateSurchargeAmount = (surcharge) => {
    if (surcharge.type === 'percentage') {
      return invoice.subtotal * surcharge.amount / 100;
    }
    return surcharge.amount;
  };

  return (
    <div className="bg-white p-8 md:p-16">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          {branding.logo && (
            <img src={branding.logo} alt="Logo" className="h-12 w-auto mb-8" />
          )}
          <h1 className="text-6xl font-light mb-2" style={{ color: branding.primaryColor }}>Invoice</h1>
        </div>
        <div className="text-right text-gray-600 space-y-1">
          <p className="font-mono text-lg">#{invoice.invoice_number}</p>
          <p className="text-sm">{invoice.invoice_date && format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</p>
          <p className="text-sm">Due {invoice.due_date && format(new Date(invoice.due_date), "MMM dd, yyyy")}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-16">
        <p className="text-xs font-light uppercase tracking-widest text-gray-500 mb-3">Billed To</p>
        <div>
          <p className="font-medium text-xl">{invoice.client_name}</p>
          {invoice.client_email && <p className="text-gray-600 mt-1">{invoice.client_email}</p>}
          {invoice.client_address && <p className="text-gray-600">{invoice.client_address}</p>}
        </div>
      </div>

      {/* Items */}
      <div className="mb-16">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: branding.primaryColor }}>
              <th className="text-left py-4 font-light text-gray-600 text-sm">Description</th>
              <th className="text-right py-4 font-light text-gray-600 text-sm w-20">Qty</th>
              <th className="text-right py-4 font-light text-gray-600 text-sm w-28">Rate</th>
              <th className="text-right py-4 font-light text-gray-600 text-sm w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-5">{item.description}</td>
                <td className="py-5 text-right text-gray-600">{item.quantity}</td>
                <td className="py-5 text-right text-gray-600 font-mono">{currencySymbol}{item.rate.toFixed(2)}</td>
                <td className="py-5 text-right font-medium font-mono">{currencySymbol}{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-96 space-y-3">
          <div className="flex justify-between py-2 text-gray-600">
            <span className="font-light">Subtotal</span>
            <span className="font-mono">{currencySymbol}{invoice.subtotal?.toFixed(2)}</span>
          </div>
          {invoice.tax_rate > 0 && (
            <div className="flex justify-between py-2 text-gray-600">
              <span className="font-light">Tax ({invoice.tax_rate}%)</span>
              <span className="font-mono">{currencySymbol}{invoice.tax_amount?.toFixed(2)}</span>
            </div>
          )}
          {invoice.surcharges?.map((surcharge, index) => (
            <div key={index} className="flex justify-between py-2 text-gray-600">
              <span className="font-light">{surcharge.description}</span>
              <span className="font-mono">{currencySymbol}{calculateSurchargeAmount(surcharge).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 border-t text-2xl font-light" style={{ borderColor: branding.primaryColor }}>
            <span>Total</span>
            <span className="font-mono font-medium" style={{ color: branding.primaryColor }}>{currencySymbol}{invoice.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(invoice.notes || invoice.payment_terms) && (
        <div className="space-y-6 text-sm text-gray-600">
          {invoice.payment_terms && (
            <div>
              <p className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2">Payment Terms</p>
              <p className="font-light">{invoice.payment_terms}</p>
            </div>
          )}
          {invoice.notes && (
            <div>
              <p className="text-xs font-light uppercase tracking-widest text-gray-500 mb-2">Notes</p>
              <p className="font-light">{invoice.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Bold Template
export function BoldTemplate({ invoice, branding }) {
  const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
  
  const calculateSurchargeAmount = (surcharge) => {
    if (surcharge.type === 'percentage') {
      return invoice.subtotal * surcharge.amount / 100;
    }
    return surcharge.amount;
  };

  return (
    <div className="bg-gray-50">
      {/* Bold Header */}
      <div className="p-8 md:p-12" style={{ backgroundColor: branding.primaryColor }}>
        <div className="flex justify-between items-start text-white">
          <div>
            {branding.logo && (
              <img src={branding.logo} alt="Logo" className="h-16 w-auto mb-6 brightness-0 invert" />
            )}
            <h1 className="text-7xl font-black mb-2">INVOICE</h1>
            <p className="text-3xl font-bold opacity-90">#{invoice.invoice_number}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 space-y-2">
              <div className="text-lg font-bold">{invoice.invoice_date && format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</div>
              <div className="text-sm opacity-90">Due: {invoice.due_date && format(new Date(invoice.due_date), "MMM dd")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {/* Bill To Card */}
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: branding.secondaryColor }}>Bill To</p>
          <div>
            <p className="font-black text-2xl mb-2">{invoice.client_name}</p>
            {invoice.client_email && <p className="text-gray-600 font-semibold">{invoice.client_email}</p>}
            {invoice.client_address && <p className="text-gray-600 mt-1">{invoice.client_address}</p>}
          </div>
        </div>

        {/* Items */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 font-black text-sm uppercase" style={{ backgroundColor: branding.secondaryColor, color: 'white' }}>
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-3 text-right">Rate</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          {invoice.items?.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 last:border-0">
              <div className="col-span-5 font-bold">{item.description}</div>
              <div className="col-span-2 text-right font-semibold text-gray-600">{item.quantity}</div>
              <div className="col-span-3 text-right font-semibold text-gray-600">{currencySymbol}{item.rate.toFixed(2)}</div>
              <div className="col-span-2 text-right font-bold">{currencySymbol}{item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Totals Card */}
        <div className="flex justify-end">
          <div className="w-96 bg-white rounded-2xl p-6 shadow-lg">
            <div className="space-y-3">
              <div className="flex justify-between font-semibold text-gray-600">
                <span>Subtotal</span>
                <span>{currencySymbol}{invoice.subtotal?.toFixed(2)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between font-semibold text-gray-600">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span>{currencySymbol}{invoice.tax_amount?.toFixed(2)}</span>
                </div>
              )}
              {invoice.surcharges?.map((surcharge, index) => (
                <div key={index} className="flex justify-between font-semibold text-gray-600">
                  <span>{surcharge.description}</span>
                  <span>{currencySymbol}{calculateSurchargeAmount(surcharge).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t-4 text-3xl font-black text-white p-4 rounded-xl mt-4" style={{ borderColor: branding.primaryColor, backgroundColor: branding.primaryColor }}>
                <span>TOTAL</span>
                <span>{currencySymbol}{invoice.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(invoice.notes || invoice.payment_terms) && (
          <div className="mt-12 space-y-6">
            {invoice.payment_terms && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm font-black uppercase tracking-wider mb-3" style={{ color: branding.secondaryColor }}>Payment Terms</p>
                <p className="font-semibold text-gray-700">{invoice.payment_terms}</p>
              </div>
            )}
            {invoice.notes && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm font-black uppercase tracking-wider mb-3" style={{ color: branding.secondaryColor }}>Notes</p>
                <p className="font-semibold text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Template Selector Component
export function getTemplateComponent(templateId) {
  switch (templateId) {
    case 'modern':
      return ModernTemplate;
    case 'minimal':
      return MinimalTemplate;
    case 'bold':
      return BoldTemplate;
    case 'classic':
    default:
      return ClassicTemplate;
  }
}