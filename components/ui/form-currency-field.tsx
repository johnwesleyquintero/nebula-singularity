"use client";

import { formatCurrency } from "@/lib/utils";
import * as React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";
import { Input } from "./input";

interface FormCurrencyFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  currency?: string;
  error?: string;
}

const FormCurrencyField = React.forwardRef<
  HTMLInputElement,
  FormCurrencyFieldProps
>(({ label, currency = "USD", className, error, ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useFormField();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      const event = {
        ...e,
        target: {
          ...e.target,
          value,
        },
      };
      props.onChange?.(event);
    }
  };

  const formatValue = (value: string) => {
    if (!value) return "";
    const numValue = parseFloat(value);
    return isNaN(numValue) ? "" : formatCurrency(numValue, currency);
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
            aria-describedby={
              !error
                ? `${formDescriptionId}`
                : `${formDescriptionId} ${formMessageId}`
            }
            onChange={handleChange}
            className="pl-8"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            {currency === "USD" ? "$" : currency}
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

FormCurrencyField.displayName = "FormCurrencyField";

export { FormCurrencyField };
