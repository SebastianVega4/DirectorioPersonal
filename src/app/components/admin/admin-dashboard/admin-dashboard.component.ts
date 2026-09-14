import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, Subscription } from 'rxjs';
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
          <div class="p-4 border-b border-gray-200 relative">
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="searchTerm" (keydown.enter)="onSearch()"
                (ngModelChange)="onSearchInput()"
                placeholder="Buscar por nombre, cédula, teléfono, email..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <button (click)="onSearch()"
                class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                Buscar
              </button>
            </div>
            @if (suggestions.length > 0 && showSuggestions) {
              <div class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                @for (suggestion of suggestions; track suggestion) {
                  <button type="button" (mousedown)="selectSuggestion(suggestion)"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition">
                    {{ suggestion }}
                  </button>
                }
              </div>
            }
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
                          <a [routerLink]="['/admin-secreto/dashboard/editar', contact.id]"
                            class="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Editar</a>
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
        <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Fusionar Contactos</h2>
                <p class="text-sm text-gray-500 mt-0.5">Se conservará: <strong class="text-green-700">{{ mergeTarget?.nombre_completo }}</strong></p>
                <p class="text-sm text-gray-500">Se eliminará: <strong class="text-red-600">{{ mergeSource?.nombre_completo }}</strong></p>
              </div>
              <button (click)="cancelMerge()" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            @if (!mergeTarget) {
              <p class="text-sm text-gray-500 mb-3">Busca el contacto con el que quieres fusionar:</p>
              <input type="text" [(ngModel)]="mergeSearchTerm" (ngModelChange)="searchMergeTarget()"
                placeholder="Escribir nombre del contacto destino..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-4" />

              @if (mergeSearchResults.length > 0) {
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  @for (result of mergeSearchResults; track result.id) {
                    <button (click)="selectMergeTarget(result)"
                      class="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition">
                      <div class="font-medium text-gray-900">{{ result.nombre_completo }}</div>
                      <div class="text-xs text-gray-500">{{ result.programa || '' }} {{ result.rol ? '- ' + result.rol : '' }}</div>
                    </button>
                  }
                </div>
              } @else if (mergeSearchTerm.length >= 2) {
                <p class="text-sm text-gray-400 text-center py-4">No se encontraron contactos</p>
              }
            } @else {
              @if (mergeConflicts.length > 0) {
                <div class="mb-6">
                  <h3 class="text-sm font-semibold text-amber-700 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    Campos en conflicto - elige cuál conservar
                  </h3>
                  <div class="space-y-3">
                    @for (field of mergeConflicts; track field.key) {
                      <div class="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                        <label class="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-3">{{ field.label }}</label>
                        <div class="grid grid-cols-2 gap-3">
                          <label class="flex items-start space-x-2.5 cursor-pointer p-2 rounded-lg border-2 transition"
                            [class]="field.choice === 'source' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'">
                            <input type="radio" [name]="'conflict_' + field.key" value="source"
                              [(ngModel)]="field.choice" class="text-blue-600 mt-0.5" />
                            <div>
                              <span class="text-sm font-medium text-gray-900 block">{{ field.sourceValue }}</span>
                              <span class="text-xs text-blue-600">Fuente (se eliminará)</span>
                            </div>
                          </label>
                          <label class="flex items-start space-x-2.5 cursor-pointer p-2 rounded-lg border-2 transition"
                            [class]="field.choice === 'target' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'">
                            <input type="radio" [name]="'conflict_' + field.key" value="target"
                              [(ngModel)]="field.choice" class="text-green-600 mt-0.5" />
                            <div>
                              <span class="text-sm font-medium text-gray-900 block">{{ field.targetValue }}</span>
                              <span class="text-xs text-green-600">Destino (se conservará)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="text-center py-4 mb-4 bg-gray-50 rounded-xl">
                  <svg class="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <p class="text-sm text-gray-600">No hay conflictos - todos los campos son iguales o están vacíos</p>
                </div>
              }

              @if (mergeAutoFill.length > 0) {
                <div class="mb-6">
                  <h3 class="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Se completarán automáticamente
                  </h3>
                  <p class="text-xs text-gray-500 mb-3">Estos campos están vacíos en el destino pero tienen datos en la fuente:</p>
                  <div class="space-y-2">
                    @for (item of mergeAutoFill; track item.key) {
                      <div class="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div>
                          <span class="text-xs font-medium text-blue-800">{{ item.label }}</span>
                          <span class="text-sm text-gray-900 block">{{ item.value }}</span>
                        </div>
                        <label class="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" [(ngModel)]="item.selected" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span class="text-xs text-gray-500">Copiar</span>
                        </label>
                      </div>
                    }
                  </div>
                </div>
              }

              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button (click)="cancelMerge()"
                  class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button (click)="executeMerge()"
                  class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
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
export class AdminDashboardComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  currentPage = 0;
  loading = true;
  searchTerm = '';
  suggestions: string[] = [];
  showSuggestions = false;

  showMergeModal = false;
  mergeSource: Contact | null = null;
  mergeTarget: Contact | null = null;
  mergeSearchTerm = '';
  mergeSearchResults: Contact[] = [];
  mergeConflicts: { key: string; label: string; sourceValue: any; targetValue: any; choice: 'source' | 'target' }[] = [];
  mergeAutoFill: { key: string; label: string; value: any; selected: boolean }[] = [];

  private search$ = new Subject<string>();
  private sub?: Subscription;

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = this.search$
      .pipe(debounceTime(300))
      .subscribe(term => this.doSearch(term));
    this.loadContacts();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async loadContacts() {
    this.loading = true;
    this.cdr.detectChanges();
    const result = await this.contactService.getContacts(
      { search: this.searchTerm },
      this.currentPage
    );
    this.contacts = result.data;
    this.loading = false;
    this.cdr.detectChanges();
  }

  onSearchInput() {
    this.showSuggestions = this.searchTerm.length > 0;
    if (this.searchTerm.length > 0) {
      this.search$.next(this.searchTerm);
    } else {
      this.suggestions = [];
      this.currentPage = 0;
      this.loadContacts();
    }
  }

  async doSearch(term: string) {
    if (term.length < 1) {
      this.suggestions = [];
      return;
    }
    const results = await this.contactService.searchSuggestions('nombre_completo', term);
    this.suggestions = results.slice(0, 10);
    this.cdr.detectChanges();
  }

  selectSuggestion(value: string) {
    this.searchTerm = value;
    this.showSuggestions = false;
    this.suggestions = [];
    this.currentPage = 0;
    this.loadContacts();
  }

  onSearch() {
    this.showSuggestions = false;
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

  async startMerge(source: Contact) {
    const fullSource = await this.contactService.getContactById(source.id);
    this.mergeSource = fullSource || source;
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
  }

  async searchMergeTarget() {
    if (this.mergeSearchTerm.length < 2) {
      this.mergeSearchResults = [];
      return;
    }
    const result = await this.contactService.getContacts({ search: this.mergeSearchTerm }, 0);
    this.mergeSearchResults = result.data.filter((c: Contact) => c.id !== this.mergeSource?.id);
    this.cdr.detectChanges();
  }

  async selectMergeTarget(target: Contact) {
    const fullTarget = await this.contactService.getContactById(target.id);
    this.mergeTarget = fullTarget || target;
    this.computeConflicts();
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  computeConflicts() {
    if (!this.mergeSource || !this.mergeTarget) return;

    const fields: { key: string; label: string; isPhone?: boolean }[] = [
      { key: 'nombre_completo', label: 'Nombre completo' },
      { key: 'programa', label: 'Programa' },
      { key: 'rol', label: 'Rol' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'correo_personal', label: 'Email personal' },
      { key: 'correo_trabajo', label: 'Email trabajo' },
      { key: 'telefono_celular', label: 'Teléfono', isPhone: true },
      { key: 'documento', label: 'Documento' },
      { key: 'foto_url', label: 'Foto' },
      { key: 'codigo_universidad', label: 'Código universidad' },
      { key: 'fecha_nacimiento', label: 'Fecha nacimiento' },
    ];

    const socialFields: { key: string; label: string; isPhone?: boolean }[] = [
      { key: 'wa', label: 'WhatsApp', isPhone: true },
      { key: 'ig', label: 'Instagram' },
      { key: 'fb', label: 'Facebook' },
    ];

    this.mergeConflicts = [];
    this.mergeAutoFill = [];

    const sRs = (this.mergeSource as any).redes_sociales || {};
    const tRs = (this.mergeTarget as any).redes_sociales || {};

    for (const field of fields) {
      const sv = (this.mergeSource as any)[field.key];
      const tv = (this.mergeTarget as any)[field.key];

      if (sv && tv) {
        const same = field.isPhone
          ? this.normalizePhone(String(sv)) === this.normalizePhone(String(tv))
          : String(sv) === String(tv);
        if (!same) {
          this.mergeConflicts.push({
            key: field.key,
            label: field.label,
            sourceValue: sv,
            targetValue: tv,
            choice: 'target',
          });
        }
      } else if (!tv && sv) {
        this.mergeAutoFill.push({
          key: field.key,
          label: field.label,
          value: sv,
          selected: true,
        });
      }
    }

    for (const sf of socialFields) {
      const sv = sRs[sf.key];
      const tv = tRs[sf.key];

      if (sv && tv) {
        const same = sf.isPhone
          ? this.normalizePhone(String(sv)) === this.normalizePhone(String(tv))
          : sv === tv;
        if (!same) {
          this.mergeConflicts.push({
            key: 'redes_sociales.' + sf.key,
            label: sf.label,
            sourceValue: sv,
            targetValue: tv,
            choice: 'target',
          });
        }
      } else if (!tv && sv) {
        this.mergeAutoFill.push({
          key: 'redes_sociales.' + sf.key,
          label: sf.label,
          value: sv,
          selected: true,
        });
      }
    }
  }

  async executeMerge() {
    if (!this.mergeSource || !this.mergeTarget) return;

    const merged: Contact = JSON.parse(JSON.stringify(this.mergeTarget));

    for (const conflict of this.mergeConflicts) {
      if (conflict.key.startsWith('redes_sociales.')) {
        const socialKey = conflict.key.split('.')[1];
        if (!merged.redes_sociales) merged.redes_sociales = {};
        (merged.redes_sociales as any)[socialKey] = conflict.choice === 'source' ? conflict.sourceValue : conflict.targetValue;
      } else {
        (merged as any)[conflict.key] = conflict.choice === 'source' ? conflict.sourceValue : conflict.targetValue;
      }
    }

    for (const item of this.mergeAutoFill) {
      if (!item.selected) continue;
      if (item.key.startsWith('redes_sociales.')) {
        const socialKey = item.key.split('.')[1];
        if (!merged.redes_sociales) merged.redes_sociales = {};
        (merged.redes_sociales as any)[socialKey] = item.value;
      } else {
        (merged as any)[item.key] = item.value;
      }
    }

    if (merged.telefono_celular && this.mergeSource.telefono_celular) {
      const targetNorm = this.normalizePhone(String(merged.telefono_celular));
      const sourceNorm = this.normalizePhone(String(this.mergeSource.telefono_celular));
      if (targetNorm === sourceNorm && merged.telefono_celular !== this.mergeSource.telefono_celular) {
        merged.telefono_celular = this.mergeSource.telefono_celular;
      }
    }

    if (merged.redes_sociales?.wa && this.mergeSource.redes_sociales?.wa) {
      const targetNorm = this.normalizePhone(String(merged.redes_sociales.wa));
      const sourceNorm = this.normalizePhone(String(this.mergeSource.redes_sociales.wa));
      if (targetNorm === sourceNorm && merged.redes_sociales.wa !== this.mergeSource.redes_sociales.wa) {
        merged.redes_sociales.wa = this.mergeSource.redes_sociales.wa;
      }
    }

    if (this.mergeTarget.tags || this.mergeSource.tags) {
      const allTags = new Set<string>([
        ...(this.mergeTarget.tags || []),
        ...(this.mergeSource.tags || []),
        ...(merged.tags || []),
      ]);
      merged.tags = [...allTags];
    }

    if (this.mergeTarget.detalles || this.mergeSource.detalles) {
      const allDetails = [
        ...(merged.detalles || []),
        ...(this.mergeTarget.detalles || []),
        ...(this.mergeSource.detalles || []),
      ];
      merged.detalles = allDetails;
    }

    if (!merged.redes_sociales) merged.redes_sociales = {};
    const srcRs: any = this.mergeSource.redes_sociales || {};
    const tgtRs: any = this.mergeTarget.redes_sociales || {};
    const mergedRs: any = merged.redes_sociales;
    for (const key of Object.keys(srcRs)) {
      if (!mergedRs[key] && tgtRs[key]) {
        mergedRs[key] = tgtRs[key];
      } else if (!mergedRs[key] && srcRs[key]) {
        mergedRs[key] = srcRs[key];
      }
    }
    for (const key of Object.keys(tgtRs)) {
      if (!mergedRs[key] && tgtRs[key]) {
        mergedRs[key] = tgtRs[key];
      }
    }

    const success = await this.contactService.updateContact(this.mergeTarget.id, merged);
    if (success) {
      await this.contactService.deleteContact(this.mergeSource.id);
      this.cancelMerge();
      await this.loadContacts();
    }
  }

  async deleteContact(contact: Contact) {
    if (!confirm(`¿Eliminar a ${contact.nombre_completo}? Esta acción no se puede deshacer.`)) {
      return;
    }
    const success = await this.contactService.deleteContact(contact.id);
    if (success) {
      await this.loadContacts();
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/admin-secreto']);
  }
}
