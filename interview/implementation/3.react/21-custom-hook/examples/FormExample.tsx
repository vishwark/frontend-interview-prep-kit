import React, { useCallback, useState } from 'react';
import { 
  Check, 
  X, 
  AlertCircle, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  CreditCard, 
  Save 
} from 'lucide-react';

// Define useForm hook types
interface UseFormParams<T> {
  initialValues: T;
  validate: (values: T) => Record<string, string>;
  validateOnChange?: boolean;
  onSubmit: (values: T) => void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (name: string, value: any) => void;
}

// Implement useForm hook
function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  validateOnChange = false,
  onSubmit
}: UseFormParams<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validate form values
  const validateForm = useCallback(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);
  
  // Handle field change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [name]: true }));
      setErrors(prev => {
        const newErrors = { ...prev };
        const fieldErrors = validate({ ...values, [name]: value });
        if (fieldErrors[name]) {
          newErrors[name] = fieldErrors[name];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  }, [values, validateOnChange, validate]);
  
  // Set field value programmatically
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [name]: true }));
      setErrors(prev => {
        const newErrors = { ...prev };
        const fieldErrors = validate({ ...values, [name]: value });
        if (fieldErrors[name]) {
          newErrors[name] = fieldErrors[name];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  }, [values, validateOnChange, validate]);
  
  // Handle field blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  }, [values, validate]);
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(touchedFields);
    
    // Validate form
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      onSubmit(values);
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  };
}

// Define form field types
interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  icon?: React.ReactNode;
  validate?: (value: string) => string | undefined;
}

// Define form values interface
interface FormValues {
  [key: string]: string;
}

const FormExample: React.FC = () => {
  // Example 1: Simple Login Form
  const loginForm = useForm<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: '',
      password: ''
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      return errors;
    },
    onSubmit: (values) => {
      alert(`Login form submitted with values: ${JSON.stringify(values, null, 2)}`);
    }
  });
  
  // Example 2: Registration Form with Field-Level Validation
  const registrationForm = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    birthdate: string;
    gender: string;
  }>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      birthdate: '',
      gender: ''
    },
    validateOnChange: true,
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (!values.firstName) errors.firstName = 'First name is required';
      if (!values.lastName) errors.lastName = 'Last name is required';
      
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
        errors.password = 'Password must contain uppercase, lowercase and numbers';
      }
      
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (values.phone && !/^\d{10}$/.test(values.phone)) {
        errors.phone = 'Phone must be 10 digits';
      }
      
      return errors;
    },
    onSubmit: (values) => {
      alert(`Registration form submitted with values: ${JSON.stringify(values, null, 2)}`);
    }
  });
  
  // Example 3: Dynamic Form with Custom Fields
  const paymentForm = useForm<{
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    saveCard: string;
  }>({
    initialValues: {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      saveCard: 'false'
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (!values.cardName) errors.cardName = 'Name on card is required';
      
      if (!values.cardNumber) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(values.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!values.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiryDate)) {
        errors.expiryDate = 'Expiry date must be in MM/YY format';
      }
      
      if (!values.cvv) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(values.cvv)) {
        errors.cvv = 'CVV must be 3 or 4 digits';
      }
      
      return errors;
    },
    onSubmit: (values) => {
      alert(`Payment form submitted with values: ${JSON.stringify(values, null, 2)}`);
    }
  });
  
  // Format credit card number with spaces
  const formatCreditCard = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Handle credit card input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCreditCard(e.target.value);
    paymentForm.setFieldValue('cardNumber', formatted);
  };
  
  // Define form fields for rendering
  const loginFields: FormField[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      icon: <Mail size={18} />
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      icon: <Lock size={18} />
    }
  ];
  
  const registrationFields: FormField[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
      icon: <User size={18} />
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      required: true,
      icon: <User size={18} />
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      icon: <Mail size={18} />
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      icon: <Lock size={18} />
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      icon: <Lock size={18} />
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter your phone number',
      icon: <Phone size={18} />
    },
    {
      name: 'birthdate',
      label: 'Date of Birth',
      type: 'date',
      icon: <Calendar size={18} />
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: '', label: 'Select gender' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
      ]
    }
  ];
  
  const paymentFields: FormField[] = [
    {
      name: 'cardName',
      label: 'Name on Card',
      type: 'text',
      placeholder: 'Enter name as shown on card',
      required: true,
      icon: <User size={18} />
    },
    {
      name: 'cardNumber',
      label: 'Card Number',
      type: 'text',
      placeholder: 'XXXX XXXX XXXX XXXX',
      required: true,
      maxLength: 19, // 16 digits + 3 spaces
      icon: <CreditCard size={18} />
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'text',
      placeholder: 'MM/YY',
      required: true,
      maxLength: 5,
      icon: <Calendar size={18} />
    },
    {
      name: 'cvv',
      label: 'CVV',
      type: 'text',
      placeholder: 'XXX',
      required: true,
      maxLength: 4,
      icon: <Lock size={18} />
    },
    {
      name: 'saveCard',
      label: 'Save card for future payments',
      type: 'checkbox'
    }
  ];
  
  // Render form field based on type
  const renderField = (field: FormField, formState: UseFormReturn<any>) => {
    const { values, errors, touched, handleChange, handleBlur } = formState;
    const hasError = touched[field.name] && errors[field.name];
    
    const baseInputClasses = `w-full rounded-md border ${
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    } shadow-sm`;
    
    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <select
                id={field.name}
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${baseInputClasses} pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-1`}
              >
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {field.icon && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  {field.icon}
                </div>
              )}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={field.name} className="mb-4">
            <div className="flex items-center">
              <input
                id={field.name}
                name={field.name}
                type="checkbox"
                checked={values[field.name] === 'true'}
                onChange={(e) => formState.setFieldValue(field.name, e.target.checked ? 'true' : 'false')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={field.name} className="ml-2 block text-sm text-gray-700">
                {field.label}
              </label>
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
        
      default:
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              {field.icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  {field.icon}
                </div>
              )}
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={field.name === 'cardNumber' ? handleCardNumberChange : handleChange}
                onBlur={handleBlur}
                className={`${baseInputClasses} ${field.icon ? 'pl-10' : 'pl-3'} py-2`}
                maxLength={field.maxLength}
                min={field.min}
                max={field.max}
                pattern={field.pattern}
              />
              {touched[field.name] && !errors[field.name] && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
                  <Check size={18} />
                </div>
              )}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" /> {errors[field.name]}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-gray-800">useForm Hook Examples</h2>
      
      {/* Example 1: Simple Login Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
          Example 1: Simple Login Form
        </h3>
        
        <form onSubmit={loginForm.handleSubmit} className="space-y-4">
          {loginFields.map(field => renderField(field, loginForm))}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loginForm.isSubmitting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loginForm.isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loginForm.isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This simple login form demonstrates basic form validation with <code className="bg-blue-100 px-1 rounded">useForm</code>.
            Try submitting the form without filling the fields to see validation in action.
          </p>
        </div>
      </div>
      
      {/* Example 2: Registration Form with Field-Level Validation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
          Example 2: Registration Form with Field-Level Validation
        </h3>
        
        <form onSubmit={registrationForm.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrationFields.map(field => (
              <div key={field.name} className={field.type === 'select' ? 'md:col-span-2' : ''}>
                {renderField(field, registrationForm)}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={registrationForm.isSubmitting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                registrationForm.isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {registrationForm.isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This registration form demonstrates field-level validation with <code className="bg-blue-100 px-1 rounded">useForm</code>.
            Validation occurs as you type, providing immediate feedback.
          </p>
        </div>
      </div>
      
      {/* Example 3: Payment Form with Custom Validation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
          Example 3: Payment Form with Custom Validation
        </h3>
        
        <form onSubmit={paymentForm.handleSubmit} className="space-y-4">
          {paymentFields.map(field => renderField(field, paymentForm))}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={paymentForm.isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium ${
                paymentForm.isSubmitting 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Save size={18} />
              {paymentForm.isSubmitting ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            This payment form demonstrates custom field formatting and validation with <code className="bg-blue-100 px-1 rounded">useForm</code>.
            The credit card number is automatically formatted as you type.
          </p>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// useForm hook implementation
function useForm({
  initialValues,
  validate,
  validateOnChange = false,
  onSubmit
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validate form values
  const validateForm = useCallback(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);
  
  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [name]: true }));
      validate({ ...values, [name]: value });
    }
  }, [values, validateOnChange, validate]);
  
  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [name]: true }));
      validate({ ...values, [name]: value });
    }
  }, [values, validateOnChange, validate]);
  
  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(values);
  }, [values, validate]);
  
  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);
    
    // Validate form
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      onSubmit(values);
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  };
}`}
        </pre>
      </div>
    </div>
  );
};

export default FormExample;
