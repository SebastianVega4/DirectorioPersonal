import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p class="text-sm text-gray-500">Directorio de Contactos</p>
          <p class="text-sm text-gray-400">sebastianvega.site</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
