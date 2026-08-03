import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { navLinks } from "../../config/navigation";
import NotificationBell from "./NotificationBell";
import Button from "../ui/Button";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">

        {/* Brand + Profile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">

            <Link
              to="/dashboard"
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              AI Career Tracker
            </Link>

            <div className="flex items-center gap-4">

              <NotificationBell />

              <div className="hidden md:flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4">

                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center font-semibold text-indigo-700 dark:text-indigo-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Hi, {user?.name}
                </span>

                <Button
                  variant="ghost"
                  onClick={logout}
                  className="!px-2"
                >
                  <LogOut size={18} />
                </Button>

              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:block border-t border-gray-200 dark:border-gray-800">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-2">

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}

            {user?.role === "admin" && (
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                      : "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                  }`
                }
              >
                Admin
              </NavLink>
            )}

          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-4">

            <div className="space-y-2">

              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user?.role === "admin" && (
                <NavLink
                  to="/admin/users"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-purple-600"
                >
                  Admin
                </NavLink>
              )}

            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center font-semibold text-indigo-700 dark:text-indigo-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Hi, {user?.name}
                </span>

              </div>

              <Button variant="ghost" onClick={logout}>
                <LogOut size={18} />
              </Button>

            </div>

          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;