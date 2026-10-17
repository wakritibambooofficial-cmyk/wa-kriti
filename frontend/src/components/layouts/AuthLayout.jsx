import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sand-100 via-sand-200 to-bamboo-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft-lg sm:p-10"
      >
        <Link to="/" className="mb-6 block text-center">
          <span className="font-display text-2xl font-bold tracking-wide text-bamboo-700">WA-KRITI</span>
          <span className="mt-0.5 block text-[11px] uppercase tracking-[0.2em] text-earth-500">
            Premium Bamboo Living
          </span>
        </Link>
        <h1 className="text-center font-display text-2xl font-semibold text-bamboo-800">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-sm text-bamboo-500">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
