import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  FiPackage, FiGift, FiTruck, FiShield, FiUsers, FiStar,
  FiCheckCircle, FiFeather, FiHeart, FiArrowRight,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';



import { productApi, categoryApi } from '../../services/productApi';
import { contactApi } from '../../services/cmsApi';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/product/ProductCardSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const STATS = [
  { icon: FiUsers, value: '12,000+', label: 'Happy customers' },
  { icon: FiGift, value: '250+', label: 'Curated gift sets' },
  { icon: FiFeather, value: '100%', label: 'Handcrafted, sustainable' },
  { icon: FiStar, value: '4.8/5', label: 'Average rating' },
];

const OCCASIONS = [
  {
    label: 'Diwali & Festivals',
    tagline: 'Warm, celebratory hampers',
    gradient: 'from-amber-500 via-earth-500 to-bamboo-700',
  },
  {
    label: 'Corporate Gifting',
    tagline: 'Bulk orders, custom branding',
    gradient: 'from-bamboo-700 via-bamboo-600 to-bamboo-800',
  },
  {
    label: 'Weddings',
    tagline: 'Elegant favors for guests',
    gradient: 'from-pink-500 via-earth-500 to-bamboo-700',
  },
  {
    label: 'Housewarming',
    tagline: 'Practical, everyday bamboo',
    gradient: 'from-bamboo-600 via-earth-600 to-earth-700',
  },
];

const FEATURES = [
  {
    icon: FiFeather,
    title: 'Sustainably sourced',
    description: 'Every piece is made from responsibly harvested bamboo, grown without pesticides.',
  },
  {
    icon: FiUsers,
    title: 'Artisan handcrafted',
    description: 'Made by skilled craftspeople in Tripura, preserving traditional techniques.',
  },
  {
    icon: FiTruck,
    title: 'Reliable delivery',
    description: 'Careful packaging and tracked shipping, timed right for your celebration.',
  },
  {
    icon: FiShield,
    title: 'Quality assured',
    description: 'Every product is checked by hand before it leaves our workshop.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ananya R.',
    role: 'Corporate gifting, Bengaluru',
    quote: 'Ordered 150 hampers for our team — every single one arrived beautifully packed and on time.',
  },
  {
    name: 'Vikram S.',
    role: 'Wedding favors, Jaipur',
    quote: 'Our guests kept asking where the bamboo tea sets were from. Genuinely elegant, thoughtful gifting.',
  },
  {
    name: 'Meera K.',
    role: 'Diwali gifting, Mumbai',
    quote: 'The quality is what sold me — you can feel the craftsmanship the moment you unwrap it.',
  },
];

// Bulk order enquiry schema — includes destination for shipping/logistics quoting
const bulkOrderSchema = z.object({
  companyName: z.string().trim().optional().or(z.literal('')),
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().min(6, 'Enter a valid phone number'),
  productInterest: z.string().trim().min(1, 'Please specify the product(s) you need'),
  quantity: z.string().trim().min(1, 'Estimated quantity is required'),
  destination: z.string().trim().min(1, 'Delivery destination is required'),
  message: z.string().optional().or(z.literal('')),
});

const Festivegifting = () => {
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  const location = useLocation();

useEffect(() => {
  if (location.hash === '#bulk-order-enquiry') {
    const el = document.getElementById('bulk-order-enquiry');
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }
}, [location]);

  const {
    register: registerBulk,
    handleSubmit: handleBulkSubmit,
    reset: resetBulk,
    formState: { errors: bulkErrors },
  } = useForm({ resolver: zodResolver(bulkOrderSchema) });

  // 1. Find the "gift" category from the category list
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories', 'flat'],
    queryFn: () => categoryApi.getCategories(),
    select: (res) => res.data.data.categories,
  });

  const giftCategory = useMemo(() => {
    if (!categoriesData) return null;
    return categoriesData.find(
      (cat) =>
        cat.name?.toLowerCase().includes('gift') ||
        cat.slug?.toLowerCase().includes('gift')
    );
  }, [categoriesData]);

  // 2. Fetch products filtered by that category's id
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError,
  } = useQuery({
    queryKey: ['products', 'category', giftCategory?._id],
    queryFn: () => productApi.getProducts({ category: giftCategory._id }),
    enabled: !!giftCategory?._id,
  });

  const products = productsData?.data?.data?.products || [];
  const isLoading = isCategoriesLoading || isProductsLoading;

  const onBulkSubmit = async (values) => {
    setIsBulkSubmitting(true);
    try {
      await contactApi.submit({
        ...values,
        subject: `Bulk Order Enquiry (Festive Gifting) — ${values.companyName || values.name}`,
        type: 'bulk-order',
      });
      toast.success('Enquiry sent! Our team will reach out with a quote soon.');
      resetBulk();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not send enquiry');
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-24">
      <Helmet>
        <title>Festive Gifting Collection</title>
        <meta
          name="description"
          content="Explore our curated festive gifting collection — handcrafted bamboo gifts, sustainably made in India."
        />
      </Helmet>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 via-bamboo-600 to-bamboo-800 px-4 py-16 text-center text-white">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-earth-400/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sand-100 backdrop-blur-sm">
            Festive Season
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Festive Gifting Collection
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-sand-200 sm:text-base">
            Handpicked bamboo gifts for every celebration — thoughtful, sustainable, and made by skilled artisans.
          </p>
        </motion.div>
      </div>

      {/* ── Stats / trust bar ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative -mt-8 px-4"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 rounded-2xl border border-bamboo-100 bg-white p-5 shadow-soft-lg sm:grid-cols-4 sm:gap-4 sm:p-6">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="flex flex-col items-center gap-1.5 text-center sm:gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bamboo-50 text-bamboo-600 sm:h-11 sm:w-11">
                <stat.icon size={18} />
              </span>
              <span className="font-display text-lg font-bold text-bamboo-800 sm:text-xl">{stat.value}</span>
              <span className="text-[11px] leading-snug text-bamboo-500 sm:text-xs">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 pt-16">
        {/* ── Shop by Occasion ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bamboo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bamboo-600">
              <FiGift size={12} /> Gifting Made Easy
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
              Shop by Occasion
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-bamboo-500">
              Every celebration deserves something thoughtful. Find gifts curated for the moment.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {OCCASIONS.map((occasion) => (
            <motion.button
  key={occasion.label}
  variants={staggerItem}
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
  className="group flex h-40 flex-col justify-end rounded-2xl border border-bamboo-100 bg-white p-4 text-left shadow-soft transition-all hover:border-bamboo-300 hover:shadow-soft-lg sm:h-48 sm:p-5"
>
  <span className="mb-2 h-1 w-8 rounded-full bg-bamboo-500 transition-all duration-300 group-hover:w-12" />
  <h3 className="font-display text-base font-bold leading-tight text-bamboo-800 sm:text-lg">
    {occasion.label}
  </h3>
  <p className="mt-1 text-xs text-bamboo-500 sm:text-sm">{occasion.tagline}</p>
</motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Product grid ── */}
        <div className="mt-16">
          {isLoading && <ProductGridSkeleton count={8} />}

          {!isLoading && isError && (
            <EmptyState
              title="Something went wrong"
              message="We couldn't load gift products right now. Please try again shortly."
            />
          )}

          {!isLoading && !isError && !giftCategory && (
            <EmptyState
              title="No gift category found"
              message="We couldn't find a 'gift' category in your catalog."
            />
          )}

          {!isLoading && !isError && giftCategory && products.length === 0 && (
            <EmptyState
              title="No gift products yet"
              message="Check back soon — new festive gifts are on the way."
            />
          )}

          {!isLoading && products.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* ── Why Choose Us ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bamboo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bamboo-600">
              <FiCheckCircle size={12} /> Why Wa-Kriti
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
              Gifting You Can Feel Good About
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-bamboo-500">
              Every hamper carries a story — of sustainable materials and skilled hands.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                className="card flex flex-col items-start gap-3 p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-600">
                  <feature.icon size={20} />
                </span>
                <h3 className="font-display text-base font-semibold text-bamboo-800">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-bamboo-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Testimonials ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bamboo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bamboo-600">
              <FiHeart size={12} /> Loved by Gifters
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
              What Our Customers Say
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                className="card flex flex-col gap-3 p-6"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-bamboo-600">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto pt-2">
                  <p className="text-sm font-semibold text-bamboo-800">{t.name}</p>
                  <p className="text-xs text-bamboo-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Bulk Order Enquiry ── */}
        <motion.div
            id="bulk-order-enquiry"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0.1}
          variants={fadeUp}
          className="mt-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bamboo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bamboo-600">
              <FiPackage size={12} /> Wholesale &amp; Bulk
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
              Bulk Order Enquiry
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-bamboo-500">
              Planning festive gifting for your team, clients, or event? Tell us what you need and where it&apos;s
              headed, and we&apos;ll send a tailored quote.
            </p>
          </div>

          <div className="card mx-auto mt-8 max-w-3xl p-6">
            <form onSubmit={handleBulkSubmit(onBulkSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Company Name (Optional)"
                  error={bulkErrors.companyName}
                  {...registerBulk('companyName')}
                />
                <FormInput label="Full Name" error={bulkErrors.name} {...registerBulk('name')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Email" type="email" error={bulkErrors.email} {...registerBulk('email')} />
                <FormInput label="Phone" error={bulkErrors.phone} {...registerBulk('phone')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Product(s) of Interest"
                  placeholder="e.g. Bamboo gift hampers, tea sets"
                  error={bulkErrors.productInterest}
                  {...registerBulk('productInterest')}
                />
                <FormInput
                  label="Estimated Quantity"
                  placeholder="e.g. 200 units"
                  error={bulkErrors.quantity}
                  {...registerBulk('quantity')}
                />
              </div>

              <FormInput
                label="Delivery Destination"
                placeholder="City, State / Country"
                error={bulkErrors.destination}
                {...registerBulk('destination')}
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">
                  Additional Details (Optional)
                </label>
                <textarea
                  {...registerBulk('message')}
                  className="input-field min-h-[100px]"
                  placeholder="Delivery timeline, customization needs, packaging preferences, etc."
                />
                {bulkErrors.message && (
                  <p className="mt-1 text-xs text-red-500">{bulkErrors.message.message}</p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" isLoading={isBulkSubmitting} fullWidth>
                  Submit Bulk Enquiry
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Festivegifting;