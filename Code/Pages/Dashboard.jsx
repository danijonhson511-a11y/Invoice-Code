import React, { useState, useEffect, useCallback } from "react";
import { Invoice } from "@/entities/Invoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Clock, AlertCircle, Plus, Eye } from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import { getCurrencySymbol } from "../components/invoice/CurrencySelector";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    pending: 0,
    overdue: 0
  });

  const calculateStats = useCallback((invoiceList) => {
    const now = new Date();
    const newStats = {
      total: invoiceList.length,
      revenue: 0,
      pending: 0,
      overdue: 0
    };

    invoiceList.forEach(invoice => {
      if (invoice.status === 'paid') {
        newStats.revenue += invoice.total || 0;
      }
      if (invoice.status === 'sent' || invoice.status === 'draft') {
        newStats.pending += invoice.total || 0;
      }
      // Check if invoice is not paid and due date is before now
      if (invoice.status !== 'paid' && invoice.due_date && isBefore(parseISO(invoice.due_date), now)) {
        newStats.overdue += 1;
      }
    });

    setStats(newStats);
  }, []); // Dependencies: setStats is a stable function provided by React, isBefore and parseISO are stable imports.

  const loadInvoices = useCallback(async () => {
    try {
      const fetchedInvoices = await Invoice.list('-created_date');
      setInvoices(fetchedInvoices);
      calculateStats(fetchedInvoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
    setIsLoading(false);
  }, [calculateStats]); // Dependencies: calculateStats is a stable function from useCallback. setInvoices, setIsLoading are stable setters.

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]); // Dependencies: loadInvoices is a stable function from useCallback.

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await Invoice.update(invoiceId, { status: newStatus });
      loadInvoices(); // Reload invoices to reflect the change
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'sent': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'overdue': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusForInvoice = (invoice) => {
    if (invoice.status === 'paid') return 'paid';
    // Check for overdue status only if it's not already paid
    if (invoice.due_date && isBefore(parseISO(invoice.due_date), new Date())) {
      return 'overdue';
    }
    return invoice.status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-white">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/60">Manage your invoices and track payments</p>
          </div>
          <Link to={createPageUrl("Generator")}>
            <Button className="bg-[#4c6fff] hover:bg-[#3d5fe6] text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#141d35] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Total Invoices</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#3d5fe6] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141d35] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Revenue</p>
                  <p className="text-3xl font-bold text-white">${stats.revenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#22c55e] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141d35] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-white">${stats.pending.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141d35] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Overdue</p>
                  <p className="text-3xl font-bold text-white">{stats.overdue}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#ef4444] flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices Table */}
        <Card className="bg-[#141d35] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">No invoices yet</p>
                <Link to={createPageUrl("Generator")}>
                  <Button className="bg-[#4c6fff] hover:bg-[#3d5fe6] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Invoice #</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Client</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => {
                      const displayStatus = getStatusForInvoice(invoice);
                      const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
                      
                      return (
                        <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-white font-medium">{invoice.invoice_number}</td>
                          <td className="py-4 px-4 text-white/80">{invoice.client_name}</td>
                          <td className="py-4 px-4 text-white/80">
                            {invoice.invoice_date && format(parseISO(invoice.invoice_date), "MMM dd, yyyy")}
                          </td>
                          <td className="py-4 px-4 text-right text-white font-medium">
                            {currencySymbol}{invoice.total?.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">
                            <Select
                              value={invoice.status}
                              onValueChange={(value) => updateInvoiceStatus(invoice.id, value)}
                            >
                              <SelectTrigger className="w-28 h-7 bg-transparent border-0">
                                <Badge className={getStatusColor(displayStatus)}>
                                  {displayStatus}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link to={`${createPageUrl("ViewInvoice")}?id=${invoice.id}`}>
                              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}