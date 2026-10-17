import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlistApi } from '../services/commerceApi';
import {
  addToWishlist as addGuestWishlistItem,
  removeFromWishlist as removeGuestWishlistItem,
  setWishlist as setGuestWishlist,
} from '../store/slices/wishlistSlice';
import { addItem as addGuestCartItem } from '../store/slices/cartSlice';

const GUEST_WISHLIST_KEY = 'wakriti_guest_wishlist';

const readGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestWishlist = (items) => {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private browsing etc.) — fail silently, wishlist still works in-session
  }
};

export const clearGuestWishlistStorage = () => {
  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    // ignore
  }
};

export const useWishlist = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const guestItems = useSelector((state) => state.wishlist.items);

  // Hydrate guest wishlist from localStorage once on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const stored = readGuestWishlist();
      if (stored.length) dispatch(setGuestWishlist(stored));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist guest wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) writeGuestWishlist(guestItems);
  }, [guestItems, isAuthenticated]);

  const { data: serverWishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.getWishlist(),
    select: (res) => res.data.data.wishlist,
    enabled: isAuthenticated,
  });

  const invalidateWishlist = () => queryClient.invalidateQueries({ queryKey: ['wishlist'] });

  const items = isAuthenticated ? serverWishlist?.items || [] : guestItems;

  const isWishlisted = useCallback(
    (productId) =>
      isAuthenticated
        ? items.some((i) => (i.product || i.productId) === productId)
        : guestItems.some((i) => i.productId === productId),
    [isAuthenticated, items, guestItems]
  );

  const addToWishlist = useCallback(
    async ({ productId, name, image, price, slug }) => {
      if (isAuthenticated) {
        try {
          await wishlistApi.addItem(productId);
          invalidateWishlist();
          toast.success('Added to wishlist');
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Could not add to wishlist');
        }
      } else {
        dispatch(addGuestWishlistItem({ productId, name, image, price, slug }));
        toast.success('Added to wishlist');
      }
    },
    [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const removeItem = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          await wishlistApi.removeItem(productId);
          invalidateWishlist();
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Could not remove item');
          return;
        }
      } else {
        dispatch(removeGuestWishlistItem(productId));
      }
      toast.success('Removed from wishlist');
    },
    [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const toggleWishlist = useCallback(
    (product) => {
      const productId = product.productId || product._id;
      if (isWishlisted(productId)) {
        removeItem(productId);
      } else {
        addToWishlist(product);
      }
    },
    [isWishlisted, removeItem, addToWishlist]
  );

  const moveToCart = useCallback(
    async (item) => {
      const productId = item.product || item.productId;
      if (isAuthenticated) {
        try {
          await wishlistApi.moveToCart(productId);
          invalidateWishlist();
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Could not move item to cart');
          return;
        }
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
    },
    [isAuthenticated, dispatch, queryClient] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    items,
    count: items.length,
    isLoading: isAuthenticated && isLoading,
    isWishlisted,
    addToWishlist,
    removeItem,
    toggleWishlist,
    moveToCart,
  };
};