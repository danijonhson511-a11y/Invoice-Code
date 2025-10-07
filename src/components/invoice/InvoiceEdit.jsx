import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Save } from "lucide-react";
import CurrencySelector from "./CurrencySelector";

export default function InvoiceEdit({ invoice, onSave, onCancel }) {
  const [formData, setFormData] = useState(invoice || {
    invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    client_name: "",
    client_email: "",
    client_address: "",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    currency: "USD",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    tax_rate: 0,
    notes: "",
    payment_terms: "Net 30",
    status: "draft"
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setFormData(prev => ({ ...prev, items: newItems }));
    recalculateTotals(newItems, formData.tax_rate);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
    recalculateTotals(newItems, formData.tax_rate);
  };

  const recalculateTotals = (items, taxRate) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = (subtotal * (taxRate || 0)) / 100;
    const total = subtotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Edit Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Invoice Number</Label>
              <Input
                value={formData.invoice_number}
                onChange={(e) => updateField('invoice_number', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Currency</Label>
              <CurrencySelector
                value={formData.currency}
                onChange={(value) => updateField('currency', value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Client Information</h3>
            <div>
              <Label className="text-white">Client Name</Label>
              <Input
                value={formData.client_name}
                onChange={(e) => updateField('client_name', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Client Email</Label>
              <Input
                value={formData.client_email}
                onChange={(e) => updateField('client_email', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Client Address</Label>
              <Textarea
                value={formData.client_address}
                onChange={(e) => updateField('client_address', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Invoice Date</Label>
              <Input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => updateField('invoice_date', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => updateField('due_date', e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">Line Items</h3>
              <Button onClick={addItem} size="sm" className="bg-white/20 hover:bg-white/30">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-white">Item {index + 1}</Label>
                    {formData.items.length > 1 && (
                      <Button
                        onClick={() => removeItem(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      disabled
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Label className="text-white">Tax Rate (%)</Label>
            <Input
              type="number"
              value={formData.tax_rate}
              onChange={(e) => {
                const taxRate = parseFloat(e.target.value) || 0;
                updateField('tax_rate', taxRate);
                recalculateTotals(formData.items, taxRate);
              }}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Payment Terms</Label>
            <Input
              value={formData.payment_terms}
              onChange={(e) => updateField('payment_terms', e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <Button onClick={onCancel} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-white text-black hover:bg-white/90">
              <Save className="w-4 h-4 mr-2" />
              Save Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
