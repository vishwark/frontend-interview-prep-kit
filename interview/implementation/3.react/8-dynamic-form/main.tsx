import React, { useState, useEffect } from 'react';
import DynamicForm from './components/DynamicForm';
import { fetchFormConfig, submitFormData, getAvailableForms } from './components/mockApi';
import { FormConfig, FormValues } from './components/types';

/**
 * Dynamic Form Demo
 * 
 * Demonstrates a dynamic form system that renders based on configuration from a backend
 */
const DynamicFormDemo: React.FC = () => {
  // State for available forms
  const [availableForms, setAvailableForms] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  
  // State for form configuration and data
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);

  // Fetch available forms on component mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getAvailableForms();
        setAvailableForms(forms);
        
        // Auto-select the first form if available
        if (forms.length > 0 && !selectedFormId) {
          setSelectedFormId(forms[0].id);
        }
      } catch (err) {
        setError('Failed to fetch available forms');
        console.error(err);
      }
    };
    
    fetchForms();
  }, []);

  // Fetch form configuration when selected form changes
  useEffect(() => {
    if (!selectedFormId) return;
    
    const loadFormConfig = async () => {
      setIsLoading(true);
      setError(null);
      setFormConfig(null);
      setSubmittedValues(null);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      try {
        const config = await fetchFormConfig(selectedFormId);
        setFormConfig(config);
      } catch (err) {
        setError(`Failed to load form configuration: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormConfig();
  }, [selectedFormId]);

  // Handle form selection change
  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    if (!selectedFormId) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    try {
      const result = await submitFormData(selectedFormId, values);
      setSubmitSuccess(result.message);
      setSubmittedValues(values);
    } catch (err) {
      setSubmitError(`Failed to submit form: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dynamic Form System</h1>
      
      {/* Form selector */}
      <div className="mb-8">
        <label htmlFor="form-selector" className="block text-sm font-medium text-gray-700 mb-1">
          Select a form:
        </label>
        <select
          id="form-selector"
          value={selectedFormId}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="" disabled>
            Select a form
          </option>
          {availableForms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.title}
            </option>
          ))}
        </select>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-6">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Dynamic form */}
      {formConfig && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <DynamicForm
            config={formConfig}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError || undefined}
            submitSuccess={submitSuccess || undefined}
          />
        </div>
      )}
      
      {/* Submitted values */}
      {submittedValues && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Submitted Values:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(submittedValues, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DynamicFormDemo;
