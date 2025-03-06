import { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "Free",
            price: { monthly: 0, annual: 0 },
            description: "Perfect for trying out our platform",
            features: [
                "5 IoT devices",
                "Basic analytics",
                "2 templates",
                "Community support",
                "1GB storage",
                "24 hour data retention"
            ],
            highlighted: false,
            buttonText: "Get Started",
            buttonLink: "/signup"
        },
        {
            name: "Pro",
            price: { monthly: 29, annual: 290 },
            description: "Great for growing businesses",
            features: [
                "25 IoT devices",
                "Advanced analytics",
                "10 templates",
                "Priority email support",
                "10GB storage",
                "30 day data retention",
                "Custom widgets",
                "API access"
            ],
            highlighted: true,
            buttonText: "Start Free Trial",
            buttonLink: "/signup?plan=pro"
        },
        {
            name: "Enterprise",
            price: { monthly: 99, annual: 990 },
            description: "For large-scale IoT deployments",
            features: [
                "Unlimited devices",
                "Custom analytics",
                "Unlimited templates",
                "24/7 phone support",
                "100GB storage",
                "Unlimited data retention",
                "Custom development",
                "Dedicated account manager",
                "SLA guarantee",
                "On-premise deployment"
            ],
            highlighted: false,
            buttonText: "Contact Sales",
            buttonLink: "/contact"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header Section */}
            <div className="pt-20 pb-16 text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                    Choose the perfect plan for your IoT needs
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center mb-12">
                    <span className={`text-sm ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative mx-4 w-16 h-8 flex items-center bg-emerald-500 rounded-full p-1 cursor-pointer"
                    >
                        <div
                            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                                isAnnual ? 'translate-x-8' : ''
                            }`}
                        />
                    </button>
                    <span className={`text-sm ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        Annual <span className="text-emerald-500">(Save 20%)</span>
                    </span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl bg-white dark:bg-slate-800 shadow-xl ${
                                plan.highlighted ? 'ring-2 ring-emerald-500' : ''
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-center text-sm font-semibold text-white py-2 shadow-md">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {plan.name}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">
                                    {plan.description}
                                </p>
                                <div className="mb-8">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {plan.price.monthly === 0 ? '' : `/${isAnnual ? 'year' : 'month'}`}
                                    </span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                                            <svg
                                                className="w-5 h-5 text-emerald-500 mr-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to={plan.buttonLink}
                                    className={`block w-full py-3 px-6 text-center rounded-lg text-white font-semibold transition-all duration-200 ${
                                        plan.highlighted
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                                            : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    {plan.buttonText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Can I switch plans later?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            What payment methods do you accept?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Do you offer a free trial?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Yes, all paid plans come with a 14-day free trial. No credit card required for the Free plan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;