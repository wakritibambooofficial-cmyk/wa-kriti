import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { loyaltyApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const REASON_LABELS = {
  registration: 'Welcome Bonus',
  purchase: 'Purchase Reward',
  review: 'Review Reward',
  referral: 'Referral Bonus',
  festival_campaign: 'Festival Campaign',
  redemption: 'Redeemed at Checkout',
  admin_adjustment: 'Admin Adjustment',
};

const Rewards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => loyaltyApi.getRewards(),
    select: (res) => res.data.data,
  });

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Reward Points</title></Helmet>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Reward Points</h1>

        <div className="card mt-6 bg-gradient-to-br from-earth-500 to-earth-600 p-6 text-white">
          <p className="text-xs uppercase tracking-wide text-sand-200">Available Points</p>
          <p className="mt-1 font-display text-3xl font-bold">{isLoading ? '...' : data?.balance ?? 0}</p>
          <p className="mt-1 text-xs text-sand-200">Worth ₹{isLoading ? '...' : Math.round((data?.balance ?? 0) * 0.5)} at checkout</p>
        </div>

        <h2 className="mt-8 font-display text-lg font-semibold text-bamboo-800">Points History</h2>

        {isLoading ? (
          <div className="mt-4 h-40 animate-pulse rounded-2xl bg-sand-200" />
        ) : !data?.transactions?.length ? (
          <div className="mt-4">
            <EmptyState title="No points earned yet" message="Earn points by shopping, reviewing products, and referring friends." />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-sand-300 rounded-2xl bg-white shadow-soft">
            {data.transactions.map((txn) => (
              <div key={txn._id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-bamboo-800">{REASON_LABELS[txn.reason] || txn.reason}</p>
                  <p className="text-xs text-bamboo-400">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`font-display text-base font-semibold ${['earned', 'adjusted'].includes(txn.type) ? 'text-green-600' : 'text-red-500'}`}>
                  {['earned', 'adjusted'].includes(txn.type) ? '+' : '-'}{txn.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
