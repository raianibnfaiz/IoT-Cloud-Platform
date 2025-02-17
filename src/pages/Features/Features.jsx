import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from 'framer-motion';
import img1 from '../../assets/image/iot-banner.jpg'
import img2 from '../../assets/image/iot-banner2.png'

const features = [
  {
      title: "Blueprints and Templates",
      description: "Templates that include a tutorial, a firmware code example, dashboard UI, and everything else you need for a working device",
  },
  {
      title: "Mobile Apps",
      description: "Our mobile application, suitable for both Android and iOS, allows users to customize their interface via an intuitive drag-and-drop process.",
  },
  {
      title: "Device Provisioning",
      description: "Device provisioning in IoT is a complex blend of hardware, firmware, software, connectivity and security.",
  },
];
const Features = () =>{
  return (

    <div className="bg-gradient-to-r from-gray-800 to-black-100 py-20 m-10 p-10">
            <h2 className="text-4xl font-bold text-center text-white mb-10 font-serif">Our Key Features</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center py-2">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="flex-1 p-6 m-4 rounded-lg shadow-lg bg-gradient-to-r from-gray-800 to-gray-600" // Darker gradient for feature boxes
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <h3 className="text-2xl font-semibold text-yellow-600 text-center py-3">{feature.title}</h3>
                        <p className="text-gray-300 text-center font-roboto ">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}
  


export default Features 