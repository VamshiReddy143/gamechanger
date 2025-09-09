import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaFootballBall,
  FaBasketballBall,
  FaRunning,
} from "react-icons/fa";
import FAQSection from "../components/QandA";
import Footer from "../components/Home/Footer";

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingTiers = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for casual fans to stay updated.",
      features: [
        "Access to live scores",
        "Basic game highlights",
        "Community forums",
        "Limited profile customization",
      ],
      icon: <FaFootballBall className="text-violet-400 text-5xl" />,
      cta: "Get Started",
    },
    {
      name: "Pro",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      description: "Ideal for athletes and dedicated fans.",
      features: [
        "All Free features",
        "Exclusive training videos",
        "Advanced stats & analytics",
        "Priority support",
        "Custom team alerts",
      ],
      icon: <FaBasketballBall className="text-violet-400 text-5xl" />,
      cta: "Go Pro",
      highlighted: true,
    },
    {
      name: "Elite",
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      description: "For coaches and premium users seeking the best.",
      features: [
        "All Pro features",
        "1:1 coaching sessions",
        "Premium game analysis",
        "VIP event access",
        "Full profile customization",
      ],
      icon: <FaRunning className="text-violet-400 text-5xl" />,
      cta: "Join Elite",
    },
  ];

  return (
    <div className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-7xl font-extrabold text-white">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text font-extrabold text-transparent italic">
               PlayMaker
            </span>{" "}
            Plan
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Unlock the ultimate sports experience with our tailored plans.
          </p>

          {/* Toggle Switch */}
          <div className="mt-6 flex justify-center">
            <div className="bg-gray-800 rounded-full p-1 flex items-center relative">
              <motion.div
                layout
                className="absolute h-8 w-20 bg-primary rounded-full"
                initial={false}
                animate={{ x: isYearly ? 80 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium z-10 ${
                  !isYearly ? "text-white" : "text-gray-400"
                }`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium z-10 ${
                  isYearly ? "text-white" : "text-gray-400"
                }`}
                onClick={() => setIsYearly(true)}
              >
                Yearly{" "}{" "}
         
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`relative rounded-2xl p-8 shadow-2xl backdrop-blur-xl bg-white/5 border ${
                tier.highlighted
                  ? "border-primary shadow-violet-500/30"
                  : "border-gray-700"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500 to-violet-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </span>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">{tier.icon}</div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-white text-center">
                {tier.name}
              </h3>
              <p className="mt-2 text-gray-400 text-center">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mt-6 text-center">
                <span className="text-5xl font-extrabold text-white">
                  ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                </span>
                <span className="text-gray-400 ml-1">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-violet-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-10">
                <button
                  className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-violet-500 to-violet-400 text-white hover:opacity-90"
                      : "bg-gray-700 text-white hover:bg-primary"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <FAQSection/>
      <Footer/>
    </div>
  );
};

export default PricingSection;
