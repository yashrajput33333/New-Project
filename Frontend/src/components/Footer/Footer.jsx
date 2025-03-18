import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Copyright */}
          <div>
            <Link to="/" className="inline-flex items-center space-x-2">
              <Logo width="120px" />
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              &copy; {new Date().getFullYear()} DevUI. All Rights Reserved.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Account
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>Made with ❤️ by DevUI Team</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
