import React from 'react';
import { FormField as FormFieldType, FormValues, FieldOption } from './types';
import { evaluateConditions } from './validation';

/**
 * Form field components for different input types
 */

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (id: string, value: any) => void;
  error?: string;
  formValues: FormValues;
}

/**
 * Text Input Field Component
 */
const TextField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  const inputType = field.props?.type || 'text';
  
  return (
    <input
      id={field.id}
      type={inputType}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      placeholder={field.placeholder}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.className || ''}`}
      disabled={field.disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.id}-error` : undefined}
      {...field.props}
    />
  );
};

/**
 * Textarea Field Component
 */
const TextareaField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <textarea
      id={field.id}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      placeholder={field.placeholder}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.className || ''}`}
      disabled={field.disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.id}-error` : undefined}
      rows={field.props?.rows || 3}
      {...field.props}
    />
  );
};

/**
 * Select Field Component
 */
const SelectField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <select
      id={field.id}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.className || ''}`}
      disabled={field.disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.id}-error` : undefined}
      {...field.props}
    >
      <option value="">{field.placeholder || 'Select an option'}</option>
      {field.options?.map((option) => (
        <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

/**
 * Multi-select Field Component
 */
const MultiSelectField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((option) => option.value);
    onChange(field.id, values);
  };

  return (
    <select
      id={field.id}
      multiple
      value={selectedValues}
      onChange={handleChange}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.className || ''}`}
      disabled={field.disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.id}-error` : undefined}
      size={field.props?.size || 4}
      {...field.props}
    >
      {field.options?.map((option) => (
        <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

/**
 * Checkbox Field Component
 */
const CheckboxField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="flex items-center">
      <input
        id={field.id}
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(field.id, e.target.checked)}
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${field.className || ''}`}
        disabled={field.disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
        {...field.props}
      />
      <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
        {field.label}
      </label>
    </div>
  );
};

/**
 * Radio Field Component
 */
const RadioField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div className="space-y-2">
      {field.options?.map((option) => (
        <div key={String(option.value)} className="flex items-center">
          <input
            id={`${field.id}-${option.value}`}
            type="radio"
            name={field.id}
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => onChange(field.id, option.value)}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${field.className || ''}`}
            disabled={field.disabled || option.disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
            {...field.props}
          />
          <label htmlFor={`${field.id}-${option.value}`} className="ml-2 text-sm text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

/**
 * Date Field Component
 */
const DateField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <input
      id={field.id}
      type="date"
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.className || ''}`}
      disabled={field.disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.id}-error` : undefined}
      {...field.props}
    />
  );
};

/**
 * File Field Component
 */
const FileField: React.FC<FormFieldProps> = ({ field, onChange, error }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(field.id, file);
    }
  };

  return (
    <input
      id={field.id}
      type="file"
      onChange={handleFileChange}
      className={`w-full px-3 py-2 border rounded-md ${
        error ? 'border-red-500' : 'border-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.className || ''}`}
      disabled={field.disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.id}-error` : undefined}
      {...field.props}
    />
  );
};

/**
 * Form Field Component
 * 
 * Renders the appropriate input component based on field type
 */
export const FormFieldComponent: React.FC<FormFieldProps> = (props) => {
  const { field, formValues } = props;
  
  // Check if field should be shown based on conditions
  const shouldShow = evaluateConditions(field.conditions, formValues);
  
  if (!shouldShow) {
    return null;
  }

  // Render field based on type
  switch (field.type) {
    case 'text':
      return <TextField {...props} />;
    
    case 'textarea':
      return <TextareaField {...props} />;
    
    case 'select':
      return <SelectField {...props} />;
    
    case 'multiselect':
      return <MultiSelectField {...props} />;
    
    case 'checkbox':
      return <CheckboxField {...props} />;
    
    case 'radio':
      return <RadioField {...props} />;
    
    case 'date':
      return <DateField {...props} />;
    
    case 'file':
      return <FileField {...props} />;
    
    case 'custom':
      // For custom fields, render a placeholder or custom component
      return <div>Custom field type not implemented</div>;
    
    default:
      return <div>Unknown field type: {field.type}</div>;
  }
};

/**
 * Form Field Container Component
 * 
 * Wraps a form field with label and error message
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  const { field, error, formValues } = props;
  
  // Check if field should be shown based on conditions
  const shouldShow = evaluateConditions(field.conditions, formValues);
  
  if (!shouldShow) {
    return null;
  }

  // For checkbox fields, the label is rendered with the input
  if (field.type === 'checkbox') {
    return (
      <div className="mb-4">
        <FormFieldComponent {...props} />
        {error && (
          <p id={`${field.id}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <FormFieldComponent {...props} />
      {error && (
        <p id={`${field.id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
