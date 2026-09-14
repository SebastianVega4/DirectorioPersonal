import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
                    <th class="px-4 py-3 font-medium text-gray-500 w-10"></th>
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
                        <button (click)="toggleFavorito(contact)"
                          class="focus:outline-none transition-transform hover:scale-110">
                          @if (contact.favorito) {
                            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          } @else {
                            <svg class="w-5 h-5 text-gray-300 hover:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                            </svg>
                          }
                        </button>
                      </td>
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
                          <button (click)="startMerge(contact)"
                            class="text-blue-600 hover:text-blue-800 text-xs font-medium">Merge</button>
                          <button (click)="deleteContact(contact)"
                            class="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (contacts.length >= 50) {
              <div class="flex justify-center p-4 border-t border-gray-200">
                <button (click)="goToPage(currentPage + 1)"
                  class="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                  Cargar más
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>

    @if (showMergeModal) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-bold text-gray-900">Merge Contacts</h2>
              <button (click)="cancelMerge()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">Busca el contacto con el que quieres fusionar "{{ mergeSource?.nombre_completo }}"</p>
          </div>

          <div class="p-6">
            @if (!mergeTarget) {
              <input type="text" [(ngModel)]="mergeSearchTerm" (ngModelChange)="searchMergeTarget()"
                placeholder="Buscar contacto destino..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-4" />

              @if (mergeSearchResults.length > 0) {
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  @for (result of mergeSearchResults; track result.id) {
                    <button (click)="selectMergeTarget(result)"
                      class="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition">
                      <div class="font-medium text-gray-900">{{ result.nombre_completo }}</div>
                      <div class="text-xs text-gray-500">{{ result.programa || '' }} {{ result.rol || '' }}</div>
                    </button>
                  }
                </div>
              }
            } @else {
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <h3 class="font-semibold text-blue-800 mb-3 text-sm">FUENTE (se eliminará)</h3>
                  <div class="space-y-2 text-sm">
                    <div><span class="text-gray-500">Nombre:</span> {{ mergeSource?.nombre_completo }}</div>
                    <div><span class="text-gray-500">Programa:</span> {{ mergeSource?.programa || '-' }}</div>
                    <div><span class="text-gray-500">Rol:</span> {{ mergeSource?.rol || '-' }}</div>
                    <div><span class="text-gray-500">Ciudad:</span> {{ mergeSource?.ciudad || '-' }}</div>
                    <div><span class="text-gray-500">Email personal:</span> {{ mergeSource?.correo_personal || '-' }}</div>
                    <div><span class="text-gray-500">Email trabajo:</span> {{ mergeSource?.correo_trabajo || '-' }}</div>
                    <div><span class="text-gray-500">Teléfono:</span> {{ mergeSource?.telefono_celular || '-' }}</div>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-green-50 border border-green-200">
                  <h3 class="font-semibold text-green-800 mb-3 text-sm">DESTINO (se conservará)</h3>
                  <div class="space-y-2 text-sm">
                    <div><span class="text-gray-500">Nombre:</span> {{ mergeTarget?.nombre_completo }}</div>
                    <div><span class="text-gray-500">Programa:</span> {{ mergeTarget?.programa || '-' }}</div>
                    <div><span class="text-gray-500">Rol:</span> {{ mergeTarget?.rol || '-' }}</div>
                    <div><span class="text-gray-500">Ciudad:</span> {{ mergeTarget?.ciudad || '-' }}</div>
                    <div><span class="text-gray-500">Email personal:</span> {{ mergeTarget?.correo_personal || '-' }}</div>
                    <div><span class="text-gray-500">Email trabajo:</span> {{ mergeTarget?.correo_trabajo || '-' }}</div>
                    <div><span class="text-gray-500">Teléfono:</span> {{ mergeTarget?.telefono_celular || '-' }}</div>
                  </div>
                </div>
              </div>

              <h3 class="font-semibold text-gray-800 mb-3 text-sm">Campos con conflicto - elige cuál conservar:</h3>
              <div class="space-y-3 mb-6">
                @for (field of mergeConflicts; track field.key) {
                  <div class="p-3 rounded-lg border border-amber-200 bg-amber-50">
                    <label class="text-xs font-medium text-amber-700 block mb-2">{{ field.label }}</label>
                    <div class="flex space-x-4">
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" [name]="'conflict_' + field.key" value="source"
                          [(ngModel)]="field.choice" class="text-blue-600" />
                        <span class="text-sm">{{ field.sourceValue || '(vacío)' }}</span>
                        <span class="text-xs text-blue-600">(fuente)</span>
                      </label>
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" [name]="'conflict_' + field.key" value="target"
                          [(ngModel)]="field.choice" class="text-green-600" />
                        <span class="text-sm">{{ field.targetValue || '(vacío)' }}</span>
                        <span class="text-xs text-green-600">(destino)</span>
                      </label>
                    </div>
                  </div>
                }
                @if (mergeConflicts.length === 0) {
                  <p class="text-sm text-gray-500">No hay conflictos - se fusionará automáticamente.</p>
                }
              </div>

              <div class="flex justify-end space-x-3">
                <button (click)="cancelMerge()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button (click)="executeMerge()"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                  Fusionar contactos
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminDashboardComponent implements OnInit {
  contacts: Contact[] = [];
  currentPage = 0;
  loading = true;
  searchTerm = '';

  showMergeModal = false;
  mergeSource: Contact | null = null;
  mergeTarget: Contact | null = null;
  mergeSearchTerm = '';
  mergeSearchResults: Contact[] = [];
  mergeConflicts: { key: string; label: string; sourceValue: any; targetValue: any; choice: 'source' | 'target' }[] = [];

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.loading = true;
    this.cdr.detectChanges();
    const result = await this.contactService.getContacts(
      { nombre: this.searchTerm },
      this.currentPage
    );
    this.contacts = result.data;
    this.loading = false;
    this.cdr.detectChanges();
  }

  onSearch() {
    this.currentPage = 0;
    this.loadContacts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadContacts();
  }

  async toggleFavorito(contact: Contact) {
    const newVal = !contact.favorito;
    const success = await this.contactService.toggleFavorito(contact.id, newVal);
    if (success) {
      contact.favorito = newVal;
      this.cdr.detectChanges();
    }
  }

  startMerge(source: Contact) {
    this.mergeSource = source;
    this.mergeTarget = null;
    this.mergeSearchTerm = '';
    this.mergeSearchResults = [];
    this.mergeConflicts = [];
    this.showMergeModal = true;
    this.cdr.detectChanges();
  }

  cancelMerge() {
    this.showMergeModal = false;
    this.mergeSource = null;
    this.mergeTarget = null;
    this.cdr.detectChanges();
  }

  async searchMergeTarget() {
    if (this.mergeSearchTerm.length < 2) {
      this.mergeSearchResults = [];
      return;
    }
    const result = await this.contactService.getContacts({ nombre: this.mergeSearchTerm }, 0);
    this.mergeSearchResults = result.data.filter((c: Contact) => c.id !== this.mergeSource?.id);
    this.cdr.detectChanges();
  }

  selectMergeTarget(target: Contact) {
    this.mergeTarget = target;
    this.computeConflicts();
    this.cdr.detectChanges();
  }

  computeConflicts() {
    if (!this.mergeSource || !this.mergeTarget) return;

    const fields: { key: string; label: string }[] = [
      { key: 'nombre_completo', label: 'Nombre completo' },
      { key: 'programa', label: 'Programa' },
      { key: 'rol', label: 'Rol' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'correo_personal', label: 'Email personal' },
      { key: 'correo_trabajo', label: 'Email trabajo' },
      { key: 'telefono_celular', label: 'Teléfono' },
      { key: 'documento', label: 'Documento' },
    ];

    this.mergeConflicts = [];
    for (const field of fields) {
      const sv = (this.mergeSource as any)[field.key];
      const tv = (this.mergeTarget as any)[field.key];
      if (sv && tv && sv !== tv) {
        this.mergeConflicts.push({
          key: field.key,
          label: field.label,
          sourceValue: sv,
          targetValue: tv,
          choice: 'target',
        });
      }
    }
  }

  async executeMerge() {
    if (!this.mergeSource || !this.mergeTarget) return;

    const merged: Partial<Contact> = { ...this.mergeTarget };

    for (const conflict of this.mergeConflicts) {
      (merged as any)[conflict.key] = conflict.choice === 'source' ? conflict.sourceValue : conflict.targetValue;
    }

    for (const field of ['correo_personal', 'correo_trabajo', 'telefono_celular']) {
      if (!merged[field as keyof Contact] && (this.mergeSource as any)[field]) {
        (merged as any)[field] = (this.mergeSource as any)[field];
      }
    }

    const allTags = new Set<string>([
      ...(this.mergeTarget.tags || []),
      ...(this.mergeSource.tags || []),
    ]);
    merged.tags = [...allTags];

    const allDetails = [
      ...(this.mergeTarget.detalles || []),
      ...(this.mergeSource.detalles || []),
    ];
    merged.detalles = allDetails;

    if (!merged.foto_url && this.mergeSource.foto_url) {
      merged.foto_url = this.mergeSource.foto_url;
    }

    const success = await this.contactService.updateContact(this.mergeTarget.id, merged);
    if (success) {
      await this.contactService.deleteContact(this.mergeSource.id);
      this.cancelMerge();
      this.loadContacts();
    }
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
