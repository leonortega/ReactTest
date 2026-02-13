import type { HTMLAttributes } from 'react';

export type CardVariant = 'panel' | 'elevated' | 'metric' | 'form';
export type CardElement = 'div' | 'section' | 'article' | 'nav' | 'li';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardElement;
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  panel: 'rounded-lg border border-border bg-surface p-6 shadow-1',
  elevated: 'rounded-lg border border-border bg-surface p-6 shadow-2',
  metric: 'rounded-md border border-border bg-surface-2 p-4',
  form: 'rounded-lg border border-border bg-surface p-6 shadow-1',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Card({
  as = 'section',
  variant = 'panel',
  className,
  ...props
}: CardProps) {
  const Component = as;
  return <Component className={cx(variantClasses[variant], className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx('text-lg font-semibold text-text', className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('text-sm text-text-muted', className)} {...props} />;
}
