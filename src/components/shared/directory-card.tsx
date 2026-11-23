import Link from "next/link";
import { SampleDataBadge } from "@/components/shared/sample-data-badge";

export function DirectoryCard({
  href,
  title,
  subtitle,
  description,
  stats,
  dataSource,
}: {
  href: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  stats: { label: string; value: string }[];
  dataSource: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border bg-card p-5 text-card-foreground transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
    >
      <h3 className="text-base font-semibold group-hover:text-primary">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
      {description ? (
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="font-medium">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex justify-end pt-4">
        <SampleDataBadge dataSource={dataSource} />
      </div>
    </Link>
  );
}