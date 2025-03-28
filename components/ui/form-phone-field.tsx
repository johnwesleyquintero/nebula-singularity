"use client";

import * as React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";
import { Input } from "./input";

interface FormPhoneFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  countryCode?: string;
  error?: string;
}

const FormPhoneField = React.forwardRef<HTMLInputElement, FormPhoneFieldProps>(
  ({ label, countryCode = "+1", className, error, ...props }, ref) => {
    const { formItemId, formDescriptionId, formMessageId } = useFormField();

    const formatPhoneNumber = (value: string) => {
      const numbers = value.replace(/[^\d]/g, "");
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d-]/g, "");
      const formattedValue = formatPhoneNumber(value);
      if (formattedValue.length <= 12) {
        const event = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        };
        props.onChange?.(event);
      }
    };

    return (
      <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <div className="relative">
            <Input
              {...props}
              ref={ref}
              id={formItemId}
              type="tel"
              placeholder="123-456-7890"
              aria-describedby={
                !error
                  ? `${formDescriptionId}`
                  : `${formDescriptionId} ${formMessageId}`
              }
              onChange={handleChange}
              className="pl-16"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              {countryCode}
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  },
);

FormPhoneField.displayName = "FormPhoneField";

export { FormPhoneField };
