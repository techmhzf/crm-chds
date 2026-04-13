import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAlerts } from '../context/AlertContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { alertCount } = useAlerts();
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm transition-colors px-3 py-1.5 rounded-lg ${
        pathname === to
          ? 'text-white font-semibold bg-white/10'
          : 'text-[#888] hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">

        {/* Left — brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/CH Digital Solutions.svg" alt="CHDS Logo" className="w-8 h-8 rounded shrink-0 object-contain" />
            <div className="hidden sm:block">
              <p className="font-semibold text-white text-sm leading-tight">CH Digital Solutions</p>
              <p className="text-[#888] text-xs leading-tight">LinkedIn CRM</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1 ml-2">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/templates', 'Templates')}
          </div>
        </div>

        {/* Right — alerts + user */}
        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <div className="relative" title={`${alertCount} follow-up${alertCount !== 1 ? 's' : ''} needed`}>
              <Bell className="w-5 h-5 text-[#888]" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-4 py-2 text-sm transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
