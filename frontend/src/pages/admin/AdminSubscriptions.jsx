import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { adminSubscriptionApi } from '../../services/adminApi';

const AdminSubscriptions = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => adminSubscriptionApi.getAll(),
    select: (res) => res.data.data.subscriptions,
  });

  return (
    <div className="px-6 py-8">
      <Helmet><title>Subscriptions</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Subscription Products</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3">Next Delivery</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
            ) : !subscriptions?.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-bamboo-400">No subscriptions yet</td></tr>
            ) : (
              subscriptions.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3 text-bamboo-700">{s.user?.firstName} {s.user?.lastName}</td>
                  <td className="px-4 py-3 font-medium text-bamboo-800">{s.product?.name}</td>
                  <td className="px-4 py-3 capitalize text-bamboo-600">{s.frequency}</td>
                  <td className="px-4 py-3 text-xs text-bamboo-400">{new Date(s.nextDeliveryDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-bamboo-100 px-2.5 py-1 text-xs font-semibold capitalize text-bamboo-700">{s.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
