
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiMapPin,
  FiHeart,
  FiCreditCard,
  FiGift,
  FiUsers,
  FiRepeat,
  FiSettings,
  FiLogOut,
  FiAward,
  FiStar,
  FiEdit2,
   FiMessageSquare,
} from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const QUICK_LINKS = [
  { to: '/dashboard/orders', label: 'My Orders', icon: FiPackage },
  { to: '/dashboard/addresses', label: 'My Addresses', icon: FiMapPin },
  { to: '/wishlist', label: 'My Wishlist', icon: FiHeart },
  //{ to: '/dashboard/wallet', label: 'Wallet', icon: FiCreditCard },
  // { to: '/dashboard/rewards', label: 'Reward Points', icon: FiGift },
  //{ to: '/dashboard/referrals', label: 'Refer a Friend', icon: FiUsers },
  //{ to: '/dashboard/subscriptions', label: 'Subscriptions', icon: FiRepeat },
   { to: '/dashboard/testimonials', label: 'My Reviews', icon: FiMessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: FiSettings },
];

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U';

const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-12">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl bg-white shadow-soft"
      >
        {/* overflow-hidden lives ONLY on the banner now, so it can never clip
            the avatar below (which used to get sliced flat at this boundary) */}
        <div className="relative h-24 overflow-hidden rounded-t-2xl bg-gradient-to-br from-bamboo-700 to-bamboo-800 sm:h-28">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-white/10 blur-xl" />

          {/* <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            <FiAward size={12} />
            {user?.membership ?? 'Basic'}
          </span>  */}

          <Link
            to="/dashboard/settings"
            aria-label="Edit profile"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <FiEdit2 size={15} />
          </Link>
        </div>

        {/* relative + top padding so the absolutely-positioned avatar has
            reserved space, instead of relying on negative-margin flow */}
        <div className="relative px-6 pb-6 pt-14 sm:px-8 sm:pt-16">
          <div className="absolute -top-10 left-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-bamboo-100 font-display text-2xl font-bold text-bamboo-700 shadow-soft sm:-top-12 sm:left-8 sm:h-24 sm:w-24 sm:text-3xl">
            {getInitials(user?.firstName, user?.lastName)}
          </div>

          <h1 className="font-display text-2xl font-semibold text-bamboo-800">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-bamboo-500">{user?.email}</p>

          {/* Stat cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* <StatCard icon={FiStar} label="Reward Points" value={user?.rewardPoints ?? 0} accent="text-amber-600 bg-amber-50" /> */}
            {/* <StatCard
              icon={FiCreditCard}
              label="Wallet Balance"
              value={`₹${user?.walletBalance ?? 0}`}
              accent="text-emerald-600 bg-emerald-50"
            />
            <StatCard icon={FiAward} label="Membership" value={user?.membership ?? 'Basic'} accent="text-bamboo-700 bg-bamboo-50" /> */}
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="mt-8"
      >
        <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-bamboo-400">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white p-5 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_-6px_rgba(63,91,62,0.3)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bamboo-50 text-bamboo-700 transition-colors duration-200 group-hover:bg-bamboo-700 group-hover:text-white">
                <Icon size={19} />
              </span>
              <span className="text-xs font-medium text-bamboo-700 sm:text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <div className="mt-8 flex justify-center sm:justify-start">
        <Button
          variant="secondary"
          onClick={logout}
          className="!border-red-200 !text-red-600 hover:!bg-red-50"
        >
          <FiLogOut size={16} className="mr-1.5 inline-block" />
          Logout
        </Button>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-center gap-3 rounded-xl bg-sand-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${accent}`}>
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-bamboo-400">{label}</p>
      <p className="mt-0.5 truncate font-display text-lg font-semibold capitalize text-bamboo-800">{value}</p>
    </div>
  </div>
);

export default DashboardHome;