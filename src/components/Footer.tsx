import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-pink-600 text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          {/* Replace with your logo image */}
          <span className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Qnnect.in</span>
          <p className="text-xs md:text-sm text-pink-100 text-center md:text-left mb-3 md:mb-4">
            Automate and simplify your business operations with easy and secure solutions
          </p>
          <button className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg font-medium text-pink-600 bg-white rounded-md hover:bg-gray-200 mt-3 md:mt-4 w-full sm:w-auto">TOP PROFILES</button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h3>
          <ul className="space-y-2 md:space-y-3 text-center md:text-left">
            <li><a href="#" className="hover:underline text-pink-100 text-sm md:text-base">About us</a></li>
            <li><a href="#" className="hover:underline text-pink-100 text-sm md:text-base">Contact us</a></li>
            <li><a href="#" className="hover:underline text-pink-100 text-sm md:text-base">Terms of service</a></li>
            <li><a href="#" className="hover:underline text-pink-100 text-sm md:text-base">Privacy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Get Social</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
            <a 
              href="https://www.linkedin.com/company/qnnectdotin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-100 hover:text-white text-sm md:text-base flex items-center gap-2"
            >
              <FaLinkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://x.com/teamqnnect" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-100 hover:text-white text-sm md:text-base flex items-center gap-2"
            >
              <FaXTwitter className="w-5 h-5" />
              <span>Twitter</span>
            </a>
            <a 
              href="https://www.instagram.com/qnnect.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-100 hover:text-white text-sm md:text-base flex items-center gap-2"
            >
              <FaInstagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-pink-100">&copy; {new Date().getFullYear()} Qnnect. All rights reserved.</div>
    </footer>
  );
};

export default Footer; 