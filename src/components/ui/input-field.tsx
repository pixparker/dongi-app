interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-text-muted mb-1.5 text-right">
          {label}
        </label>
      )}
      <div className="bg-input-bg border border-border rounded-xl px-3.5 py-3 flex items-center gap-2 direction-rtl">
        {icon && <span className="text-text-muted text-base">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent text-text-primary text-sm text-right outline-none placeholder:text-text-muted"
        />
      </div>
    </div>
  );
}
