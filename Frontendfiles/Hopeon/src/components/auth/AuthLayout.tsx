import type { ReactNode } from "react";
import { Heart, CheckCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Reusable authentication layout component
 * Provides consistent hero section and form container for auth pages
 */
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-blue-600/90 to-indigo-600/90 z-10"></div>
        <img
          src="https://plus.unsplash.com/premium_photo-1683140538884-07fb31428ca6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Community coming together"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative z-20 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Join Our Community
            </Badge>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start Making a
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Real Difference
              </span>
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed mb-8">
              Join thousands of compassionate donors who are creating positive
              change in communities around the world.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: Heart, text: "Support causes you care about" },
              { icon: Users, text: "Connect with like-minded donors" },
              { icon: CheckCircle, text: "Track your impact in real-time" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-emerald-100"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <item.icon className="h-4 w-4" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
};
