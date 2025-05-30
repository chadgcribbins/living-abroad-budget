'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input, { InputProps } from './Input';

interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value?: number | string;
  onChange?: (value: number | null) => void;
  currencySymbol?: string;
  decimalPlaces?: number;
  allowNegative?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>((
  {
    value,
    onChange,
    currencySymbol = '€',
    decimalPlaces = 2,
    allowNegative = false,
    thousandSeparator = ',',
    decimalSeparator = '.',
    ...props
  },
  ref
) => {
  // Internal state for displayed value
  const [displayValue, setDisplayValue] = useState('');

  // Format a numeric value to string with proper formatting
  const formatValue = useCallback((value: number | string) => {
    if (value === undefined || value === null || value === '') {
      return '';
    }

    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Check if it's a valid number
    if (isNaN(numericValue)) {
      return '';
    }

    // Format the number with the specified decimal places
    const formattedValue = numericValue.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping: true,
    }).replace(/,/g, thousandSeparator).replace(/\./g, decimalSeparator);

    return formattedValue;
  }, [decimalPlaces, thousandSeparator, decimalSeparator]);

  // Parse a formatted string back to a numeric value
  const parseFormattedValue = (formattedValue: string): number | null => {
    if (!formattedValue) {
      return null;
    }

    // Remove currency symbol and non-numeric characters except decimal separator and minus sign
    const cleanValue = formattedValue
      .replace(new RegExp(`[^0-9\\${decimalSeparator}\\-]`, 'g'), '')
      .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.');

    // If it's an empty string or just a minus sign, return null
    if (cleanValue === '' || cleanValue === '-') {
      return null;
    }

    return parseFloat(cleanValue);
  };

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // If the input is empty, clear the value
    if (!inputValue) {
      setDisplayValue('');
      onChange?.(null);
      return;
    }

    // Check if input is valid
    // Allow: digits, decimal separator, minus sign (if allowNegative), thousand separator
    const validInputRegex = new RegExp(
      `^[0-9\\${thousandSeparator}\\${decimalSeparator}${allowNegative ? '\\-' : ''}]*$`
    );

    if (!validInputRegex.test(inputValue)) {
      return;
    }

    // Set the display value to what was typed
    setDisplayValue(inputValue);
    
    // Parse and send the numeric value to parent
    const numericValue = parseFormattedValue(inputValue);
    onChange?.(numericValue);
  };

  // Handle value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatValue(value));
    }
  }, [value, formatValue]);

  // Handle blur event to format the value properly
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numericValue = parseFormattedValue(displayValue);
    
    // Format the value properly on blur
    if (numericValue !== null) {
      setDisplayValue(formatValue(numericValue));
    } else {
      setDisplayValue('');
    }
    
    // Call the parent onBlur handler if provided
    props.onBlur?.(e);
  };

  return (
    <Input
      {...props}
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      leftAddon={currencySymbol}
      inputMode="decimal"
      ref={ref}
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput; 