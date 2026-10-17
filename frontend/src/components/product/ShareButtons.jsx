import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { FiMail, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { shareLinks } from '../../utils/shareProduct';

const ShareButtons = ({ url, text }) => {
  const links = shareLinks(url, text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a href={links.whatsapp} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20" aria-label="Share on WhatsApp">
        <FaWhatsapp size={16} />
      </a>
      <a href={links.facebook} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100" aria-label="Share on Facebook">
        <FaFacebook size={16} />
      </a>
      <a href={links.email} className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-200 text-bamboo-600 hover:bg-sand-300" aria-label="Share via Email">
        <FiMail size={16} />
      </a>
      <button onClick={handleCopy} className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-200 text-bamboo-600 hover:bg-sand-300" aria-label="Copy link">
        <FiLink size={16} />
      </button>
    </div>
  );
};

export default ShareButtons;
