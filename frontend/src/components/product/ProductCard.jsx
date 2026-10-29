


// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { FiHeart, FiShoppingBag, FiEye, FiShare2, FiRepeat } from 'react-icons/fi';
// import { useDispatch, useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { addToCompare, removeFromCompare } from '../../store/slices/compareSlice';
// import QuickViewModal from './QuickViewModal';
// import { shareProduct } from '../../utils/shareProduct';
// import { useCart } from '../../hooks/useCart';
// import { useWishlist } from '../../hooks/useWishlist';

// const Badge = ({ children, className }) => (
//   <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${className}`}>
//     {children}
//   </span>
// );

// const ProductCard = ({ product }) => {

//   const dispatch = useDispatch();
//   const { addToCart } = useCart();
//   const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
//   const isWishlisted = checkIsWishlisted(product._id);
//   const compareItems = useSelector((state) => state.compare.items);
//   const isCompared = compareItems.some((p) => p._id === product._id);
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

//   const primaryImage = product.images?.find((img) => img.type === 'primary') || product.images?.[0];
//   const secondaryImage = product.images?.[1];

//   const discount =
//     product.comparePrice && product.comparePrice > product.price
//       ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
//       : 0;

//   const handleWishlistToggle = (e) => {
//     e.preventDefault();
//     toggleWishlist({
//       productId: product._id,
//       name: product.name,
//       image: primaryImage?.url,
//       price: product.price,
//       slug: product.slug,
//     });
//   };

//   const handleCompareToggle = (e) => {
//     e.preventDefault();
//     if (isCompared) {
//       dispatch(removeFromCompare(product._id));
//     } else {
//       dispatch(addToCompare(product));
//       toast.success('Added to compare');
//     }
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     addToCart({
//       productId: product._id,
//       variantId: null,
//       name: product.name,
//       image: primaryImage?.url,
//       price: product.price,
//       mrp: product.comparePrice,
//       quantity: 1,
//       sku: product.sku,
//       slug: product.slug,
//     });
//   };

//   return (
//     <Link to={`/product/${product.slug}`} className="card group relative block overflow-hidden">
//       <div className="relative aspect-square overflow-hidden bg-sand-100">
//         {primaryImage?.url ? (
//           <img
//             src={primaryImage.url}
//             alt={primaryImage.altText || product.name}
//             loading="lazy"
//             className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center text-bamboo-300">No Image</div>
//         )}
//         {secondaryImage?.url && (
//           <img
//             src={secondaryImage.url}
//             alt={product.name}
//             loading="lazy"
//             className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
//           />
//         )}

//         <div className="absolute left-3 top-3 flex flex-col gap-1.5">
//           {discount > 0 && <Badge className="bg-red-500 text-white">{discount}% Off</Badge>}
//           {product.isNewArrival && <Badge className="bg-bamboo-600 text-white">New</Badge>}
//           {product.isBestSeller && <Badge className="bg-earth-500 text-white">Best Seller</Badge>}
//           {product.isEcoFriendly && <Badge className="bg-bamboo-100 text-bamboo-700">Eco</Badge>}
//         </div>

//         <button
//           onClick={handleWishlistToggle}
//           className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-bamboo-600 shadow-soft transition-transform hover:scale-110"
//           aria-label="Toggle wishlist"
//         >
//           <FiHeart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
//         </button>

//         <button
//           onClick={handleCompareToggle}
//           className={`absolute right-3 top-14 flex h-9 w-9 items-center justify-center rounded-full shadow-soft transition-transform hover:scale-110 ${
//             isCompared ? 'bg-bamboo-600 text-white' : 'bg-white/90 text-bamboo-600'
//           }`}
//           aria-label="Toggle compare"
//           title="Add to Compare"
//         >
//           <FiRepeat size={15} />
//         </button>

//         <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//           <button
//             onClick={handleAddToCart}
//             className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-bamboo-600 py-2 text-xs font-semibold text-white shadow-soft hover:bg-bamboo-700"
//           >
//             <FiShoppingBag size={14} /> Add to Cart
//           </button>
//           <button
//             className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-bamboo-600 shadow-soft hover:bg-bamboo-50"
//             aria-label="Quick view"
//             onClick={(e) => {
//               e.preventDefault();
//               setIsQuickViewOpen(true);
//             }}
//           >
//             <FiEye size={16} />
//           </button>
//           <button
//             className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-bamboo-600 shadow-soft hover:bg-bamboo-50"
//             aria-label="Share product"
//             onClick={(e) => {
//               e.preventDefault();
//               shareProduct(product);
//             }}
//           >
//             <FiShare2 size={16} />
//           </button>
//         </div>
//       </div>

//       <div className="p-4">
//         <p className="truncate text-xs uppercase tracking-wide text-bamboo-400">{product.category?.name}</p>
//         <h3 className="mt-1 truncate font-medium text-bamboo-800">{product.name}</h3>
//         <div className="mt-2 flex items-center gap-2">
//           <span className="font-display text-lg font-semibold text-bamboo-700">₹{product.price}</span>
//           {product.comparePrice > product.price && (
//             <span className="text-sm text-bamboo-400 line-through">₹{product.comparePrice}</span>
//           )}
//         </div>
//         {product.ratingsCount > 0 && (
//           <p className="mt-1 text-xs text-bamboo-400">
//             ★ {product.ratingsAverage?.toFixed(1)} ({product.ratingsCount})
//           </p>
//         )}
//       </div>

//       {isQuickViewOpen && (
//         <QuickViewModal
//           slug={product.slug}
//           onClose={(e) => {
//             e?.preventDefault?.();
//             setIsQuickViewOpen(false);
//           }}
//         />
//       )}
//     </Link>
//   );
// };

// export default ProductCard;



import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiHeart, FiShoppingBag, FiEye, FiShare2, FiRepeat } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCompare, removeFromCompare } from '../../store/slices/compareSlice';
import QuickViewModal from './QuickViewModal';
import { shareProduct } from '../../utils/shareProduct';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

/* Badges are smaller on mobile so they don't dominate the image */
const Badge = ({ children, className }) => (
  <span
    className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide sm:px-2.5 sm:py-1 sm:text-[10px] ${className}`}
  >
    {children}
  </span>
);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkIsWishlisted(product._id);
  const compareItems = useSelector((state) => state.compare.items);
  const isCompared = compareItems.some((p) => p._id === product._id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const primaryImage = product.images?.find((img) => img.type === 'primary') || product.images?.[0];
  const secondaryImage = product.images?.[1];

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    toggleWishlist({
      productId: product._id,
      name: product.name,
      image: primaryImage?.url,
      price: product.price,
      slug: product.slug,
    });
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    if (isCompared) {
      dispatch(removeFromCompare(product._id));
    } else {
      dispatch(addToCompare(product));
      toast.success('Added to compare');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      productId: product._id,
      variantId: null,
      name: product.name,
      image: primaryImage?.url,
      price: product.price,
      mrp: product.comparePrice,
      quantity: 1,
      sku: product.sku,
      slug: product.slug,
    });
  };

  return (
    <Link to={`/product/${product.slug}`} className="card group relative block overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-sand-100">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-bamboo-300 sm:text-sm">
            No Image
          </div>
        )}
        {secondaryImage?.url && (
          <img
            src={secondaryImage.url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
          />
        )}

        {/* Badges: on mobile only the discount shows, so the image stays clean */}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {discount > 0 && <Badge className="bg-red-500 text-white">{discount}% Off</Badge>}
          {product.isNewArrival && <Badge className="hidden bg-bamboo-600 text-white sm:inline-block">New</Badge>}
          {product.isBestSeller && <Badge className="hidden bg-earth-500 text-white sm:inline-block">Best Seller</Badge>}
          {product.isEcoFriendly && <Badge className="hidden bg-bamboo-100 text-bamboo-700 sm:inline-block">Eco</Badge>}
        </div>

        <button
          onClick={handleWishlistToggle}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-bamboo-600 shadow-soft transition-transform hover:scale-110 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
          aria-label="Toggle wishlist"
        >
          <FiHeart size={14} className={`sm:h-4 sm:w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        <button
          onClick={handleCompareToggle}
          className={`absolute right-2 top-11 flex h-7 w-7 items-center justify-center rounded-full shadow-soft transition-transform hover:scale-110 sm:right-3 sm:top-14 sm:h-9 sm:w-9 ${
            isCompared ? 'bg-bamboo-600 text-white' : 'bg-white/90 text-bamboo-600'
          }`}
          aria-label="Toggle compare"
          title="Add to Compare"
        >
          <FiRepeat size={13} className="sm:h-[15px] sm:w-[15px]" />
        </button>

        {/* Mobile: always-visible cart button (hover doesn't exist on touch) */}
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-bamboo-600 text-white shadow-soft active:scale-95 sm:hidden"
        >
          <FiShoppingBag size={14} />
        </button>

        {/* Desktop: hover action bar */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-bamboo-600 py-2 text-xs font-semibold text-white shadow-soft hover:bg-bamboo-700"
          >
            <FiShoppingBag size={14} /> Add to Cart
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-bamboo-600 shadow-soft hover:bg-bamboo-50"
            aria-label="Quick view"
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
          >
            <FiEye size={16} />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-bamboo-600 shadow-soft hover:bg-bamboo-50"
            aria-label="Share product"
            onClick={(e) => {
              e.preventDefault();
              shareProduct(product);
            }}
          >
            <FiShare2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-2.5 sm:p-4">
        <p className="truncate text-[10px] uppercase tracking-wide text-bamboo-400 sm:text-xs">
          {product.category?.name}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-bamboo-800 sm:mt-1 sm:truncate sm:text-base">
          {product.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5 sm:mt-2 sm:gap-2">
          <span className="font-display text-base font-semibold text-bamboo-700 sm:text-lg">₹{product.price}</span>
          {product.comparePrice > product.price && (
            <span className="text-xs text-bamboo-400 line-through sm:text-sm">₹{product.comparePrice}</span>
          )}
        </div>
        {product.ratingsCount > 0 && (
          <p className="mt-0.5 text-[11px] text-bamboo-400 sm:mt-1 sm:text-xs">
            ★ {product.ratingsAverage?.toFixed(1)} ({product.ratingsCount})
          </p>
        )}
      </div>

      {isQuickViewOpen && (
        <QuickViewModal
          slug={product.slug}
          onClose={(e) => {
            e?.preventDefault?.();
            setIsQuickViewOpen(false);
          }}
        />
      )}
    </Link>
  );
};

export default ProductCard;