import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ROUTES } from "@/routes/routes";

/**
 * Footer - Main footer component with links, contact info, and social media
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: ROUTES.HOME },
    { name: "Campaigns", path: ROUTES.CAMPAIGNS },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const supportLinks = [
    { name: "How It Works", path: "/how-it-works" },
    { name: "FAQs", path: "/faqs" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-emerald-500" />
              <span className="text-2xl font-bold text-white">HopeOn</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering communities through transparent and impactful fundraising. 
              Together, we can make a difference.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ name, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map(({ name, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Hope Street, Charity City, CC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-500 shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-500 shrink-0" />
                <a
                  href="mailto:support@hopeon.com"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  support@hopeon.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} HopeOn. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500" /> for a better world
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
