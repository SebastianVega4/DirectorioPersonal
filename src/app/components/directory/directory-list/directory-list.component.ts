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

        @if (loading) {
          <app-loading message="Cargando contactos..." />
        } @else {
          <div class="mb-4 text-sm text-gray-500">
            {{ totalCount }} contacto{{ totalCount !== 1 ? 's' : '' }} encontrado{{ totalCount !== 1 ? 's' : '' }}
          </div>

          @if (contacts.length === 0) {
            <div class="text-center py-16">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="mt-4 text-gray-500">No se encontraron contactos con estos filtros</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (contact of contacts; track contact.id) {
                <app-directory-card [contact]="contact" />
              }
            </div>

            @if (totalCount > pageSize) {
              <div class="flex justify-center items-center space-x-2 mt-8">
                <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
                  class="px-4 py-2 text-sm font-medium rounded-lg border transition
                    {{ currentPage === 0 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50' }}">
                  Anterior
                </button>
                <span class="text-sm text-gray-500">
                  Página {{ currentPage + 1 }} de {{ totalPages }}
                </span>
                <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
                  class="px-4 py-2 text-sm font-medium rounded-lg border transition
                    {{ currentPage >= totalPages - 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50' }}">
                  Siguiente
                </button>
              </div>
            }
          }
        }
      </div>
    </div>
  `,
})
export class DirectoryListComponent implements OnInit {
  contacts: Contact[] = [];
  totalCount = 0;
  currentPage = 0;
  pageSize = 24;
  loading = true;
  currentFilters: ContactFilters = {};

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.loading = true;
    const result = await this.contactService.getContacts(this.currentFilters, this.currentPage);
    this.contacts = result.data;
    this.totalCount = result.count;
    this.loading = false;
  }

  onFiltersChange(filters: ContactFilters) {
    this.currentFilters = filters;
    this.currentPage = 0;
    this.loadContacts();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadContacts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
