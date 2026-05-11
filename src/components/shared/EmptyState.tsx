interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export const EmptyState = ({ title, subtitle }: EmptyStateProps) => (
  <div className="rounded-xl2 border border-dashed border-stone-300 p-6 text-center text-stone-500 dark:border-stone-700 dark:text-stone-400">
    <p className="font-medium">{title}</p>
    <p className="mt-1 text-sm">{subtitle}</p>
  </div>
);
