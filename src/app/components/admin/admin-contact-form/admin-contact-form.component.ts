import { Component, OnInit } from '@angular/core';
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
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div class="mb-6">
          <button (click)="goBack()" class="text-sm text-gray-500 hover:text-indigo-600 mb-4 inline-flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver al dashboard
          </button>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditing ? 'Editar Contacto' : 'Nuevo Contacto' }}</h1>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input type="text" [(ngModel)]="contact.nombre_completo" name="nombre" required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                <input type="text" [(ngModel)]="contact.documento" name="documento"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Código Universidad</label>
                <input type="text" [(ngModel)]="contact.codigo_universidad" name="codigo"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                <input type="text" [(ngModel)]="contact.programa" name="programa"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <input type="text" [(ngModel)]="contact.rol" name="rol"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo Personal</label>
                <input type="email" [(ngModel)]="contact.correo_personal" name="correo_personal"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo Trabajo</label>
                <input type="email" [(ngModel)]="contact.correo_trabajo" name="correo_trabajo"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono Celular</label>
                <input type="tel" [(ngModel)]="contact.telefono_celular" name="telefono"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input type="text" [(ngModel)]="contact.ciudad" name="ciudad"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input type="date" [(ngModel)]="contact.fecha_nacimiento" name="fecha_nacimiento"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
                <input type="url" [(ngModel)]="contact.foto_url" name="foto_url"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-4">Redes Sociales</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">WhatsApp (@)</label>
                  <input type="text" [(ngModel)]="contact.redes_sociales.wa" name="wa"
                    placeholder="@usuario"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Instagram (@)</label>
                  <input type="text" [(ngModel)]="contact.redes_sociales.ig" name="ig"
                    placeholder="@usuario"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Facebook</label>
                  <input type="text" [(ngModel)]="contact.redes_sociales.fb" name="fb"
                    placeholder="usuario o URL"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-4">Ubicación (Mapa)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Latitud</label>
                  <input type="number" step="any" [(ngModel)]="contact.latitud" name="latitud"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Longitud</label>
                  <input type="number" step="any" [(ngModel)]="contact.longitud" name="longitud"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-2">Usa Google Maps para obtener las coordenadas: clic derecho → "¿Qué hay aquí?"</p>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-4">Tags</h3>
              <input type="text" [(ngModel)]="tagsInput" name="tags"
                placeholder="Separados por coma: volley uptc, ingeniería, amigo"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <p class="text-xs text-gray-400 mt-1">Separar cada tag con coma</p>
            </div>

            @if (error) {
              <p class="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{{ error }}</p>
            }
            @if (success) {
              <p class="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">
                {{ isEditing ? 'Contacto actualizado correctamente' : 'Contacto creado correctamente' }}
              </p>
            }

            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" (click)="goBack()"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" [disabled]="saving"
                class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Contacto') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminContactFormComponent implements OnInit {
  contact: Contact = this.getEmptyContact();
  tagsInput = '';
  isEditing = false;
  saving = false;
  error = '';
  success = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadContact(id);
    }
  }

  async loadContact(id: string) {
    const contact = await this.contactService.getContactById(id);
    if (contact) {
      this.contact = contact;
      this.tagsInput = (contact.tags || []).join(', ');
    }
  }

  async onSubmit() {
    this.saving = true;
    this.error = '';
    this.success = false;

    this.contact.tags = this.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (!this.contact.redes_sociales) {
      this.contact.redes_sociales = {};
    }

    try {
      if (this.isEditing) {
        const success = await this.contactService.updateContact(this.contact.id, this.contact);
        if (success) {
          this.success = true;
        } else {
          this.error = 'Error al actualizar el contacto';
        }
      } else {
        const newContact = await this.contactService.createContact(this.contact);
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
      created_at: '',
      updated_at: '',
    };
  }
}
