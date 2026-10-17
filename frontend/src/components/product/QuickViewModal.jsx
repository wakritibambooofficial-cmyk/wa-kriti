import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import { productApi } from '../../services/productApi';
import { addItem } from '../../store/slices/cartSlice';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

const QuickViewModal = ({ slug, onClose }) => {
  const dispatch = useDispatch();
   const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    productApi
      .getProductBySlug(slug)
      .then((res) => {
        if (mounted) setProduct(res.data.data.product);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  // const handleAddToCart = () => {
  //   dispatch(
  //     addItem({
  //       productId: product._id,
  //       variantId: null,
  //       name: product.name,
  //       image: product.images?.[0]?.url,
  //       price: product.price,
  //       mrp: product.comparePrice,
  //       quantity,
  //       sku: product.sku,
  //       slug: product.slug,
  //     })
  //   );
  //   toast.success('Added to cart');
  //   onClose();
  // };

   const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      productId: product._id,
      variantId: null,
      name: product.name,
      image: product.images?.url,
      price: product.price,
      mrp: product.comparePrice,
      quantity: 1,
      sku: product.sku,
      slug: product.slug,
    });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-bamboo-500 hover:text-bamboo-700" aria-label="Close quick view">
          <FiX size={20} />
        </button>

        {isLoading || !product ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-xl bg-sand-200" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-sand-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-sand-200" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-xl bg-sand-100">
              {product.images?.[0]?.url && (
                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-bamboo-400">{product.category?.name}</p>
              <h2 className="mt-1 font-display text-xl font-bold text-bamboo-800">{product.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-display text-2xl font-semibold text-bamboo-700">₹{product.price}</span>
                {product.comparePrice > product.price && (
                  <span className="text-bamboo-400 line-through">₹{product.comparePrice}</span>
                )}
              </div>
              <p className="mt-3 text-sm text-bamboo-600">{product.shortDescription}</p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-sand-400">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-2.5 py-2 text-bamboo-600 hover:bg-sand-100">
                    <FiMinus size={13} />
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="px-2.5 py-2 text-bamboo-600 hover:bg-sand-100">
                    <FiPlus size={13} />
                  </button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1">Add to Cart</Button>
              </div>

              <Link to={`/product/${product.slug}`} onClick={onClose} className="mt-4 block text-center text-sm font-semibold text-bamboo-600 hover:underline">
                View Full Details
              </Link> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickViewModal;
