interface FormInputProps {
  type?: "text" | "email";
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface FormTextareaProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

const inputClassName =
  "w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all duration-300";

export function FormInput({
  type = "text",
  id,
  name,
  label,
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        className={inputClassName}
        placeholder={placeholder}
      />
    </div>
  );
}

export function FormTextarea({
  id,
  name,
  label,
  placeholder,
  rows = 5,
  required = false,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        className={`${inputClassName} resize-none`}
        placeholder={placeholder}
      />
    </div>
  );
}
