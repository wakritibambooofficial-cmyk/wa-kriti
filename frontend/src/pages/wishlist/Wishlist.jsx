import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

import { wishlistApi } from '../../services/commerceApi';
import { removeFromWishlist as removeGuestWishlistItem } from '../../store/slices/wishlistSlice';
import { addItem as addGuestCartItem } from '../../store/slices/cartSlice';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button'; 

const Wishlist = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const guestItems = useSelector((state) => state.wishlist.items);

  const { data: serverWishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.getWishlist(),
    select: (res) => res.data.data.wishlist,
    enabled: isAuthenticated,
  });

  const items = isAuthenticated ? serverWishlist?.items || [] : guestItems;

  const handleRemove = async (item) => {
    if (isAuthenticated) {
      await wishlistApi.removeItem(item.product);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } else {
      dispatch(removeGuestWishlistItem(item.productId));
    }
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = async (item) => {
    if (isAuthenticated) {
      await wishlistApi.moveToCart(item.product);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } else {
      dispatch(
        addGuestCartItem({
          productId: item.productId,
          variantId: null,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: 1,
          slug: item.slug,
        })
      );
      dispatch(removeGuestWishlistItem(item.productId));
    }
    toast.success('Moved to cart');
  };

  if (isAuthenticated && isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-8 w-40 animate-pulse rounded bg-sand-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Your Wishlist</title></Helmet>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Your Wishlist</h1>

        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Your wishlist is empty"
              message="Save products you love and come back to them anytime."
              actionLabel="Explore Products"
              actionTo="/shop"
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => {
              const productId = item.product || item.productId;
              return (
                <div key={item._id || productId} className="card overflow-hidden">
                  <Link to={`/product/${item.slug}`} className="block aspect-square overflow-hidden bg-sand-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-bamboo-300">No Image</div>
                    )}
                  </Link>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-bamboo-800">{item.name}</p>
                    <p className="mt-1 font-display text-base font-semibold text-bamboo-700">₹{item.price}</p>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => handleMoveToCart(item)} className="flex-1 !px-2 !py-2 text-xs">
                        <FiShoppingBag size={13} className="mr-1" /> Add to Cart
                      </Button>
                      <button
                        onClick={() => handleRemove(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-sand-400 text-red-500 hover:bg-red-50"
                        aria-label="Remove from wishlist"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
