import toast from 'react-hot-toast';

/**
 * Shares a product via the native Web Share API (mobile browsers) or falls
 * back to copying a shareable link + opening WhatsApp/Facebook share URLs.
 */
export const shareProduct = async (product) => {
  const url = `${window.location.origin}/product/${product.slug}`;
  const text = `Check out ${product.name} on Wa-Kriti — Premium Bamboo Living`;

  if (navigator.share) {
    try {
      await navigator.share({ title: product.name, text, url });
    } catch {
      // user cancelled the native share sheet — no action needed
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success('Product link copied to clipboard!');
  } catch {
    toast.error('Could not copy link');
  }
};

export const shareLinks = (url, text) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
});
