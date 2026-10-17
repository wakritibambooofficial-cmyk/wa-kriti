

// import { useEffect, useRef, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   FiArrowUp,
//   FiMessageCircle,
//   FiX,
//   FiMail,
//   FiChevronRight,
//   FiChevronLeft,
//   FiHome,
//   FiPackage,
//   FiTruck,
//   FiCreditCard,
//   FiRefreshCw,
//   FiFeather,
//   FiShoppingBag,
//   FiSend,
// } from 'react-icons/fi';
// import { TbBrandWhatsapp } from 'react-icons/tb';
// import { cmsApi } from '../../services/cmsApi';

// // ── Menu data: edit freely, or later swap for a fetch('/api/faqs') call ──
// // Structure: Main menu (categories) -> Category menu (3 questions) -> Answer + contact options
// // The 'bulk' category is special-cased: instead of a question list, it drives
// // a short guided text-input flow (product -> quantity -> name/company).
// const MENU = [
//   {
//     id: 'orders',
//     label: 'Orders',
//     icon: FiPackage,
//     questions: [
//       {
//         id: 'track-order',
//         question: 'Where is my order?',
//         answer: 'You can track your order anytime from My Orders → Track Order. You\u2019ll also get SMS/email updates at every stage.',
//       },
//       {
//         id: 'cancel-order',
//         question: 'Can I cancel my order?',
//         answer: 'Orders can be cancelled within 2 hours of placing them, as long as they haven\u2019t been shipped yet. Go to My Orders → Cancel Order.',
//       },
//       {
//         id: 'delayed-order',
//         question: 'My order is delayed.',
//         answer: 'We\u2019re sorry for the delay. Delays are usually courier-side \u2014 please check My Orders for the latest status, or reach out below with your order ID.',
//       },
//     ],
//   },
//   {
//     id: 'shipping',
//     label: 'Shipping',
//     icon: FiTruck,
//     questions: [
//       {
//         id: 'delivery-charges',
//         question: 'What are the delivery charges?',
//         answer: 'Delivery is free on orders above \u20B9499. Below that, a flat \u20B949 shipping fee applies.',
//       },
//       {
//         id: 'delivery-time',
//         question: 'How long does shipping take?',
//         answer: 'Most orders are delivered within 3\u20137 business days, depending on your location.',
//       },
//       {
//         id: 'international',
//         question: 'Do you ship internationally?',
//         answer: 'Currently we only ship within India. International shipping is on our roadmap \u2014 stay tuned!',
//       },
//     ],
//   },
//   {
//     id: 'payments',
//     label: 'Payments',
//     icon: FiCreditCard,
//     questions: [
//       {
//         id: 'payment-failed',
//         question: 'My payment failed, what now?',
//         answer: 'If an amount was deducted, it\u2019s usually auto-refunded within 5\u20137 business days. If not, please share your order ID with support.',
//       },
//       {
//         id: 'refund-status',
//         question: 'I haven\u2019t received my refund.',
//         answer: 'Refunds are processed within 5\u20137 business days after approval and reflect in your original payment method.',
//       },
//       {
//         id: 'payment-methods',
//         question: 'What payment methods do you accept?',
//         answer: 'We accept UPI, credit/debit cards, net banking (via Razorpay), and Cash on Delivery on eligible orders.',
//       },
//     ],
//   },
//   {
//     id: 'returns',
//     label: 'Returns & Refunds',
//     icon: FiRefreshCw,
//     questions: [
//       {
//         id: 'return-policy',
//         question: 'What is your return policy?',
//         answer: 'Returns are accepted within 7 days of delivery, as long as the product is unused and in its original packaging.',
//       },
//       {
//         id: 'exchange',
//         question: 'Can I exchange a product?',
//         answer: 'Yes, exchanges are available within 7 days for size or variant issues, subject to stock availability.',
//       },
//       {
//         id: 'damaged-product',
//         question: 'I received a damaged product.',
//         answer: 'We\u2019re really sorry about that. Please share a photo of the product along with your order ID and we\u2019ll arrange a free replacement.',
//       },
//     ],
//   },
//   {
//     id: 'products',
//     label: 'Products',
//     icon: FiFeather,
//     questions: [
//       {
//         id: 'bamboo-care',
//         question: 'How do I care for bamboo products?',
//         answer: 'Keep bamboo items dry after use, avoid soaking for long periods, and occasionally wipe with a light coat of food-safe mineral oil to keep them lasting for years.',
//       },
//       {
//         id: 'eco-friendly',
//         question: 'Are your products eco-friendly?',
//         answer: 'Yes! All our products are made from sustainably sourced bamboo and biodegradable materials, free from plastic.',
//       },
//       {
//         id: 'warranty',
//         question: 'Do products have a warranty?',
//         answer: 'Our bamboo products come with a 6-month warranty against manufacturing defects. Normal wear from daily use isn\u2019t covered.',
//       },
//     ],
//   },
//   {
//     id: 'bulk',
//     label: 'Bulk Order Enquiry',
//     icon: FiShoppingBag,
//     isFlow: true, // marks this as a guided input flow rather than a Q&A list
//   },
// ];

// const SUPPORT_EMAIL = 'support@wakriti.com';
// // Fallback WhatsApp number (used if CMS settings don't return one). Assumed India (+91) — update if different.
// const DEFAULT_WHATSAPP_NUMBER = '914545454545';

// // Simulated "typing" delay before a bot reply appears, in ms.
// const TYPING_DELAY = 750;

// const FloatingButtons = () => {
//   const [showBackToTop, setShowBackToTop] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);

//   // conversation transcript (display only)
//   const [history, setHistory] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const hasGreeted = useRef(false);

//   // current active view:
//   // { type: 'main' }
//   // { type: 'category', category }
//   // { type: 'answer', category, question }
//   // { type: 'bulk', step: 'product' | 'quantity' | 'name' | 'done' }
//   const [view, setView] = useState({ type: 'main' });

//   // guided bulk-order answers, collected across the flow
//   const [bulkData, setBulkData] = useState({ product: '', quantity: '', name: '' });
//   const [inputValue, setInputValue] = useState('');

//   const scrollRef = useRef(null);
//   const inputRef = useRef(null);

//   const { data: settings } = useQuery({
//     queryKey: ['website-settings'],
//     queryFn: () => cmsApi.getSettings(),
//     select: (res) => res.data.data.settings,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     const onScroll = () => setShowBackToTop(window.scrollY > 400);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   useEffect(() => {
//     scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
//   }, [history, view, isTyping]);

//   // Play the opening "typing... then greeting" sequence once, the first time the panel opens.
//   useEffect(() => {
//     if (chatOpen && !hasGreeted.current) {
//       hasGreeted.current = true;
//       setIsTyping(true);
//       const t = setTimeout(() => {
//         setIsTyping(false);
//         setHistory([{ from: 'bot', text: 'Hi, welcome to Wa-Kriti \uD83C\uDF3F How can we help you today?' }]);
//       }, TYPING_DELAY);
//       return () => clearTimeout(t);
//     }
//   }, [chatOpen]);

//   // Focus the text input whenever a bulk-flow step needs free text.
//   useEffect(() => {
//     if (view.type === 'bulk' && ['product', 'quantity', 'name'].includes(view.step) && !isTyping) {
//       inputRef.current?.focus();
//     }
//   }, [view, isTyping]);

//   const whatsappNumber = settings?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

//   // Appends a bot message after a short simulated "typing" delay.
//   const botSay = (text, delay = TYPING_DELAY) => {
//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       setHistory((prev) => [...prev, { from: 'bot', text }]);
//     }, delay);
//   };

//   const selectCategory = (category) => {
//     setHistory((prev) => [...prev, { from: 'user', text: category.label }]);

//     if (category.isFlow && category.id === 'bulk') {
//       setBulkData({ product: '', quantity: '', name: '' });
//       setView({ type: 'bulk', step: 'product' });
//       botSay('Great choice! What product(s) are you looking to order in bulk?');
//       return;
//     }

//     setView({ type: 'category', category });
//   };

//   const selectQuestion = (category, question) => {
//     setHistory((prev) => [...prev, { from: 'user', text: question.question }]);
//     setView({ type: 'answer', category, question });
//     botSay(question.answer);
//   };

//   const backToCategory = (category) => setView({ type: 'category', category });
//   const backToMain = () => setView({ type: 'main' });

//   const submitBulkInput = () => {
//     const value = inputValue.trim();
//     if (!value || isTyping) return;

//     setHistory((prev) => [...prev, { from: 'user', text: value }]);
//     setInputValue('');

//     if (view.step === 'product') {
//       setBulkData((d) => ({ ...d, product: value }));
//       setView({ type: 'bulk', step: 'quantity' });
//       botSay('Got it! Roughly how many units are you looking for?');
//     } else if (view.step === 'quantity') {
//       setBulkData((d) => ({ ...d, quantity: value }));
//       setView({ type: 'bulk', step: 'name' });
//       botSay('Thanks! Could you share your name or company name so our team can follow up?');
//     } else if (view.step === 'name') {
//       setBulkData((d) => ({ ...d, name: value }));
//       setView({ type: 'bulk', step: 'done' });
//       botSay(
//         'Perfect, thank you! Our team can put together a quote for you \u2014 tap below to continue on WhatsApp for the fastest response.'
//       );
//     }
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       submitBulkInput();
//     }
//   };

//   const openWhatsAppChat = () => {
//     if (!whatsappNumber) return;
//     const text = encodeURIComponent('Hi Wa-Kriti team, I need help with my order.');
//     window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
//   };

//   const openEmail = () => {
//     const subject = encodeURIComponent('Support request - Wa-Kriti');
//     window.open(`mailto:${SUPPORT_EMAIL}?subject=${subject}`, '_blank');
//   };

//   const openWhatsAppBulkChat = () => {
//     if (!whatsappNumber) return;
//     const text = encodeURIComponent(
//       `Hi Wa-Kriti team, I'd like to place a bulk order.\n` +
//         `Product(s): ${bulkData.product}\n` +
//         `Quantity: ${bulkData.quantity}\n` +
//         `Name/Company: ${bulkData.name}`
//     );
//     window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
//   };

//   const openEmailBulk = () => {
//     const subject = encodeURIComponent('Bulk Order Enquiry - Wa-Kriti');
//     const body = encodeURIComponent(
//       `Product(s): ${bulkData.product}\nQuantity: ${bulkData.quantity}\nName/Company: ${bulkData.name}`
//     );
//     window.open(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
//   };

//   const showBulkTextInput =
//     view.type === 'bulk' && ['product', 'quantity', 'name'].includes(view.step);

//   return (
//     <>
//       {/* Chat panel */}
//       {chatOpen && (
//         <div className="fixed bottom-24 right-5 z-40 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-bamboo-100 bg-white shadow-soft-lg">
//           {/* Header */}
//           <div className="flex items-center justify-between bg-bamboo-700 px-4 py-4 text-white">
//             <div className="leading-tight">
//               <p className="text-sm font-semibold">Wa-Kriti Support</p>
//               <p className="text-xs text-white/75">Usually replies in a few minutes</p>
//             </div>
//             <button
//               onClick={() => setChatOpen(false)}
//               aria-label="Close support chat"
//               className="rounded-full p-1 transition-colors hover:bg-white/10"
//             >
//               <FiX size={18} />
//             </button>
//           </div>

//           {/* Transcript */}
//           <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
//             {history.map((m, i) => (
//               <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div
//                   className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
//                     m.from === 'user'
//                       ? 'rounded-br-sm bg-bamboo-700 text-white'
//                       : 'rounded-bl-sm border border-bamboo-100 bg-white text-gray-800'
//                   }`}
//                 >
//                   {m.text}
//                 </div>
//               </div>
//             ))}

//             {/* Typing indicator */}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-bamboo-100 bg-white px-3.5 py-3">
//                   <span
//                     className="h-1.5 w-1.5 animate-bounce rounded-full bg-bamboo-400"
//                     style={{ animationDelay: '0ms' }}
//                   />
//                   <span
//                     className="h-1.5 w-1.5 animate-bounce rounded-full bg-bamboo-400"
//                     style={{ animationDelay: '150ms' }}
//                   />
//                   <span
//                     className="h-1.5 w-1.5 animate-bounce rounded-full bg-bamboo-400"
//                     style={{ animationDelay: '300ms' }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Active menu — hidden while the bot is "typing" so options land with the message */}
//             {!isTyping && (
//               <div className="space-y-1.5 pt-1">
//                 {view.type === 'main' &&
//                   MENU.map((cat) => {
//                     const Icon = cat.icon;
//                     return (
//                       <button
//                         key={cat.id}
//                         onClick={() => selectCategory(cat)}
//                         className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
//                           cat.isFlow
//                             ? 'border-bamboo-700 bg-bamboo-50 text-bamboo-800 hover:bg-bamboo-100'
//                             : 'border-bamboo-100 bg-white text-gray-800 hover:border-bamboo-700 hover:bg-bamboo-50'
//                         }`}
//                       >
//                         <span className="flex items-center gap-2">
//                           <Icon size={16} className="text-bamboo-700" />
//                           {cat.label}
//                         </span>
//                         <FiChevronRight size={16} className="text-gray-400" />
//                       </button>
//                     );
//                   })}

//                 {view.type === 'category' && (
//                   <>
//                     {view.category.questions.map((q) => (
//                       <button
//                         key={q.id}
//                         onClick={() => selectQuestion(view.category, q)}
//                         className="flex w-full items-center justify-between rounded-lg border border-bamboo-100 bg-white px-3 py-2.5 text-left text-sm text-gray-800 transition-colors hover:border-bamboo-700 hover:bg-bamboo-50"
//                       >
//                         {q.question}
//                         <FiChevronRight size={16} className="text-gray-400 shrink-0 ml-2" />
//                       </button>
//                     ))}
//                     <button
//                       onClick={backToMain}
//                       className="flex w-full items-center gap-2 pt-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-700"
//                     >
//                       <FiHome size={13} /> Back to Main Menu
//                     </button>
//                   </>
//                 )}

//                 {view.type === 'answer' && (
//                   <div className="space-y-2 rounded-xl border border-bamboo-100 bg-bamboo-50/60 p-3">
//                     <p className="text-xs font-medium text-gray-500">Still need help? Reach a real person:</p>
//                     {whatsappNumber && (
//                       <button
//                         onClick={openWhatsAppChat}
//                         className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
//                       >
//                         <TbBrandWhatsapp size={18} /> Quick support, chat on WhatsApp
//                       </button>
//                     )}
//                     <button
//                       onClick={openEmail}
//                       className="flex w-full items-center justify-center gap-2 rounded-lg border border-bamboo-700 px-3 py-2 text-sm font-medium text-bamboo-700 transition-colors hover:bg-white"
//                     >
//                       <FiMail size={16} /> Email your query
//                     </button>
//                     <div className="flex items-center justify-between pt-1">
//                       <button
//                         onClick={() => backToCategory(view.category)}
//                         className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-bamboo-700"
//                       >
//                         <FiChevronLeft size={13} /> Back to previous
//                       </button>
//                       <button
//                         onClick={backToMain}
//                         className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-bamboo-700"
//                       >
//                         <FiHome size={13} /> Main Menu
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Mid-flow: just a way out, the actual prompt is already the latest bot message above */}
//                 {showBulkTextInput && (
//                   <button
//                     onClick={backToMain}
//                     className="flex w-full items-center gap-2 pt-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-700"
//                   >
//                     <FiHome size={13} /> Cancel &amp; back to Main Menu
//                   </button>
//                 )}

//                 {/* Bulk flow complete: summary + WhatsApp handoff */}
//                 {view.type === 'bulk' && view.step === 'done' && (
//                   <div className="space-y-2 rounded-xl border border-bamboo-100 bg-bamboo-50/60 p-3">
//                     <p className="text-xs font-medium text-gray-500">Your enquiry:</p>
//                     <div className="space-y-0.5 rounded-lg bg-white px-3 py-2 text-xs text-gray-700">
//                       <p><span className="font-semibold text-bamboo-700">Product:</span> {bulkData.product}</p>
//                       <p><span className="font-semibold text-bamboo-700">Quantity:</span> {bulkData.quantity}</p>
//                       <p><span className="font-semibold text-bamboo-700">Name/Company:</span> {bulkData.name}</p>
//                     </div>
//                     {whatsappNumber && (
//                       <button
//                         onClick={openWhatsAppBulkChat}
//                         className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
//                       >
//                         <TbBrandWhatsapp size={18} /> Continue on WhatsApp
//                       </button>
//                     )}
//                     <button
//                       onClick={openEmailBulk}
//                       className="flex w-full items-center justify-center gap-2 rounded-lg border border-bamboo-700 px-3 py-2 text-sm font-medium text-bamboo-700 transition-colors hover:bg-white"
//                     >
//                       <FiMail size={16} /> Email this enquiry instead
//                     </button>
//                     <button
//                       onClick={backToMain}
//                       className="flex w-full items-center gap-2 pt-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-700"
//                     >
//                       <FiHome size={13} /> Back to Main Menu
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Compose bar — only shown while the bulk flow needs free-text input */}
//           {showBulkTextInput && (
//             <div className="flex items-center gap-2 border-t border-bamboo-100 bg-white px-3 py-2.5">
//               <input
//                 ref={inputRef}
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleInputKeyDown}
//                 disabled={isTyping}
//                 placeholder={
//                   view.step === 'product'
//                     ? 'e.g. Bamboo gift hampers'
//                     : view.step === 'quantity'
//                     ? 'e.g. 200 units'
//                     : 'Your name or company'
//                 }
//                 className="flex-1 rounded-full border border-bamboo-100 bg-sand-50 px-3.5 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-bamboo-400 disabled:opacity-60"
//               />
//               <button
//                 onClick={submitBulkInput}
//                 disabled={!inputValue.trim() || isTyping}
//                 aria-label="Send"
//                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bamboo-700 text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiSend size={15} />
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Button stack: back-to-top (top) → support chat → WhatsApp (bottom) */}
//       <div className="fixed bottom-6 right-5 z-30 flex flex-col items-end gap-3">
//         {showBackToTop && (
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//             className="flex h-11 w-11 items-center justify-center rounded-full bg-bamboo-700 text-white shadow-soft-lg transition-transform hover:scale-105"
//             aria-label="Back to top"
//           >
//             <FiArrowUp size={18} />
//           </button>
//         )}

//         <button
//           onClick={() => setChatOpen((v) => !v)}
//           className="flex h-12 w-12 items-center justify-center rounded-full bg-bamboo-700 text-white shadow-soft-lg transition-transform hover:scale-105"
//           aria-label={chatOpen ? 'Close support chat' : 'Open support chat'}
//         >
//           {chatOpen ? <FiX size={20} /> : <FiMessageCircle size={20} />}
//         </button>

//         {/* {whatsappNumber && (
          
//             href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
//             target="_blank"
//             rel="noreferrer"
//             className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft-lg transition-transform hover:scale-105"
//             aria-label="Chat on WhatsApp"
//           >
//             <TbBrandWhatsapp size={26} />
//           </a>
//         )} */}
//       </div>
//     </>
//   );
// };

// export default FloatingButtons;



import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  //FiArrowUp,
  FiUser,
  FiX,
  FiMail,
  FiChevronRight,
  FiChevronLeft,
  FiChevronUp,
  FiChevronDown,
  FiHome,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiRefreshCw,
  FiRotateCw,
  FiFeather,
  FiShoppingBag,
  FiSend,
} from 'react-icons/fi';
import { TbBrandWhatsapp } from 'react-icons/tb';
import { cmsApi } from '../../services/cmsApi';

// ── Menu data: edit freely, or later swap for a fetch('/api/faqs') call ──
// Structure: Main menu (categories) -> Category menu (3 questions) -> Answer + contact options
// The 'bulk' category is special-cased: instead of a question list, it drives
// a short guided text-input flow (product -> quantity -> name/company).
const MENU = [
  {
    id: 'orders',
    label: 'Orders',
    icon: FiPackage,
    questions: [
      {
        id: 'track-order',
        question: 'Where is my order?',
        answer: 'You can track your order anytime from My Orders → Track Order. You\u2019ll also get SMS/email updates at every stage.',
      },
      {
        id: 'cancel-order',
        question: 'Can I cancel my order?',
        answer: 'Orders can be cancelled within 2 hours of placing them, as long as they haven\u2019t been shipped yet. Go to My Orders → Cancel Order.',
      },
      {
        id: 'delayed-order',
        question: 'My order is delayed.',
        answer: 'We\u2019re sorry for the delay. Delays are usually courier-side \u2014 please check My Orders for the latest status, or reach out below with your order ID.',
      },
    ],
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: FiTruck,
    questions: [
      {
        id: 'delivery-charges',
        question: 'What are the delivery charges?',
        answer: 'Delivery is free on orders above \u20B9499. Below that, a flat \u20B949 shipping fee applies.',
      },
      {
        id: 'delivery-time',
        question: 'How long does shipping take?',
        answer: 'Most orders are delivered within 3\u20137 business days, depending on your location.',
      },
      {
        id: 'international',
        question: 'Do you ship internationally?',
        answer: 'Currently we only ship within India. International shipping is on our roadmap \u2014 stay tuned!',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: FiCreditCard,
    questions: [
      {
        id: 'payment-failed',
        question: 'My payment failed, what now?',
        answer: 'If an amount was deducted, it\u2019s usually auto-refunded within 5\u20137 business days. If not, please share your order ID with support.',
      },
      {
        id: 'refund-status',
        question: 'I haven\u2019t received my refund.',
        answer: 'Refunds are processed within 5\u20137 business days after approval and reflect in your original payment method.',
      },
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI, credit/debit cards, net banking (via Razorpay), and Cash on Delivery on eligible orders.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    icon: FiRefreshCw,
    questions: [
      {
        id: 'return-policy',
        question: 'What is your return policy?',
        answer: 'Returns are accepted within 7 days of delivery, as long as the product is unused and in its original packaging.',
      },
      {
        id: 'exchange',
        question: 'Can I exchange a product?',
        answer: 'Yes, exchanges are available within 7 days for size or variant issues, subject to stock availability.',
      },
      {
        id: 'damaged-product',
        question: 'I received a damaged product.',
        answer: 'We\u2019re really sorry about that. Please share a photo of the product along with your order ID and we\u2019ll arrange a free replacement.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: FiFeather,
    questions: [
      {
        id: 'bamboo-care',
        question: 'How do I care for bamboo products?',
        answer: 'Keep bamboo items dry after use, avoid soaking for long periods, and occasionally wipe with a light coat of food-safe mineral oil to keep them lasting for years.',
      },
      {
        id: 'eco-friendly',
        question: 'Are your products eco-friendly?',
        answer: 'Yes! All our products are made from sustainably sourced bamboo and biodegradable materials, free from plastic.',
      },
      {
        id: 'warranty',
        question: 'Do products have a warranty?',
        answer: 'Our bamboo products come with a 6-month warranty against manufacturing defects. Normal wear from daily use isn\u2019t covered.',
      },
    ],
  },
  {
    id: 'bulk',
    label: 'Bulk Order Enquiry',
    icon: FiShoppingBag,
    isFlow: true, // marks this as a guided input flow rather than a Q&A list
  },
];

const SUPPORT_EMAIL = 'support@wakriti.com';
// Fallback WhatsApp number (used if CMS settings don't return one). Assumed India (+91) — update if different.
const DEFAULT_WHATSAPP_NUMBER = '914545454545';

const ASSISTANT_NAME = 'Wa-Kriti Assistant';
const GREETING = 'Hi! Welcome to Wa-Kriti \uD83D\uDC4B\nHow can I help you today?';

// How many menu pills show before "Show more". Keep it even so the grid stays tidy.
const COLLAPSED_COUNT = 5;

// Simulated "typing" delay before a bot reply appears, in ms.
const TYPING_DELAY = 750;

const FloatingButtons = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);

  // conversation transcript (display only)
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasGreeted = useRef(false);

  // current active view:
  // { type: 'main' }
  // { type: 'category', category }
  // { type: 'answer', category, question }
  // { type: 'bulk', step: 'product' | 'quantity' | 'name' | 'done' }
  const [view, setView] = useState({ type: 'main' });

  // guided bulk-order answers, collected across the flow
  const [bulkData, setBulkData] = useState({ product: '', quantity: '', name: '' });
  const [inputValue, setInputValue] = useState('');

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn: () => cmsApi.getSettings(),
    select: (res) => res.data.data.settings,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, view, isTyping, showAllMenu]);

  // Play the opening "typing... then greeting" sequence once, the first time the panel opens.
  useEffect(() => {
    if (chatOpen && !hasGreeted.current) {
      hasGreeted.current = true;
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setHistory([{ from: 'bot', text: GREETING }]);
      }, TYPING_DELAY);
      return () => clearTimeout(t);
    }
  }, [chatOpen]);

  // Focus the text input whenever a bulk-flow step needs free text.
  useEffect(() => {
    if (view.type === 'bulk' && ['product', 'quantity', 'name'].includes(view.step) && !isTyping) {
      inputRef.current?.focus();
    }
  }, [view, isTyping]);

  const whatsappNumber = settings?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  // Appends a bot message after a short simulated "typing" delay.
  const botSay = (text, delay = TYPING_DELAY) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setHistory((prev) => [...prev, { from: 'bot', text }]);
    }, delay);
  };

  // Refresh button: wipe the conversation and start again from the greeting.
  const resetChat = () => {
    setHistory([]);
    setView({ type: 'main' });
    setBulkData({ product: '', quantity: '', name: '' });
    setInputValue('');
    setShowAllMenu(false);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setHistory([{ from: 'bot', text: GREETING }]);
    }, TYPING_DELAY);
  };

  const selectCategory = (category) => {
    setHistory((prev) => [...prev, { from: 'user', text: category.label }]);

    if (category.isFlow && category.id === 'bulk') {
      setBulkData({ product: '', quantity: '', name: '' });
      setView({ type: 'bulk', step: 'product' });
      botSay('Great choice! What product(s) are you looking to order in bulk?');
      return;
    }

    setView({ type: 'category', category });
  };

  const selectQuestion = (category, question) => {
    setHistory((prev) => [...prev, { from: 'user', text: question.question }]);
    setView({ type: 'answer', category, question });
    botSay(question.answer);
  };

  const backToCategory = (category) => setView({ type: 'category', category });
  const backToMain = () => setView({ type: 'main' });

  const submitBulkInput = () => {
    const value = inputValue.trim();
    if (!value || isTyping) return;

    setHistory((prev) => [...prev, { from: 'user', text: value }]);
    setInputValue('');

    if (view.step === 'product') {
      setBulkData((d) => ({ ...d, product: value }));
      setView({ type: 'bulk', step: 'quantity' });
      botSay('Got it! Roughly how many units are you looking for?');
    } else if (view.step === 'quantity') {
      setBulkData((d) => ({ ...d, quantity: value }));
      setView({ type: 'bulk', step: 'name' });
      botSay('Thanks! Could you share your name or company name so our team can follow up?');
    } else if (view.step === 'name') {
      setBulkData((d) => ({ ...d, name: value }));
      setView({ type: 'bulk', step: 'done' });
      botSay(
        'Perfect, thank you! Our team can put together a quote for you \u2014 tap below to continue on WhatsApp for the fastest response.'
      );
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitBulkInput();
    }
  };

  const openWhatsAppChat = () => {
    if (!whatsappNumber) return;
    const text = encodeURIComponent('Hi Wa-Kriti team, I need help with my order.');
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const openEmail = () => {
    const subject = encodeURIComponent('Support request - Wa-Kriti');
    window.open(`mailto:${SUPPORT_EMAIL}?subject=${subject}`, '_blank');
  };

  const openWhatsAppBulkChat = () => {
    if (!whatsappNumber) return;
    const text = encodeURIComponent(
      `Hi Wa-Kriti team, I'd like to place a bulk order.\n` +
        `Product(s): ${bulkData.product}\n` +
        `Quantity: ${bulkData.quantity}\n` +
        `Name/Company: ${bulkData.name}`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const openEmailBulk = () => {
    const subject = encodeURIComponent('Bulk Order Enquiry - Wa-Kriti');
    const body = encodeURIComponent(
      `Product(s): ${bulkData.product}\nQuantity: ${bulkData.quantity}\nName/Company: ${bulkData.name}`
    );
    window.open(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  const showBulkTextInput =
    view.type === 'bulk' && ['product', 'quantity', 'name'].includes(view.step);

  const visibleMenu = showAllMenu ? MENU : MENU.slice(0, COLLAPSED_COUNT);
  const canToggleMenu = MENU.length > COLLAPSED_COUNT;
  // When expanded with an odd number of pills, let the toggle take a full row.
  const toggleSpansRow = showAllMenu && visibleMenu.length % 2 === 0;

  const pillBase =
    'flex min-h-[3rem] items-center justify-center rounded-3xl border px-3 py-2.5 text-center text-sm leading-snug transition-colors';

  return (
    <>
      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-5 z-40 flex h-[540px] max-h-[calc(100vh-7rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-soft-lg">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 px-5 pb-3 pt-5">
            <div className="leading-tight">
              <p className="text-base font-bold text-gray-900">{ASSISTANT_NAME}</p>
              <p className="mt-1 text-sm text-gray-500">Wa-Kriti</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                aria-label="Restart conversation"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <FiRotateCw size={16} />
              </button>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close assistant"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Transcript + options (options sit at the bottom of the panel) */}
          <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {history.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-bamboo-700 text-white'
                        : 'rounded-bl-sm bg-gray-100 text-gray-800'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3.5">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-bamboo-400"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active menu — hidden while the bot is "typing" so options land with the message */}
            {!isTyping && (
              <div className="mt-auto space-y-2 pt-5">
                {view.type === 'main' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {visibleMenu.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat)}
                        className={`${pillBase} ${
                          cat.isFlow
                            ? 'border-bamboo-700 bg-bamboo-50 font-medium text-bamboo-800 hover:bg-bamboo-100'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-bamboo-700 hover:bg-bamboo-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}

                    {canToggleMenu && (
                      <button
                        onClick={() => setShowAllMenu((v) => !v)}
                        className={`${pillBase} gap-1.5 border-transparent bg-gray-50 text-gray-700 hover:bg-gray-100 ${
                          toggleSpansRow ? 'col-span-2' : ''
                        }`}
                      >
                        {showAllMenu ? 'Show less' : 'Show more'}
                        {showAllMenu ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                      </button>
                    )}
                  </div>
                )}

                {view.type === 'category' && (
                  <>
                    {view.category.questions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => selectQuestion(view.category, q)}
                        className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:border-bamboo-700 hover:bg-bamboo-50"
                      >
                        {q.question}
                        <FiChevronRight size={16} className="ml-2 shrink-0 text-gray-400" />
                      </button>
                    ))}
                    <button
                      onClick={backToMain}
                      className="flex w-full items-center gap-2 pt-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-700"
                    >
                      <FiHome size={13} /> Back to Main Menu
                    </button>
                  </>
                )}

                {view.type === 'answer' && (
                  <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">Still need help? Reach a real person:</p>
                    {whatsappNumber && (
                      <button
                        onClick={openWhatsAppChat}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        <TbBrandWhatsapp size={18} /> Quick support, chat on WhatsApp
                      </button>
                    )}
                    <button
                      onClick={openEmail}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-bamboo-700 px-3 py-2.5 text-sm font-medium text-bamboo-700 transition-colors hover:bg-white"
                    >
                      <FiMail size={16} /> Email your query
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => backToCategory(view.category)}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-bamboo-700"
                      >
                        <FiChevronLeft size={13} /> Back to previous
                      </button>
                      <button
                        onClick={backToMain}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-bamboo-700"
                      >
                        <FiHome size={13} /> Main Menu
                      </button>
                    </div>
                  </div>
                )}

                {/* Mid-flow: just a way out, the actual prompt is already the latest bot message above */}
                {showBulkTextInput && (
                  <button
                    onClick={backToMain}
                    className="flex w-full items-center gap-2 pt-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-700"
                  >
                    <FiHome size={13} /> Cancel &amp; back to Main Menu
                  </button>
                )}

                {/* Bulk flow complete: summary + WhatsApp handoff */}
                {view.type === 'bulk' && view.step === 'done' && (
                  <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">Your enquiry:</p>
                    <div className="space-y-0.5 rounded-xl bg-white px-3 py-2 text-xs text-gray-700">
                      <p><span className="font-semibold text-bamboo-700">Product:</span> {bulkData.product}</p>
                      <p><span className="font-semibold text-bamboo-700">Quantity:</span> {bulkData.quantity}</p>
                      <p><span className="font-semibold text-bamboo-700">Name/Company:</span> {bulkData.name}</p>
                    </div>
                    {whatsappNumber && (
                      <button
                        onClick={openWhatsAppBulkChat}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        <TbBrandWhatsapp size={18} /> Continue on WhatsApp
                      </button>
                    )}
                    <button
                      onClick={openEmailBulk}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-bamboo-700 px-3 py-2.5 text-sm font-medium text-bamboo-700 transition-colors hover:bg-white"
                    >
                      <FiMail size={16} /> Email this enquiry instead
                    </button>
                    <button
                      onClick={backToMain}
                      className="flex w-full items-center gap-2 pt-1.5 text-xs font-medium text-gray-500 hover:text-bamboo-700"
                    >
                      <FiHome size={13} /> Back to Main Menu
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Compose bar — only shown while the bulk flow needs free-text input */}
          {showBulkTextInput && (
            <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-2.5">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isTyping}
                placeholder={
                  view.step === 'product'
                    ? 'e.g. Bamboo gift hampers'
                    : view.step === 'quantity'
                    ? 'e.g. 200 units'
                    : 'Your name or company'
                }
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-bamboo-400 disabled:opacity-60"
              />
              <button
                onClick={submitBulkInput}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bamboo-700 text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiSend size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Launcher stack: back-to-top (top) → Wa-Kriti Assistant pill (bottom) */}
      <div className="fixed bottom-6 right-5 z-30 flex flex-col items-end gap-3">
        {/* {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-bamboo-700 text-white shadow-soft-lg transition-transform hover:scale-105"
            aria-label="Back to top"
          >
            <FiArrowUp size={18} />
          </button>
        )} */}

        <button
          onClick={() => setChatOpen((v) => !v)}
          className="flex h-14 items-center gap-3 rounded-full bg-bamboo-700 pl-4 pr-6 text-base font-semibold text-white shadow-soft-lg transition-transform hover:scale-105"
          aria-label={chatOpen ? `Close ${ASSISTANT_NAME}` : `Open ${ASSISTANT_NAME}`}
          aria-expanded={chatOpen}
        >
          <FiUser size={22} />
          {ASSISTANT_NAME}
        </button>
      </div>
    </>
  );
};

export default FloatingButtons;