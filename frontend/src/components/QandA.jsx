import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiMail, FiMessageSquare } from "react-icons/fi";

const faqs = [
  {
    question: "What is GameChanger?",
    answer:
      "GameChanger is a premium sports platform that revolutionizes how athletes and fans engage with sports. We combine live streaming, advanced analytics, and exclusive training content into one seamless experience. Our platform uses AI-powered insights to help you track performance metrics in real-time.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No payment information is required for our Free tier. You can enjoy basic features immediately after signup. When you're ready to upgrade, we accept all major credit cards, PayPal, and Apple Pay for your convenience.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you retain full control of your subscription. Cancellations take effect at the end of your billing cycle with no penalties. We even send reminders before renewals so you're never surprised.",
  },
  {
    question: "Is there a discount for yearly plans?",
    answer:
      "Our yearly subscriptions offer significant savings - up to 20% compared to monthly billing. We also occasionally run seasonal promotions with additional discounts for new members.",
  },
  {
    question: "What support options are available?",
    answer:
      "All plans include access to our knowledge base and community forums. Pro and Elite members get priority email support with <4 hour response times during business hours. Elite members enjoy 24/7 dedicated support including video consultations.",
  },
  {
    question: "How secure is my payment information?",
    answer:
      "We use bank-level 256-bit SSL encryption and never store raw payment details on our servers. All transactions are processed through PCI-compliant partners like Stripe and PayPal.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "You can upgrade or downgrade at any time. When upgrading, you'll get immediate access to new features with a prorated charge. Downgrades take effect at your next billing cycle.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className=" py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about GameChanger, in one place.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-3 max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600 transition-colors duration-300"
              >
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${index}`}
                >
                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 ml-4"
                  >
                    <div className="p-1 rounded-full bg-gray-700">
                      <FiChevronDown className="text-xl text-violet-400" />
                    </div>
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2, delay: 0.1 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2 },
                          opacity: { duration: 0.1 },
                        },
                      }}
                      className="px-6 pb-5 text-gray-300"
                    >
                      <div className="pt-2 border-t border-gray-700/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Extra CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-2xl px-8 py-6">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-400 max-w-md">
                Our support team is ready to help you with any inquiries.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30">
                <FiMail className="text-lg" />
                Email Us
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors duration-300">
                <FiMessageSquare className="text-lg" />
                Live Chat
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;