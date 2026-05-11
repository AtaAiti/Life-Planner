interface ProgressBarProps {
  value: number;
  colorClass?: string;
}

export const ProgressBar = ({ value, colorClass = "bg-app-lightAccent dark:bg-app-darkAccent" }: ProgressBarProps) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
    <div
      className={`h-full rounded-full transition-all duration-320 ${colorClass}`}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);
