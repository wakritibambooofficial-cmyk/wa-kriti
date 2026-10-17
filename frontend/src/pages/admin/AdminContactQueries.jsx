// import { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import toast from 'react-hot-toast';
// import { adminContactApi } from '../../services/adminApi';
// import Button from '../../components/ui/Button';

// const AdminContactQueries = () => {
//   const queryClient = useQueryClient();
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [isSending, setIsSending] = useState(false);

//   const { data: queries, isLoading } = useQuery({
//     queryKey: ['admin-contact-queries'],
//     queryFn: () => adminContactApi.getAll(),
//     select: (res) => res.data.data.queries,
//   });

//   const handleReply = async () => {
//     if (!replyText.trim()) return;
//     setIsSending(true);
//     try {
//       await adminContactApi.reply(replyingTo._id, replyText.trim());
//       toast.success('Reply sent');
//       queryClient.invalidateQueries({ queryKey: ['admin-contact-queries'] });
//       setReplyingTo(null);
//       setReplyText('');
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Could not send reply');
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="px-6 py-8">
//       <Helmet><title>Contact Queries</title></Helmet>
//       <h1 className="font-display text-2xl font-bold text-bamboo-800">Contact Queries</h1>

//       <div className="mt-6 space-y-4">
//         {isLoading ? (
//           <p className="text-bamboo-400">Loading...</p>
//         ) : !queries?.length ? (
//           <p className="text-bamboo-400">No contact queries yet</p>
//         ) : (
//           queries.map((q) => (
//             <div key={q._id} className="card p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-bamboo-800">{q.name} · {q.email}</p>
//                   <p className="text-xs text-bamboo-400">{q.subject}</p>
//                 </div>
//                 <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${q.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
//                   {q.status.replace('_', ' ')}
//                 </span>
//               </div>
//               <p className="mt-2 text-sm text-bamboo-600">{q.message}</p>

//               {q.adminReply && (
//                 <div className="mt-3 rounded-xl bg-bamboo-50 p-3 text-sm text-bamboo-700">
//                   <span className="font-semibold">Your reply: </span>{q.adminReply}
//                 </div>
//               )}

//               {!q.adminReply && (
//                 <button onClick={() => { setReplyingTo(q); setReplyText(''); }} className="mt-3 text-xs font-semibold text-bamboo-600 hover:underline">
//                   Reply
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//       {replyingTo && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6">
//             <h2 className="font-display text-lg font-semibold text-bamboo-800">Reply to {replyingTo.name}</h2>
//             <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="input-field mt-4 min-h-[120px]" placeholder="Type your reply..." />
//             <div className="mt-4 flex gap-3">
//               <Button variant="secondary" className="flex-1" onClick={() => setReplyingTo(null)}>Cancel</Button>
//               <Button className="flex-1" onClick={handleReply} isLoading={isSending}>Send Reply</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminContactQueries;




import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiX, FiMail, FiPhone, FiBriefcase, FiPackage, FiMapPin } from 'react-icons/fi';
import { adminContactApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';

// A query is a "bulk order" enquiry if it was submitted with this type,
// or (as a fallback, in case older records predate the `type` field)
// if it carries bulk-order-only fields.
const isBulkOrder = (q) =>
  q.type === 'bulk-order' || Boolean(q.destination || q.productInterest || q.quantity || q.companyName);

const TABS = [
  { key: 'all', label: 'All Queries' },
  { key: 'contact', label: 'Contact Us' },
  { key: 'bulk-order', label: 'Bulk Order Enquiries' },
];

const FIELD_LABELS = {
  phone: 'Phone',
  subject: 'Subject',
  type: 'Enquiry Type',
  companyName: 'Company Name',
  productInterest: 'Product(s) of Interest',
  quantity: 'Estimated Quantity',
  destination: 'Delivery Destination',
  createdAt: 'Received On',
  updatedAt: 'Last Updated',
};

const HIDDEN_FIELDS = new Set(['_id', '__v', 'adminReply', 'status', 'name', 'email', 'message']);

const titleCase = (key) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const formatValue = (key, value) => {
  if (value == null || value === '') return '—';
  if (key === 'createdAt' || key === 'updatedAt') {
    return new Date(value).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return String(value);
};

const AdminContactQueries = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [viewingQuery, setViewingQuery] = useState(null);

  const { data: queries, isLoading } = useQuery({
    queryKey: ['admin-contact-queries'],
    queryFn: () => adminContactApi.getAll(),
    select: (res) => res.data.data.queries,
  });

  const counts = useMemo(() => {
    const all = queries || [];
    const bulk = all.filter(isBulkOrder);
    return { all: all.length, 'bulk-order': bulk.length, contact: all.length - bulk.length };
  }, [queries]);

  const filteredQueries = useMemo(() => {
    const all = queries || [];
    if (activeTab === 'bulk-order') return all.filter(isBulkOrder);
    if (activeTab === 'contact') return all.filter((q) => !isBulkOrder(q));
    return all;
  }, [queries, activeTab]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await adminContactApi.reply(replyingTo._id, replyText.trim());
      toast.success('Reply sent');
      queryClient.invalidateQueries({ queryKey: ['admin-contact-queries'] });
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not send reply');
    } finally {
      setIsSending(false);
    }
  };

  const extraFields = viewingQuery
    ? Object.keys(viewingQuery).filter((key) => !HIDDEN_FIELDS.has(key))
    : [];
  const knownDetailKeys = ['phone', 'companyName', 'destination', 'productInterest', 'quantity'];

  return (
    <div className="px-6 py-8">
      <Helmet><title>Contact Queries</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Contact Queries</h1>

      {/* ── Tabs: switch between Contact Us and Bulk Order enquiries ── */}
      <div className="mt-5 flex flex-wrap gap-2 border-b border-sand-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.key ? 'text-bamboo-800' : 'text-bamboo-400 hover:text-bamboo-600'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 rounded-full bg-sand-200 px-1.5 py-0.5 text-xs text-bamboo-600">
              {counts[tab.key] ?? 0}
            </span>
            {activeTab === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-bamboo-600" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-bamboo-400">Loading...</p>
        ) : !filteredQueries.length ? (
          <p className="text-bamboo-400">
            {activeTab === 'bulk-order'
              ? 'No bulk order enquiries yet'
              : activeTab === 'contact'
              ? 'No contact queries yet'
              : 'No queries yet'}
          </p>
        ) : (
          filteredQueries.map((q) => {
            const bulk = isBulkOrder(q);
            return (
              <div
                key={q._id}
                onClick={() => setViewingQuery(q)}
                className="card cursor-pointer p-5 transition-shadow hover:shadow-soft-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-bamboo-800">{q.name} · {q.email}</p>
                    <p className="text-xs text-bamboo-400">{q.subject}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {bulk && (
                      <span className="rounded-full bg-earth-100 px-2.5 py-1 text-xs font-semibold text-earth-600">
                        Bulk Order
                      </span>
                    )}
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${q.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {q.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Bulk-order specific fields, shown right on the card so
                    they don't need a click to be visible. */}
                {bulk && (
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl bg-sand-100 p-3 text-xs sm:grid-cols-4">
                    {q.companyName && (
                      <div>
                        <p className="text-bamboo-400">Company</p>
                        <p className="font-medium text-bamboo-700">{q.companyName}</p>
                      </div>
                    )}
                    {q.productInterest && (
                      <div>
                        <p className="text-bamboo-400">Product(s)</p>
                        <p className="font-medium text-bamboo-700">{q.productInterest}</p>
                      </div>
                    )}
                    {q.quantity && (
                      <div>
                        <p className="text-bamboo-400">Quantity</p>
                        <p className="font-medium text-bamboo-700">{q.quantity}</p>
                      </div>
                    )}
                    {q.destination && (
                      <div>
                        <p className="text-bamboo-400">Delivery Destination</p>
                        <p className="font-medium text-bamboo-700">{q.destination}</p>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-2 line-clamp-2 text-sm text-bamboo-600">{q.message}</p>

                {q.adminReply && (
                  <div className="mt-3 rounded-xl bg-bamboo-50 p-3 text-sm text-bamboo-700">
                    <span className="font-semibold">Your reply: </span>{q.adminReply}
                  </div>
                )}

                {!q.adminReply && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplyingTo(q);
                      setReplyText('');
                    }}
                    className="mt-3 text-xs font-semibold text-bamboo-600 hover:underline"
                  >
                    Reply
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Full query detail modal ── */}
      {viewingQuery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setViewingQuery(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-bamboo-800">
                    {viewingQuery.subject || 'Contact Query'}
                  </h2>
                  {isBulkOrder(viewingQuery) && (
                    <span className="rounded-full bg-earth-100 px-2 py-0.5 text-xs font-semibold text-earth-600">
                      Bulk Order
                    </span>
                  )}
                </div>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${viewingQuery.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {viewingQuery.status.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => setViewingQuery(null)}
                className="rounded-full p-1.5 text-bamboo-400 hover:bg-sand-100 hover:text-bamboo-700"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Sender + bulk-order details */}
            <div className="mt-4 space-y-1.5 rounded-xl bg-sand-100 p-4">
              <p className="font-medium text-bamboo-800">{viewingQuery.name}</p>
              <p className="flex items-center gap-2 text-sm text-bamboo-600">
                <FiMail size={13} /> {viewingQuery.email}
              </p>
              {viewingQuery.phone && (
                <p className="flex items-center gap-2 text-sm text-bamboo-600">
                  <FiPhone size={13} /> {viewingQuery.phone}
                </p>
              )}
              {viewingQuery.companyName && (
                <p className="flex items-center gap-2 text-sm text-bamboo-600">
                  <FiBriefcase size={13} /> {viewingQuery.companyName}
                </p>
              )}
              {viewingQuery.destination && (
                <p className="flex items-center gap-2 text-sm text-bamboo-600">
                  <FiMapPin size={13} /> {viewingQuery.destination}
                </p>
              )}
              {viewingQuery.productInterest && (
                <p className="flex items-center gap-2 text-sm text-bamboo-600">
                  <FiPackage size={13} /> {viewingQuery.productInterest}
                  {viewingQuery.quantity && ` · Qty: ${viewingQuery.quantity}`}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-bamboo-400">
                Message
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-bamboo-700">
                {viewingQuery.message || '—'}
              </p>
            </div>

            {/* Any other field on the record, shown generically so new
                form fields never get silently dropped. */}
            {extraFields.filter((key) => !knownDetailKeys.includes(key)).length > 0 && (
              <div className="mt-4 space-y-2 border-t border-sand-200 pt-4">
                {extraFields
                  .filter((key) => !knownDetailKeys.includes(key))
                  .map((key) => (
                    <div key={key} className="flex justify-between gap-4 text-sm">
                      <span className="text-bamboo-400">{FIELD_LABELS[key] || titleCase(key)}</span>
                      <span className="text-right text-bamboo-700">{formatValue(key, viewingQuery[key])}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Reply */}
            {viewingQuery.adminReply ? (
              <div className="mt-4 rounded-xl bg-bamboo-50 p-3 text-sm text-bamboo-700">
                <span className="font-semibold">Your reply: </span>{viewingQuery.adminReply}
              </div>
            ) : (
              <Button
                fullWidth
                className="mt-5"
                onClick={() => {
                  setReplyingTo(viewingQuery);
                  setReplyText('');
                  setViewingQuery(null);
                }}
              >
                Reply to this query
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── Reply modal ── */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Reply to {replyingTo.name}</h2>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="input-field mt-4 min-h-[120px]" placeholder="Type your reply..." />
            <div className="mt-4 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setReplyingTo(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleReply} isLoading={isSending}>Send Reply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactQueries;