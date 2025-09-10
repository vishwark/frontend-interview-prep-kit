// Define the structure for dropdown options
export interface DropdownOption {
  id: string | number;
  label: string;
  value: any;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

// Props for the Dropdown component
export interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[] | number | number[];
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiSelect?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  maxHeight?: number;
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  renderTrigger?: (selectedOptions: DropdownOption[], isOpen: boolean) => React.ReactNode;
}

// Type guard to check if value is an array
export function isValueArray(value: any): value is (string[] | number[]) {
  return Array.isArray(value);
}
