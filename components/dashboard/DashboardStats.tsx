'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { UserProfileModel } from '@/types/user';

interface DashboardStatsProps {
  profile?: UserDetail | null;
}

interface StatItem {
  name: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
}

export default function DashboardStats({ profile }: DashboardStatsProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const memberSince = profile?.createdAt 
    ? new Date(profile.createdAt) 
    : new Date();
  
  const daysSinceMember = Math.floor(
    (currentTime.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24)
  );

  const profileCompleteness = (): number => {
    if (!profile) return 0;
    
    let completedFields = 0;
    const totalFields = 6;
    
    if (profile.firstName) completedFields++;
    if (profile.lastName) completedFields++;
    if (profile.email) completedFields++;
    if (profile.userName) completedFields++;
    if (profile.address?.street) completedFields++;
    if (profile.address?.city) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const stats: StatItem[] = [
    {
      name: 'Account Status',
      value: 'Active',
      change: daysSinceMember > 0 ? `${daysSinceMember} days` : 'Today',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
    },
    {
      name: 'Profile Complete',
      value: `${profileCompleteness()}%`,
      change: profileCompleteness() >= 80 ? 'Complete' : 'Needs attention',
      changeType: profileCompleteness() >= 80 ? 'increase' : 'decrease',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: profileCompleteness() >= 80 ? 'green' : 'yellow',
    },
    {
      name: 'Last Login',
      value: 'Today',
      change: currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      name: 'Security Level',
      value: 'Good',
      change: 'Password set',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'green',
    },
  ];

  const getColorClasses = (color: StatItem['color']) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200',
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200',
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200',
      },
      pink: {
        bg: 'bg-pink-100',
        text: 'text-pink-600',
        border: 'border-pink-200',
      },
    };

    return colorMap[color];
  };

  const getChangeIcon = (changeType: StatItem['changeType']) => {
    if (changeType === 'increase') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    }
    
    if (changeType === 'decrease') {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const colors = getColorClasses(stat.color);
        
        return (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {stat.value}
                </p>
                
                {stat.change && (
                  <div className="flex items-center mt-2 text-sm">
                    {getChangeIcon(stat.changeType)}
                    <span className={`ml-1 ${
                      stat.changeType === 'increase' 
                        ? 'text-green-600' 
                        : stat.changeType === 'decrease' 
                        ? 'text-red-600' 
                        : 'text-text-secondary'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}