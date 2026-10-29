// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { FiInstagram, FiFacebook, FiYoutube, FiLinkedin, FiMail } from 'react-icons/fi';
// import { FaPinterestP } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import { cmsApi, contactApi } from '../../services/cmsApi';

// const FooterColumn = ({ title, links }) => (
//   <div>
//     <h4 className="mb-3 text-sm font-semibold text-sand-100">{title}</h4>
//     <ul className="space-y-2">
//       {links.map((link) => (
//         <li key={link.to}>
//           <Link to={link.to} className="text-sm text-sand-300 hover:text-white">
//             {link.label}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// const Footer = () => {
//   const [email, setEmail] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: settings } = useQuery({
//     queryKey: ['website-settings'],
//     queryFn: () => cmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//     staleTime: 5 * 60 * 1000,
//   });

//   const handleSubscribe = async (e) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     setIsSubmitting(true);
//     try {
//       await contactApi.subscribeNewsletter(email.trim());
//       toast.success('Subscribed successfully!');
//       setEmail('');
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not subscribe');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <footer className="bg-bamboo-800 pt-14 text-sand-200">
//       {/* Newsletter */}
//       <div className="mx-auto max-w-3xl px-4 pb-10 text-center">
//         <h3 className="font-display text-xl font-semibold text-white">Stay Connected</h3>
//         <p className="mt-1 text-sm text-sand-300">Receive offers, bamboo tips, and new launches.</p>
//         <form onSubmit={handleSubscribe} className="mx-auto mt-4 flex max-w-md gap-2">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             className="w-full rounded-xl border border-bamboo-600 bg-bamboo-700 px-4 py-2.5 text-sm text-white placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-bamboo-400"
//           />
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="flex shrink-0 items-center gap-1.5 rounded-xl bg-sand-100 px-4 py-2.5 text-sm font-semibold text-bamboo-800 hover:bg-white disabled:opacity-60"
//           >
//             <FiMail size={14} /> Subscribe
//           </button>
//         </form>
//       </div>

//       <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 border-t border-bamboo-700 px-4 py-12 sm:grid-cols-3 lg:grid-cols-5">
//         <FooterColumn
//           title="Company"
//           links={[
//             { label: 'About Us', to: '/about' },
//             { label: 'Founder', to: '/founder' },
//             { label: 'Sustainability', to: '/sustainability' },
//             { label: 'Artisans', to: '/artisans' },
//           ]}
//         />
//         <FooterColumn
//           title="Shop"
//           links={[
//             { label: 'All Categories', to: '/shop' },
//             { label: 'New Arrivals', to: '/shop?newArrival=true' },
//             { label: 'Best Sellers', to: '/shop?bestSeller=true' },
//             { label: 'Festival Offers', to: '/shop?festival=true' },
//             //{ label: 'Gift Hamper Builder', to: '/gift-hamper' },
//           ]}
//         />
//         <FooterColumn
//           title="Support"
//           links={[
//             { label: 'Contact Us', to: '/contact' },
//             { label: 'Returns', to: '/dashboard/orders' },
//             { label: 'Shipping Policy', to: '/shipping-policy' },
//             { label: 'Terms & Conditions', to: '/terms-and-conditions' },
//             { label: 'Certifications', to: '/certificates' },
//             { label: 'Privacy Policy', to: '/privacy-policy' },
//             { label: 'Refund Policy', to: '/refund-policy' },
//             { label: 'Cancellation Policy', to: '/cancellation-policy' },
//             { label: 'Accessibility Statement', to: '/accessibility-statement' },
//           ]}
//         />
//         <FooterColumn
//           title="Community"
//           links={[
//             { label: 'Blog', to: '/blog' },
//             { label: 'Knowledge Center', to: '/knowledge-center' },
//            // { label: 'Events', to: '/events' },
//           ]}
//         />
//         <FooterColumn
//           title="Business"
//           links={[
//             { label: 'Wholesale', to: '/contact' },
//             { label: 'Corporate Gifting', to: '/contact' },
//             { label: 'Export Enquiry', to: '/contact' },
//           ]}
//         />
//       </div>

//       <div className="border-t border-bamboo-700 px-4 py-6">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
//           <p className="text-xs text-sand-400">
//             &copy; {new Date().getFullYear()} {settings?.websiteName || 'Wa-Kriti'}. All rights reserved.
//           </p>
//           <div className="flex gap-3 text-sand-300">
//             {settings?.socialLinks?.instagram && (
//               <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram size={22} /></a>
//             )}
//             {settings?.socialLinks?.facebook && (
//               <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook size={22} /></a>
//             )}
//             {settings?.socialLinks?.youtube && (
//               <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><FiYoutube size={22} /></a>
//             )}
//             {settings?.socialLinks?.linkedin && (
//               <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin size={22} /></a>
//             )}
//              {settings?.socialLinks?.pinterest && (
//     <a
//       href={settings.socialLinks.pinterest}
//       target="_blank"
//       rel="noreferrer"
//       aria-label="Pinterest"
//     >
//       <FaPinterestP size={22} />
//     </a>
//   )}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiInstagram, FiFacebook, FiYoutube, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { cmsApi, contactApi } from '../../services/cmsApi';

const SOCIAL_LINKS_CONFIG = [
  { key: 'instagram', icon: FiInstagram, label: 'Instagram' },
  { key: 'facebook', icon: FiFacebook, label: 'Facebook' },
  { key: 'youtube', icon: FiYoutube, label: 'YouTube' },
  // { key: 'linkedin', icon: FiLinkedin, label: 'LinkedIn' },
  // { key: 'pinterest', icon: FaPinterestP, label: 'Pinterest' },
];

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sand-400">{title}</h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="text-sm text-sand-300 transition-colors duration-150 hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
    staleTime: 5 * 60 * 1000,
  });

  const websiteName = settings?.websiteName || 'Wa-Kriti';

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await contactApi.subscribeNewsletter(email.trim());
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-bamboo-800 text-sand-200">
      {/* ── Brand + newsletter row ── */}
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border-b border-bamboo-700/60 px-6 py-10 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt={`${websiteName} logo`}
            className="h-[70px] w-[70px] rounded-full object-contain"
          />
         <div>
  <span className="flex items-start font-display text-2xl font-semibold text-white">
    {websiteName}
    <sup className="ml-0.5 mt-0.5 text-[9px] font-semibold leading-none tracking-normal">TM</sup>
  </span>
  <p className="mt-1 text-sm text-sand-400">
𝐂𝐫𝐚𝐟𝐭𝐞𝐝 𝐛𝐲 𝐍𝐚𝐭𝐮𝐫𝐞, 𝐖𝐨𝐯𝐞𝐧 𝐰𝐢𝐭𝐡 𝐁𝐚𝐦𝐛𝐨𝐨</p>
</div>
        </div>

        <div className="w-full max-w-xs sm:text-right">
          <p className="text-sm text-sand-300">Subscribe to our newsletter to receive updates</p>
          <form onSubmit={handleSubscribe} className="mt-3 flex w-full items-center gap-2">
            <div className="relative flex-1">
              <FiMail
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bamboo-400"
                size={15}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-full border border-bamboo-600 bg-white/95 py-2.5 pl-9 pr-4 text-sm text-bamboo-800 placeholder:text-bamboo-400 shadow-sm outline-none ring-earth-400 transition-all focus:ring-2"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="Subscribe"
              className="flex shrink-0 items-center justify-center rounded-full bg-sand-50 p-2.5 text-bamboo-800 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-white hover:shadow-md disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="text-xs">...</span>
              ) : (
                <FiArrowRight size={15} />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Social icons, centered ── */}
      <div className="flex flex-col items-center gap-3 border-b border-bamboo-700/60 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sand-400">
          Follow us on social media
        </p>
        <div className="flex gap-5">
          {SOCIAL_LINKS_CONFIG.map(({ key, icon: Icon, label }) => {
            const url = settings?.socialLinks?.[key];
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-sand-300 transition-colors duration-150 hover:text-earth-400"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Link grid ── */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-3 sm:px-8 lg:grid-cols-6">
        <FooterColumn
          title="Company"
          links={[
            { label: 'About Us', to: '/about' },
            { label: 'Founder', to: '/founder' },
            { label: 'Sustainability', to: '/sustainability' },
            { label: 'Artisans', to: '/artisans' },
          ]}
        />
        <FooterColumn
          title="Shop"
          links={[
            { label: 'All Categories', to: '/shop' },
            { label: 'New Arrivals', to: '/shop?newArrival=true' },
            { label: 'Best Sellers', to: '/shop?bestSeller=true' },
            { label: 'Festival Offers', to: '/shop?festival=true' },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { label: 'Contact Us', to: '/contact' },
            { label: 'Returns', to: '/dashboard/orders' },
            { label: 'Shipping Policy', to: '/shipping-policy' },
            { label: 'Certifications', to: '/certificates' },
          ]}
        />
        <FooterColumn
          title="Policies"
          links={[
            { label: 'Terms & Conditions', to: '/terms-and-conditions' },
            { label: 'Privacy Policy', to: '/privacy-policy' },
            { label: 'Refund Policy', to: '/refund-policy' },
            { label: 'Cancellation Policy', to: '/cancellation-policy' },
            { label: 'Accessibility Statement', to: '/accessibility-statement' },
          ]}
        />
        <FooterColumn
          title="Community"
          links={[
            { label: 'Blog', to: '/blog' },
            { label: 'Knowledge Center', to: '/knowledge-center' },
            { label: 'F&Q', to: '/f&q' },
          ]}
        />
        <FooterColumn
          title="Business"
          links={[
            { label: 'Wholesale', to: '/contact' },
            { label: 'Corporate Gifting', to: '/contact' },
            { label: 'Export Enquiry', to: '/contact' },
          ]}
        />
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-bamboo-700/60 px-6 py-5 text-center text-xs text-sand-400 sm:px-8">
        &copy; {new Date().getFullYear()} {websiteName}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;