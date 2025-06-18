import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12">
          IT TAKES ONLY 1 MINUTE TO BOOK 1-ON-1 CALL
        </h2>

        {/* Placeholder for the flow diagram/illustrations */}
        <div className="flex justify-center items-center">
          {/* You would replace this div with your actual illustrations and arrows */}
          <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-center text-sm md:text-base">
            Placeholder for How It Works Flow Diagram
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection; 