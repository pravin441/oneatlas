import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SampleDataBadge({
  dataSource,
  className,
}: {
  dataSource: string;
  className?: string;
}) {
  if (dataSource !== "SAMPLE") return null;
  return (
    <Badge
      variant="warning"
      className={className}
      title="This data is generated for demo purposes and is not verified."
    >
      <FlaskConical className="mr-1 h-3 w-3" />
      Sample data
    </Badge>
  );
}