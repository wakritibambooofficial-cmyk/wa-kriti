import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { contentApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const BambooSpeciesDetail = () => {
  const { slug } = useParams();

  const { data: species, isLoading, isError } = useQuery({
    queryKey: ['bamboo-species', slug],
    queryFn: () => contentApi.getBambooSpeciesBySlug(slug),
    select: (res) => res.data.data.species,
    retry: false,
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-12"><div className="h-80 animate-pulse rounded-2xl bg-sand-200" /></div>;
  if (isError || !species) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Article Not Found" actionLabel="Knowledge Center" actionTo="/knowledge-center" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>{species.name} — Bamboo Knowledge Center</title></Helmet>
      {species.image?.url && <div className="h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url(${species.image.url})` }} />}

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-bamboo-800">{species.name}</h1>
        {species.scientificName && <p className="mt-1 italic text-bamboo-400">{species.scientificName}</p>}

        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-bamboo-600">{species.description}</p>

        {species.growthRegion && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Growth Region</h2>
            <p className="mt-1 text-sm text-bamboo-600">{species.growthRegion}</p>
          </div>
        )}

        {species.usedFor?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Commonly Used For</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {species.usedFor.map((use) => (
                <span key={use} className="rounded-full bg-bamboo-100 px-3 py-1 text-xs font-semibold text-bamboo-700">{use}</span>
              ))}
            </div>
          </div>
        )}

        {species.sustainabilityNotes && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-bamboo-800">Sustainability Notes</h2>
            <p className="mt-1 whitespace-pre-line text-sm text-bamboo-600">{species.sustainabilityNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BambooSpeciesDetail;
