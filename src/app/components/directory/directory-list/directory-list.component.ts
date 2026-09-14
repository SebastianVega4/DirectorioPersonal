import { Component, OnInit } from '@angular/core';
import { DirectoryCardComponent } from '../directory-card/directory-card.component';
import { DirectoryFiltersComponent } from '../directory-filters/directory-filters.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ContactService } from '../../../services/contact.service';
import { Contact, ContactFilters } from '../../../models/contact.model';

@Component({
  selector: 'app-directory-list',
  standalone: true,
  imports: [DirectoryCardComponent, DirectoryFiltersComponent, LoadingComponent],
  template: `
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Directorio de Contactos</h1>
          <p class="mt-2 text-gray-500">Encuentra personas de tu red universitaria y profesional</p>
        </div>

        <app-directory-filters (filtersChange)="onFiltersChange($event)" />

        @if (loading && contacts.length === 0) {
          <app-loading message="Cargando contactos..." />
        } @else if (error) {
          <div class="text-center py-16">
            <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <p class="mt-4 text-red-500">{{ error }}</p>
            <button (click)="loadContacts()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
              Reintentar
            </button>
          </div>
        } @else if (contacts.length === 0) {
          <div class="text-center py-16">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="mt-4 text-gray-500">No se encontraron contactos</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            @for (contact of contacts; track contact.id) {
              <app-directory-card [contact]="contact" />
            }
          </div>

          @if (hasMore) {
            <div class="flex justify-center mt-8">
              <button (click)="loadMore()" [disabled]="loading"
                class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                {{ loading ? 'Cargando...' : 'Cargar más contactos' }}
              </button>
            </div>
          }

          <div class="text-center mt-4 text-sm text-gray-400">
            Mostrando {{ contacts.length }} contactos
          </div>
        }
      </div>
    </div>
  `,
})
export class DirectoryListComponent implements OnInit {
  contacts: any[] = [];
  currentPage = 0;
  hasMore = true;
  loading = true;
  currentFilters: ContactFilters = {};
  error = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.loading = true;
    this.error = '';
    try {
      const result = await this.contactService.getContacts(this.currentFilters, this.currentPage);
      this.contacts = result.data;
      this.hasMore = result.hasMore;
    } catch (e) {
      console.error('Error in loadContacts:', e);
      this.error = 'Error al cargar contactos. Intenta de nuevo.';
    }
    this.loading = false;
  }

  async loadMore() {
    this.currentPage++;
    this.loading = true;
    const result = await this.contactService.getContacts(this.currentFilters, this.currentPage);
    this.contacts = [...this.contacts, ...result.data];
    this.hasMore = result.hasMore;
    this.loading = false;
  }

  onFiltersChange(filters: ContactFilters) {
    this.currentFilters = filters;
    this.currentPage = 0;
    this.contacts = [];
    this.loadContacts();
  }
}
