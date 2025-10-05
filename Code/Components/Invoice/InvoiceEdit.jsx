import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X } from "lucide-react";
import CurrencySelector, { getCurrencySymbol } from "./CurrencySelector";
import ClientAutocomplete from "./ClientAutocomplete";
import ItemAutocomplete from "./ItemAutocomplete";
import { InvoiceMemory } from "./InvoiceMemory";

export default function InvoiceEdit({ invoice, onSave, onCancel }) {
  const [editedInvoice, setEditedInvoice] = useState({
    ...invoice,
    currency: invoice.currency || "USD",
    surcharges: invoice.surcharges || [],
    status: invoice.status || "draft"
  });

  // Auto-save to local storage
  useEffect(() => {
    const timer = setTimeout(() => {
      InvoiceMemory.saveDraft(editedInvoice);
    }, 1000);

    return () => clearTimeout(timer);
  }, [editedInvoice]);

  const currencySymbol = getCurrencySymbol(editedInvoice.currency);

  const updateField = (field, value) => {
    setEditedInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleClientSelect = (client) => {
    setEditedInvoice(prev => ({
      ...prev,
      client_name: client.name,
      client_email: client.email || '',
      client_address: client.address || ''
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...editedInvoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }
    
    updateField('items', newItems);
    recalculateTotals(newItems, editedInvoice.surcharges);
  };

  const handleItemSelect = (index, item) => {
    const newItems = [...editedInvoice.items];
    newItems[index] = {
      ...newItems[index],
      description: item.description,
      rate: item.rate || 0,
      amount: (newItems[index].quantity || 1) * (item.rate || 0)
    };
    updateField('items', newItems);
    recalculateTotals(newItems, editedInvoice.surcharges);
  };

  const addItem = () => {
    const newItems = [...(editedInvoice.items || []), {
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }];
    updateField('items', newItems);
  };

  const removeItem = (index) => {
    const newItems = editedInvoice.items.filter((_, i) => i !== index);
    updateField('items', newItems);
    recalculateTotals(newItems, editedInvoice.surcharges);
  };

  const addSurcharge = () => {
    const newSurcharges = [...(editedInvoice.surcharges || []), {
      description: '',
      amount: 0,
      type: 'fixed'
    }];
    updateField('surcharges', newSurcharges);
  };

  const updateSurcharge = (index, field, value) => {
    const newSurcharges = [...editedInvoice.surcharges];
    newSurcharges[index] = { ...newSurcharges[index], [field]: value };
    updateField('surcharges', newSurcharges);
    recalculateTotals(editedInvoice.items, newSurcharges);
  };

  const removeSurcharge = (index) => {
    const newSurcharges = editedInvoice.surcharges.filter((_, i) => i !== index);
    updateField('surcharges', newSurcharges);
    recalculateTotals(editedInvoice.items, newSurcharges);
  };

  const recalculateTotals = (items, surcharges = []) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * (editedInvoice.tax_rate || 0) / 100;
    
    let surchargeTotal = 0;
    surcharges.forEach(surcharge => {
      if (surcharge.type === 'percentage') {
        surchargeTotal += subtotal * (surcharge.amount || 0) / 100;
      } else {
        surchargeTotal += (surcharge.amount || 0);
      }
    });
    
    const total = subtotal + taxAmount + surchargeTotal;
    
    setEditedInvoice(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total
    }));
  };

  const handleSave = () => {
    // Save client info to memory
    if (editedInvoice.client_name) {
      InvoiceMemory.saveClient({
        name: editedInvoice.client_name,
        email: editedInvoice.client_email,
        address: editedInvoice.client_address
      });
    }

    // Save items to memory
    editedInvoice.items?.forEach(item => {
      if (item.description && item.rate) {
        InvoiceMemory.saveItem(item);
      }
    });

    // Clear draft
    InvoiceMemory.clearDraft();

    onSave(editedInvoice);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-white text-2xl font-bold">Edit Invoice</h2>
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-white text-black hover:bg-white/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm p-8 space-y-8">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Invoice Number</Label>
            <Input
              value={editedInvoice.invoice_number || ''}
              onChange={(e) => updateField('invoice_number', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <CurrencySelector
              value={editedInvoice.currency}
              onChange={(value) => updateField('currency', value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Invoice Date</Label>
            <Input
              type="date"
              value={editedInvoice.invoice_date || ''}
              onChange={(e) => updateField('invoice_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={editedInvoice.due_date || ''}
              onChange={(e) => updateField('due_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              value={editedInvoice.tax_rate || 0}
              onChange={(e) => {
                updateField('tax_rate', parseFloat(e.target.value) || 0);
                recalculateTotals(editedInvoice.items, editedInvoice.surcharges);
              }}
            />
          </div>
        </div>

        {/* Client Info with Autocomplete */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Client Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <ClientAutocomplete
                value={editedInvoice.client_name || ''}
                onChange={(e) => updateField('client_name', e.target.value)}
                onSelectClient={handleClientSelect}
                placeholder="Start typing client name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Client Email</Label>
              <Input
                value={editedInvoice.client_email || ''}
                onChange={(e) => updateField('client_email', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Client Address</Label>
            <Textarea
              value={editedInvoice.client_address || ''}
              onChange={(e) => updateField('client_address', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Items with Autocomplete */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Line Items</h3>
            <Button onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {editedInvoice.items?.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 p-4 border rounded-lg">
                <div className="col-span-12 md:col-span-5 space-y-2">
                  <Label className="text-xs">Description</Label>
                  <ItemAutocomplete
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    onSelectItem={(selectedItem) => handleItemSelect(index, selectedItem)}
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-2">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-2">
                  <Label className="text-xs">Rate</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-3 md:col-span-2 space-y-2">
                  <Label className="text-xs">Amount</Label>
                  <div className="h-10 flex items-center font-semibold">
                    {currencySymbol}{item.amount?.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1 flex items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surcharges */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Surcharges & Fees</h3>
            <Button onClick={addSurcharge} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Surcharge
            </Button>
          </div>
          
          {editedInvoice.surcharges?.length > 0 && (
            <div className="space-y-3">
              {editedInvoice.surcharges.map((surcharge, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 p-4 border rounded-lg bg-gray-50">
                  <div className="col-span-12 md:col-span-5 space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={surcharge.description}
                      onChange={(e) => updateSurcharge(index, 'description', e.target.value)}
                      placeholder="e.g., Regional fee, Processing fee"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-3 space-y-2">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={surcharge.type}
                      onValueChange={(value) => updateSurcharge(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-2">
                    <Label className="text-xs">Amount {surcharge.type === 'percentage' ? '(%)' : ''}</Label>
                    <Input
                      type="number"
                      value={surcharge.amount}
                      onChange={(e) => updateSurcharge(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSurcharge(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{currencySymbol}{editedInvoice.subtotal?.toFixed(2)}</span>
            </div>
            {editedInvoice.tax_rate > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax ({editedInvoice.tax_rate}%)</span>
                <span className="font-medium">{currencySymbol}{editedInvoice.tax_amount?.toFixed(2)}</span>
              </div>
            )}
            {editedInvoice.surcharges?.map((surcharge, index) => {
              const amount = surcharge.type === 'percentage' 
                ? (editedInvoice.subtotal * surcharge.amount / 100)
                : surcharge.amount;
              return (
                <div key={index} className="flex justify-between text-sm">
                  <span>{surcharge.description}</span>
                  <span className="font-medium">{currencySymbol}{amount.toFixed(2)}</span>
                </div>
              );
            })}
            <div className="flex justify-between pt-2 border-t font-bold">
              <span>Total</span>
              <span>{currencySymbol}{editedInvoice.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Terms</Label>
            <Input
              value={editedInvoice.payment_terms || ''}
              onChange={(e) => updateField('payment_terms', e.target.value)}
              placeholder="e.g., Net 30"
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={editedInvoice.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Additional notes or terms"
              rows={3}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}