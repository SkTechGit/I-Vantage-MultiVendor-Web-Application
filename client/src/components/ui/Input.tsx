import {
  forwardRef,
  InputHTMLAttributes,
} from "react";
import clsx from "clsx";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="min-w-0 w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1.5 block text-sm font-medium text-[#0A1F66]"
          >
            {label}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          {...props}
          className={clsx(
            // Base
            "w-full min-w-0 rounded-xl border bg-white",
            "border-gray-300 outline-none",
            "text-sm text-gray-900",
            "transition-all duration-200",

            // Responsive height
            "h-11 px-3.5",
            "sm:h-12 sm:px-4",

            // Placeholder
            "placeholder:text-gray-400",

            // Focus
            "focus:border-[#1E5BFF]",
            "focus:ring-4 focus:ring-blue-100",

            // Error
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-100",

            // Disabled
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",

            className
          )}
        />

        {/* Error */}
        {error && (
          <p className="mt-1.5 text-xs leading-4 text-red-500 sm:text-sm">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;