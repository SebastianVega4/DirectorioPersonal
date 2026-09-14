import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, Subscription, switchMap, of } from 'rxjs';
import { ContactFilters } from '../../../models/contact.model';
import { ContactService } from '../../../services/contact.service';

@Component({
  selector: 'app-directory-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
          <input type="text" [(ngModel)]="filters.search" (ngModelChange)="onSearchChange()"
            placeholder="Nombre, cédula, teléfono, email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
        </div>
        <div class="relative">
          <label class="block text-xs font-medium text-gray-500 mb-1">Programa</label>
          <input type="text" [(ngModel)]="programaInput" (ngModelChange)="onProgramaChange()" (focus)="showProgramas = true" (blur)="hideProgramas('programa')"
            placeholder="Escribir para buscar..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
          @if (showProgramas && programas.length > 0) {
            <div class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (p of programas; track p) {
                <button type="button" (mousedown)="selectPrograma(p)"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 transition">
                  {{ p }}
                </button>
              }
            </div>
          }
        </div>
        <div class="relative">
          <label class="block text-xs font-medium text-gray-500 mb-1">Rol</label>
          <input type="text" [(ngModel)]="rolInput" (ngModelChange)="onRolChange()" (focus)="showRoles = true" (blur)="hideRoles('rol')"
            placeholder="Escribir para buscar..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
          @if (showRoles && roles.length > 0) {
            <div class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (r of roles; track r) {
                <button type="button" (mousedown)="selectRol(r)"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 transition">
                  {{ r }}
                </button>
              }
            </div>
          }
        </div>
        <div class="relative">
          <label class="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
          <input type="text" [(ngModel)]="ciudadInput" (ngModelChange)="onCiudadChange()" (focus)="showCiudades = true" (blur)="hideCiudades('ciudad')"
            placeholder="Escribir para buscar..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
          @if (showCiudades && ciudades.length > 0) {
            <div class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (c of ciudades; track c) {
                <button type="button" (mousedown)="selectCiudad(c)"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 transition">
                  {{ c }}
                </button>
              }
            </div>
          }
        </div>
      </div>
      <div class="mt-3 flex justify-end">
        <button (click)="clearFilters()"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
          Limpiar filtros
        </button>
      </div>
    </div>
  `,
})
export class DirectoryFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<ContactFilters>();

  filters: ContactFilters = {};
  programaInput = '';
  rolInput = '';
  ciudadInput = '';

  programas: string[] = [];
  roles: string[] = [];
  ciudades: string[] = [];

  showProgramas = false;
  showRoles = false;
  showCiudades = false;

  private search$ = new Subject<string>();
  private sub?: Subscription;
  private initialized = false;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.sub = this.search$
      .pipe(debounceTime(300))
      .subscribe(term => this.doSearch(term));
    setTimeout(() => { this.initialized = true; }, 0);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSearchChange() {
    if (!this.initialized) return;
    this.emitFilters();
  }

  onProgramaChange() {
    this.filters.programa = this.programaInput || undefined;
    this.showProgramas = true;
    this.search$.next('programa:' + this.programaInput);
  }

  onRolChange() {
    this.filters.rol = this.rolInput || undefined;
    this.showRoles = true;
    this.search$.next('rol:' + this.rolInput);
  }

  onCiudadChange() {
    this.filters.ciudad = this.ciudadInput || undefined;
    this.showCiudades = true;
    this.search$.next('ciudad:' + this.ciudadInput);
  }

  async doSearch(term: string) {
    const [column, value] = term.split(':');
    if (!value || value.length < 1) {
      if (column === 'programa') this.programas = [];
      if (column === 'rol') this.roles = [];
      if (column === 'ciudad') this.ciudades = [];
      return;
    }

    const results = await this.contactService.searchSuggestions(column, value);
    if (column === 'programa') this.programas = results;
    if (column === 'rol') this.roles = results;
    if (column === 'ciudad') this.ciudades = results;
  }

  selectPrograma(val: string) {
    this.programaInput = val;
    this.filters.programa = val;
    this.showProgramas = false;
    this.emitFilters();
  }

  selectRol(val: string) {
    this.rolInput = val;
    this.filters.rol = val;
    this.showRoles = false;
    this.emitFilters();
  }

  selectCiudad(val: string) {
    this.ciudadInput = val;
    this.filters.ciudad = val;
    this.showCiudades = false;
    this.emitFilters();
  }

  hideProgramas(field: string) {
    setTimeout(() => { this.showProgramas = false; }, 150);
  }

  hideRoles(field: string) {
    setTimeout(() => { this.showRoles = false; }, 150);
  }

  hideCiudades(field: string) {
    setTimeout(() => { this.showCiudades = false; }, 150);
  }

  private emitFilters() {
    this.filtersChange.emit({ ...this.filters });
  }

  clearFilters() {
    this.filters = {};
    this.programaInput = '';
    this.rolInput = '';
    this.ciudadInput = '';
    this.emitFilters();
  }
}
