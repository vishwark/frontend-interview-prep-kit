import { ValidationRule, FormValues, FormErrors } from './types';

/**
 * Validation utility for form fields
 * 
 * Handles validating form values against validation rules
 */

/**
 * Validate a single field value against a validation rule
 * @param value The field value to validate
 * @param rule The validation rule to apply
 * @param formValues All form values (for cross-field validation)
 * @returns true if valid, false if invalid
 */
export const validateField = (value: any, rule: ValidationRule, formValues: FormValues): boolean => {
  // Skip validation if value is empty and not required
  if ((value === undefined || value === null || value === '') && rule.type !== 'required') {
    return true;
  }

  switch (rule.type) {
    case 'required':
      // Check if value exists and is not empty
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';

    case 'minLength':
      // Check if string length is at least the minimum
      return typeof value === 'string' && value.length >= rule.value;

    case 'maxLength':
      // Check if string length is at most the maximum
      return typeof value === 'string' && value.length <= rule.value;

    case 'pattern':
      // Check if string matches the pattern
      return typeof value === 'string' && new RegExp(rule.value).test(value);

    case 'email':
      // Simple email validation pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && emailPattern.test(value);

    case 'url':
      // Simple URL validation pattern
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      return typeof value === 'string' && urlPattern.test(value);

    case 'min':
      // Check if number is at least the minimum
      return typeof value === 'number' && value >= rule.value;

    case 'max':
      // Check if number is at most the maximum
      return typeof value === 'number' && value <= rule.value;

    case 'custom':
      // Use custom validator function
      return rule.validator ? rule.validator(value, formValues) : true;

    default:
      // Unknown rule type, consider it valid
      return true;
  }
};

/**
 * Validate all form values against validation rules
 * @param formValues The form values to validate
 * @param fields The form fields with validation rules
 * @returns Object with field IDs as keys and error messages as values
 */
export const validateForm = (
  formValues: FormValues,
  fields: Array<{ id: string; validation?: ValidationRule[] }>
): FormErrors => {
  const errors: FormErrors = {};

  // Validate each field
  fields.forEach((field) => {
    if (!field.validation || field.validation.length === 0) {
      return;
    }

    const value = formValues[field.id];

    // Check each validation rule for the field
    for (const rule of field.validation) {
      const isValid = validateField(value, rule, formValues);
      
      if (!isValid) {
        errors[field.id] = rule.message;
        break; // Stop at the first validation error
      }
    }
  });

  return errors;
};

/**
 * Check if a field should be shown based on its conditions
 * @param conditions The conditions to check
 * @param formValues The current form values
 * @returns true if the field should be shown, false otherwise
 */
export const evaluateConditions = (
  conditions: Array<{ field: string; operator: string; value: any }> | undefined,
  formValues: FormValues
): boolean => {
  // If no conditions, always show the field
  if (!conditions || conditions.length === 0) {
    return true;
  }

  // Check all conditions (AND logic)
  return conditions.every((condition) => {
    const fieldValue = formValues[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      
      case 'notEquals':
        return fieldValue !== condition.value;
      
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(condition.value);
        }
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(String(condition.value));
        }
        return false;
      
      case 'greaterThan':
        return fieldValue > condition.value;
      
      case 'lessThan':
        return fieldValue < condition.value;
      
      default:
        return true;
    }
  });
};
