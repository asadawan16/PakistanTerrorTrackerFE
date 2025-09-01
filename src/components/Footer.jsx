import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="max-w-[80%] mt-30 mx-auto bg-white text-gray-800 py-12 px-30 rounded-t-[100px] border-t-4 border-red-800">
            <div className="w-">
                <div className=" px-4 flex flex-row md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Left side - Logo and title */}
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Pakistan Terror Tracker" className="w-13 h-15" />
                        <span className="text-2xl leading-none font-bold text-gradient  from-red-500 to-red-800 w-1/3">Pakistan Terror Tracker</span>
                    </div>

                    {/* Right side - Description */}
                    <div className="text-[#5B5B5B] text-regular max-w-md text-left md:text-right leading-relaxed">
                        Get live updates, get detailed reports, AI insights and much more with our Terror Tracking Engine.
                    </div>
                </div>

                {/* Bottom - Policy links */}
                <div className="mt-10 pt-8  flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-6">
                 
                    <div className="flex gap-8 text-sm">
                        <a 
                            href="/privacy-policy" 
                            className="text-gray-600 border-r border-gray-300 pr-4 hover:text-red-800 transition-colors duration-200 font-medium"
                        >
                            Privacy Policy
                        </a>
                        <a 
                            href="/terms-conditions" 
                            className="text-gray-600 border-r border-gray-300 pr-4 hover:text-red-800 transition-colors duration-200 font-medium"
                        >
                            Terms & Conditions
                        </a>
                        <a 
                            href="/cookie-policy" 
                            className="text-gray-600 hover:text-red-800 transition-colors duration-200 font-medium"
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;