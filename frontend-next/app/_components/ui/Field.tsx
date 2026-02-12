import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

export type FieldVariant = 'default' | 'invalid' | 'quiet';

const variantClasses: Record<FieldVariant, string> = {
  default: 'border-border bg-surface text-text placeholder:text-text-muted',
  invalid:
    'border-danger/70 bg-danger/5 text-text placeholder:text-danger/70 focus-visible:ring-danger/30',
  quiet: 'border-transparent bg-surface-2 text-text placeholder:text-text-muted',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function getFieldClassName(variant: FieldVariant = 'default', className?: string) {
  return cx(
    'h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    className,
  );
}

type FieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cx('grid gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-text">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}

export type FieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: FieldVariant;
};

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(function FieldInput(
  { variant = 'default', className, ...props },
  ref,
) {
  return <input ref={ref} className={getFieldClassName(variant, className)} {...props} />;
});

export type FieldSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: FieldVariant;
};

export const FieldSelect = forwardRef<HTMLSelectElement, FieldSelectProps>(function FieldSelect(
  { variant = 'default', className, children, ...props },
  ref,
) {
  return (
    <select ref={ref} className={getFieldClassName(variant, className)} {...props}>
      {children}
    </select>
  );
});

export type FieldTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: FieldVariant;
};

export const FieldTextarea = forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
  function FieldTextarea({ variant = 'default', className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cx(
          getFieldClassName(variant, className),
          'min-h-24 resize-y py-2 leading-relaxed',
          'h-auto',
        )}
        {...props}
      />
    );
  },
);

FieldInput.displayName = 'FieldInput';
FieldSelect.displayName = 'FieldSelect';
FieldTextarea.displayName = 'FieldTextarea';
