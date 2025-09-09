import { FormConfig } from './types';

/**
 * Mock API for form configuration
 * 
 * This simulates fetching form configuration from a backend API
 */

// Sample form configuration for a user registration form
const userRegistrationForm: FormConfig = {
  id: 'user-registration',
  title: 'User Registration',
  description: 'Please fill out the form to create your account',
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          validation: [
            { type: 'required', message: 'First name is required' },
            { type: 'minLength', value: 2, message: 'First name must be at least 2 characters' }
          ]
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          validation: [
            { type: 'required', message: 'Last name is required' },
            { type: 'minLength', value: 2, message: 'Last name must be at least 2 characters' }
          ]
        },
        {
          id: 'dateOfBirth',
          type: 'date',
          label: 'Date of Birth',
          validation: [
            { type: 'required', message: 'Date of birth is required' }
          ]
        },
        {
          id: 'gender',
          type: 'radio',
          label: 'Gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Non-binary', value: 'non-binary' },
            { label: 'Prefer not to say', value: 'not-specified' }
          ]
        }
      ]
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'How can we reach you?',
      fields: [
        {
          id: 'email',
          type: 'text',
          label: 'Email Address',
          placeholder: 'Enter your email',
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]
        },
        {
          id: 'phone',
          type: 'text',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          validation: [
            { type: 'pattern', value: '^[0-9]{10}$', message: 'Please enter a valid 10-digit phone number' }
          ]
        },
        {
          id: 'contactPreference',
          type: 'select',
          label: 'Preferred Contact Method',
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'Text Message', value: 'text' }
          ],
          defaultValue: 'email'
        }
      ]
    },
    {
      id: 'account-info',
      title: 'Account Information',
      description: 'Create your login credentials',
      fields: [
        {
          id: 'username',
          type: 'text',
          label: 'Username',
          placeholder: 'Choose a username',
          validation: [
            { type: 'required', message: 'Username is required' },
            { type: 'minLength', value: 4, message: 'Username must be at least 4 characters' },
            { type: 'pattern', value: '^[a-zA-Z0-9_]+$', message: 'Username can only contain letters, numbers, and underscores' }
          ]
        },
        {
          id: 'password',
          type: 'text',
          label: 'Password',
          placeholder: 'Create a password',
          props: { type: 'password' },
          validation: [
            { type: 'required', message: 'Password is required' },
            { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
            { 
              type: 'pattern', 
              value: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])',
              message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
            }
          ]
        },
        {
          id: 'confirmPassword',
          type: 'text',
          label: 'Confirm Password',
          placeholder: 'Confirm your password',
          props: { type: 'password' },
          validation: [
            { type: 'required', message: 'Please confirm your password' },
            { 
              type: 'custom', 
              message: 'Passwords do not match',
              validator: (value, formValues) => value === formValues.password
            }
          ]
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Tell us about your preferences',
      fields: [
        {
          id: 'interests',
          type: 'multiselect',
          label: 'Interests',
          options: [
            { label: 'Sports', value: 'sports' },
            { label: 'Music', value: 'music' },
            { label: 'Movies', value: 'movies' },
            { label: 'Reading', value: 'reading' },
            { label: 'Travel', value: 'travel' },
            { label: 'Cooking', value: 'cooking' },
            { label: 'Technology', value: 'technology' }
          ]
        },
        {
          id: 'newsletter',
          type: 'checkbox',
          label: 'Subscribe to newsletter',
          defaultValue: true
        },
        {
          id: 'marketingEmails',
          type: 'checkbox',
          label: 'Receive marketing emails',
          defaultValue: false,
          conditions: [
            { field: 'newsletter', operator: 'equals', value: true }
          ]
        },
        {
          id: 'bio',
          type: 'textarea',
          label: 'Short Bio',
          placeholder: 'Tell us about yourself (optional)',
          props: { rows: 4 }
        }
      ]
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Upload required documents',
      fields: [
        {
          id: 'profilePicture',
          type: 'file',
          label: 'Profile Picture',
          props: { accept: 'image/*' }
        },
        {
          id: 'termsAndConditions',
          type: 'checkbox',
          label: 'I agree to the terms and conditions',
          validation: [
            { type: 'required', message: 'You must agree to the terms and conditions' }
          ]
        }
      ]
    }
  ],
  submitButtonText: 'Create Account',
  cancelButtonText: 'Cancel',
  showResetButton: true,
  resetButtonText: 'Reset Form'
};

// Sample form configuration for a product feedback form
const productFeedbackForm: FormConfig = {
  id: 'product-feedback',
  title: 'Product Feedback',
  description: 'We value your feedback on our products',
  sections: [
    {
      id: 'product-info',
      title: 'Product Information',
      fields: [
        {
          id: 'productName',
          type: 'select',
          label: 'Product',
          options: [
            { label: 'Product A', value: 'product-a' },
            { label: 'Product B', value: 'product-b' },
            { label: 'Product C', value: 'product-c' }
          ],
          validation: [
            { type: 'required', message: 'Please select a product' }
          ]
        },
        {
          id: 'purchaseDate',
          type: 'date',
          label: 'Purchase Date',
          validation: [
            { type: 'required', message: 'Purchase date is required' }
          ]
        }
      ]
    },
    {
      id: 'feedback',
      title: 'Your Feedback',
      fields: [
        {
          id: 'rating',
          type: 'radio',
          label: 'How would you rate this product?',
          options: [
            { label: '1 - Poor', value: 1 },
            { label: '2 - Below Average', value: 2 },
            { label: '3 - Average', value: 3 },
            { label: '4 - Good', value: 4 },
            { label: '5 - Excellent', value: 5 }
          ],
          validation: [
            { type: 'required', message: 'Please provide a rating' }
          ]
        },
        {
          id: 'wouldRecommend',
          type: 'radio',
          label: 'Would you recommend this product to others?',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        {
          id: 'comments',
          type: 'textarea',
          label: 'Additional Comments',
          placeholder: 'Please share your thoughts about the product',
          props: { rows: 5 },
          validation: [
            { type: 'required', message: 'Please provide your feedback' },
            { type: 'minLength', value: 10, message: 'Please provide at least 10 characters of feedback' }
          ]
        }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Optional: Provide your contact information if you would like us to follow up',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          placeholder: 'Your name'
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'Your email address',
          validation: [
            { type: 'email', message: 'Please enter a valid email address' }
          ]
        },
        {
          id: 'contactMe',
          type: 'checkbox',
          label: 'I would like to be contacted about my feedback'
        }
      ]
    }
  ],
  submitButtonText: 'Submit Feedback',
  cancelButtonText: 'Cancel'
};

// Available form configurations
const formConfigs: Record<string, FormConfig> = {
  'user-registration': userRegistrationForm,
  'product-feedback': productFeedbackForm
};

/**
 * Fetch a form configuration by ID
 * @param formId The ID of the form to fetch
 * @returns Promise that resolves to the form configuration
 */
export const fetchFormConfig = (formId: string): Promise<FormConfig> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const config = formConfigs[formId];
      if (config) {
        resolve(config);
      } else {
        reject(new Error(`Form configuration with ID "${formId}" not found`));
      }
    }, 500);
  });
};

/**
 * Submit form data to the backend
 * @param formId The ID of the form being submitted
 * @param formData The form data to submit
 * @returns Promise that resolves when the submission is complete
 */
export const submitFormData = (formId: string, formData: Record<string, any>): Promise<{ success: boolean, message: string }> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      console.log(`Form ${formId} submitted with data:`, formData);
      resolve({
        success: true,
        message: 'Form submitted successfully!'
      });
    }, 1000);
  });
};

/**
 * Get a list of available form configurations
 * @returns Promise that resolves to an array of form IDs and titles
 */
export const getAvailableForms = (): Promise<Array<{ id: string, title: string }>> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(Object.entries(formConfigs).map(([id, config]) => ({
        id,
        title: config.title
      })));
    }, 300);
  });
};
