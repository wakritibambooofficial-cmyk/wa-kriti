import Button from '../ui/Button';

const StickyMobileAddToCart = ({ price, onAddToCart, disabled, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-sand-300 bg-white px-4 py-3 shadow-soft-lg lg:hidden">
      <div>
        <p className="text-xs text-bamboo-400">Price</p>
        <p className="font-display text-lg font-bold text-bamboo-800">₹{price}</p>
      </div>
      <Button onClick={onAddToCart} disabled={disabled} className="flex-1">
        Add to Cart
      </Button>
    </div>
  );
};

export default StickyMobileAddToCart;
