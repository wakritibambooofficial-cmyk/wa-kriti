import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-sand-100 px-4 text-center">
    <h1 className="font-display text-6xl font-bold text-bamboo-600">404</h1>
    <p className="mt-2 text-lg font-medium text-bamboo-700">Page Not Found</p>
    <p className="mt-1 max-w-sm text-sm text-bamboo-500">
      The page you&apos;re looking for doesn&apos;t exist or may have been moved.
    </p>
    <Link to="/" className="btn-primary mt-6">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
