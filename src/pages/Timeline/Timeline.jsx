import React from 'react'

const Timeline = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-black-100 py-20 m-10 p-10">
        <h2 className="text-4xl font-bold text-center text-white mb-10">Our Services</h2>
        <div className="flex flex-col lg:flex-row justify-center items-center ">
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        <li>
            <div className="timeline-middle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd" />
            </svg>
            </div>
            <div className="timeline-start mb-10 md:text-end">
            <time className="font-mono italic text-orange-500">Home Automation</time>
            <div className="text-lg font-black">Integrating many devices into one cohesive system</div>
            BJIT IoT Cloud Platform offers a range of significant features, including a user-friendly interface for designing custom applications,
        real-time data monitoring and analytics to optimize device usage, and robust security protocols for secure data transmission.
        Connectivity between devices and the cloud is facilitated through our extensive libraries, ensuring seamless integration and efficient operation.
            </div>
            <hr />
        </li>
        <li>
            <hr />
            <div className="timeline-middle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd" />
            </svg>
            </div>
            <div className="timeline-end md:mb-10">
            <time className="font-mono italic text-orange-500">Subscription-Based Services</time>
            <div className="text-lg font-black ">For IoT Developers</div>
            With a business model built on subscription-based services, BJIT IoT Cloud Platform is geared towards providing users with premium services, stimulating growth in the IoT sector.
        By offering subscription plans, we aim to create a sustainable revenue stream that supports continuous innovation and customer support.
      
            </div>
            <hr />
        </li>
        <li>
            <hr />
            <div className="timeline-middle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd" />
            </svg>
            </div>
            <div className="timeline-start mb-10 md:text-end">
            <time className="font-mono italic text-orange-500">Blueprints & Templates</time>
            
            <div className="text-lg font-black">BJIT IoT Cloud Platform Blueprints and Template</div>
            
            Templates that include a tutorial, a firmware code example, dashboard UI, and everything else you need for a working device. Using a Blueprint is a breeze. Each Blueprint contains all the necessary components for a complete project. Simply read through the tutorial, click the 'Use Blueprint' button, and follow the next steps to get your device online within minutes!
            </div>
            <hr />
        </li>
        <li>
            <hr />
            <div className="timeline-middle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd" />
            </svg>
            </div>
            <div className="timeline-end md:mb-10">
            <time className="font-mono italic text-orange-500">Documentation</time>
            <div className="text-lg font-black">Guidelines</div>
            Our commitment to maintaining up-to-date resources reflects our dedication to innovation and customer satisfaction. 
        The documentation includes detailed instructions on using our libraries, setting up various hardware, and deploying applications,
        making it easier for users to get started and achieve their goals. By providing clear and accessible documentation, we aim to empower users to create sophisticated and efficient home automation systems with minimal effort.
            
            </div>
            <hr />
        </li>
        </ul>
    </div>
    </div>
  )
}

export default Timeline