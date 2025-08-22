import { ButtonHTMLAttributes } from 'react';

export default function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2 disabled:opacity-50 ${className}`}
    />
  );
}