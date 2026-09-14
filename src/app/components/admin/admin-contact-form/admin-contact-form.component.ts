import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-admin-contact-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div class="mb-6">
          <button (click)="goBack()" class="text-sm text-gray-500 hover:text-indigo-600 mb-4 inline-flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver al dashboard
          </button>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Contacto' : 'Nuevo Contacto' }}</h1>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="space-y-6">
            <!-- Información Básica -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Información Básica</h2>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo *</label>
                    <input type="text" [(ngModel)]="contact.nombre_completo" name="nombre" required
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Documento</label>
                    <input type="text" [(ngModel)]="contact.documento" name="documento"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Código Universidad</label>
                    <input type="text" [(ngModel)]="contact.codigo_universidad" name="codigo"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Programa</label>
                    <input type="text" [(ngModel)]="contact.programa" name="programa"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
                    <input type="text" [(ngModel)]="contact.rol" name="rol"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
                    <input type="text" [(ngModel)]="contact.ciudad" name="ciudad"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Nacimiento</label>
                    <input type="date" [(ngModel)]="contact.fecha_nacimiento" name="fecha_nacimiento"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Foto de perfil -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Foto de Perfil</h2>
              <div class="flex items-start space-x-5">
                <div class="flex-shrink-0">
                  @if (contact.foto_url) {
                    <img [src]="contact.foto_url" class="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200" (error)="contact.foto_url = null" />
                  } @else {
                    <div class="w-20 h-20 rounded-2xl bg-indigo-100 border-2 border-dashed border-indigo-300 flex items-center justify-center">
                      <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  }
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">URL de la imagen</label>
                  <input type="url" [(ngModel)]="contact.foto_url" name="foto_url"
                    placeholder="https://ejemplo.com/foto.jpg"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  <p class="text-xs text-gray-400 mt-1.5">Pega una URL de imagen (Google Fotos, Instagram, etc.)</p>
                </div>
              </div>
            </div>

            <!-- Contacto -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600">
                <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Información de Contacto</h2>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo Personal</label>
                    <input type="email" [(ngModel)]="contact.correo_personal" name="correo_personal"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo Trabajo</label>
                    <input type="email" [(ngModel)]="contact.correo_trabajo" name="correo_trabajo"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono Celular</label>
                    <input type="tel" [(ngModel)]="contact.telefono_celular" name="telefono"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Redes Sociales -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600">
                <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Redes Sociales</h2>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">WhatsApp</label>
                    <input type="text" [(ngModel)]="contact.redes_sociales.wa" name="wa"
                      placeholder="@usuario o +57..."
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Instagram</label>
                    <input type="text" [(ngModel)]="contact.redes_sociales.ig" name="ig"
                      placeholder="@usuario"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Facebook</label>
                    <input type="text" [(ngModel)]="contact.redes_sociales.fb" name="fb"
                      placeholder="usuario o URL"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Ubicación con Mapa -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600">
                <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Ubicación</h2>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500 mb-4">Haz clic en el mapa para seleccionar la ubicación, o arrastra el marcador.</p>
                <div id="edit-map-container" class="rounded-xl overflow-hidden border border-gray-200" style="height: 350px;"></div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Latitud</label>
                    <input type="number" step="any" [(ngModel)]="contact.latitud" name="latitud"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-gray-50" readonly />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Longitud</label>
                    <input type="number" step="any" [(ngModel)]="contact.longitud" name="longitud"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-gray-50" readonly />
                  </div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600">
                <h2 class="text-sm font-semibold text-white uppercase tracking-wider">Tags</h2>
              </div>
              <div class="p-6">
                <input type="text" [(ngModel)]="tagsInput" name="tags"
                  placeholder="volley uptc, ingeniería, amigo..."
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                <p class="text-xs text-gray-400 mt-1.5">Separar cada tag con coma</p>
              </div>
            </div>
          </div>

          @if (error) {
            <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{{ error }}</div>
          }
          @if (success) {
            <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              {{ isEditing ? 'Contacto actualizado correctamente' : 'Contacto creado correctamente' }}
            </div>
          }

          <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button type="button" (click)="goBack()"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" [disabled]="saving"
              class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Contacto') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AdminContactFormComponent implements OnInit, OnDestroy, AfterViewInit {
  contact: Contact = this.getEmptyContact();
  originalFotoUrl: string | null = null;
  tagsInput = '';
  isEditing = false;
  saving = false;
  error = '';
  success = false;
  private map: any = null;
  private mapReady = false;
  private mapInitTimer: any = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadContact(id);
    } else {
      this.mapInitTimer = setTimeout(() => this.initMap(), 100);
    }
  }

  ngAfterViewInit() {
    if (!this.isEditing && !this.mapReady) {
      this.initMap();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    if (this.mapInitTimer) {
      clearTimeout(this.mapInitTimer);
    }
  }

  async loadContact(id: string) {
    const contact = await this.contactService.getContactById(id);
    if (contact) {
      this.contact = contact;
      this.originalFotoUrl = contact.foto_url;
      this.tagsInput = (contact.tags || []).join(', ');
      console.log('Contacto cargado:', contact.nombre_completo, 'foto_url:', contact.foto_url);
      this.cdr.detectChanges();
      setTimeout(() => this.initMap(), 200);
    }
  }

  private async initMap() {
    if (this.mapReady) return;
    try {
      const L = await import('leaflet');
      const container = document.getElementById('edit-map-container');
      if (!container) return;

      const defaultLat = this.contact.latitud || 4.6097;
      const defaultLng = this.contact.longitud || -74.0817;

      const map = L.map('edit-map-container', {
        center: [defaultLat, defaultLng],
        zoom: this.contact.latitud ? 14 : 6,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      let marker: any = null;
      if (this.contact.latitud && this.contact.longitud) {
        marker = L.marker([this.contact.latitud, this.contact.longitud], { draggable: true }).addTo(map);
        this.setupMarkerDrag(marker, L);
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.contact.latitud = Math.round(lat * 1000000) / 1000000;
        this.contact.longitud = Math.round(lng * 1000000) / 1000000;
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng], { draggable: true }).addTo(map);
          this.setupMarkerDrag(marker, L);
        }
        this.cdr.detectChanges();
      });

      setTimeout(() => map.invalidateSize(), 100);
      this.map = map;
      this.mapReady = true;
    } catch (e) {
      console.error('Error loading map:', e);
    }
  }

  private setupMarkerDrag(marker: any, L: any) {
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      this.contact.latitud = Math.round(pos.lat * 1000000) / 1000000;
      this.contact.longitud = Math.round(pos.lng * 1000000) / 1000000;
      this.cdr.detectChanges();
    });
  }

  async onSubmit() {
    this.saving = true;
    this.error = '';
    this.success = false;
    this.cdr.detectChanges();

    this.contact.tags = this.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (!this.contact.redes_sociales) {
      this.contact.redes_sociales = {};
    }

    if (!this.contact.foto_url && this.originalFotoUrl) {
      this.contact.foto_url = this.originalFotoUrl;
    }

    const dataToSend = this.cleanNulls({ ...this.contact });

    try {
      if (this.isEditing) {
        const success = await this.contactService.updateContact(this.contact.id, dataToSend);
        if (success) {
          this.success = true;
        } else {
          this.error = 'Error al actualizar el contacto';
        }
      } else {
        const newContact = await this.contactService.createContact(dataToSend);
        if (newContact) {
          this.success = true;
          setTimeout(() => this.goBack(), 1500);
        } else {
          this.error = 'Error al crear el contacto';
        }
      }
    } catch (e) {
      this.error = 'Ocurrió un error inesperado';
    }

    this.saving = false;
    this.cdr.detectChanges();
  }

  private cleanNulls(obj: any): any {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val === null || val === undefined || val === '') {
        continue;
      }
      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        const nested = this.cleanNulls(val);
        if (Object.keys(nested).length > 0) {
          cleaned[key] = nested;
        }
      } else {
        cleaned[key] = val;
      }
    }
    return cleaned;
  }

  goBack() {
    this.router.navigate(['/admin-secreto/dashboard']);
  }

  private getEmptyContact(): Contact {
    return {
      id: '',
      foto_url: null,
      nombre_completo: '',
      documento: null,
      codigo_universidad: null,
      programa: null,
      rol: null,
      correo_personal: null,
      correo_trabajo: null,
      telefono_celular: null,
      redes_sociales: {},
      tags: [],
      ciudad: null,
      latitud: null,
      longitud: null,
      fecha_nacimiento: null,
      detalles: [],
      favorito: false,
      created_at: '',
      updated_at: '',
    };
  }
}
