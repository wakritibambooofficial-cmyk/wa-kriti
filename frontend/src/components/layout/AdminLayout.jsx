// import { Outlet, NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {
//   FiGrid,
//   FiBox,
//   FiTag,
//   FiShoppingCart,
//   FiUsers,
//   FiStar,
//   FiPercent,
//   FiLayout,
//   FiFileText,
//   FiMail,
//   FiSettings,
//   FiLogOut,
//   FiArchive,
//   FiGift,
//   FiFeather,
//   FiRepeat,
//   FiClipboard,
//   FiDatabase,
//   FiLayers,
//   FiMessageSquare,
// } from 'react-icons/fi';
// import { useAuth } from '../../hooks/useAuth';

// const NAV_ITEMS = [
//   { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
//   { to: '/admin/products', label: 'Products', icon: FiBox },
//   { to: '/admin/categories', label: 'Categories', icon: FiTag },
//   { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
//   { to: '/admin/customers', label: 'Customers', icon: FiUsers },
//   { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
//   { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
//   { to: '/admin/coupons', label: 'Coupons', icon: FiPercent },
//   { to: '/admin/promotions', label: 'Promotions', icon: FiGift },
//   { to: '/admin/subscriptions', label: 'Subscriptions', icon: FiRepeat },
//   { to: '/admin/warehouses', label: 'Warehouses', icon: FiArchive },
//   { to: '/admin/content', label: 'Content', icon: FiFeather },
//   { to: '/admin/cms', label: 'CMS', icon: FiLayout },
//   { to: '/admin/blogs', label: 'Blog', icon: FiFileText },
//   { to: '/admin/contact-queries', label: 'Contact Queries', icon: FiMail },
//   { to: '/admin/audit-logs', label: 'Audit Logs', icon: FiClipboard },
//   { to: '/admin/backups', label: 'Backups', icon: FiDatabase },
//   { to: '/admin/settings', label: 'Settings', icon: FiSettings },
//   { to: '/admin/features', label: 'Features', icon: FiLayers },
// ];

// const AdminLayout = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { logout } = useAuth();

//   return (
//     <div className="flex min-h-screen bg-sand-100">
//       <aside className="hidden w-64 shrink-0 flex-col bg-bamboo-800 text-sand-100 md:flex">
//         <div className="px-6 py-6">
//           <span className="font-display text-lg font-bold text-white">WA-KRITI</span>
//           <p className="text-[10px] uppercase tracking-widest text-sand-400">Admin Panel</p>
//         </div>
//         <nav className="flex-1 space-y-0.5 px-3">
//           {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={end}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
//                   isActive ? 'bg-bamboo-600 text-white' : 'text-sand-300 hover:bg-bamboo-700 hover:text-white'
//                 }`
//               }
//             >
//               <Icon size={16} /> {label}
//             </NavLink>
//           ))}
//         </nav>
//         <div className="border-t border-bamboo-700 p-4">
//           <p className="truncate text-xs text-sand-400">{user?.email}</p>
//           <button onClick={logout} className="mt-2 flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200">
//             <FiLogOut size={14} /> Logout
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 overflow-x-hidden">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;



import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiGrid,
  FiBox,
  FiTag,
  FiShoppingCart,
  FiUsers,
  FiStar,
  FiPercent,
  FiLayout,
  FiFileText,
  FiMail,
  FiSettings,
  FiLogOut,
  FiArchive,
  FiGift,
  FiFeather,
  FiRepeat,
  FiClipboard,
  FiDatabase,
  FiLayers,
  FiMessageSquare,
  FiMenu,
  FiX,
   FiVideo,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
   { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { to: '/admin/coupons', label: 'Coupons', icon: FiPercent },
  { to: '/admin/promotions', label: 'Promotions', icon: FiGift },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: FiRepeat },
  { to: '/admin/warehouses', label: 'Warehouses', icon: FiArchive },
  { to: '/admin/content', label: 'Content', icon: FiFeather },
  { to: '/admin/cms', label: 'CMS', icon: FiLayout },
  { to: '/admin/blogs', label: 'Blog', icon: FiFileText },
  { to: '/admin/contact-queries', label: 'Contact Queries', icon: FiMail },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: FiClipboard },
  { to: '/admin/backups', label: 'Backups', icon: FiDatabase },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
  { to: '/admin/features', label: 'Features', icon: FiLayers },
  { to: '/admin/video-showcase', label: 'Video Showcase', icon: FiVideo },
  { to: '/admin/video', label: 'Video', icon: FiVideo },
  { to: '/admin/newsletter', label: 'Newsletter', icon: FiMail },
];

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = ({ onNavigate }) => (
    <>
      <div className="px-6 py-6">
        <span className="font-display text-lg font-bold text-white">WA-KRITI</span>
        <p className="text-[10px] uppercase tracking-widest text-sand-400">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-bamboo-600 text-white' : 'text-sand-300 hover:bg-bamboo-700 hover:text-white'
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-bamboo-700 p-4">
        <p className="truncate text-xs text-sand-400">{user?.email}</p>
        <button onClick={logout} className="mt-2 flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200">
          <FiLogOut size={14} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-sand-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-bamboo-800 text-sand-100 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Drawer panel */}
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-bamboo-800 text-sand-100 shadow-xl transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={closeMobile}
            className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-sand-300 hover:bg-bamboo-700 hover:text-white"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
          <SidebarContent onNavigate={closeMobile} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center gap-3 border-b border-sand-300 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-bamboo-700 hover:bg-sand-100"
            aria-label="Open menu"
          >
            <FiMenu size={20} />
          </button>
          <span className="font-display text-base font-bold text-bamboo-800">WA-KRITI</span>
          <span className="text-[10px] uppercase tracking-widest text-bamboo-400">Admin</span>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;