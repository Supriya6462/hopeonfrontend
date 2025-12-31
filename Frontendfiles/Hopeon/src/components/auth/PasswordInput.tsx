import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePasswordToggle } from "@/hooks";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder?: string;
  name?: string;
}

/**
 * Reusable password input component with visibility toggle
 */
export const PasswordInput = ({
  value,
  onChange,
  onBlur,
  placeholder = "••••••••",
  name,
}: PasswordInputProps) => {
  const { isVisible, toggle, type } = usePasswordToggle();

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type={type}
        placeholder={placeholder}
        className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};
