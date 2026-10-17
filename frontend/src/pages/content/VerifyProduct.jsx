import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { verifyApi } from '../../services/growthApi';

const VerifyProduct = () => {
  const { serialNumber } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['verify', serialNumber],
    queryFn: () => verifyApi.verifyProduct(serialNumber),
    select: (res) => res.data.data,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 px-4">
      <Helmet><title>Product Authenticity Verification</title></Helmet>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft-lg">
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-sand-200" />
        ) : data?.authentic ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <FiCheckCircle size={32} />
            </div>
            <h1 className="font-display text-xl font-bold text-bamboo-800">Genuine Wa-Kriti Product</h1>
            <p className="mt-2 text-sm text-bamboo-500">This product has been verified as authentic.</p>

            <div className="mt-5 rounded-xl bg-sand-100 p-4 text-left text-sm">
              <p><span className="font-semibold text-bamboo-700">Product:</span> {data.product.name}</p>
              <p><span className="font-semibold text-bamboo-700">Material:</span> {data.product.material}</p>
              {data.product.productOrigin && <p><span className="font-semibold text-bamboo-700">Origin:</span> {data.product.productOrigin}</p>}
              {data.product.artisan?.name && <p><span className="font-semibold text-bamboo-700">Artisan:</span> {data.product.artisan.name}</p>}
            </div>

            <Link to={`/product/${data.product.slug}`} className="btn-primary mt-6 inline-block">View Product</Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <FiXCircle size={32} />
            </div>
            <h1 className="font-display text-xl font-bold text-bamboo-800">Could Not Verify</h1>
            <p className="mt-2 text-sm text-bamboo-500">
              This serial number doesn&apos;t match any Wa-Kriti product. If you believe this is an error, please contact support.
            </p>
            <Link to="/contact" className="btn-secondary mt-6 inline-block">Contact Support</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyProduct;
