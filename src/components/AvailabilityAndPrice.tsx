import React, { useState, useEffect } from 'react';

const AvailabilityAndPrice: React.FC = () => {
  const [availability, setAvailability] = useState<any>({}); // State to manage availability
  const [pricing, setPricing] = useState<any>({}); // State to manage pricing

  const categories = [
    'Career', 'Design', 'Data & AI', 'Finance', 'Marketing',
    'HR', 'Legal', 'Startup', 'Mental Health', 'Content',
    'Travel', 'Life Coach', 'Real Estate', 'Study Abroad', 'CA',
    'Spiritual', 'Relationship', 'CEOs', 'Creativity', 'More...',
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    const storedAvailability = localStorage.getItem('expertAvailability');
    const storedPricing = localStorage.getItem('expertPricing');

    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability));
    }
    if (storedPricing) {
      setPricing(JSON.parse(storedPricing));
    }
  }, []);

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Availability change: ${e.target.name}: ${e.target.value}`);
    setAvailability({
      ...availability,
      [e.target.name]: e.target.value,
    });
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Pricing change: ${e.target.name}: ${e.target.value}`);
    const { name, value } = e.target;
    setPricing((prevPricing: any) => ({
      ...prevPricing,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('expertAvailability', JSON.stringify(availability));
    localStorage.setItem('expertPricing', JSON.stringify(pricing));
    console.log('Availability:', availability);
    console.log('Pricing:', pricing);
    alert('Availability and Pricing saved!');
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Your Availability & Price</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Availability Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {daysOfWeek.map(day => (
              <div key={day}>
                <label htmlFor={day.toLowerCase()}>{day}</label>
                <input
                  type="text"
                  id={day.toLowerCase()}
                  name={day.toLowerCase()}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  onChange={handleAvailabilityChange}
                  value="TEST"
                  tabIndex={0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Pricing by Category and Session</h3>
          {categories.map(category => (
            <div key={category} className="mb-6 p-4 border border-gray-200 rounded-md">
              <h4 className="text-lg font-medium text-gray-800 mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${category.toLowerCase()}-30min`}>30-min Session Price</label>
                  <input
                    type="number"
                    id={`${category.toLowerCase()}-30min`}
                    name={`${category.toLowerCase()}-30min`}
                    placeholder="e.g., 50"
                    onChange={handlePricingChange}
                    value={123}
                    tabIndex={0}
                  />
                </div>
                <div>
                  <label htmlFor={`${category.toLowerCase()}-60min`}>60-min Session Price</label>
                  <input
                    type="number"
                    id={`${category.toLowerCase()}-60min`}
                    name={`${category.toLowerCase()}-60min`}
                    placeholder="e.g., 90"
                    onChange={handlePricingChange}
                    value={456}
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Availability & Pricing
        </button>
      </form>
    </div>
  );
};

export default AvailabilityAndPrice; 