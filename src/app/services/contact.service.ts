import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Contact, ContactFilters, Detail } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly PAGE_SIZE = 20;
  private filterCache = new Map<string, string[]>();

  constructor(private supabase: SupabaseService) {}

  async getContacts(
    filters: ContactFilters = {},
    page: number = 0
  ): Promise<{ data: any[]; hasMore: boolean }> {
    const start = page * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;

    let query = this.supabase.supabase
      .from('directorio')
      .select('id,foto_url,nombre_completo,programa,rol,ciudad,tags,favorito,telefono_celular,correo_personal,correo_trabajo,documento,codigo_universidad');

    if (filters.search) {
      const search = filters.search.trim();
      const digitsOnly = search.replace(/[^0-9]/g, '');
      const isPhoneSearch = digitsOnly.length >= 3 && /[\d+]/.test(search);

      if (isPhoneSearch) {
        query = query.or(`telefono_celular.ilike.%${search}%`);
      } else {
        const words = search.split(/\s+/);
        const textColumns = [
          'nombre_completo', 'documento',
          'correo_personal', 'correo_trabajo', 'codigo_universidad',
          'telefono_celular'
        ];
        for (const word of words) {
          const conditions = textColumns.map(col => `${col}.ilike.%${word}%`).join(',');
          query = query.or(conditions);
        }
      }
    }
    if (filters.programa) {
      query = query.ilike('programa', `%${filters.programa}%`);
    }
    if (filters.rol) {
      query = query.ilike('rol', `%${filters.rol}%`);
    }
    if (filters.ciudad) {
      query = query.ilike('ciudad', `%${filters.ciudad}%`);
    }

    const hasSearch = !!filters.search;
    const isPhoneSearch = hasSearch && filters.search!.replace(/[^0-9]/g, '').length >= 3 && /[\d+]/.test(filters.search!);

    const { data, error } = await query
      .order('favorito', { ascending: false })
      .order('nombre_completo')
      .range(start, (hasSearch && !isPhoneSearch) ? start + 200 : (isPhoneSearch ? 5000 : end));

    if (error) {
      console.error('Error fetching contacts:', error.message, error.code, error.details);
      return { data: [], hasMore: false };
    }

    console.log('Contacts loaded:', data?.length || 0, 'records');
    let results = data || [];
    const hasMore = !isPhoneSearch && results.length > this.PAGE_SIZE;

    if (isPhoneSearch) {
      const digits = filters.search!.replace(/[^0-9]/g, '');
      results = results.filter(c => {
        const phone = this.normalizePhone(c.telefono_celular || '');
        return phone.includes(digits);
      });
      results = this.sortByRelevance(results, filters.search!.trim().toLowerCase());
      const totalResults = results.length;
      results = results.slice(0, this.PAGE_SIZE);
      return { data: results, hasMore: totalResults > this.PAGE_SIZE };
    }

    if (hasSearch && filters.search) {
      results = this.sortByRelevance(results, filters.search.trim().toLowerCase());
      results = results.slice(0, this.PAGE_SIZE);
    } else {
      results = hasMore ? results.slice(0, this.PAGE_SIZE) : results;
    }

    return { data: results, hasMore };
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  private sortByRelevance(contacts: any[], search: string): any[] {
    const words = search.split(/\s+/);
    const digits = search.replace(/[^0-9]/g, '');

    const scored = contacts.map(c => {
      let score = 0;

      const name = (c.nombre_completo || '').toLowerCase();
      const doc = (c.documento || '').toLowerCase();
      const email1 = (c.correo_personal || '').toLowerCase();
      const email2 = (c.correo_trabajo || '').toLowerCase();
      const phone = this.normalizePhone(c.telefono_celular || '');

      for (const word of words) {
        if (name === word) score += 1000;
        else if (name.startsWith(word)) score += 500;
        else if (name.includes(word)) score += 200;

        if (doc === word) score += 900;
        else if (doc.startsWith(word)) score += 450;
        else if (doc.includes(word)) score += 180;

        if (email1 === word) score += 800;
        else if (email1.startsWith(word)) score += 400;
        else if (email1.includes(word)) score += 160;

        if (email2 === word) score += 800;
        else if (email2.startsWith(word)) score += 400;
        else if (email2.includes(word)) score += 160;
      }

      if (digits.length >= 3 && phone) {
        if (phone === digits) score += 950;
        else if (phone.endsWith(digits)) score += 600;
        else if (phone.startsWith(digits)) score += 550;
        else if (phone.includes(digits)) score += 250;
      }

      if (c.favorito) score += 50;

      return { contact: c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.contact);
  }

  async toggleFavorito(id: string, favorito: boolean): Promise<boolean> {
    const { error } = await this.supabase.supabase
      .from('directorio')
      .update({ favorito, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }

  async searchSuggestions(column: string, term: string): Promise<string[]> {
    if (!term || term.length < 1) return [];
    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .select(column)
      .not(column, 'is', null)
      .ilike(column, `%${term}%`)
      .limit(30);

    if (error || !data) return [];

    const seen = new Set<string>();
    const results: string[] = [];
    for (const row of data) {
      const val = (row as any)[column];
      if (val && !seen.has(val)) {
        seen.add(val);
        results.push(val);
      }
    }
    return results.sort();
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

    if (fetchError) return false;

    const currentDetails = data.detalles || [];
    const updatedDetails = [...currentDetails, detail];

    const { error } = await this.supabase.supabase
      .from('directorio')
      .update({ detalles: updatedDetails, updated_at: new Date().toISOString() })
      .eq('id', contactId);

    return !error;
  }

  async createContact(contact: Partial<Contact>): Promise<Contact | null> {
    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .insert(contact)
      .select()
      .single();

    if (error) return null;
    return data;
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<boolean> {
    const { error } = await this.supabase.supabase
      .from('directorio')
      .update({ ...contact, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }

  async deleteContact(id: string): Promise<boolean> {
    const { error } = await this.supabase.supabase
      .from('directorio')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getUniqueValues(column: string): Promise<string[]> {
    const cached = this.filterCache.get(column);
    if (cached) return cached;

    const { data, error } = await this.supabase.supabase
      .from('directorio')
      .select(column)
      .not(column, 'is', null)
      .limit(10000);

    if (error || !data) return [];

    const seen = new Set<string>();
    const values: string[] = [];
    for (const row of data) {
      const val = (row as any)[column];
      if (val && !seen.has(val)) {
        seen.add(val);
        values.push(val);
      }
    }

    values.sort();
    this.filterCache.set(column, values);
    return values;
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
      .from('directorio')
      .select('tags')
      .not('tags', 'is', null)
      .limit(5000);

    if (error || !data) return [];

    const seen = new Set<string>();
    for (const row of data) {
      const tags = (row as any).tags;
      if (tags && Array.isArray(tags)) {
        for (const t of tags) {
          if (t && !seen.has(t)) {
            seen.add(t);
          }
        }
      }
    }

    const sorted = [...seen].sort();
    this.filterCache.set('tags', sorted);
    return sorted;
  }
}
