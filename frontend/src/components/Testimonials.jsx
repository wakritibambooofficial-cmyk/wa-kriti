// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { motion } from 'framer-motion';
// import { FiStar } from 'react-icons/fi';

// const TESTIMONIALS = [
//   {
//     _id: 'demo-1',
//     name: 'Ananya Sharma',
//     location: 'Bengaluru',
//     rating: 5,
//     text: 'The bamboo dining set exceeded every expectation. The craftsmanship is stunning and it feels genuinely sustainable without compromising on style.',
//   },
//   {
//     _id: 'demo-2',
//     name: 'Rohit Verma',
//     location: 'Pune',
//     rating: 5,
//     text: 'Fast delivery, beautiful packaging, and the product itself is even better in person. This is now my go-to for home decor.',
//   },
//   {
//     _id: 'demo-3',
//     name: 'Meera Iyer',
//     location: 'Kochi',
//     rating: 4,
//     text: 'Love that every piece supports artisan communities. You can feel the care that went into making it. Will definitely order again.',
//   },
//   {
//     _id: 'demo-4',
//     name: 'Arjun Nair',
//     location: 'Delhi',
//     rating: 5,
//     text: 'Wa-Kriti has completely changed how I think about home furniture. Elegant, eco-friendly, and built to last.',
//   },
// ];

// const initials = (name = '') =>
//   name
//     .split(' ')
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase();

// const StarRow = ({ rating }) => (
//   <div className="flex items-center justify-center gap-0.5">
//     {[...Array(5)].map((_, i) => (
//       <FiStar
//         key={i}
//         size={14}
//         className={i < rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'}
//       />
//     ))}
//   </div>
// );

// const TestimonialCard = ({ testimonial }) => (
//   <div className="mx-2 flex h-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_34px_-10px_rgba(63,91,62,0.35)]">
//     <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bamboo-100 font-display text-lg font-bold text-bamboo-700">
//       {initials(testimonial.name)}
//     </div>

//     <div className="mt-4">
//       <StarRow rating={testimonial.rating} />
//     </div>

//     <p className="mt-4 min-h-[5.5rem] text-sm leading-relaxed text-bamboo-600">
//       &ldquo;{testimonial.text}&rdquo;
//     </p>

//     <div className="mt-5 border-t border-sand-200 pt-4">
//       <p className="font-display text-sm font-semibold text-bamboo-800">{testimonial.name}</p>
//       <p className="text-xs text-bamboo-400">{testimonial.location}</p>
//     </div>
//   </div>
// );

// const Testimonials = () => {
//   return (
//     <section className="bg-bamboo-50 py-16">
//       <div className="mx-auto max-w-7xl px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: '-80px' }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <span className="text-xs font-semibold uppercase tracking-[0.3em] text-earth-500">
//             Testimonials
//           </span>
//           <h2 className="mt-2 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
//             Loved by Our Customers
//           </h2>
//           <p className="mx-auto mt-2 max-w-xl text-sm text-bamboo-500">
//             Real stories from people who brought Wa-Kriti craftsmanship into their homes.
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: '-80px' }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="mt-10"
//         >
//           <Swiper
//             modules={[Autoplay, Pagination]}
//             autoplay={{ delay: 4500, disableOnInteraction: false }}
//             pagination={{ clickable: true }}
//             spaceBetween={16}
//             slidesPerView={1}
//             breakpoints={{
//               640: { slidesPerView: 2 },
//               1024: { slidesPerView: 3 },
//             }}
//             className="!pb-10"
//           >
//             {TESTIMONIALS.map((t) => (
//               <SwiperSlide key={t._id} className="!h-auto">
//                 <TestimonialCard testimonial={t} />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;


import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { testimonialApi } from '../services/testimonialApi'; // adjust the '../../' depth to match where this file lives relative to src/services

const initials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const StarRow = ({ rating }) => (
  <div className="flex items-center justify-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={14}
        className={i < rating ? 'fill-earth-500 text-earth-500' : 'text-sand-300'}
      />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="mx-2 flex h-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_34px_-10px_rgba(63,91,62,0.35)]">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bamboo-100 font-display text-lg font-bold text-bamboo-700">
      {initials(testimonial.name)}
    </div>

    <div className="mt-4">
      <StarRow rating={testimonial.rating} />
    </div>

    <p className="mt-4 min-h-[5.5rem] text-sm leading-relaxed text-bamboo-600">
      &ldquo;{testimonial.text}&rdquo;
    </p>

    <div className="mt-5 border-t border-sand-200 pt-4">
      <p className="font-display text-sm font-semibold text-bamboo-800">{testimonial.name}</p>
      <p className="text-xs text-bamboo-400">{testimonial.location}</p>
    </div>
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTestimonials = async () => {
      try {
        const res = await testimonialApi.getTestimonials();
        // Your backend wraps responses as { data: { data: { testimonials: [...] } } }
        // (see AdminTestimonials.jsx's `select: (res) => res.data.data.testimonials`)
        const data = res?.data?.data?.testimonials || [];

        if (isMounted) {
          setTestimonials(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  // Keep the section from rendering an empty/broken Swiper before data arrives
  if (loading || error || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-bamboo-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-earth-500">
            Testimonials
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-bamboo-800 sm:text-3xl">
            Loved by Our Customers
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-bamboo-500">
            Real stories from people who brought Wa-Kriti craftsmanship into their homes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-10"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t._id} className="!h-auto">
                <TestimonialCard testimonial={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;