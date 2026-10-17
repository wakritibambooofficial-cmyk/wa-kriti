import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { adminWarehouseApi } from '../../services/adminApi';
import { productApi } from '../../services/productApi';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const emptyWarehouseForm = { name: '', code: '', city: '', state: '', pincode: '', isPrimary: false };
const emptyAdjustForm = { productId: '', warehouseId: '', quantityChange: '', changeType: 'restock', note: '' };

const AdminWarehouses = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyWarehouseForm);
  const [adjustForm, setAdjustForm] = useState(emptyAdjustForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const { data: warehouses, isLoading } = useQuery({
    queryKey: ['admin-warehouses'],
    queryFn: () => adminWarehouseApi.getAll(),
    select: (res) => res.data.data.warehouses,
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products-lite'],
    queryFn: () => productApi.getProducts({ status: 'all', limit: 100 }),
    select: (res) => res.data.data.products,
  });

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminWarehouseApi.create(form);
      toast.success('Warehouse created');
      queryClient.invalidateQueries({ queryKey: ['admin-warehouses'] });
      setIsFormOpen(false);
      setForm(emptyWarehouseForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not create warehouse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWarehouse = async (id) => {
    try {
      await adminWarehouseApi.delete(id);
      toast.success('Warehouse deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-warehouses'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete warehouse');
    }
  };

  const handleAdjustInventory = async (e) => {
    e.preventDefault();
    setIsAdjusting(true);
    try {
      await adminWarehouseApi.adjustInventory({
        ...adjustForm,
        quantityChange: Number(adjustForm.quantityChange),
      });
      toast.success('Inventory adjusted successfully');
      setAdjustForm(emptyAdjustForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not adjust inventory');
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Warehouses & Inventory</title></Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Warehouses & Inventory</h1>
        <Button onClick={() => setIsFormOpen(true)} className="!px-4 !py-2 text-sm">
          <FiPlus size={14} className="mr-1.5" /> Add Warehouse
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-bamboo-800">Warehouse Locations</h2>
          {isLoading ? (
            <p className="text-bamboo-400">Loading...</p>
          ) : (
            <div className="space-y-3">
              {warehouses?.map((w) => (
                <div key={w._id} className="card flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-bamboo-800">
                      {w.name} <span className="ml-1 text-xs text-bamboo-400">({w.code})</span>
                      {w.isPrimary && <span className="ml-2 rounded-full bg-bamboo-100 px-2 py-0.5 text-[10px] font-semibold text-bamboo-700">Primary</span>}
                    </p>
                    <p className="text-xs text-bamboo-500">{w.city}, {w.state} {w.pincode}</p>
                  </div>
                  <button onClick={() => handleDeleteWarehouse(w._id)} className="text-red-500 hover:underline">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-bamboo-800">Adjust Inventory</h2>
          <form onSubmit={handleAdjustInventory} className="card space-y-3 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Product</label>
              <select
                required
                value={adjustForm.productId}
                onChange={(e) => setAdjustForm((f) => ({ ...f, productId: e.target.value }))}
                className="input-field"
              >
                <option value="">Select product</option>
                {products?.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Warehouse</label>
              <select
                required
                value={adjustForm.warehouseId}
                onChange={(e) => setAdjustForm((f) => ({ ...f, warehouseId: e.target.value }))}
                className="input-field"
              >
                <option value="">Select warehouse</option>
                {warehouses?.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Quantity Change (+/-)"
                type="number"
                value={adjustForm.quantityChange}
                onChange={(e) => setAdjustForm((f) => ({ ...f, quantityChange: e.target.value }))}
                required
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-bamboo-700">Type</label>
                <select value={adjustForm.changeType} onChange={(e) => setAdjustForm((f) => ({ ...f, changeType: e.target.value }))} className="input-field">
                  <option value="restock">Restock</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="transfer">Transfer</option>
                  <option value="return">Return</option>
                </select>
              </div>
            </div>
            <FormInput label="Note" value={adjustForm.note} onChange={(e) => setAdjustForm((f) => ({ ...f, note: e.target.value }))} />
            <Button type="submit" fullWidth isLoading={isAdjusting}>Apply Adjustment</Button>
          </form>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Add Warehouse</h2>
            <form onSubmit={handleCreateWarehouse} className="mt-4 space-y-4">
              <FormInput label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <FormInput label="Code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} required />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                <FormInput label="State" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
              </div>
              <FormInput label="Pincode" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
              <label className="flex items-center gap-2 text-sm text-bamboo-600">
                <input type="checkbox" checked={form.isPrimary} onChange={(e) => setForm((f) => ({ ...f, isPrimary: e.target.checked }))} />
                Set as Primary Warehouse
              </label>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isSubmitting}>Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouses;
