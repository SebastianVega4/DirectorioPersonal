import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactService } from '../../../services/contact.service';
import { Contact, Detail } from '../../../models/contact.model';
import { AddDetailFormComponent } from '../add-detail-form/add-detail-form.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [RouterLink, AddDetailFormComponent, LoadingComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <a routerLink="/" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver al directorio
        </a>

        @if (loading) {
          <app-loading message="Cargando perfil..." />
        } @else if (!contact) {
          <div class="text-center py-16">
            <p class="text-gray-500 text-lg">Contacto no encontrado</p>
          </div>
        } @else {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
            <div class="px-6 pb-6">
              <div class="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-16">
                <div class="flex-shrink-0">
                  @if (contact.foto_url) {
                    <img [src]="contact.foto_url" [alt]="contact.nombre_completo"
                      class="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                      (error)="onImageError($event)" />
                  } @else {
                    <div class="w-28 h-28 rounded-2xl bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center">
                      <span class="text-indigo-600 font-bold text-3xl">{{ getInitials() }}</span>
                    </div>
                  }
                </div>
                <div class="mt-4 sm:mt-0 sm:pb-1">
                  <h1 class="text-2xl font-bold text-gray-900">{{ contact.nombre_completo }}</h1>
                  @if (contact.programa) {
                    <p class="text-gray-500">{{ contact.programa }}</p>
                  }
                </div>
              </div>

              <div class="mt-6 space-y-6">
                @if (contact.rol || contact.ciudad || contact.documento || contact.codigo_universidad) {
                  <section>
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Información Personal</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      @if (contact.rol) {
                        <div class="flex items-center space-x-2 text-sm">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <span class="text-gray-600">{{ contact.rol }}</span>
                        </div>
                      }
                      @if (contact.ciudad) {
                        <div class="flex items-center space-x-2 text-sm">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          <span class="text-gray-600">{{ contact.ciudad }}</span>
                        </div>
                      }
                      @if (contact.documento) {
                        <div class="flex items-center space-x-2 text-sm">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/>
                          </svg>
                          <span class="text-gray-600">Doc: {{ contact.documento }}</span>
                        </div>
                      }
                      @if (contact.fecha_nacimiento) {
                        <div class="flex items-center space-x-2 text-sm">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span class="text-gray-600">{{ formatDate(contact.fecha_nacimiento) }}</span>
                        </div>
                      }
                    </div>
                  </section>
                }

                @if (contact.correo_personal || contact.correo_trabajo || contact.telefono_celular) {
                  <section>
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contacto</h3>
                    <div class="space-y-2">
                      @if (contact.correo_personal) {
                        <a [href]="'mailto:' + contact.correo_personal" class="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <span>{{ contact.correo_personal }}</span>
                          <span class="text-xs text-gray-400">(personal)</span>
                        </a>
                      }
                      @if (contact.correo_trabajo) {
                        <a [href]="'mailto:' + contact.correo_trabajo" class="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <span>{{ contact.correo_trabajo }}</span>
                          <span class="text-xs text-gray-400">(trabajo)</span>
                        </a>
                      }
                      @if (contact.telefono_celular) {
                        <a [href]="'tel:' + contact.telefono_celular" class="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                          </svg>
                          <span>{{ contact.telefono_celular }}</span>
                        </a>
                      }
                    </div>
                  </section>
                }

                @if (hasSocialLinks()) {
                  <section>
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Redes Sociales</h3>
                    <div class="flex space-x-3">
                      @if (contact.redes_sociales?.wa) {
                        <a [href]="'https://wa.me/' + contact.redes_sociales.wa.replace('@','').replace('+','')" target="_blank"
                          class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition">
                          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </a>
                      }
                      @if (contact.redes_sociales?.ig) {
                        <a [href]="'https://instagram.com/' + contact.redes_sociales.ig.replace('@','')" target="_blank"
                          class="flex items-center justify-center w-10 h-10 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition">
                          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                        </a>
                      }
                      @if (contact.redes_sociales?.fb) {
                        <a [href]="'https://facebook.com/' + contact.redes_sociales.fb" target="_blank"
                          class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      }
                    </div>
                  </section>
                }

                @if (contact.tags && contact.tags.length > 0) {
                  <section>
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tags</h3>
                    <div class="flex flex-wrap gap-2">
                      @for (tag of contact.tags; track tag) {
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          {{ tag }}
                        </span>
                      }
                    </div>
                  </section>
                }

                @if (contact.latitud && contact.longitud) {
                  <section>
                    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ubicación</h3>
                    <div id="map-container" class="rounded-xl overflow-hidden border border-gray-200" style="height: 300px;"></div>
                  </section>
                }

                <section>
                  <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Detalles y Notas ({{ contact.detalles?.length || 0 }})
                  </h3>
                  @if (contact.detalles && contact.detalles.length > 0) {
                    <div class="space-y-3 mb-4">
                      @for (detail of contact.detalles; track detail.fecha) {
                        <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p class="text-sm text-gray-700">{{ detail.nota }}</p>
                          <div class="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                            <span>{{ detail.autor }}</span>
                            <span>&middot;</span>
                            <span>{{ formatDate(detail.fecha) }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  }
                  <app-add-detail-form
                    [contactId]="contact.id"
                    (detailAdded)="onDetailAdded($event)" />
                </section>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProfileViewComponent implements OnInit {
  contact: Contact | null = null;
  loading = true;
  private mapLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContact(id);
    } else {
      this.loading = false;
    }
  }

  async loadContact(id: string) {
    this.loading = true;
    try {
      this.contact = await this.contactService.getContactById(id);
    } catch (e) {
      console.error('Error loading contact:', e);
    }
    this.loading = false;

    if (this.contact?.latitud && this.contact?.longitud && !this.mapLoaded) {
      setTimeout(() => this.initMap(), 300);
    }
  }

  private async initMap() {
    if (this.mapLoaded) return;
    try {
      const L = await import('leaflet');
      const container = document.getElementById('map-container');
      if (!container) return;

      const map = L.map('map-container', {
        center: [this.contact!.latitud!, this.contact!.longitud!],
        zoom: 14,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      L.marker([this.contact!.latitud!, this.contact!.longitud!]).addTo(map);

      setTimeout(() => map.invalidateSize(), 100);
      this.mapLoaded = true;
    } catch (e) {
      console.error('Error loading map:', e);
    }
  }

  getInitials(): string {
    if (!this.contact) return '';
    const parts = this.contact.nombre_completo.split(' ').filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  hasSocialLinks(): boolean {
    if (!this.contact?.redes_sociales) return false;
    const rs = this.contact.redes_sociales;
    return !!(rs.wa || rs.ig || rs.fb);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  async onDetailAdded(detail: Detail) {
    if (!this.contact) return;
    const success = await this.contactService.addDetail(this.contact.id, detail);
    if (success) {
      this.contact.detalles = [...(this.contact.detalles || []), detail];
    }
  }
}
