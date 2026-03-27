export interface Indicator {
  id: string;
  titulo: string;
  descripcion: string;
  iframeSrc: string;
  iframeHeight: number;
  tipo: "powerbi" | "tableau" | "placeholder";
  fuentes: string[];
  ultimaActualizacion: string;
  notasMetodologicas: string;
  unidad: string;
  codigo: string;
  objetivo: string;
  formula: string;
  formulaSimplificada: string | null;
  variables: string | null;
  frecuenciaMedicion: string;
  estado: string;
  lineaBase: string | null;
  dimension: string;
  fuenteAdministrativa: string;
  responsableCalculo: string;
  responsableVerificar: string;
  fechaCorte: string;
  instructivoCalculo: string;
}

export interface IndicatorCategory {
  id: string;
  label: string;
  icono: string;
  descripcion: string;
  indicadores: Indicator[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Dashboard {
  widgets: string[];
  refreshRate: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

export interface IndicatorFilterCriteria {
  category: string;
  year: number;
}

export interface SearchResult {
  results: any[];
  totalResults: number;
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
}

export interface DataAlert {
  threshold: number;
  message: string;
}

export interface CardProps {
  title: string;
  content: string;
}

export interface ModalProps {
  title: string;
  isOpen: boolean;
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface AppState {
  user: User;
  loading: LoadingState;
  notifications: Notification[];
}
