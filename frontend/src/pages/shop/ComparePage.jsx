import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiX } from 'react-icons/fi';
import { removeFromCompare } from '../../store/slices/compareSlice';
import EmptyState from '../../components/ui/EmptyState';

const SPEC_ROWS = [
  { key: 'price', label: 'Price', render: (p) => `₹${p.price}` },
  { key: 'comparePrice', label: 'MRP', render: (p) => (p.comparePrice ? `₹${p.comparePrice}` : '—') },
  { key: 'material', label: 'Material', render: (p) => p.material || '—' },
  { key: 'color', label: 'Color', render: (p) => p.color || '—' },
  {
    key: 'dimensions',
    label: 'Dimensions',
    render: (p) => (p.dimensions?.length ? `${p.dimensions.length} × ${p.dimensions.width} × ${p.dimensions.height} cm` : '—'),
  },
  { key: 'weight', label: 'Weight', render: (p) => (p.weight ? `${p.weight} kg` : '—') },
  { key: 'warranty', label: 'Warranty', render: (p) => p.warranty || '—' },
  { key: 'ratingsAverage', label: 'Rating', render: (p) => (p.ratingsCount ? `★ ${p.ratingsAverage?.toFixed(1)} (${p.ratingsCount})` : 'No reviews') },
  { key: 'availability', label: 'Availability', render: (p) => (p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock') },
  { key: 'isHandmade', label: 'Handmade', render: (p) => (p.isHandmade ? 'Yes' : 'No') },
  { key: 'isEcoFriendly', label: 'Eco Friendly', render: (p) => (p.isEcoFriendly ? 'Yes' : 'No') },
];

const ComparePage = () => {
  const items = useSelector((state) => state.compare.items);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Compare Products</title></Helmet>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-bamboo-800">Compare Products</h1>

        {items.length < 2 ? (
          <div className="mt-8">
            <EmptyState
              title="Add products to compare"
              message="Select at least 2 products from the shop to see a side-by-side comparison."
              actionLabel="Browse Products"
              actionTo="/shop"
            />
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr>
                  <th className="w-40 px-4 py-4"></th>
                  {items.map((p) => (
                    <th key={p._id} className="min-w-[180px] px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() => dispatch(removeFromCompare(p._id))}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sand-200 text-bamboo-500 hover:bg-red-100 hover:text-red-500"
                          aria-label={`Remove ${p.name}`}
                        >
                          <FiX size={12} />
                        </button>
                        {p.images?.[0]?.url && (
                          <img src={p.images[0].url} alt={p.name} className="h-24 w-24 rounded-xl object-cover" />
                        )}
                        <Link to={`/product/${p.slug}`} className="mt-2 block font-medium text-bamboo-800 hover:underline">
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {SPEC_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="bg-sand-100 px-4 py-3 font-semibold text-bamboo-700">{row.label}</td>
                    {items.map((p) => (
                      <td key={p._id} className="px-4 py-3 text-bamboo-600">
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
