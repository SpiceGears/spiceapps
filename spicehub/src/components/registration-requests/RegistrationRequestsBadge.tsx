"use client";

import { Badge } from "@/components/ui/badge";
import { usePendingRequestsCount } from "@/hooks/usePendingRegistrationRequestsCount";

export function RegistrationRequestsBadge() {
  const { count } = usePendingRequestsCount();

  if (count === 0) return null;

  return (
    <Badge variant="destructive" className="ml-auto">
      {count}
    </Badge>
  );
}
