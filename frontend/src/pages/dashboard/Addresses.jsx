import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';

import { addressApi } from '../../services/commerceApi';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import AddressForm from '../../components/checkout/AddressForm';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className={`card relative p-5 ${address.isDefault ? 'ring-2 ring-bamboo-500' : ''}`}>
    {address.isDefault && (
      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-bamboo-100 px-2.5 py-1 text-[10px] font-semibold text-bamboo-700">
        <FiCheckCircle size={11} /> Default
      </span>
    )}
    <span className="inline-block rounded-full bg-sand-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-bamboo-600">
      {address.label}
    </span>
    <p className="mt-2 font-medium text-bamboo-800">{address.fullName}</p>
    <p className="text-sm text-bamboo-500">{address.phone}</p>
    <p className="mt-1 text-sm text-bamboo-600">
      {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
      {address.city}, {address.state} - {address.pincode}
    </p>

    <div className="mt-4 flex gap-3 text-xs font-semibold">
      <button onClick={() => onEdit(address)} className="flex items-center gap-1 text-bamboo-600 hover:underline">
        <FiEdit2 size={12} /> Edit
      </button>
      <button onClick={() => onDelete(address._id)} className="flex items-center gap-1 text-red-500 hover:underline">
        <FiTrash2 size={12} /> Delete
      </button>
      {!address.isDefault && (
        <button onClick={() => onSetDefault(address._id)} className="text-bamboo-500 hover:underline">
          Set as Default
        </button>
      )}
    </div>
  </div>
);

const Addresses = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses(),
    select: (res) => res.data.data.addresses,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['addresses'] });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await addressApi.updateAddress(editingAddress._id, values);
        toast.success('Address updated');
      } else {
        await addressApi.createAddress(values);
        toast.success('Address added');
      }
      invalidate();
      setIsFormOpen(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await addressApi.deleteAddress(id);
      toast.success('Address deleted');
      invalidate();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete address');
    }
  };

  const handleSetDefault = async (id) => {
    await addressApi.setDefault(id);
    toast.success('Default address updated');
    invalidate();
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>My Addresses</title></Helmet>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-bamboo-800">My Addresses</h1>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setIsFormOpen(true);
            }}
            className="!px-4 !py-2 text-sm"
          >
            <FiPlus size={14} className="mr-1.5" /> Add Address
          </Button>
        </div>

        {isFormOpen && (
          <div className="card mt-6 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-bamboo-800">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <AddressForm
              defaultValues={editingAddress}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingAddress(null);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 h-32 animate-pulse rounded-2xl bg-sand-200" />
        ) : addresses.length === 0 && !isFormOpen ? (
          <div className="mt-8">
            <EmptyState title="No addresses saved" message="Add an address to speed up your checkout." />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={(addr) => {
                  setEditingAddress(addr);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
