import React from 'react';
import { FiPhone } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ConnectSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#E9D3A4] py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full px-4">
        <div className="flex items-center justify-center mb-8">
          <span className="text-2xl md:text-3xl mr-2 text-black">
            {React.createElement(FiPhone, { size: 28, color: "black" })}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">Let's Connect!</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Reach Out Card */}
          <div className="bg-white rounded-xl border-2 border-purple-400 p-6 flex flex-col items-center shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-black flex items-center">
              Reach Out
              <span className="ml-2 text-purple-500">
                {React.createElement(FiPhone, { size: 20, color: "#a855f7" })}
              </span>
            </h3>
            <p className="mb-4 text-black">teamqnnect@gmail.com</p>
            {/* Placeholder for QR code */}
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md mb-2">
              <span className="text-gray-500">QR</span>
            </div>
          </div>
          {/* Join as Expert Card */}
          <div className="bg-white rounded-xl border-2 border-black p-6 flex flex-col items-center shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-black text-center">
              To monetise your expertise and knowledge,<br />Join us as an Expert.
            </h3>
            <button className="mt-4 px-6 py-2 bg-orange-500 text-white font-bold rounded-md text-lg hover:bg-orange-600 transition" onClick={() => navigate('/signup?role=expert')}>
              Join Now!
            </button>
          </div>
        </div>
        {/* Qnnect Logo */}
        <div className="flex justify-center items-center mt-4">
          <span className="text-2xl font-bold text-black mr-2">Q</span>
          <span className="w-4 h-4 bg-orange-500 rounded-full inline-block mr-2"></span>
          <span className="text-xl font-bold text-black">nnect</span>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection; 