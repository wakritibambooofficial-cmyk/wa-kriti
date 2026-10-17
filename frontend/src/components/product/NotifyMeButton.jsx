import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiBell } from 'react-icons/fi';
import { engagementApi } from '../../services/growthApi';
import Button from '../ui/Button';

const NotifyMeButton = ({ productId, variantId = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await engagementApi.subscribeStockAlert({
        productId,
        variantId,
        email: isAuthenticated ? user.email : email,
      });
      toast.success("We'll email you when it's back in stock!");
      setSubscribed(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-bamboo-50 px-4 py-3 text-sm font-medium text-bamboo-700">
        <FiBell size={16} /> You&apos;ll be notified when this is back in stock.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {!isAuthenticated && (
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="input-field !py-2.5 text-sm"
        />
      )}
      <Button type="submit" variant="secondary" isLoading={isSubmitting} className="flex shrink-0 items-center gap-1.5 !py-2.5 text-sm">
        <FiBell size={14} /> Notify Me
      </Button>
    </form>
  );
};

export default NotifyMeButton;
