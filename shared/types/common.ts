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

