import { Link, useLocation } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const OrderFailed = () => {
  const location = useLocation();
  const { message } = location.state || {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
          <FiXCircle size={32} />
        </div>

        <h1 className="font-display text-2xl font-bold text-bamboo-800">Payment Failed</h1>
        <p className="mt-2 text-sm text-bamboo-500">
          {message || 'Something went wrong while processing your payment. Please try again.'}
        </p> 

        <div className="mt-6 flex flex-col gap-3">
          <Link to="/checkout" className="btn-primary">
            Retry Payment
          </Link>
          <Link to="/cart" className="btn-secondary">
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
