import {
  forwardRef,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

interface Props
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full min-w-0">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1.5 block text-sm font-medium text-[#0A1F66]"
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          {...props}
          className={clsx(
            // Base
            "block w-full min-w-0 rounded-xl border bg-white",
            "border-gray-300 outline-none",
            "text-sm leading-6 text-gray-900",
            "transition-all duration-200",

            // Responsive height
            "min-h-28 px-3.5 py-3",
            "sm:min-h-32 sm:px-4 sm:py-3",

            // Placeholder
            "placeholder:text-gray-400",

            // Resize
            "resize-y",

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

Textarea.displayName = "Textarea";

export default Textarea;