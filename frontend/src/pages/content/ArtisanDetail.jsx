import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { contentApi } from '../../services/growthApi';
import ProductCard from '../../components/product/ProductCard';
import EmptyState from '../../components/ui/EmptyState';

const ArtisanDetail = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['artisan', slug],
    queryFn: () => contentApi.getArtisanBySlug(slug),
    select: (res) => res.data.data,
    retry: false,
  });

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-12"><div className="h-96 animate-pulse rounded-2xl bg-sand-200" /></div>;
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Artisan Not Found" message="This profile may have been removed." actionLabel="Meet Our Artisans" actionTo="/artisans" />
      </div>
    );
  }

  const { artisan, products } = data;

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>{artisan.name} — Wa-Kriti Artisan</title></Helmet>

      <div className="bg-bamboo-700 px-4 py-14 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          {artisan.photo?.url && (
            <img src={artisan.photo.url} alt={artisan.name} className="h-32 w-32 rounded-full border-4 border-white/30 object-cover" />
          )}
          <div>
            <h1 className="font-display text-3xl font-bold">{artisan.name}</h1>
            <p className="text-sand-200">{artisan.village}, {artisan.state}</p>
            <p className="mt-1 text-sm text-sand-300">{artisan.experienceYears}+ years · {artisan.craftSpecialty}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {artisan.quote && (
          <blockquote className="border-l-4 border-bamboo-500 pl-4 font-display text-lg italic text-bamboo-700">
            &ldquo;{artisan.quote}&rdquo;
          </blockquote>
        )}

        <h2 className="mt-8 font-display text-xl font-semibold text-bamboo-800">Their Story</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-bamboo-600">{artisan.story}</p>

        {artisan.gallery?.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {artisan.gallery.map((img, idx) => (
              <img key={idx} src={img.url} alt={`${artisan.name} gallery ${idx + 1}`} className="aspect-square rounded-xl object-cover" />
            ))}
          </div>
        )}

        {products?.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-bamboo-800">Products by {artisan.name}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDetail;
