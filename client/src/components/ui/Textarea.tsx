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

const Textarea = forwardRef<
  HTMLTextAreaElement,
  Props
>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        {...props}
        className={clsx(
          "min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3",
          "focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100 outline-none",
          error && "border-red-500",
          className
        )}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;