

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../services/authApi';
import { cartApi, wishlistApi } from '../services/commerceApi';
import { setCredentials, logoutLocal } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';
import { clearWishlist } from '../store/slices/wishlistSlice';
import { clearGuestCartStorage } from './useCart';
import { clearGuestWishlistStorage } from './useWishlist';

const extractErrorMessage = (error) =>
  error?.response?.data?.message || 'Something went wrong. Please try again.';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, accessToken, isAuthenticated, isInitializing } = useSelector((state) => state.auth);
  const guestCartItems = useSelector((state) => state.cart.items);
  const guestWishlistItems = useSelector((state) => state.wishlist.items);

  const mergeGuestDataAfterLogin = useCallback(async () => {
    try {
      if (guestCartItems.length) {
        await cartApi.mergeGuestCart(
          guestCartItems.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }))
        );
      }
      if (guestWishlistItems.length) {
        await wishlistApi.mergeGuestWishlist(guestWishlistItems.map((i) => i.productId));
      }
    } catch {
      // Merge failures shouldn't block login — user's server cart/wishlist still works
    } finally {
      dispatch(clearCart());
      dispatch(clearWishlist());
      clearGuestCartStorage();
      clearGuestWishlistStorage();
      // Force a fresh fetch of server cart/wishlist now that merge has settled —
      // without this, a GET fired the instant isAuthenticated flipped true (from
      // useCart/useWishlist mounted elsewhere, e.g. Navbar) could have raced ahead
      // of the merge call and cached stale/empty data.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['cart'] }),
        queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
      ]);
    }
  }, [guestCartItems, guestWishlistItems, dispatch, queryClient]);

  const login = useCallback(
    async (payload) => {
      try {
        const { data } = await authApi.login(payload);
        dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));
        await mergeGuestDataAfterLogin();
        toast.success(data.message || 'Welcome back!');
        navigate(data.data.redirectTo || '/dashboard');
        return { success: true };
      } catch (error) {
        toast.error(extractErrorMessage(error));
        return { success: false, error };
      }
    },
    [dispatch, navigate, mergeGuestDataAfterLogin]
  );

  const signup = useCallback(async (payload) => {
    try {
      const { data } = await authApi.signup(payload);
      toast.success(data.message || 'Account created. Please verify your email.');
      return { success: true, email: data.data.email };
    } catch (error) {
      toast.error(extractErrorMessage(error));
      return { success: false, error };
    }
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    try {
      const { data } = await authApi.verifyOtp(payload);
      toast.success(data.message || 'Verified successfully');
      return { success: true };
    } catch (error) {
      toast.error(extractErrorMessage(error));
      return { success: false, error };
    }
  }, []);

  const resendOtp = useCallback(async (payload) => {
    try {
      const { data } = await authApi.resendOtp(payload);
      toast.success(data.message || 'OTP resent');
      return { success: true };
    } catch (error) {
      toast.error(extractErrorMessage(error));
      return { success: false, error };
    }
  }, []);

  const forgotPassword = useCallback(async (payload) => {
    try {
      const { data } = await authApi.forgotPassword(payload);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error(extractErrorMessage(error));
      return { success: false, error };
    }
  }, []);

  const resetPassword = useCallback(
    async (payload) => {
      try {
        const { data } = await authApi.resetPassword(payload);
        toast.success(data.message || 'Password reset successfully');
        navigate('/login');
        return { success: true };
      } catch (error) {
        toast.error(extractErrorMessage(error));
        return { success: false, error };
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout — clear local state regardless
    }
    dispatch(logoutLocal());
    toast.success('Logged out successfully');
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isInitializing,
    login,
    signup,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  };
};