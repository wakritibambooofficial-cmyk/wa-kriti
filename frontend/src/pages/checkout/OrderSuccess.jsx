// import { Link, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiCheckCircle } from 'react-icons/fi';

// const OrderSuccess = () => {
//   const location = useLocation();
//   const { orderNumber, orderId } = location.state || {};

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-bamboo-50 to-sand-100 px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft-lg"
//       > 
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
//           className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600"
//         >
//           <FiCheckCircle size={32} />
//         </motion.div>

//         <h1 className="font-display text-2xl font-bold text-bamboo-800">Order Placed!</h1>
//         <p className="mt-2 text-sm text-bamboo-500">
//           Thank you for choosing Wa-Kriti. Your order has been confirmed.
//         </p>

//         {orderNumber && (
//           <div className="mt-5 rounded-xl bg-sand-100 px-4 py-3">
//             <p className="text-xs uppercase tracking-wide text-bamboo-400">Order Number</p>
//             <p className="font-display text-lg font-semibold text-bamboo-800">{orderNumber}</p>
//           </div>
//         )}

//         <div className="mt-6 flex flex-col gap-3">
//           {orderId && (
//             <Link to={`/dashboard/orders/${orderId}`} className="btn-primary">
//               Track Order
//             </Link>
//           )}
//           <Link to="/shop" className="btn-secondary">
//             Continue Shopping
//           </Link>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default OrderSuccess;

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

import DeliveryRouteMap from './Deliveryroutemap';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderNumber, orderId, shippingAddress } = location.state || {};

  // TEMP: remove once the map is confirmed working.
  // If shippingAddress logs as undefined, the fix is in Checkout.jsx,
  // not here — the navigate() calls aren't passing it.
  console.log('order-success state:', location.state);

  const eta = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-bamboo-50 to-sand-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-soft-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600"
        >
          <FiCheckCircle size={32} />
        </motion.div>

        <h1 className="font-display text-2xl font-bold text-bamboo-800">Order Placed!</h1>
        <p className="mt-2 text-sm text-bamboo-500">
          Thank you for choosing Wa-Kriti. Your order has been confirmed.
        </p>

        {orderNumber && (
          <div className="mt-5 rounded-xl bg-sand-100 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-bamboo-400">Order Number</p>
            <p className="font-display text-lg font-semibold text-bamboo-800">{orderNumber}</p>
          </div>
        )}

        {shippingAddress && (
          <div className="mt-6">
            <h2 className="mb-3 text-left font-display text-base font-semibold text-bamboo-800">
              Your order is on its way
            </h2>
            <DeliveryRouteMap address={shippingAddress} eta={eta} />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {orderId && (
            <Link to={`/dashboard/orders/${orderId}`} className="btn-primary">
              Track Order
            </Link>
          )}
          <Link to="/shop" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;