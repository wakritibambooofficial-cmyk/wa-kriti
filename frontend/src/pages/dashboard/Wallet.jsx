import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { loyaltyApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const REASON_LABELS = {
  refund: 'Refund',
  admin_credit: 'Admin Credit',
  order_payment: 'Order Payment',
  referral_bonus: 'Referral Bonus',
  cashback: 'Cashback',
  other: 'Other',
};

const Wallet = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => loyaltyApi.getWallet(),
    select: (res) => res.data.data,
  });

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>My Wallet</title></Helmet>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">My Wallet</h1>

        <div className="card mt-6 bg-gradient-to-br from-bamboo-600 to-bamboo-700 p-6 text-white">
          <p className="text-xs uppercase tracking-wide text-sand-200">Available Balance</p>
          <p className="mt-1 font-display text-3xl font-bold">
            {isLoading ? '...' : `₹${data?.balance ?? 0}`}
          </p>
        </div>

        <h2 className="mt-8 font-display text-lg font-semibold text-bamboo-800">Transaction History</h2>

        {isLoading ? (
          <div className="mt-4 h-40 animate-pulse rounded-2xl bg-sand-200" />
        ) : !data?.transactions?.length ? (
          <div className="mt-4">
            <EmptyState title="No transactions yet" message="Your wallet credits and debits will appear here." />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-sand-300 rounded-2xl bg-white shadow-soft">
            {data.transactions.map((txn) => (
              <div key={txn._id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-bamboo-800">{REASON_LABELS[txn.reason] || txn.reason}</p>
                  <p className="text-xs text-bamboo-400">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  {txn.description && <p className="text-xs text-bamboo-500">{txn.description}</p>}
                </div>
                <span className={`font-display text-base font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
