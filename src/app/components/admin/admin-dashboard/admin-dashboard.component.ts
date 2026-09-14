import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../models/contact.model';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-gray-500 text-sm mt-1">Gestiona los contactos del directorio</p>
          </div>
          <div class="flex space-x-3">
            <a routerLink="/admin-secreto/dashboard/nuevo"
              class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
              + Nuevo Contacto
            </a>
            <button (click)="logout()"
              class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition">
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch()"
              placeholder="Buscar contactos..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>

          @if (loading) {
            <app-loading message="Cargando..." />
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 text-left">
                  <tr>
                    <th class="px-4 py-3 font-medium text-gray-500">Nombre</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Programa</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Rol</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Ciudad</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  @for (contact of contacts; track contact.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center space-x-3">
                          @if (contact.foto_url) {
                            <img [src]="contact.foto_url" class="w-8 h-8 rounded-full object-cover" (error)="$event.target.style.display='none'" />
                          }
                          <span class="font-medium text-gray-900">{{ contact.nombre_completo }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-gray-600 max-w-[200px] truncate">{{ contact.programa || '-' }}</td>
                      <td class="px-4 py-3 text-gray-600">{{ contact.rol || '-' }}</td>
                      <td class="px-4 py-3 text-gray-600">{{ contact.ciudad || '-' }}</td>
                      <td class="px-4 py-3">
                        <div class="flex space-x-2">
                          <a [routerLink]="['/contacto', contact.id]"
                            class="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Ver</a>
                          <button (click)="deleteContact(contact)"
                            class="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (totalCount > 50) {
              <div class="flex justify-center items-center space-x-2 p-4 border-t border-gray-200">
                <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
                  class="px-3 py-1 text-sm rounded border {{ currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50' }}">
                  Anterior
                </button>
                <span class="text-sm text-gray-500">{{ currentPage + 1 }} / {{ Math.ceil(totalCount / 50) }}</span>
                <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= Math.ceil(totalCount / 50) - 1"
                  class="px-3 py-1 text-sm rounded border {{ currentPage >= Math.ceil(totalCount / 50) - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50' }}">
                  Siguiente
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  contacts: Contact[] = [];
  totalCount = 0;
  currentPage = 0;
  loading = true;
  searchTerm = '';
  Math = Math;

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.loading = true;
    const result = await this.contactService.getContacts(
      { nombre: this.searchTerm },
      this.currentPage
    );
    this.contacts = result.data;
    this.totalCount = result.count;
    this.loading = false;
  }

  onSearch() {
    this.currentPage = 0;
    this.loadContacts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadContacts();
  }

  async deleteContact(contact: Contact) {
    if (!confirm(`¿Eliminar a ${contact.nombre_completo}? Esta acción no se puede deshacer.`)) {
      return;
    }
    const success = await this.contactService.deleteContact(contact.id);
    if (success) {
      this.loadContacts();
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/admin-secreto']);
  }
}
