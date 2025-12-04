import Root from './Input.svelte';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps {
  type?: InputType;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autocomplete?: string;
  maxlength?: number;
  minlength?: number;
  pattern?: string;
  class?: string;
}

export {
  Root,
  //
  Root as Input,
};
