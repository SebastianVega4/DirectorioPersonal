export interface Contact {
  id: string;
  foto_url: string | null;
  nombre_completo: string;
  documento: string | null;
  codigo_universidad: string | null;
  programa: string | null;
  rol: string | null;
  correo_personal: string | null;
  correo_trabajo: string | null;
  telefono_celular: string | null;
  redes_sociales: SocialLinks;
  tags: string[];
  ciudad: string | null;
  latitud: number | null;
  longitud: number | null;
  fecha_nacimiento: string | null;
  detalles: Detail[];
  favorito: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  wa?: string;
  ig?: string;
  fb?: string;
}

export interface Detail {
  autor: string;
  nota: string;
  fecha: string;
}

export interface ContactFilters {
  search?: string;
  programa?: string;
  rol?: string;
  ciudad?: string;
}
