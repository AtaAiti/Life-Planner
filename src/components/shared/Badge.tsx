import clsx from "clsx";

interface BadgeProps {
  text: string;
  className?: string;
}

export const Badge = ({ text, className }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-600 dark:bg-stone-700/70 dark:text-stone-200",
      className
    )}
  >
    {text}
  </span>
);
