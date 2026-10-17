import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';
import { promotionApi } from '../../services/growthApi'; 
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const GiftHamperBuilder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [basketIndex, setBasketIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [greetingCard, setGreetingCard] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['hamper-templates'],
    queryFn: () => promotionApi.getHamperTemplates(),
    select: (res) => res.data.data.templates,
  });

  const template = templates.find((t) => t._id === selectedTemplateId) || templates[0];

  const toggleProduct = (id) => {
    setSelectedProducts((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= (template?.maxItems || 6)) {
        toast.error(`You can select up to ${template.maxItems} items`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleBuild = async () => {
    if (!isAuthenticated) {
      toast('Please log in to build your hamper', { icon: '🔒' });
      navigate('/login');
      return;
    }
    if (!selectedProducts.length) {
      toast.error('Select at least one product');
      return;
    }
    setIsSubmitting(true);
    try {
      await promotionApi.buildHamper(template._id, {
        basketIndex,
        productIds: selectedProducts,
        greetingCard,
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Gift hamper added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not build hamper');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-12"><div className="h-96 animate-pulse rounded-2xl bg-sand-200" /></div>;
  }

  if (!templates.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Gift Hampers Coming Soon" message="We're preparing our gift hamper builder. Check back soon!" actionLabel="Continue Shopping" actionTo="/shop" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 pb-32">
      <Helmet><title>Build Your Own Gift Hamper</title></Helmet>
      <div className="bg-bamboo-700 px-4 py-12 text-center text-white">
        <h1 className="font-display text-3xl font-bold">Build Your Own Gift Hamper</h1>
        <p className="mx-auto mt-2 max-w-xl text-sand-200">{template?.description}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Step 1: Basket */}
        <h2 className="font-display text-lg font-semibold text-bamboo-800">1. Choose Your Basket</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {template?.basketOptions?.map((basket, idx) => (
            <button
              key={basket.name}
              onClick={() => setBasketIndex(idx)}
              className={`rounded-2xl border-2 p-4 text-left transition-colors ${basketIndex === idx ? 'border-bamboo-600 bg-bamboo-50' : 'border-sand-300 bg-white'}`}
            >
              {basket.image?.url && <img src={basket.image.url} alt={basket.name} className="mb-2 h-20 w-full rounded-xl object-cover" />}
              <p className="text-sm font-medium text-bamboo-800">{basket.name}</p>
              <p className="text-xs text-bamboo-500">₹{basket.price}</p>
            </button>
          ))}
        </div>

        {/* Step 2: Products */}
        <h2 className="mt-8 font-display text-lg font-semibold text-bamboo-800">
          2. Select Products (up to {template?.maxItems})
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {template?.availableProducts?.map((product) => {
            const selected = selectedProducts.includes(product._id);
            return (
              <button
                key={product._id}
                onClick={() => toggleProduct(product._id)}
                className={`relative rounded-2xl border-2 p-3 text-left transition-colors ${selected ? 'border-bamboo-600 bg-bamboo-50' : 'border-sand-300 bg-white'}`}
              >
                {selected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-bamboo-600 text-white">
                    <FiCheck size={12} />
                  </span>
                )}
                {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="mb-2 h-20 w-full rounded-xl object-cover" />}
                <p className="truncate text-xs font-medium text-bamboo-800">{product.name}</p>
                <p className="text-xs text-bamboo-500">₹{product.price}</p>
              </button>
            );
          })}
        </div>

        {/* Step 3: Greeting card */}
        <h2 className="mt-8 font-display text-lg font-semibold text-bamboo-800">3. Add a Greeting Message (Optional)</h2>
        <textarea
          value={greetingCard}
          onChange={(e) => setGreetingCard(e.target.value)}
          placeholder="Write your personal message here..."
          className="input-field mt-3 min-h-[100px]"
        />

        <Button onClick={handleBuild} isLoading={isSubmitting} fullWidth className="mt-8">
          Add Hamper to Cart
        </Button>
      </div>
    </div>
  );
};

export default GiftHamperBuilder;
