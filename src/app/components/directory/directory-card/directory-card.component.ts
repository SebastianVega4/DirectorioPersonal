import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-directory-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/contacto', contact.id]"
       class="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all duration-200 group relative">
      @if (contact.favorito) {
        <div class="absolute top-2 right-2 z-10">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
      }
      <div class="p-4">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            @if (contact.foto_url) {
              <img [src]="contact.foto_url" [alt]="contact.nombre_completo"
                class="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-indigo-200 transition"
                (error)="onImageError($event)" />
            } @else {
              <div class="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-gray-100">
                <span class="text-indigo-600 font-semibold text-lg">{{ getInitials() }}</span>
              </div>
            }
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition">
              {{ contact.nombre_completo }}
            </h3>
            @if (contact.programa) {
              <p class="text-xs text-gray-500 mt-0.5 truncate">{{ contact.programa }}</p>
            }
            <div class="flex items-center space-x-2 mt-1.5">
              @if (contact.rol) {
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {{ contact.rol }}
                </span>
              }
              @if (contact.ciudad) {
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  {{ contact.ciudad }}
                </span>
              }
            </div>
          </div>
        </div>
        @if (contact.tags && contact.tags.length > 0) {
          <div class="mt-3 flex flex-wrap gap-1">
            @for (tag of contact.tags.slice(0, 3); track tag) {
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {{ tag }}
              </span>
            }
            @if (contact.tags.length > 3) {
              <span class="text-xs text-gray-400">+{{ contact.tags.length - 3 }}</span>
            }
          </div>
        }
      </div>
    </a>
  `,
})
export class DirectoryCardComponent {
  @Input({ required: true }) contact!: Contact;

  getInitials(): string {
    const parts = this.contact.nombre_completo.split(' ').filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
