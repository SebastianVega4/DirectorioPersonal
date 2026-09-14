import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-profile-map',
  standalone: true,
  template: `
    <div class="rounded-xl overflow-hidden border border-gray-200" style="height: 300px;">
      <div id="map" class="w-full h-full"></div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .leaflet-container { z-index: 1; }
  `]
})
export class ProfileMapComponent implements AfterViewInit, OnDestroy {
  @Input() latitud!: number;
  @Input() longitud!: number;
  @Input() nombre = '';

  private map: L.Map | null = null;

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    this.map = L.map('map', {
      center: [this.latitud, this.longitud],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.marker([this.latitud, this.longitud], { icon })
      .addTo(this.map)
      .bindPopup(`<strong>${this.nombre}</strong>`)
      .openPopup();

    setTimeout(() => this.map?.invalidateSize(), 200);
  }
}
