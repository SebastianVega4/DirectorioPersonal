import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex justify-center items-center py-12">
      <div class="relative">
        <div class="w-10 h-10 border-4 border-indigo-200 rounded-full animate-spin"></div>
        <div class="w-10 h-10 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
      </div>
      @if (message) {
        <p class="ml-4 text-gray-500 text-sm">{{ message }}</p>
      }
    </div>
  `,
})
export class LoadingComponent {
  @Input() message = '';
}
