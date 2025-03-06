import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from 'framer-motion';
import img1 from '../../assets/image/iot-banner.jpg'
import img2 from '../../assets/image/iot-banner2.png'

const Features = () => {
  const features = [
    {
      title: "3D Widget Library",
      description: "Access a comprehensive library of pre-built 3D IoT widgets for quick implementation.",
      icon: "📚"
    },
    {
      title: "Real-time Updates",
      description: "Monitor device states and receive instant updates with WebSocket integration.",
      icon: "🔄"
    },
    {
      title: "Customizable Widgets",
      description: "Easily customize widget appearance, behavior, and animations to match your needs.",
      icon: "🎨"
    },
    {
      title: "Drag & Drop Interface",
      description: "Intuitive drag and drop functionality for effortless device placement and organization.",
      icon: "🎯"
    },
    {
      title: "State Management",
      description: "Robust state management system for tracking and controlling device states.",
      icon: "⚡"
    },
    {
      title: "Export & Import",
      description: "Save and load your playground configurations for easy sharing and backup.",
      icon: "💾"
    }
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the tools and capabilities that make Cloud.Playground the perfect solution for IoT device management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 
                       transition-colors duration-300 transform hover:scale-105
                       border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <a
            href="/playground"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg 
                     text-lg font-semibold hover:bg-blue-700 transition-colors 
                     duration-300 transform hover:scale-105"
          >
            Try It Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features; 