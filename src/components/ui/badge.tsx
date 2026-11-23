import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "outline" | "warning";

const variants: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-accent text-accent-foreground",
  outline: "border border-border text-muted-foreground",
  warning: "bg-warning/15 text-warning",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"span"> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}