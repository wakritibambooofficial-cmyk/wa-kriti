import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { adminCustomerApi } from '../../services/adminApi';

const AdminCustomers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: () => adminCustomerApi.getAll({ q: search || undefined }),
    select: (res) => res.data.data.customers,
  });

  const handleToggleBlock = async (id) => {
    try {
      await adminCustomerApi.toggleBlock(id);
      toast.success('Customer status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update customer');
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Manage Customers</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Customers</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="input-field mt-5 !w-72 !py-2 text-sm"
      />

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-bamboo-400">No customers found</td></tr>
            ) : (
              data.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-bamboo-800">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3 text-bamboo-600">{c.email}</td>
                  <td className="px-4 py-3 text-xs text-bamboo-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${c.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleBlock(c._id)} className="text-xs font-semibold text-bamboo-600 hover:underline">
                      {c.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
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

export default AdminCustomers;
