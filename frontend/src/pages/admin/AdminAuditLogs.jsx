import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { adminAuditLogApi } from '../../services/adminApi';

const MODULES = ['', 'products', 'categories', 'orders', 'coupons', 'customers'];

const AdminAuditLogs = () => {
  const [moduleFilter, setModuleFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', moduleFilter],
    queryFn: () => adminAuditLogApi.getAll({ module: moduleFilter || undefined, limit: 100 }),
    select: (res) => res.data.data.logs,
  });

  return (
    <div className="px-6 py-8">
      <Helmet><title>Audit Logs</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Admin Activity Logs</h1>

      <div className="mt-5 flex gap-2">
        {MODULES.map((m) => (
          <button
            key={m || 'all'}
            onClick={() => setModuleFilter(m)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${moduleFilter === m ? 'bg-bamboo-600 text-white' : 'bg-white text-bamboo-600'}`}
          >
            {m || 'All'}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-100 text-xs uppercase text-bamboo-500">
            <tr>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-bamboo-400">Loading...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-bamboo-400">No activity logged yet</td></tr>
            ) : (
              data.map((log) => (
                <tr key={log._id}>
                  <td className="px-4 py-3 font-medium text-bamboo-800">{log.admin?.firstName} {log.admin?.lastName}</td>
                  <td className="px-4 py-3 text-bamboo-600">{log.action}</td>
                  <td className="px-4 py-3 capitalize text-bamboo-500">{log.module}</td>
                  <td className="px-4 py-3 text-bamboo-500">{log.description}</td>
                  <td className="px-4 py-3 text-xs text-bamboo-400">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
