// import { useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { cartApi } from '../services/commerceApi';
// import { addItem as addGuestItem, updateQuantity as updateGuestQuantity, removeItem as removeGuestItem, setCart as setGuestCart } from '../store/slices/cartSlice';

// const GUEST_CART_KEY = 'wakriti_guest_cart';

// const readGuestCart = () => {
//   try {
//     const raw = localStorage.getItem(GUEST_CART_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// };

// const writeGuestCart = (items) => {
//   try {
//     localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
//   } catch {
//     // localStorage unavailable (private browsing etc.) — fail silently, cart still works in-session
//   }
// };

// export const clearGuestCartStorage = () => {
//   try {
//     localStorage.removeItem(GUEST_CART_KEY);
//   } catch {
//     // ignore
//   }
// };

// export const useCart = () => {
//   const dispatch = useDispatch();
//   const queryClient = useQueryClient();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const guestItems = useSelector((state) => state.cart.items);

//   // Hydrate guest cart from localStorage once on mount
//   useEffect(() => {
//     if (!isAuthenticated) {
//       const stored = readGuestCart();
//       if (stored.length) dispatch(setGuestCart(stored));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Persist guest cart to localStorage whenever it changes
//   useEffect(() => {
//     if (!isAuthenticated) writeGuestCart(guestItems);
//   }, [guestItems, isAuthenticated]);

//   const { data: serverCart, isLoading } = useQuery({
//     queryKey: ['cart'],
//     queryFn: () => cartApi.getCart(),
//     select: (res) => res.data.data.cart,
//     enabled: isAuthenticated,
//   });

//   const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

//   const addToCart = useCallback(
//     async ({ productId, variantId = null, quantity = 1, name, image, price, mrp, sku, slug }) => {
//       if (isAuthenticated) {
//         try {
//           await cartApi.addItem({ productId, variantId, quantity });
//           invalidateCart();
//           toast.success('Added to cart');
//         } catch (error) {
//           toast.error(error?.response?.data?.message || 'Could not add to cart');
//         }
//       } else {
//         dispatch(addGuestItem({ productId, variantId, quantity, name, image, price, mrp, sku, slug }));
//         toast.success('Added to cart');
//       }
//     },
//     [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
//   );

//   const updateItemQuantity = useCallback(
//     async (item, quantity) => {
//       if (isAuthenticated) {
//         await cartApi.updateItem(item._id, quantity);
//         invalidateCart();
//       } else {
//         dispatch(updateGuestQuantity({ productId: item.productId, variantId: item.variantId, quantity }));
//       }
//     },
//     [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
//   );

//   const removeItem = useCallback(
//     async (item) => {
//       if (isAuthenticated) {
//         await cartApi.removeItem(item._id);
//         invalidateCart();
//       } else {
//         dispatch(removeGuestItem({ productId: item.productId, variantId: item.variantId }));
//       }
//       toast.success('Item removed');
//     },
//     [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
//   );

//   const items = isAuthenticated ? (serverCart?.items || []).filter((i) => !i.savedForLater) : guestItems;
//   const savedForLater = isAuthenticated ? (serverCart?.items || []).filter((i) => i.savedForLater) : [];
//   const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

//   return {
//     items,
//     savedForLater,
//     subtotal,
//     coupon: serverCart?.coupon,
//     isLoading: isAuthenticated && isLoading,
//     addToCart,
//     updateItemQuantity,
//     removeItem,
//     toggleSaveForLater: async (item) => {
//       await cartApi.toggleSaveForLater(item._id);
//       invalidateCart();
//     },
//     applyCoupon: async (code) => {
//       const { data } = await cartApi.applyCoupon(code);
//       invalidateCart();
//       return data;
//     },
//     removeCoupon: async () => {
//       await cartApi.removeCoupon();
//       invalidateCart();
//     },
//   };
// };

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '../services/commerceApi';
import { addItem as addGuestItem, updateQuantity as updateGuestQuantity, removeItem as removeGuestItem, setCart as setGuestCart } from '../store/slices/cartSlice';

const GUEST_CART_KEY = 'wakriti_guest_cart';

const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private browsing etc.) — fail silently, cart still works in-session
  }
};

export const clearGuestCartStorage = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // ignore
  }
};

export const useCart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const guestItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!isAuthenticated) {
      const stored = readGuestCart();
      if (stored.length) dispatch(setGuestCart(stored));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated) writeGuestCart(guestItems);
  }, [guestItems, isAuthenticated]);

  const { data: serverCart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    select: (res) => res.data.data.cart,
    enabled: isAuthenticated,
  });

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const addToCart = useCallback(
    async ({ productId, variantId = null, quantity = 1, name, image, price, mrp, sku, slug }) => {
      if (isAuthenticated) {
        try {
          await cartApi.addItem({ productId, variantId, quantity });
          invalidateCart();
          toast.success('Added to cart');
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Could not add to cart');
        }
      } else {
        dispatch(addGuestItem({ productId, variantId, quantity, name, image, price, mrp, sku, slug }));
        toast.success('Added to cart');
      }
    },
    [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const updateItemQuantity = useCallback(
    async (item, quantity) => {
      if (isAuthenticated) {
        await cartApi.updateItem(item._id, quantity);
        invalidateCart();
      } else {
        dispatch(updateGuestQuantity({ productId: item.productId, variantId: item.variantId, quantity }));
      }
    },
    [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const removeItem = useCallback(
    async (item) => {
      if (isAuthenticated) {
        await cartApi.removeItem(item._id);
        invalidateCart();
      } else {
        dispatch(removeGuestItem({ productId: item.productId, variantId: item.variantId }));
      }
      toast.success('Item removed');
    },
    [isAuthenticated, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const items = isAuthenticated ? (serverCart?.items || []).filter((i) => !i.savedForLater) : guestItems;
  const savedForLater = isAuthenticated ? (serverCart?.items || []).filter((i) => i.savedForLater) : [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    items,
    savedForLater,
    subtotal,
    coupon: serverCart?.coupon,
    isLoading: isAuthenticated && isLoading,
    addToCart,
    updateItemQuantity,
    removeItem,
    toggleSaveForLater: async (item) => {
      await cartApi.toggleSaveForLater(item._id);
      invalidateCart();
    },
    applyCoupon: async (code) => {
      const { data } = await cartApi.applyCoupon(code);
      invalidateCart();
      return data;
    },
    removeCoupon: async () => {
      await cartApi.removeCoupon();
      invalidateCart();
    },
  };
};