import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Plus, BarChart3, Map, Settings } from 'lucide-react';
import logo from '../assets/logo.png';
const Header = () => {
  return (
    <header >
      <div className="max-w-[80%] flex justify-between items-center py-9 mx-auto px-4 sm:px-6 lg:px-8">
        
          {/* Logo and Title */}
        <div className='flex items-top gap-2'>
          <img src={logo} alt="" className='w-13 h-14' />
          <h1 className='text-xl font-lufga-extrabold font-extrabold text-white w-1/3 leading-none'>Pakistan <span className='font-base important'>Terror</span> Tracker</h1>
          {/* Main Title */}
        </div>
              <h1 className="text-2xl font-extrabold font-lufga-extrabold text-[#D9D9D9]">Live Terror Tracker</h1>


        </div>

    </header>
  );
};

export default Header;