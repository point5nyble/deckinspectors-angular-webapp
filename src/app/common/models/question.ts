export interface Question {
    type: 'text' | 'radio' | 'checkbox' | 'dropdown';
    label: string;
    options?: string[];
  }
  