import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, LayoutDashboard, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: "Landing", icon: Home, label: "Home" },
    { name: "Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { name: "Generator", icon: FileText, label: "Create Invoice" },
  ];

  if (currentPageName === "Landing" || currentPageName === "Generator") {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <nav className="bg-[#141d35] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to={createPageUrl("Landing")} className="text-white text-2xl font-bold">
                PayLance
              </Link>

              <div className="hidden md:flex items-center gap-4">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentPageName === item.name
                        ? "bg-[#4c6fff] text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
