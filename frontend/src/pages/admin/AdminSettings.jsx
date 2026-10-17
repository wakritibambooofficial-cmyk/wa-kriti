// import { useEffect, useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { adminCmsApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';
// import FormInput from '../../components/ui/FormInput';

// const AdminSettings = () => {
//   const queryClient = useQueryClient();
//   const [form, setForm] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: settings } = useQuery({
//     queryKey: ['admin-settings'],
//     queryFn: () => adminCmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//   });

//   useEffect(() => {
//     if (settings && !form) {
//       setForm({
//         websiteName: settings.websiteName,
//         tagline: settings.tagline,
//         contactEmail: settings.contactEmail,
//         contactPhone: settings.contactPhone,
//         whatsappNumber: settings.whatsappNumber,
//         address: settings.address,
//         freeShippingThreshold: settings.freeShippingThreshold,
//         flatShippingCost: settings.flatShippingCost,
//       });
//     }
//   }, [settings, form]);

//   const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//       await adminCmsApi.updateSettings(fd);
//       toast.success('Settings updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['website-settings'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not update settings');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!form) return <div className="px-6 py-8"><div className="h-64 animate-pulse rounded-2xl bg-sand-200" /></div>;

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Website Settings</title></Helmet>
//       <h1 className="font-display text-2xl font-bold text-bamboo-800">Website Settings</h1>

//       <form onSubmit={handleSubmit} className="card mt-6 max-w-2xl space-y-4 p-6">
//         <div className="grid grid-cols-2 gap-4">
//           <FormInput label="Website Name" value={form.websiteName} onChange={(e) => handleChange('websiteName', e.target.value)} />
//           <FormInput label="Tagline" value={form.tagline} onChange={(e) => handleChange('tagline', e.target.value)} />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <FormInput label="Contact Email" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
//           <FormInput label="Contact Phone" value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
//         </div>
//         <FormInput label="WhatsApp Number (with country code, digits only)" value={form.whatsappNumber} onChange={(e) => handleChange('whatsappNumber', e.target.value)} />
//         <FormInput label="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
//         <div className="grid grid-cols-2 gap-4">
//           <FormInput label="Free Shipping Threshold (₹)" type="number" value={form.freeShippingThreshold} onChange={(e) => handleChange('freeShippingThreshold', e.target.value)} />
//           <FormInput label="Flat Shipping Cost (₹)" type="number" value={form.flatShippingCost} onChange={(e) => handleChange('flatShippingCost', e.target.value)} />
//         </div>
//         <Button type="submit" isLoading={isSubmitting}>Save Settings</Button>
//       </form>
//     </div>
//   );
// };

// export default AdminSettings;


import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

import { adminCmsApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const AdminSettings = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminCmsApi.getSettings(),
    select: (res) => res.data.data.settings,
  });

  useEffect(() => {
    if (settings && !form) {
      setForm({
        websiteName: settings.websiteName || '',
        tagline: settings.tagline || '',

        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        whatsappNumber: settings.whatsappNumber || '',
        address: settings.address || '',
        googleMapEmbedUrl: settings.googleMapEmbedUrl || '',

        freeShippingThreshold: settings.freeShippingThreshold || '',
        flatShippingCost: settings.flatShippingCost || '',
        taxPercentage: settings.taxPercentage || '',

        instagram: settings.socialLinks?.instagram || '',
        facebook: settings.socialLinks?.facebook || '',
        youtube: settings.socialLinks?.youtube || '',
        linkedin: settings.socialLinks?.linkedin || '',
        pinterest: settings.socialLinks?.pinterest || '',

        defaultMetaTitle: settings.seo?.defaultMetaTitle || '',
        defaultMetaDescription: settings.seo?.defaultMetaDescription || '',

        announcementEnabled: settings.announcementBar?.isEnabled ?? true,
        announcementMessages:
          settings.announcementBar?.messages?.join('\n') || '',
        autoRotateSeconds:
          settings.announcementBar?.autoRotateSeconds || 5,

        logo: null,
        favicon: null,
      });
    }
  }, [settings, form]);

  const handleChange = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();

      fd.append('websiteName', form.websiteName);
      fd.append('tagline', form.tagline);

      fd.append('contactEmail', form.contactEmail);
      fd.append('contactPhone', form.contactPhone);
      fd.append('whatsappNumber', form.whatsappNumber);
      fd.append('address', form.address);
      fd.append('googleMapEmbedUrl', form.googleMapEmbedUrl);

      fd.append('freeShippingThreshold', form.freeShippingThreshold);
      fd.append('flatShippingCost', form.flatShippingCost);
      fd.append('taxPercentage', form.taxPercentage);

      fd.append('socialLinks.instagram', form.instagram);
      fd.append('socialLinks.facebook', form.facebook);
      fd.append('socialLinks.youtube', form.youtube);
      fd.append('socialLinks.linkedin', form.linkedin);
      fd.append('socialLinks.pinterest', form.pinterest);

      fd.append('seo.defaultMetaTitle', form.defaultMetaTitle);
      fd.append('seo.defaultMetaDescription', form.defaultMetaDescription);

      fd.append('announcementBar.isEnabled', form.announcementEnabled);

      fd.append(
        'announcementBar.messages',
        JSON.stringify(
          form.announcementMessages
            .split('\n')
            .map((m) => m.trim())
            .filter(Boolean)
        )
      );

      fd.append('announcementBar.autoRotateSeconds', form.autoRotateSeconds);

      if (form.logo) {
        fd.append('logo', form.logo);
      }

      if (form.favicon) {
        fd.append('favicon', form.favicon);
      }

      await adminCmsApi.updateSettings(fd);

      toast.success('Settings updated successfully');

      queryClient.invalidateQueries({ queryKey: ['website-settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Could not update settings'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return (
      <div className="px-6 py-8">
        <div className="h-64 animate-pulse rounded-2xl bg-sand-200" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <Helmet>
        <title>Website Settings</title>
      </Helmet>

      <h1 className="font-display text-2xl font-bold text-bamboo-800">
        Website Settings
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-8 p-6">
        {/* Website */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            Website Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Website Name"
              value={form.websiteName}
              onChange={(e) => handleChange('websiteName', e.target.value)}
            />

            <FormInput
              label="Tagline"
              value={form.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
            />
          </div>
        </div>

        {/* Branding */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            Branding
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="mb-2 block text-sm font-medium">Logo</label>

              {settings?.logo?.url && (
                <img
                  src={settings.logo.url}
                  alt=""
                  className="mb-3 h-20 rounded border object-contain"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange('logo', e.target.files[0])}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Favicon
              </label>

              {settings?.favicon?.url && (
                <img
                  src={settings.favicon.url}
                  alt=""
                  className="mb-3 h-16 w-16 rounded border object-contain"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange('favicon', e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            Contact Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Contact Email"
              value={form.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />

            <FormInput
              label="Contact Phone"
              value={form.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />

            <FormInput
              label="WhatsApp Number"
              value={form.whatsappNumber}
              onChange={(e) =>
                handleChange('whatsappNumber', e.target.value)
              }
            />

            <FormInput
              label="Address"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="mt-4">
            <FormInput
              label="Google Map Embed URL"
              value={form.googleMapEmbedUrl}
              onChange={(e) =>
                handleChange('googleMapEmbedUrl', e.target.value)
              }
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            Social Links
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Instagram"
              value={form.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />

            <FormInput
              label="Facebook"
              value={form.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />

            <FormInput
              label="YouTube"
              value={form.youtube}
              onChange={(e) => handleChange('youtube', e.target.value)}
            />

            <FormInput
              label="LinkedIn"
              value={form.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />

            <FormInput
              label="Pinterest"
              value={form.pinterest}
              onChange={(e) => handleChange('pinterest', e.target.value)}
            />
          </div>
        </div>

        {/* Shipping & Tax */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            Shipping & Tax
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <FormInput
              type="number"
              label="Free Shipping Threshold"
              value={form.freeShippingThreshold}
              onChange={(e) =>
                handleChange('freeShippingThreshold', e.target.value)
              }
            />

            <FormInput
              type="number"
              label="Flat Shipping Cost"
              value={form.flatShippingCost}
              onChange={(e) =>
                handleChange('flatShippingCost', e.target.value)
              }
            />

            <FormInput
              type="number"
              label="Tax Percentage"
              value={form.taxPercentage}
              onChange={(e) => handleChange('taxPercentage', e.target.value)}
            />
          </div>
        </div>

        {/* SEO */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            SEO
          </h2>

          <div className="space-y-4">
            <FormInput
              label="Default Meta Title"
              value={form.defaultMetaTitle}
              onChange={(e) =>
                handleChange('defaultMetaTitle', e.target.value)
              }
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-bamboo-700">
                Default Meta Description
              </label>

              <textarea
                rows={4}
                value={form.defaultMetaDescription}
                onChange={(e) =>
                  handleChange('defaultMetaDescription', e.target.value)
                }
                className="input-field w-full"
              />
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-bamboo-800">
            Announcement Bar
          </h2>

          <label className="mb-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.announcementEnabled}
              onChange={(e) =>
                handleChange('announcementEnabled', e.target.checked)
              }
            />
            Enable Announcement Bar
          </label>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-bamboo-700">
                Messages (One per line)
              </label>

              <textarea
                rows={6}
                value={form.announcementMessages}
                onChange={(e) =>
                  handleChange('announcementMessages', e.target.value)
                }
                className="input-field w-full"
              />
            </div>

            <FormInput
              type="number"
              label="Auto Rotate Seconds"
              value={form.autoRotateSeconds}
              onChange={(e) =>
                handleChange('autoRotateSeconds', e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;