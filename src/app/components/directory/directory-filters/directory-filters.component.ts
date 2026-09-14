import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, Subscription } from 'rxjs';
import { ContactFilters } from '../../../models/contact.model';
import { ContactService } from '../../../services/contact.service';

@Component({
  selector: 'app-directory-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
          <input type="text" [(ngModel)]="filters.nombre" (ngModelChange)="onNameChange()"
            placeholder="Buscar por nombre..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Programa</label>
          <select [(ngModel)]="filters.programa" (ngModelChange)="onFilter()"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white">
            <option value="">Todos</option>
            @for (p of programs; track p) {
              <option [value]="p">{{ p }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Rol</label>
          <select [(ngModel)]="filters.rol" (ngModelChange)="onFilter()"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white">
            <option value="">Todos</option>
            @for (r of roles; track r) {
              <option [value]="r">{{ r }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
          <select [(ngModel)]="filters.ciudad" (ngModelChange)="onFilter()"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white">
            <option value="">Todas</option>
            @for (c of ciudades; track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Tag</label>
          <select [(ngModel)]="filters.tags" (ngModelChange)="onFilter()"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white">
            <option value="">Todos</option>
            @for (t of tags; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
        <div class="flex items-end">
          <button (click)="clearFilters()"
            class="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DirectoryFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<ContactFilters>();

  filters: ContactFilters = {};
  programs: string[] = [];
  roles: string[] = [];
  ciudades: string[] = [];
  tags: string[] = [];

  private nameSearch$ = new Subject<string>();
  private sub?: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.sub = this.nameSearch$
      .pipe(debounceTime(400))
      .subscribe(() => this.emitFilters());

    this.loadFilterOptions();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private async loadFilterOptions() {
    const [programs, roles, ciudades, tags] = await Promise.all([
      this.contactService.getUniquePrograms(),
      this.contactService.getUniqueRoles(),
      this.contactService.getUniqueCiudades(),
      this.contactService.getAllTags(),
    ]);
    this.programs = programs.slice(0, 200);
    this.roles = roles;
    this.ciudades = ciudades.slice(0, 100);
    this.tags = tags.slice(0, 100);
  }

  onNameChange() {
    this.nameSearch$.next(this.filters.nombre || '');
  }

  onFilter() {
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChange.emit({ ...this.filters });
  }

  clearFilters() {
    this.filters = {};
    this.emitFilters();
  }
}
