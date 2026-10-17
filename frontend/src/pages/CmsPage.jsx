

// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import { cmsApi } from '../services/cmsApi';
// import EmptyState from '../components/ui/EmptyState';

// // const CmsPage = () => {
// //   const { slug } = useParams();
// const CmsPage = ({ slug: slugProp }) => {
//   const { slug: slugParam } = useParams();
//   const slug = slugProp || slugParam;

//   const { data: page, isLoading, isError } = useQuery({
//     queryKey: ['cms-page', slug],
//     queryFn: () => cmsApi.getPage(slug),
//     select: (res) => res.data.data.page,
//     retry: false,
//   });

//   if (isLoading) {
//     return (
//       <div className="mx-auto max-w-3xl px-4 py-12">
//         <div className="h-8 w-1/2 animate-pulse rounded bg-sand-200" />
//         <div className="mt-6 h-64 animate-pulse rounded-2xl bg-sand-200" />
//       </div>
//     );
//   }

//   if (isError || !page) {
//     return (
//       <div className="mx-auto max-w-2xl px-4 py-20">
//         <EmptyState title="Page Not Available" message="This page hasn't been published yet. Please check back soon." />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet>
//         <title>{page.metaTitle || page.title}</title>
//         <meta name="description" content={page.metaDescription} />
//       </Helmet>

//       {/*
//         Banner uses a real <img> with w-full + h-auto (no fixed height,
//         no bg-cover) so the full image renders at its natural aspect
//         ratio and never gets cropped, on any screen width.
//       */}
//       {page.heroImage?.url && (
//         <img
//           src={page.heroImage.url}
//           alt={page.heroImage.alt || page.title}
//           className="block w-full h-auto"
//         />
//       )}

//       <div className="mx-auto max-w-3xl px-4 py-12">
//         <h1 className="font-display text-3xl font-bold text-bamboo-800">{page.title}</h1>
//         <div
//           className="prose prose-bamboo mt-6 max-w-none text-bamboo-700"
//           // eslint-disable-next-line react/no-danger
//           dangerouslySetInnerHTML={{ __html: page.content }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CmsPage;


import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { cmsApi } from '../services/cmsApi';
import EmptyState from '../components/ui/EmptyState';

const CmsPage = ({ slug: slugProp }) => {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['cms-page', slug],
    queryFn: () => cmsApi.getPage(slug),
    select: (res) => res.data.data.page,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-8 w-1/2 animate-pulse rounded bg-sand-200" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-sand-200" />
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Page Not Available" message="This page hasn't been published yet. Please check back soon." />
      </div>
    );
  }

  // Only the Founder page shows the hero banner/image — other CMS pages
  // (About, Contact, etc.) render straight into the content section below.
  const isFounderPage = slug === 'founder';

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet>
        <title>{page.metaTitle || page.title}</title>
        <meta name="description" content={page.metaDescription} />
      </Helmet>

      {/*
        Banner uses a real <img> with w-full + h-auto (no fixed height,
        no bg-cover) so the full image renders at its natural aspect
        ratio and never gets cropped, on any screen width.
      */}
      {isFounderPage && page.heroImage?.url && (
        <img
          src={page.heroImage.url}
          alt={page.heroImage.alt || page.title}
          className="block w-full h-auto"
        />
      )}

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-bamboo-800">{page.title}</h1>
        <div
          className="prose prose-bamboo mt-6 max-w-none text-bamboo-700"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export default CmsPage;