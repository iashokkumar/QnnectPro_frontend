import React from 'react';
import { FiPhone } from 'react-icons/fi';

const CategoriesSection: React.FC = () => {
  const categories = [
    'Career', 'Design', 'Data & AI', 'Finance', 'Marketing',
    'HR', 'Legal', 'Startup', 'Mental Health', 'Content',
    'Travel', 'Life Coach', 'Real Estate', 'Study Abroad', 'CA',
    'Spiritual', 'Relationship', 'CEOs', 'Creativity', 'More...',
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
          Our Top Mentors, Handpicked for You
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">
          In a hurry? Begin with Premium Picks.
        </p>
        <p className="text-gray-600 text-sm md:text-base mb-8 md:mb-12">
          We've handpicked Qnnect's top-rated mentors and most sought-after
          resources—trusted by users for delivering proven results.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-full text-gray-700 text-sm md:text-base hover:bg-blue-600 hover:text-white transition duration-300"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection; 