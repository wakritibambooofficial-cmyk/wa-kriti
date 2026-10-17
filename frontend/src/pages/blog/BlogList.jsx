// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { Helmet } from 'react-helmet-async';
// import { blogApi } from '../../services/cmsApi';
// import EmptyState from '../../components/ui/EmptyState';

// const BlogCard = ({ blog }) => (
//   <Link to={`/blog/${blog.slug}`} className="card overflow-hidden">
//     <div className="aspect-video bg-sand-100">
//       {blog.featuredImage?.url && <img src={blog.featuredImage.url} alt={blog.title} className="h-full w-full object-cover" />}
//     </div>
//     <div className="p-4">
//       {blog.category?.name && (
//         <span className="text-xs font-semibold uppercase tracking-wide text-bamboo-500">{blog.category.name}</span>
//       )}
//       <h3 className="mt-1 font-display text-lg font-semibold text-bamboo-800">{blog.title}</h3>
//       <p className="mt-1.5 line-clamp-2 text-sm text-bamboo-500">{blog.excerpt}</p>
//       <p className="mt-3 text-xs text-bamboo-400">
//         {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
//       </p>
//     </div>
//   </Link>
// );

// const BlogList = () => {
//   const { data: blogs = [], isLoading } = useQuery({
//     queryKey: ['blogs'],
//     queryFn: () => blogApi.getBlogs(),
//     select: (res) => res.data.data.blogs,
//   });

//   return (
//     <div className="min-h-screen bg-sand-100 pb-20">
//       <Helmet><title>Blog</title></Helmet>
//       <div className="mx-auto max-w-6xl px-4 py-12">
//         <h1 className="text-center font-display text-3xl font-bold text-bamboo-800">Wa-Kriti Blog</h1>
//         <p className="mx-auto mt-2 max-w-lg text-center text-sm text-bamboo-500">
//           Stories, tips, and insights on sustainable bamboo living.
//         </p>

//         {isLoading ? (
//           <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-sand-200" />)}
//           </div>
//         ) : blogs.length === 0 ? (
//           <div className="mt-10">
//             <EmptyState title="No blog posts yet" message="Check back soon for bamboo tips and stories." />
//           </div>
//         ) : (
//           <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogList;



import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { blogApi } from '../../services/cmsApi';
import EmptyState from '../../components/ui/EmptyState';

const BlogCard = ({ blog, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: idx * 0.05 }}
  >
    <Link
      to={`/blog/${blog.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-bamboo-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* accent bar that slides in on hover, matching the rest of the site */}
      <span className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-bamboo-700 transition-transform duration-300 ease-out group-hover:scale-x-100" />

      <div className="aspect-video overflow-hidden bg-sand-100">
        {blog.featuredImage?.url ? (
          <img
            src={blog.featuredImage.url}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-bamboo-200">
            🎋
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {blog.category?.name && (
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-bamboo-500">
            {blog.category.name}
          </span>
        )}
        <h3 className="mt-1.5 font-display text-lg font-semibold text-bamboo-800 transition-colors duration-200 group-hover:text-bamboo-900">
          {blog.title}
        </h3>
        <p className="mt-1.5 flex-1 line-clamp-2 text-sm leading-relaxed text-bamboo-600">
          {blog.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-bamboo-400">
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-bamboo-700">
            Read
            <FiArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const BlogList = () => {
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getBlogs(),
    select: (res) => res.data.data.blogs,
  });

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet><title>Blog</title></Helmet>

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-bamboo-700 to-bamboo-800 px-4 py-16 text-center text-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-bamboo-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-200/80">
            Stories from the workshop
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Wa-Kriti Blog
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-sand-200">
            Stories, tips, and insights on sustainable bamboo living.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-sand-200" />)}
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState title="No blog posts yet" message="Check back soon for bamboo tips and stories." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, idx) => <BlogCard key={blog._id} blog={blog} idx={idx} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;