import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { subscriptionApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const Subscriptions = () => {
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => subscriptionApi.getMy(),
    select: (res) => res.data.data.subscriptions,
  });

  const handlePause = async (id) => {
    await subscriptionApi.pause(id);
    queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
  };

  const handleCancel = async (id) => {
    try {
      await subscriptionApi.cancel(id);
      toast.success('Subscription cancelled');
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not cancel subscription');
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>My Subscriptions</title></Helmet>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">My Subscriptions</h1>
        <p className="mt-1 text-sm text-bamboo-500">Manage your recurring bamboo tea, salt, and consumable deliveries.</p>

        {isLoading ? (
          <div className="mt-6 h-32 animate-pulse rounded-2xl bg-sand-200" />
        ) : !subscriptions?.length ? (
          <div className="mt-6">
            <EmptyState
              title="No active subscriptions"
              message="Subscribe to your favorite consumables from their product page for recurring delivery and a discount."
              actionLabel="Browse Products"
              actionTo="/shop"
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="card flex items-center gap-4 p-5">
                {sub.product?.images?.[0]?.url && (
                  <img src={sub.product.images[0].url} alt={sub.product.name} className="h-16 w-16 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-bamboo-800">{sub.product?.name}</p>
                  <p className="text-xs capitalize text-bamboo-500">
                    {sub.frequency} · Qty {sub.quantity} · Next delivery {new Date(sub.nextDeliveryDate).toLocaleDateString('en-IN')}
                  </p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    sub.status === 'active' ? 'bg-green-100 text-green-600' : sub.status === 'paused' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                {sub.status !== 'cancelled' && (
                  <div className="flex flex-col gap-2 text-xs font-semibold">
                    <button onClick={() => handlePause(sub._id)} className="text-bamboo-600 hover:underline">
                      {sub.status === 'paused' ? 'Resume' : 'Pause'}
                    </button>
                    <button onClick={() => handleCancel(sub._id)} className="text-red-500 hover:underline">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
