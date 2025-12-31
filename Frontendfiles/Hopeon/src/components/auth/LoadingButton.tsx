import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  loading: boolean;
  loadingText?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable button component with loading state
 */
export const LoadingButton = ({
  loading,
  loadingText = "Loading...",
  children,
  type = "submit",
  disabled = false,
  className = "",
}: LoadingButtonProps) => {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      className={`w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};
