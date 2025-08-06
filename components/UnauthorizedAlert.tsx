"use client";

import { useState, useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface UnauthorizedAlertProps {
  userRole?: string;
}

export default function UnauthorizedAlert({ userRole = "user" }: UnauthorizedAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mb-4 max-w-md">
      <Alert className="border-orange-300 bg-orange-100 text-orange-800 p-3 text-sm flex items-center justify-between shadow-sm rounded-md">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <span>Access denied for <strong className="capitalize">{userRole}</strong></span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="p-1 h-auto text-orange-600 hover:bg-orange-200"
          title="Dismiss"
        >
          <X className="h-3 w-3" />
        </Button>
      </Alert>
    </div>
  );
}
