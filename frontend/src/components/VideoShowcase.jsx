import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { videoShowcaseApi } from '../services/videoShowcaseApi';

const extractYoutubeId = (url) => {
  // Handles: watch?v=ID, youtu.be/ID, shorts/ID, live/ID, embed/ID —
  // with or without trailing params like &t=10s or ?si=...
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/live\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  // last resort: assume they pasted a bare 11-character video ID
  return url.trim();
};

const getEmbedUrl = (video) => {
  if (video.type === 'youtube') {
    const id = extractYoutubeId(video.url);
    // loop=1 only works on a single video when paired with playlist=<same id>
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&playsinline=1`;
  }
  if (video.type === 'vimeo') {
    const idMatch = video.url.match(/vimeo\.com\/(\d+)/);
    const id = idMatch ? idMatch[1] : video.url;
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&controls=1&playsinline=1`;
  }
  return null;
};

const VideoBlock = ({ video, heading }) => {
  const embedUrl = getEmbedUrl(video);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-bamboo-900 shadow-soft">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={heading}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={video.url}
          poster={video.thumbnail || undefined}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};

const ShowcaseBlock = ({ item, index }) => {
  const videoFirst = item.videoPosition !== 'right';

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <motion.div
        initial={{ opacity: 0, x: videoFirst ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={videoFirst ? 'lg:order-1' : 'lg:order-2'}
      >
        <VideoBlock video={item.video} heading={item.heading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: videoFirst ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={videoFirst ? 'lg:order-2' : 'lg:order-1'}
      >
        {item.subheading && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bamboo-400">
            {item.subheading}
          </span>
        )}
        <h2 className="mt-2 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">{item.heading}</h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-bamboo-600 sm:text-base">
          {item.description}
        </p>
        {item.ctaLabel && item.ctaLink && (
          <Link to={item.ctaLink} className="btn-primary mt-6 inline-block">
            {item.ctaLabel}
          </Link>
        )}
      </motion.div>
    </div>
  );
};

const VideoShowcase = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['video-showcase'],
    queryFn: () => videoShowcaseApi.getVideoShowcases(),
    select: (res) => res.data.data.videoShowcases,
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-sand-200" />
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl space-y-16 px-4">
        {items.map((item, index) => (
          <ShowcaseBlock key={item._id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

export default VideoShowcase;