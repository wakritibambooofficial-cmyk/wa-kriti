import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminNewsletterApi } from '../../services/adminApi';

const AdminNewsletter = () => {
  const queryClient = useQueryClient();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  // Get subscribers
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-newsletter-subscribers'],
    queryFn: async () => {
      const response = await adminNewsletterApi.getSubscribers();
      return response.data;
    },
  });

  // Send newsletter
  const sendMutation = useMutation({
    mutationFn: async (newsletterData) => {
      const response = await adminNewsletterApi.sendNewsletter(
        newsletterData
      );
      return response.data;
    },

    onSuccess: (response) => {
      setResult(response);
      setSubject('');
      setMessage('');
    },

    onError: (error) => {
      alert(
        error?.response?.data?.message ||
          'Failed to send newsletter'
      );
    },
  });

  // Delete subscriber
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      adminNewsletterApi.deleteSubscriber(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-newsletter-subscribers'],
      });
    },

    onError: (error) => {
      alert(
        error?.response?.data?.message ||
          'Failed to delete subscriber'
      );
    },
  });

const subscribers = Array.isArray(data?.data?.subscribers)
  ? data.data.subscribers
  : [];

  const handleSendNewsletter = (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      alert('Please enter email subject');
      return;
    }

    if (!message.trim()) {
      alert('Please enter email content');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to send this newsletter to ${subscribers.length} subscribers?`
    );

    if (!confirmed) return;

    setResult(null);

    sendMutation.mutate({
      subject: subject.trim(),
      message: message.trim(),
    });
  };

  const handleDelete = (subscriber) => {
    const confirmed = window.confirm(
      `Remove ${subscriber.email} from newsletter subscribers?`
    );

    if (!confirmed) return;

    deleteMutation.mutate(subscriber._id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Newsletter
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Send email campaigns to your newsletter subscribers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Subscribers
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {isLoading ? '...' : subscribers.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Newsletter Status
          </p>

          <p className="mt-2 text-lg font-semibold text-green-600">
            Active
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Last Campaign
          </p>

          <p className="mt-2 text-lg font-semibold text-gray-900">
            {result ? 'Just sent' : 'No campaign'}
          </p>
        </div>
      </div>

      {/* Send Newsletter */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Send Newsletter
          </h2>

          <p className="text-sm text-gray-500">
            Send an email to all active subscribers.
          </p>
        </div>

        <form
          onSubmit={handleSendNewsletter}
          className="space-y-5 p-6"
        >
          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Bamboo Collection is Here!"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Content
            </label>

            <textarea
              rows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your newsletter content here..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            <p className="mt-2 text-xs text-gray-500">
              This message will be sent to all subscribed users.
            </p>
          </div>

          {/* Send button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                sendMutation.isPending ||
                !subscribers.length
              }
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendMutation.isPending
                ? 'Sending...'
                : `Send to ${subscribers.length} Subscribers`}
            </button>
          </div>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h3 className="font-semibold text-green-800">
            Newsletter Sent Successfully
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="text-xl font-bold text-gray-900">
                {result.data?.totalSubscribers ??
                  result.totalSubscribers ??
                  0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Sent
              </p>

              <p className="text-xl font-bold text-green-600">
                {result.data?.sent ?? result.sent ?? 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Failed
              </p>

              <p className="text-xl font-bold text-red-600">
                {result.data?.failed ?? result.failed ?? 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Subscribers
            </h2>

            <p className="text-sm text-gray-500">
              Users currently subscribed to your newsletter.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
            {subscribers.length}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading subscribers...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Failed to load subscribers.
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No subscribers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">
                    #
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Email
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {subscribers.map((subscriber, index) => (
                  <tr
                    key={subscriber._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {subscriber.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Subscribed
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleDelete(subscriber)
                        }
                        disabled={deleteMutation.isPending}
                        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;