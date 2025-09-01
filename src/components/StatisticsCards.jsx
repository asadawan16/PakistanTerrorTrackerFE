import React from 'react';
import { TrendingUp, Users, MapPin, AlertTriangle } from 'lucide-react';

const StatisticsCards = ({ data = {}, isLoading = false }) => {
  const cards = [
    {
      title: 'Total Attacks',
      value: data.totalAttacks || 68,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'Total Fatalities', 
      value: data.totalFatalities || 56,
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Hotspot Areas',
      value: data.hotspotAreas || 'KP',
      icon: MapPin,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    }
  ];
 
  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="border px-6 py-8 hover:border-gray-600 transition-all duration-300"
            style={{ 
              backgroundColor: '#202126',
              borderColor: '#444B53'
            }}
          >
            <div className="text-center">
              <p className="text-white text-sm font-lufga-extrabold font-normal mb-2">{card.title}</p>
              <div className="text-7xl font-bold text-white">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 h-16 w-20 mx-auto rounded"></div>
                ) : (
                  card.value.length > 3 ? card.value.slice(0, 2) : card.value
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;