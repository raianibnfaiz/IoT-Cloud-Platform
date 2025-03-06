import 'react'

const Timeline = () => {
    const timelineEvents = [
        {
            year: "2024",
            title: "Cloud.Playground Launch",
            description: "Introducing our innovative 3D IoT device management platform with real-time control capabilities."
        },
        {
            year: "2023",
            title: "Beta Testing",
            description: "Successful beta testing phase with industry partners, gathering valuable feedback and improvements."
        },
        {
            year: "2022",
            title: "Development Begins",
            description: "Started development of the Cloud.Playground platform with focus on user experience and performance."
        }
    ];

    return (
        <div className="py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Our Journey
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        Follow our path from concept to reality as we revolutionize IoT device management.
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-blue-600"></div>

                    {/* Timeline events */}
                    <div className="relative space-y-12">
                        {timelineEvents.map((event, index) => (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-start 
                          ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} 
                          relative`}
                            >
                                {/* Event content */}
                                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                                    <div className="bg-gray-800 rounded-xl p-6 
                               transform hover:scale-105 transition-transform duration-300
                               border border-gray-700">
                                        <div className="text-blue-400 font-bold text-xl mb-2">
                                            {event.year}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-300">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline dot */}
                                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 
                            w-8 h-8 rounded-full bg-blue-600 border-4 border-gray-900
                            flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-16 text-center">
                    <p className="text-lg text-gray-300 mb-6">
                        Join us in shaping the future of IoT device management
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg 
                     text-lg font-semibold hover:bg-blue-700 transition-colors 
                     duration-300 transform hover:scale-105"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Timeline