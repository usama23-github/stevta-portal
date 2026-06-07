import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";

interface DateFormatProps {
  value: string;
  className?: string;
}

export const DateFormat = ({ value, className }: DateFormatProps) => {
  const today = new Date();
  const endDate = value === null ? null : new Date(value);
  const diffInDays =
    endDate === null ? null : differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  if (diffInDays !== null) {
    if (diffInDays <= 3) {
      textColor = "text-red-500";
    } else if (diffInDays <= 7) {
      textColor = "text-orange-500";
    } else if (diffInDays <= 14) {
      textColor = "text-yellow-500";
    }
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>
        {value !== null && format(value, "PPP")}
      </span>
    </div>
  );
};
