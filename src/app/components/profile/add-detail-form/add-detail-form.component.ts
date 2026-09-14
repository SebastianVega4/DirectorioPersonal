import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Detail } from '../../../models/contact.model';

@Component({
  selector: 'app-add-detail-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">Agregar un comentario o nota</h4>
      <div class="space-y-3">
        <input type="text" [(ngModel)]="autor" placeholder="Tu nombre"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
        <textarea [(ngModel)]="nota" placeholder="Escribe un dato, recuerdo o información sobre esta persona..." rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"></textarea>
        <div class="flex justify-end">
          <button (click)="submit()" [disabled]="!autor.trim() || !nota.trim() || submitting"
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {{ submitting ? 'Guardando...' : 'Agregar nota' }}
          </button>
        </div>
        @if (success) {
          <p class="text-sm text-green-600">Nota agregada correctamente</p>
        }
      </div>
    </div>
  `,
})
export class AddDetailFormComponent {
  @Input() contactId = '';
  @Output() detailAdded = new EventEmitter<Detail>();

  autor = '';
  nota = '';
  submitting = false;
  success = false;

  constructor() {}

  async submit() {
    if (!this.autor.trim() || !this.nota.trim()) return;

    this.submitting = true;
    const detail: Detail = {
      autor: this.autor.trim(),
      nota: this.nota.trim(),
      fecha: new Date().toISOString(),
    };

    this.detailAdded.emit(detail);
    this.nota = '';
    this.success = true;
    this.submitting = false;

    setTimeout(() => (this.success = false), 3000);
  }
}
