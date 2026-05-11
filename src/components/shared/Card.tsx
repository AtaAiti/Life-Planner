import type { PropsWithChildren } from "react";
import clsx from "clsx";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card = ({ className, children }: CardProps) => (
  <section
    className={clsx(
      "rounded-xl2 border border-stone-200/70 bg-app-lightCard p-4 shadow-soft transition-all duration-280 dark:border-stone-700 dark:bg-app-darkCard",
      className
    )}
  >
    {children}
  </section>
);
