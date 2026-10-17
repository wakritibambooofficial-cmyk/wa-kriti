import { Link } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  message = '',
  actionLabel,
  actionTo,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl bg-sand-100 px-6 py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-500">
      <Icon size={28} />
    </div>
    <h3 className="font-display text-lg font-semibold text-bamboo-800">{title}</h3>
    {message && <p className="mt-1.5 max-w-sm text-sm text-bamboo-500">{message}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary mt-6">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
