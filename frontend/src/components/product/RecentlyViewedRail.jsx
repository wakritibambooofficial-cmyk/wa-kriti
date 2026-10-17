import { useQuery } from '@tanstack/react-query';
import { engagementApi } from '../../services/growthApi';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const RecentlyViewedRail = ({ excludeSlug }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data: products = [] } = useQuery({
    queryKey: ['recently-viewed'],
    queryFn: () => engagementApi.getRecentlyViewed(),
    select: (res) => res.data.data.products,
    enabled: isAuthenticated,
  });

  const filtered = products.filter((p) => p.slug !== excludeSlug);
  if (!isAuthenticated || filtered.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-xl font-semibold text-bamboo-800">Recently Viewed</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.slice(0, 8).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedRail;
