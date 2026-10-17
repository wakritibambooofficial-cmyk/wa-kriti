import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiAward } from 'react-icons/fi';
import { contentApi } from '../../services/growthApi';
import EmptyState from '../../components/ui/EmptyState';

const Certificates = () => {
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => contentApi.getCertificates(),
    select: (res) => res.data.data.certificates,
  });

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Certifications</title></Helmet>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-center font-display text-3xl font-bold text-bamboo-800">Our Certifications</h1>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-bamboo-500">
          Wa-Kriti is a certified, compliant business committed to quality and sustainability.
        </p>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-sand-200" />)}
          </div>
        ) : certificates.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No certificates published yet" />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {certificates.map((cert) => (
              <div key={cert._id} className="card flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600">
                  <FiAward size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-bamboo-800">{cert.title}</p>
                  <p className="text-xs uppercase text-bamboo-400">{cert.type.replace(/_/g, ' ')}</p>
                </div>
                <a href={cert.file.url} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-200 text-bamboo-600 hover:bg-sand-300" aria-label={`Download ${cert.title}`}>
                  <FiDownload size={15} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
