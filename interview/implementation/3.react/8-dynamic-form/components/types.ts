/**
 * Types for the Dynamic Form System
 */

// Field types supported by the form
export type FieldType = 
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'custom';

// Validation rule types
export type ValidationRuleType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'url'
  | 'min'
  | 'max'
  | 'custom';

// Validation rule definition
export interface ValidationRule {
  type: ValidationRuleType;
  message: string;
  value?: any; // For rules that need a value (e.g., minLength: 5)
  validator?: (value: any, formValues: Record<string, any>) => boolean; // For custom validation
}

// Option for select, multiselect, radio, etc.
export interface FieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

// Condition for showing/hiding fields based on other field values
export interface FieldCondition {
  field: string; // Field name to check
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

// Form field configuration
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: ValidationRule[];
  disabled?: boolean;
  required?: boolean;
  conditions?: FieldCondition[]; // Show this field only if conditions are met
  className?: string;
  props?: Record<string, any>; // Additional props for the field component
}

// Form section configuration
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditions?: FieldCondition[]; // Show this section only if conditions are met
}

// Complete form configuration
export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  sections: FormSection[];
  submitButtonText?: string;
  cancelButtonText?: string;
  showResetButton?: boolean;
  resetButtonText?: string;
}

// Form values type
export type FormValues = Record<string, any>;

// Form errors type
export type FormErrors = Record<string, string | undefined>;
