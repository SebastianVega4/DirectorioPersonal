import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Contact, ContactFilters, Detail } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly PAGE_SIZE = 24;
  private filterCache = new Map<string, string[]>();

  constructor(private supabase: SupabaseService) {}

  async getContacts(
    filters: ContactFilters = {},
    page: number = 0
  ): Promise<{ data: any[]; count: number }> {
    const hasFilters = Object.values(filters).some(v => v && v.trim());

    let query = this.supabase.supabase
      .from('directorio')
      .select(
        'id,foto_url,nombre_completo,programa,rol,ciudad,tags,documento',
        { count: 'exact' }
      );

    if (filters.nombre) {
      query = query.ilike('nombre_completo', `%${filters.nombre}%`);
    }
    if (filters.programa) {
      query = query.eq('programa', filters.programa);
    }
    if (filters.rol) {
      query = query.eq('rol', filters.rol);
    }
    if (filters.ciudad) {
      query = query.eq('ciudad', filters.ciudad);
    }
    if (filters.tags) {
      query = query.contains('tags', [filters.tags]);
    }
    if (filters.documento) {
      query = query.ilike('documento', `%${filters.documento}%`);
    }

    const start = page * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE - 1;

    const { data, count, error } = await query
      .order('nombre_completo')
      .range(start, end);

    if (error) {
      console.error('Error fetching contacts:', error);
      return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
  }

  async getContactById(id: string): Promise<Contact | null> {
    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contact:', error);
      return null;
    }

    return data;
  }

  async addDetail(contactId: string, detail: Detail): Promise<boolean> {
    const { data, error: fetchError } = await this.supabase.supabase
      .from('directorio')
      .select('detalles')
      .eq('id', contactId)
      .single();

    if (fetchError) {
      console.error('Error fetching contact for detail:', fetchError);
      return false;
    }

    const currentDetails = data.detalles || [];
    const updatedDetails = [...currentDetails, detail];

    const { error } = await this.supabase.supabase
      .from('directorio')
      .update({ detalles: updatedDetails, updated_at: new Date().toISOString() })
      .eq('id', contactId);

    if (error) {
      console.error('Error adding detail:', error);
      return false;
    }

    return true;
  }

  async createContact(contact: Partial<Contact>): Promise<Contact | null> {
    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .insert(contact)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return null;
    }

    return data;
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<boolean> {
    const { error } = await this.supabase.supabase
      .from('directorio')
      .update({ ...contact, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating contact:', error);
      return false;
    }

    return true;
  }

  async deleteContact(id: string): Promise<boolean> {
    const { error } = await this.supabase.supabase
      .from('directorio')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      return false;
    }

    return true;
  }

  async getUniqueValues(column: string): Promise<string[]> {
    const cached = this.filterCache.get(column);
    if (cached) return cached;

    const { data, error } = await this.supabase.supabase
      .rpc('get_unique_values', { col_name: column });

    if (error || !data) {
      return this.getUniqueValuesFallback(column);
    }

    const values = data
      .map((r: any) => r[column] || r.value)
      .filter(Boolean)
      .sort() as string[];

    this.filterCache.set(column, values);
    return values;
  }

  private async getUniqueValuesFallback(column: string): Promise<string[]> {
    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .select(column)
      .not(column, 'is', null)
      .limit(5000);

    if (error || !data) return [];

    const values = [...new Set(data.map((r: any) => r[column]).filter(Boolean))];
    const sorted = values.sort() as string[];
    this.filterCache.set(column, sorted);
    return sorted;
  }

  async getUniquePrograms(): Promise<string[]> {
    return this.getUniqueValues('programa');
  }

  async getUniqueRoles(): Promise<string[]> {
    return this.getUniqueValues('rol');
  }

  async getUniqueCiudades(): Promise<string[]> {
    return this.getUniqueValues('ciudad');
  }

  async getAllTags(): Promise<string[]> {
    const cached = this.filterCache.get('tags');
    if (cached) return cached;

    const { data, error } = await this.supabase.supabase
      .rpc('get_all_tags');

    if (error || !data) {
      return this.getAllTagsFallback();
    }

    const tags = data
      .map((r: any) => r.tag || r.value)
      .filter(Boolean)
      .sort() as string[];

    this.filterCache.set('tags', tags);
    return tags;
  }

  private async getAllTagsFallback(): Promise<string[]> {
    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .select('tags')
      .not('tags', 'is', null)
      .limit(5000);

    if (error || !data) return [];

    const allTags = new Set<string>();
    data.forEach((r: any) => {
      if (r.tags && Array.isArray(r.tags)) {
        r.tags.forEach((t: string) => allTags.add(t));
      }
    });
    const sorted = [...allTags].sort();
    this.filterCache.set('tags', sorted);
    return sorted;
  }

  clearCache() {
    this.filterCache.clear();
  }
}
