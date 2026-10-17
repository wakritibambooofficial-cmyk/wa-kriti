import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { notificationApi } from '../../services/cmsApi';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications({ limit: 8 }),
    select: (res) => res.data.data,
    refetchInterval: 60 * 1000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleClickNotification = async (n) => {
    if (!n.read) {
      await notificationApi.markAsRead(n._id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-bamboo-600 hover:bg-sand-100"
        aria-label="Notifications"
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl bg-white p-3 shadow-soft-lg">
            <div className="flex items-center justify-between px-2 pb-2">
              <h3 className="text-sm font-semibold text-bamboo-800">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs font-medium text-bamboo-500 hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-bamboo-400">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n._id}
                    to={n.link || '#'}
                    onClick={() => handleClickNotification(n)}
                    className={`block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-sand-100 ${
                      !n.read ? 'bg-bamboo-50' : ''
                    }`}
                  >
                    <p className="font-medium text-bamboo-800">{n.title}</p>
                    <p className="mt-0.5 text-xs text-bamboo-500">{n.message}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
