import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { removeFromCompare, clearCompare } from '../../store/slices/compareSlice';

const CompareBar = () => {
  const items = useSelector((state) => state.compare.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!items.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-300 bg-white px-4 py-3 shadow-soft-lg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          {items.map((p) => (
            <div key={p._id} className="relative flex shrink-0 items-center gap-2 rounded-xl bg-sand-100 px-3 py-1.5">
              {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="h-8 w-8 rounded-lg object-cover" />}
              <span className="max-w-[100px] truncate text-xs font-medium text-bamboo-700">{p.name}</span>
              <button onClick={() => dispatch(removeFromCompare(p._id))} aria-label={`Remove ${p.name}`}>
                <FiX size={13} className="text-bamboo-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => dispatch(clearCompare())} className="text-xs font-semibold text-bamboo-500 hover:underline">
            Clear All
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={items.length < 2}
            className="btn-primary !px-4 !py-2 text-xs disabled:opacity-50"
          >
            Compare ({items.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
