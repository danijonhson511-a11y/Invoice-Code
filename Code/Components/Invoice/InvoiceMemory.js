// Local storage utilities for invoice memory and auto-save
export const InvoiceMemory = {
  // Auto-save draft invoice
  saveDraft: (invoice) => {
    try {
      localStorage.setItem('invoice_draft', JSON.stringify(invoice));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  },

  // Load draft invoice
  loadDraft: () => {
    try {
      const draft = localStorage.getItem('invoice_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  },

  // Clear draft
  clearDraft: () => {
    try {
      localStorage.removeItem('invoice_draft');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  },

  // Save client info
  saveClient: (client) => {
    try {
      const clients = InvoiceMemory.getClients();
      const existingIndex = clients.findIndex(c => c.name === client.name);
      
      if (existingIndex >= 0) {
        clients[existingIndex] = { ...clients[existingIndex], ...client, lastUsed: Date.now() };
      } else {
        clients.push({ ...client, lastUsed: Date.now() });
      }
      
      // Keep only last 20 clients
      const sortedClients = clients.sort((a, b) => b.lastUsed - a.lastUsed).slice(0, 20);
      localStorage.setItem('invoice_clients', JSON.stringify(sortedClients));
    } catch (error) {
      console.error('Error saving client:', error);
    }
  },

  // Get saved clients
  getClients: () => {
    try {
      const clients = localStorage.getItem('invoice_clients');
      return clients ? JSON.parse(clients) : [];
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  },

  // Search clients
  searchClients: (query) => {
    if (!query) return [];
    const clients = InvoiceMemory.getClients();
    const lowerQuery = query.toLowerCase();
    return clients.filter(c => 
      c.name?.toLowerCase().includes(lowerQuery) || 
      c.email?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  },

  // Save frequently used item
  saveItem: (item) => {
    try {
      const items = InvoiceMemory.getItems();
      const existingIndex = items.findIndex(i => i.description === item.description);
      
      if (existingIndex >= 0) {
        items[existingIndex] = { 
          ...items[existingIndex], 
          ...item, 
          useCount: (items[existingIndex].useCount || 0) + 1,
          lastUsed: Date.now() 
        };
      } else {
        items.push({ ...item, useCount: 1, lastUsed: Date.now() });
      }
      
      // Keep only last 30 items
      const sortedItems = items.sort((a, b) => b.lastUsed - a.lastUsed).slice(0, 30);
      localStorage.setItem('invoice_items', JSON.stringify(sortedItems));
    } catch (error) {
      console.error('Error saving item:', error);
    }
  },

  // Get saved items
  getItems: () => {
    try {
      const items = localStorage.getItem('invoice_items');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  },

  // Search items
  searchItems: (query) => {
    if (!query) return [];
    const items = InvoiceMemory.getItems();
    const lowerQuery = query.toLowerCase();
    return items
      .filter(i => i.description?.toLowerCase().includes(lowerQuery))
      .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
      .slice(0, 5);
  }
};

export default InvoiceMemory;