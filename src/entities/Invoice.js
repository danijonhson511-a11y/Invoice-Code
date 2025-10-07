import { supabase } from '@/lib/supabase';
import invoiceSchema from './invoice.schema.json';

export class Invoice {
  static schema() {
    return invoiceSchema;
  }

  static async create(data) {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([data])
      .select()
      .maybeSingle();

    if (error) throw error;
    return invoice;
  }

  static async list(orderBy = '-created_at') {
    const isDescending = orderBy.startsWith('-');
    const column = isDescending ? orderBy.slice(1) : orderBy;

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order(column, { ascending: !isDescending });

    if (error) throw error;
    return data || [];
  }

  static async get(id) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
