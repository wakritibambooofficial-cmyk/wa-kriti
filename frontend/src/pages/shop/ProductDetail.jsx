

// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { useSelector } from 'react-redux';
// import { Helmet } from 'react-helmet-async';
// import { FiHeart, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

// import { productApi } from '../../services/productApi';
// import { engagementApi } from '../../services/growthApi';
// import ProductGallery from '../../components/product/ProductGallery';
// import ProductCard from '../../components/product/ProductCard';
// import ShareButtons from '../../components/product/ShareButtons';
// import NotifyMeButton from '../../components/product/NotifyMeButton';
// import StickyMobileAddToCart from '../../components/product/StickyMobileAddToCart';
// import RecentlyViewedRail from '../../components/product/RecentlyViewedRail';
// import ReviewSection from '../../components/review/ReviewSection';
// import Button from '../../components/ui/Button';
// import EmptyState from '../../components/ui/EmptyState';
// import { useCart } from '../../hooks/useCart';
// import { useWishlist } from '../../hooks/useWishlist';

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const { addToCart } = useCart();
//   const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
//   const [quantity, setQuantity] = useState(1);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['product', slug],
//     queryFn: () => productApi.getProductBySlug(slug),
//     select: (res) => res.data.data.product,
//   });

//   useEffect(() => {
//     if (isAuthenticated && data?._id) {
//       engagementApi.trackRecentlyViewed(data._id).catch(() => {});
//     }
//   }, [isAuthenticated, data?._id]);

//   const { data: related } = useQuery({
//     queryKey: ['product-related', slug],
//     queryFn: () => productApi.getRelatedProducts(slug),
//     select: (res) => res.data.data.products,
//     enabled: Boolean(data),
//   });

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-6xl px-4 py-12">
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
//           <div className="aspect-square animate-pulse rounded-2xl bg-sand-200" />
//           <div className="space-y-4">
//             <div className="h-4 w-1/3 animate-pulse rounded bg-sand-200" />
//             <div className="h-8 w-2/3 animate-pulse rounded bg-sand-200" />
//             <div className="h-6 w-1/4 animate-pulse rounded bg-sand-200" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <div className="mx-auto max-w-2xl px-4 py-20">
//         <EmptyState
//           title="Product Not Found"
//           message="This product may have been removed or the link is incorrect."
//           actionLabel="Continue Shopping"
//           actionTo="/shop"
//         />
//       </div>
//     );
//   }

//   const product = data;
//   const availableStock = product.stockQuantity - product.reservedStock;
//   const discount =
//     product.comparePrice > product.price
//       ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
//       : 0;
//   const isWishlisted = checkIsWishlisted(product._id);

//   const handleAddToCart = () => {
//     addToCart({
//       productId: product._id,
//       variantId: null,
//       name: product.name,
//       image: product.images?.[0]?.url,
//       price: product.price,
//       mrp: product.comparePrice,
//       quantity,
//       sku: product.sku,
//       slug: product.slug,
//     });
//   };

//   const handleWishlist = () => {
//     toggleWishlist({
//       productId: product._id,
//       name: product.name,
//       image: product.images?.[0]?.url,
//       price: product.price,
//       slug: product.slug,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet>
//         <title>{product.metaTitle || product.name}</title>
//         <meta name="description" content={product.metaDescription || product.shortDescription} />
//       </Helmet>

//       {/* Breadcrumb */}
//       <div className="mx-auto max-w-6xl px-4 pt-6 text-sm text-bamboo-500">
//         <Link to="/" className="hover:underline">Home</Link> {' > '}
//         <Link to="/shop" className="hover:underline">Shop</Link> {' > '}
//         {product.category?.name && (
//           <>
//             <Link to={`/shop?category=${product.category._id}`} className="hover:underline">
//               {product.category.name}
//             </Link>{' '}
//             {' > '} 
//           </>  
//         )}
//         <span className="text-bamboo-700">{product.name}</span>
//       </div>

//       <div className="mx-auto max-w-6xl px-4 py-8">
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
//           <ProductGallery images={product.images} productName={product.name} />

//           <div>
//             <p className="text-xs uppercase tracking-wide text-bamboo-400">{product.category?.name}</p>
//             <h1 className="mt-1 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">{product.name}</h1>

//             <div className="mt-2 flex items-center gap-2 text-sm text-bamboo-500">
//               {product.ratingsCount > 0 ? (
//                 <a href="#reviews" className="hover:underline">
//                   ★ {product.ratingsAverage?.toFixed(1)} ({product.ratingsCount} reviews)
//                 </a>
//               ) : (
//                 <a href="#reviews" className="hover:underline">No reviews yet</a>
//               )}
//               <span>·</span>
//               <span>SKU: {product.sku}</span>
//             </div>

//             <div className="mt-4 flex items-center gap-3">
//               <span className="font-display text-3xl font-bold text-bamboo-700">₹{product.price}</span>
//               {product.comparePrice > product.price && (
//                 <>
//                   <span className="text-lg text-bamboo-400 line-through">₹{product.comparePrice}</span>
//                   <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
//                     {discount}% OFF
//                   </span>
//                 </>
//               )}
//             </div>

//             <p className="mt-4 text-sm leading-relaxed text-bamboo-600">{product.shortDescription}</p>

//             <div className="mt-4 flex flex-wrap gap-2">
//               {product.isHandmade && <TrustTag label="Handmade" />}
//               {product.isEcoFriendly && <TrustTag label="Eco Friendly" />}
//               {product.isMadeInIndia && <TrustTag label="Made in India" />}
//               {product.isTribalArtisanProduct && <TrustTag label="Tribal Artisan" />}
//             </div>

//             <p className="mt-4 text-sm font-medium">
//               {availableStock > 0 ? (
//                 availableStock <= product.minStockLevel ? (
//                   <span className="text-orange-600">Only {availableStock} left in stock</span>
//                 ) : (
//                   <span className="text-bamboo-600">In Stock</span>
//                 )
//               ) : (
//                 <span className="text-red-500">Out of Stock</span>
//               )}
//             </p>

//             {availableStock <= 0 && (
//               <div className="mt-3">
//                 <NotifyMeButton productId={product._id} />
//               </div>
//             )}

//             {/* Quantity + actions */}
//             <div className="mt-6 flex items-center gap-3"> 
//               <div className="flex items-center rounded-xl border border-sand-400">
//                 <button
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="px-3 py-2.5 text-bamboo-600 hover:bg-sand-100"
//                   aria-label="Decrease quantity"
//                 >
//                   <FiMinus size={14} />
//                 </button>
//                 <span className="w-10 text-center text-sm font-medium">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity((q) => Math.min(availableStock || 1, q + 1))}
//                   className="px-3 py-2.5 text-bamboo-600 hover:bg-sand-100"
//                   aria-label="Increase quantity"
//                 >
//                   <FiPlus size={14} />
//                 </button>
//               </div>

//               <Button onClick={handleAddToCart} disabled={availableStock <= 0} className="flex-1">
//                 Add to Cart
//               </Button>

//               <button
//                 onClick={handleWishlist}
//                 className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand-400 text-bamboo-500 hover:bg-sand-100"
//                 aria-label="Add to wishlist"
//               >
//                 <FiHeart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
//               </button>
//             </div>

//             <div className="mt-4 flex items-center gap-3">
//               <span className="text-xs font-medium text-bamboo-500">Share:</span>
//               <ShareButtons url={`${window.location.origin}/product/${product.slug}`} text={`Check out ${product.name} on Wa-Kriti`} />
//             </div>

//             {/* Trust / delivery info */}
//             <div className="mt-8 space-y-3 rounded-2xl bg-white p-5 shadow-soft">
//               <InfoRow icon={FiTruck} text={`Estimated delivery in ${product.estimatedDeliveryDays || 5} days`} />
//               <InfoRow icon={FiShield} text={product.warranty || 'Quality guaranteed craftsmanship'} />
//               <InfoRow icon={FiRefreshCw} text={product.returnPolicy || 'Easy returns within 7 days'} />
//             </div>
//           </div>
//         </div>

//         {/* Description & specs */}
//         <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             <h2 className="font-display text-xl font-semibold text-bamboo-800">Product Description</h2>
//             <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-bamboo-600">
//               {product.longDescription || product.shortDescription}
//             </p>

//             {product.careInstructions && (
//               <>
//                 <h3 className="mt-8 font-display text-lg font-semibold text-bamboo-800">Care Instructions</h3>
//                 <p className="mt-2 whitespace-pre-line text-sm text-bamboo-600">{product.careInstructions}</p>
//               </>
//             )}
//           </div>

//           <div>
//             <h2 className="font-display text-xl font-semibold text-bamboo-800">Specifications</h2>
//             <dl className="mt-3 divide-y divide-sand-300 rounded-xl bg-white shadow-soft">
//               <SpecRow label="Material" value={product.material} />
//               <SpecRow label="Color" value={product.color} />
//               <SpecRow label="Finish" value={product.finish} />
//               <SpecRow label="Weight" value={product.weight ? `${product.weight} kg` : null} />
//               <SpecRow
//                 label="Dimensions"
//                 value={
//                   product.dimensions?.length
//                     ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`
//                     : null
//                 }
//               />
//               <SpecRow label="Origin" value={product.productOrigin} />
//               <SpecRow label="Warranty" value={product.warranty} />
//             </dl>
//           </div>
//         </div>

//         {/* Customer reviews */}
//         <ReviewSection product={product} />

//         {/* Related products */}
//         {related?.length > 0 && (
//           <div className="mt-16">
//             <h2 className="font-display text-xl font-semibold text-bamboo-800">You May Also Like</h2>
//             <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               {related.map((p) => (
//                 <ProductCard key={p._id} product={p} />
//               ))}
//             </div>
//           </div>
//         )}

//         <RecentlyViewedRail excludeSlug={product.slug} />
//       </div>

//       <StickyMobileAddToCart
//         price={product.price}
//         onAddToCart={handleAddToCart}
//         disabled={availableStock <= 0}
//         visible
//       />
//     </div>
//   );
// };

// const TrustTag = ({ label }) => (
//   <span className="rounded-full bg-bamboo-100 px-3 py-1 text-xs font-semibold text-bamboo-700">{label}</span>
// );

// const InfoRow = ({ icon: Icon, text }) => (
//   <div className="flex items-center gap-3 text-sm text-bamboo-600">
//     <Icon size={18} className="shrink-0 text-bamboo-500" />
//     <span>{text}</span>
//   </div>
// );

// const SpecRow = ({ label, value }) => {
//   if (!value) return null;
//   return (
//     <div className="flex justify-between px-4 py-3 text-sm">
//       <dt className="text-bamboo-500">{label}</dt>
//       <dd className="font-medium text-bamboo-800">{value}</dd>
//     </div>
//   );
// };

// export default ProductDetail;



import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiThumbsUp,
  FiLock,
  FiRepeat,
  FiFeather,
  FiDroplet,
  FiAward,
} from 'react-icons/fi';

import { productApi } from '../../services/productApi';
import { engagementApi } from '../../services/growthApi';
import ProductGallery from '../../components/product/ProductGallery';
import ProductCard from '../../components/product/ProductCard';
import ShareButtons from '../../components/product/ShareButtons';
import NotifyMeButton from '../../components/product/NotifyMeButton';
import StickyMobileAddToCart from '../../components/product/StickyMobileAddToCart';
import RecentlyViewedRail from '../../components/product/RecentlyViewedRail';
import ReviewSection from '../../components/review/ReviewSection';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

/* ------------------------------------------------------------------ */
/* Store-wide support details – replace with your real values          */
/* (or move to a shared config file / env vars)                        */
/* ------------------------------------------------------------------ */
const SUPPORT = {
  hours: 'Mon-Sat : 11:00 AM - 7:00 PM',
  whatsapp: '+91 00000 00000', // display text
  whatsappLink: '910000000000', // digits only, with country code
  email: 'contact@wa-kriti.com',
};

const WHY_CHOOSE_US = [
  { icon: FiShield, title: 'Quality Products', subtitle: '100% Premium' },
  { icon: FiThumbsUp, title: 'Customers', subtitle: '50K+ Happy' },
  { icon: FiTruck, title: 'Shipping', subtitle: 'Direct Shipping' },
  { icon: FiLock, title: 'Secure 100%', subtitle: 'Online Shopping' },
];

/*
 * Sustainability features. Each product can switch them on/off with
 * product.sustainability = { reusable, compostable, bpaFree, durable }.
 * If a product has no `sustainability` object, all four show when the
 * product is marked isEcoFriendly.
 */
const SUSTAINABILITY_FEATURES = [
  { key: 'reusable', label: 'Reusable', icon: FiRepeat, note: 'Made to be used again and again.' },
  { key: 'compostable', label: 'Compostable', icon: FiFeather, note: 'Returns to the soil at end of life.' },
  { key: 'bpaFree', label: 'BPA Free', icon: FiDroplet, note: 'No harmful plastics or chemicals.' },
  { key: 'durable', label: 'Durable', icon: FiAward, note: 'Built to last, so less gets thrown away.' },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { addToCart } = useCart();
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug),
    select: (res) => res.data.data.product,
  });

  useEffect(() => {
    if (isAuthenticated && data?._id) {
      engagementApi.trackRecentlyViewed(data._id).catch(() => {});
    }
  }, [isAuthenticated, data?._id]);

  const { data: related } = useQuery({
    queryKey: ['product-related', slug],
    queryFn: () => productApi.getRelatedProducts(slug),
    select: (res) => res.data.data.products,
    enabled: Boolean(data),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-sand-200" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-sand-200" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-sand-200" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-sand-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Product Not Found"
          message="This product may have been removed or the link is incorrect."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  const product = data;
  const availableStock = product.stockQuantity - product.reservedStock;
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;
  const isWishlisted = checkIsWishlisted(product._id);

  const activeSustainability = SUSTAINABILITY_FEATURES.filter((f) =>
    product.sustainability ? product.sustainability[f.key] : product.isEcoFriendly
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      variantId: null,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.price,
      mrp: product.comparePrice,
      quantity,
      sku: product.sku,
      slug: product.slug,
    });
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.price,
      slug: product.slug,
    });
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet>
        <title>{product.metaTitle || product.name}</title>
        <meta name="description" content={product.metaDescription || product.shortDescription} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-6 text-sm text-bamboo-500">
        <Link to="/" className="hover:underline">Home</Link> {' > '}
        <Link to="/shop" className="hover:underline">Shop</Link> {' > '}
        {product.category?.name && (
          <>
            <Link to={`/shop?category=${product.category._id}`} className="hover:underline">
              {product.category.name}
            </Link>{' '}
            {' > '}
          </>
        )}
        <span className="text-bamboo-700">{product.name}</span>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            <p className="text-xs uppercase tracking-wide text-bamboo-400">{product.category?.name}</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">{product.name}</h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-bamboo-500">
              {product.ratingsCount > 0 ? (
                <a href="#reviews" className="hover:underline">
                  ★ {product.ratingsAverage?.toFixed(1)} ({product.ratingsCount} reviews)
                </a>
              ) : (
                <a href="#reviews" className="hover:underline">No reviews yet</a>
              )}
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-bamboo-700">₹{product.price}</span>
              {product.comparePrice > product.price && (
                <>
                  <span className="text-lg text-bamboo-400 line-through">₹{product.comparePrice}</span>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-bamboo-600">{product.shortDescription}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.isHandmade && <TrustTag label="Handmade" />}
              {product.isEcoFriendly && <TrustTag label="Eco Friendly" />}
              {product.isMadeInIndia && <TrustTag label="Made in India" />}
              {product.isTribalArtisanProduct && <TrustTag label="Tribal Artisan" />}
            </div>

            <p className="mt-4 text-sm font-medium">
              {availableStock > 0 ? (
                availableStock <= product.minStockLevel ? (
                  <span className="text-orange-600">Only {availableStock} left in stock</span>
                ) : (
                  <span className="text-bamboo-600">In Stock</span>
                )
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </p>

            {availableStock <= 0 && (
              <div className="mt-3">
                <NotifyMeButton productId={product._id} />
              </div>
            )}

            {/* Quantity + actions */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-sand-400">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-bamboo-600 hover:bg-sand-100"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(availableStock || 1, q + 1))}
                  className="px-3 py-2.5 text-bamboo-600 hover:bg-sand-100"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <Button onClick={handleAddToCart} disabled={availableStock <= 0} className="flex-1">
                Add to Cart
              </Button>

              <button
                onClick={handleWishlist}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-sand-400 text-bamboo-500 hover:bg-sand-100"
                aria-label="Add to wishlist"
              >
                <FiHeart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-medium text-bamboo-500">Share:</span>
              <ShareButtons url={`${window.location.origin}/product/${product.slug}`} text={`Check out ${product.name} on Wa-Kriti`} />
            </div>

            {/* Trust / delivery info */}
            <div className="mt-8 space-y-3 rounded-2xl bg-white p-5 shadow-soft">
              <InfoRow icon={FiTruck} text={`Estimated delivery in ${product.estimatedDeliveryDays || 5} days`} />
              <InfoRow icon={FiShield} text={product.warranty || 'Quality guaranteed craftsmanship'} />
              <InfoRow icon={FiRefreshCw} text={product.returnPolicy || 'Easy returns within 7 days'} />
            </div>

            {/* Need help */}
            <HelpBlock />

            {/* Why choose us */}
            <div className="mt-6">
              <h2 className="border-b border-sand-300 pb-2 text-sm font-semibold text-bamboo-800">
                Why choose us
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {WHY_CHOOSE_US.map((item) => (
                  <WhyTile key={item.title} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability / what makes this product unique */}
        {(activeSustainability.length > 0 || product.sustainabilityNote) && (
          <section className="mt-14" aria-labelledby="unique-heading">
            <h2
              id="unique-heading"
              className="border-b border-bamboo-700 pb-2 font-display text-xl font-semibold text-bamboo-800"
            >
              What makes this product unique
            </h2>

            {product.sustainabilityNote && (
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-bamboo-600">
                {product.sustainabilityNote}
              </p>
            )}

            {activeSustainability.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {activeSustainability.map(({ key, label, icon: Icon, note }) => (
                  <li key={key} className="flex flex-col items-center text-center">
                    <Icon size={32} className="text-bamboo-700" aria-hidden="true" />
                    <span className="mt-3 text-sm font-semibold text-bamboo-800">{label}</span>
                    <span className="mt-1 text-xs text-bamboo-500">{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Description & specs */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold text-bamboo-800">Product Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-bamboo-600">
              {product.longDescription || product.shortDescription}
            </p>

            {product.careInstructions && (
              <>
                <h3 className="mt-8 font-display text-lg font-semibold text-bamboo-800">Care Instructions</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-bamboo-600">{product.careInstructions}</p>
              </>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-bamboo-800">Specifications</h2>
            <dl className="mt-3 divide-y divide-sand-300 rounded-xl bg-white shadow-soft">
              <SpecRow label="Material" value={product.material} />
              <SpecRow label="Color" value={product.color} />
              <SpecRow label="Finish" value={product.finish} />
              <SpecRow label="Weight" value={product.weight ? `${product.weight} kg` : null} />
              <SpecRow
                label="Dimensions"
                value={
                  product.dimensions?.length
                    ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`
                    : null
                }
              />
              <SpecRow label="Origin" value={product.productOrigin} />
              <SpecRow label="Warranty" value={product.warranty} />
            </dl>
          </div>
        </div>

        {/* Customer reviews */}
        <ReviewSection product={product} />

        {/* Related products */}
        {related?.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold text-bamboo-800">You May Also Like</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        <RecentlyViewedRail excludeSlug={product.slug} />
      </div>

      <StickyMobileAddToCart
        price={product.price}
        onAddToCart={handleAddToCart}
        disabled={availableStock <= 0}
        visible
      />
    </div>
  );
};

const TrustTag = ({ label }) => (
  <span className="rounded-full bg-bamboo-100 px-3 py-1 text-xs font-semibold text-bamboo-700">{label}</span>
);

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-bamboo-600">
    <Icon size={18} className="shrink-0 text-bamboo-500" />
    <span>{text}</span>
  </div>
);

const HelpBlock = () => (
  <div className="mt-6 rounded-2xl border border-sand-300 bg-white p-5">
    <p className="text-sm font-semibold text-bamboo-800">
      Need help? <span className="font-normal text-bamboo-600">{SUPPORT.hours}</span>
    </p>
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <a
        href={`https://wa.me/${SUPPORT.whatsappLink}?text=${encodeURIComponent('Hi, I need help with an order.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 text-sm text-bamboo-600 hover:text-bamboo-800"
      >
        <FiPhone size={18} className="mt-0.5 shrink-0 text-bamboo-500" />
        <span>
          WhatsApp us at
          <br />
          <span className="font-medium text-bamboo-800">{SUPPORT.whatsapp}</span>
        </span>
      </a>
      <a
        href={`mailto:${SUPPORT.email}`}
        className="flex items-start gap-3 text-sm text-bamboo-600 hover:text-bamboo-800"
      >
        <FiMail size={18} className="mt-0.5 shrink-0 text-bamboo-500" />
        <span>
          Write to us at
          <br />
          <span className="break-all font-medium text-bamboo-800">{SUPPORT.email}</span>
        </span>
      </a>
    </div>
  </div>
);

const WhyTile = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 rounded-lg bg-bamboo-800 px-4 py-3 text-white">
    <Icon size={18} className="shrink-0" aria-hidden="true" />
    <div className="leading-tight">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-white/80">{subtitle}</p>
    </div>
  </div>
);

const SpecRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between px-4 py-3 text-sm">
      <dt className="text-bamboo-500">{label}</dt>
      <dd className="font-medium text-bamboo-800">{value}</dd>
    </div>
  );
};

export default ProductDetail;