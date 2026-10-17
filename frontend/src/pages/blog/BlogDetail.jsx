import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { blogApi } from '../../services/cmsApi';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const BlogDetail = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBlogBySlug(slug),
    select: (res) => res.data.data.blog,
    retry: false,
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await blogApi.addComment(slug, comment.trim());
      toast.success('Comment submitted for moderation');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-12"><div className="h-96 animate-pulse rounded-2xl bg-sand-200" /></div>;
  }

  if (isError || !blog) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Blog Post Not Found" message="This article may have been removed." actionLabel="Back to Blog" actionTo="/blog" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 pb-20">
      <Helmet>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
      </Helmet>

      {/* {blog.featuredImage?.url && (
        <div className="h-72 w-full bg-cover bg-center" style={{ backgroundImage: `url(${blog.featuredImage.url})` }} />
      )} */}

      <div className="mx-auto max-w-3xl px-4 py-10">
        {blog.category?.name && <span className="text-xs font-semibold uppercase tracking-wide text-bamboo-500">{blog.category.name}</span>}
        <h1 className="mt-2 font-display text-3xl font-bold text-bamboo-800">{blog.title}</h1>
        <p className="mt-2 text-xs text-bamboo-400">
          By {blog.author?.firstName} {blog.author?.lastName} · {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div
          className="prose prose-bamboo mt-6 max-w-none text-bamboo-700"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Comments */}
        {/* <div className="mt-12 border-t border-sand-300 pt-8">
          <h2 className="font-display text-xl font-semibold text-bamboo-800">Comments ({blog.comments?.length || 0})</h2>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="input-field !py-2 text-sm"
              />
              <Button type="submit" isLoading={isSubmitting} className="!px-4 !py-2 text-sm">Post</Button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-bamboo-500">Please log in to leave a comment.</p>
          )}

          <div className="mt-6 space-y-4">
            {(blog.comments || []).map((c, idx) => (
              <div key={c._id || idx} className="rounded-xl bg-white p-4 shadow-soft">
                <p className="text-sm font-medium text-bamboo-800">{c.user?.firstName} {c.user?.lastName}</p>
                <p className="mt-1 text-sm text-bamboo-600">{c.comment}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BlogDetail;
