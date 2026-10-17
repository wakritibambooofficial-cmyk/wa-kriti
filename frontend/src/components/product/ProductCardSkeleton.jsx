const ProductCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="aspect-square animate-pulse bg-sand-200" />
    <div className="space-y-2 p-4">
      <div className="h-3 w-1/3 animate-pulse rounded bg-sand-200" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-sand-200" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-sand-200" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default ProductCardSkeleton;
