import { Heart } from "lucide-react";

interface AuthFormHeaderProps {
  title: string;
  subtitle: string;
  showMobileHeader?: boolean;
}

/**
 * Reusable header component for authentication forms
 */
export const AuthFormHeader = ({
  title,
  subtitle,
  showMobileHeader = true,
}: AuthFormHeaderProps) => {
  return (
    <>
      {/* Mobile Header */}
      {showMobileHeader && (
        <div className="lg:hidden text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">
              Fund-Raising
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      )}

      {/* Desktop Header */}
      <div className="text-center pb-6">
        <h2 className="text-2xl font-bold text-gray-900 lg:block">
          {title}
        </h2>
        <p className="text-gray-600 lg:block">{subtitle}</p>
      </div>
    </>
  );
};
