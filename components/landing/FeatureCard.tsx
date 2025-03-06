import React from 'react';

export interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureProps) => (
  <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-vibrant-teal/50">
    <div className="rounded-full bg-vibrant-teal p-2 text-white">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-center text-muted-foreground">
      {description}
    </p>
  </div>
);
