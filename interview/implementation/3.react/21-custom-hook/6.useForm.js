// useForm hook
// Form state management
//
// Use cases:
// 1. User registration and login forms
// 2. Multi-step form wizards with validation
// 3. Dynamic forms with conditional fields
// 4. Search forms with complex filtering options
// 5. Data collection forms with real-time validation
// 6. Form state persistence across page navigation

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for form state management
 * 
 * @template T
 * @param {Object} options - Configuration options
 * @param {T} [options.initialValues={}] - Initial form values
 * @param {Object} [options.validationSchema] - Validation schema for form fields
 * @param {function} [options.onSubmit] - Form submission handler
 * @param {boolean} [options.validateOnChange=true] - Whether to validate on field change
 * @param {boolean} [options.validateOnBlur=true] - Whether to validate on field blur
 * @param {boolean} [options.validateOnSubmit=true] - Whether to validate on form submission
 * @returns {Object} - Form state and handlers
 */
function useForm(options = {}) {
  const {
    initialValues = {},
    validationSchema = {},
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true
  } = options;

  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Refs for callbacks and state tracking
  const onSubmitRef = useRef(onSubmit);
  const initialValuesRef = useRef(initialValues);
  const formStateRef = useRef({
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty
  });

  // Update refs when props change
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // Update form state ref when state changes
  useEffect(() => {
    formStateRef.current = {
      values,
      errors,
      touched,
      isSubmitting,
      isValid,
      isDirty
    };
  }, [values, errors, touched, isSubmitting, isValid, isDirty]);

  // Check if form is dirty (values have changed from initial values)
  useEffect(() => {
    const checkDirty = () => {
      const initialVals = initialValuesRef.current;
      const currentVals = values;
      
      // Check if any value has changed from initial value
      for (const key in currentVals) {
        if (currentVals[key] !== initialVals[key]) {
          return true;
        }
      }
      
      // Check if any new fields have been added
      for (const key in initialVals) {
        if (!(key in currentVals)) {
          return true;
        }
      }
      
      return false;
    };
    
    setIsDirty(checkDirty());
  }, [values]);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    if (!validationSchema || !validationSchema[name]) {
      return '';
    }
    
    const fieldSchema = validationSchema[name];
    let error = '';
    
    // Run through validation rules
    if (typeof fieldSchema === 'function') {
      // If schema is a function, call it with the value and all values
      error = fieldSchema(value, values);
    } else if (typeof fieldSchema === 'object') {
      // If schema is an object with validation rules
      if (fieldSchema.required && (!value || (Array.isArray(value) && value.length === 0))) {
        return fieldSchema.required === true ? `${name} is required` : fieldSchema.required;
      }
      
      if (fieldSchema.min && value && value.length < fieldSchema.min) {
        return `${name} must be at least ${fieldSchema.min} characters`;
      }
      
      if (fieldSchema.max && value && value.length > fieldSchema.max) {
        return `${name} must be at most ${fieldSchema.max} characters`;
      }
      
      if (fieldSchema.pattern && value && !fieldSchema.pattern.test(value)) {
        return fieldSchema.message || `${name} is invalid`;
      }
      
      if (fieldSchema.validate && typeof fieldSchema.validate === 'function') {
        error = fieldSchema.validate(value, values);
      }
    }
    
    return error;
  }, [validationSchema, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isFormValid = true;
    
    // Validate each field
    for (const name in values) {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isFormValid = false;
      }
    }
    
    // Check for required fields that are not in values
    if (validationSchema) {
      for (const name in validationSchema) {
        if (!(name in values) && validationSchema[name].required) {
          newErrors[name] = validationSchema[name].required === true 
            ? `${name} is required` 
            : validationSchema[name].required;
          isFormValid = false;
        }
      }
    }
    
    setErrors(newErrors);
    setIsValid(isFormValid);
    
    return { isValid: isFormValid, errors: newErrors };
  }, [validateField, values, validationSchema]);

  // Handle field change
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue
    }));
    
    // Validate on change if enabled
    if (validateOnChange) {
      const error = validateField(name, fieldValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
      
      // Update isValid state
      const hasError = Object.values({ ...errors, [name]: error }).some(Boolean);
      setIsValid(!hasError);
    }
  }, [validateOnChange, validateField, errors]);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate on blur if enabled
    if (validateOnBlur) {
      const error = validateField(name, values[name]);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
      
      // Update isValid state
      const hasError = Object.values({ ...errors, [name]: error }).some(Boolean);
      setIsValid(!hasError);
    }
  }, [validateOnBlur, validateField, values, errors]);

  // Set a field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
    
    // Validate if needed
    if (validateOnChange) {
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
      
      // Update isValid state
      const hasError = Object.values({ ...errors, [name]: error }).some(Boolean);
      setIsValid(!hasError);
    }
  }, [validateOnChange, validateField, errors]);

  // Set a field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
    
    // Update isValid state
    const hasError = Object.values({ ...errors, [name]: error }).some(Boolean);
    setIsValid(!hasError);
  }, [errors]);

  // Set a field touched state programmatically
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: isTouched
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((event) => {
    if (event) {
      event.preventDefault();
    }
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate form if needed
    let formIsValid = isValid;
    if (validateOnSubmit) {
      const validationResult = validateForm();
      formIsValid = validationResult.isValid;
    }
    
    // Submit if valid
    if (formIsValid && onSubmitRef.current) {
      setIsSubmitting(true);
      
      Promise.resolve(onSubmitRef.current(values, formStateRef.current))
        .finally(() => {
          if (formStateRef.current.isSubmitting) {
            setIsSubmitting(false);
          }
        });
    }
  }, [validateOnSubmit, validateForm, values, isValid]);

  // Reset form to initial values
  const resetForm = useCallback((newInitialValues = initialValuesRef.current) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
    setIsDirty(false);
    initialValuesRef.current = newInitialValues;
  }, []);

  // Get field props for a form field
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined
    };
  }, [values, handleChange, handleBlur, errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateForm,
    validateField,
    getFieldProps
  };
}

export default useForm;
