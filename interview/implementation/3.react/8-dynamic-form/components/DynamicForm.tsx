import React, { useState, useEffect } from 'react';
import { FormConfig, FormValues, FormErrors, FormField as FormFieldType } from './types';
import { FormField } from './FormFields';
import { validateForm, evaluateConditions } from './validation';

interface DynamicFormProps {
  config: FormConfig;
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitError?: string;
  submitSuccess?: string;
}

/**
 * Dynamic Form Component
 * 
 * Renders a form based on configuration
 * Handles form state, validation, and submission
 */
const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError,
  submitSuccess,
}) => {
  // Form state
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Initialize form values with default values from config
  useEffect(() => {
    const defaultValues: FormValues = {};
    
    // Extract default values from all fields in all sections
    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.defaultValue !== undefined && values[field.id] === undefined) {
          defaultValues[field.id] = field.defaultValue;
        }
      });
    });
    
    // Update form values with defaults
    if (Object.keys(defaultValues).length > 0) {
      setValues((prevValues) => ({
        ...defaultValues,
        ...prevValues,
      }));
    }
  }, [config]);

  // Get all fields from all sections
  const getAllFields = (): FormFieldType[] => {
    return config.sections.flatMap((section) => section.fields);
  };

  // Handle field change
  const handleChange = (id: string, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [id]: true,
    }));
    
    setIsDirty(true);
    
    // Clear error when field is changed
    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const allFields = getAllFields();
    const newErrors = validateForm(values, allFields);
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((field) => {
      newTouched[field.id] = true;
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  // Handle form reset
  const handleReset = () => {
    // Reset to initial values or empty object
    setValues(initialValues || {});
    setErrors({});
    setTouched({});
    setCurrentSection(0);
    setIsDirty(false);
  };

  // Check if a section should be shown based on its conditions
  const shouldShowSection = (sectionIndex: number) => {
    const section = config.sections[sectionIndex];
    return evaluateConditions(section.conditions, values);
  };

  // Navigate to the next section
  const goToNextSection = () => {
    // Validate current section fields
    const currentSectionFields = config.sections[currentSection].fields;
    const sectionErrors = validateForm(values, currentSectionFields);
    
    // Mark current section fields as touched
    const newTouched = { ...touched };
    currentSectionFields.forEach((field) => {
      newTouched[field.id] = true;
    });
    
    setTouched(newTouched);
    setErrors(sectionErrors);
    
    // If no errors in current section, go to next section
    if (Object.keys(sectionErrors).length === 0) {
      // Find next visible section
      let nextSection = currentSection + 1;
      while (
        nextSection < config.sections.length &&
        !shouldShowSection(nextSection)
      ) {
        nextSection++;
      }
      
      if (nextSection < config.sections.length) {
        setCurrentSection(nextSection);
      }
    }
  };

  // Navigate to the previous section
  const goToPrevSection = () => {
    // Find previous visible section
    let prevSection = currentSection - 1;
    while (prevSection >= 0 && !shouldShowSection(prevSection)) {
      prevSection--;
    }
    
    if (prevSection >= 0) {
      setCurrentSection(prevSection);
    }
  };

  // Get visible sections
  const visibleSections = config.sections.filter((_, index) => 
    shouldShowSection(index)
  );

  // Current visible section
  const currentVisibleSection = visibleSections[currentSection];
  
  // Check if we're on the last section
  const isLastSection = currentSection === visibleSections.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        {/* Form header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{config.title}</h2>
          {config.description && (
            <p className="mt-2 text-gray-600">{config.description}</p>
          )}
        </div>
        
        {/* Multi-step progress indicator */}
        {visibleSections.length > 1 && (
          <div className="mb-6">
            <div className="flex items-center">
              {visibleSections.map((section, index) => (
                <React.Fragment key={section.id}>
                  {/* Section indicator */}
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index <= currentSection
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Connector line */}
                  {index < visibleSections.length - 1 && (
                    <div 
                      className={`flex-1 h-1 mx-2 ${
                        index < currentSection
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Section title */}
            <div className="mt-2 text-lg font-medium">
              {currentVisibleSection.title}
            </div>
            
            {/* Section description */}
            {currentVisibleSection.description && (
              <div className="mt-1 text-gray-600">
                {currentVisibleSection.description}
              </div>
            )}
          </div>
        )}
        
        {/* Form fields */}
        <div className="space-y-4">
          {currentVisibleSection.fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={values[field.id]}
              onChange={handleChange}
              error={touched[field.id] ? errors[field.id] : undefined}
              formValues={values}
            />
          ))}
        </div>
        
        {/* Form actions */}
        <div className="mt-8 flex items-center justify-between">
          {/* Back button (for multi-step forms) */}
          {visibleSections.length > 1 && currentSection > 0 ? (
            <button
              type="button"
              onClick={goToPrevSection}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : (
            <div>
              {/* Cancel button */}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  {config.cancelButtonText || 'Cancel'}
                </button>
              )}
            </div>
          )}
          
          <div className="flex space-x-3">
            {/* Reset button */}
            {config.showResetButton && isDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                {config.resetButtonText || 'Reset'}
              </button>
            )}
            
            {/* Next/Submit button */}
            {isLastSection ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : config.submitButtonText || 'Submit'}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextSection}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Next
              </button>
            )}
          </div>
        </div>
        
        {/* Form status messages */}
        {submitError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}
        
        {submitSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {submitSuccess}
          </div>
        )}
      </form>
    </div>
  );
};

export default DynamicForm;
