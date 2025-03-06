import React from 'react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, children }) => {
  return (
    <div className="widget bg-white rounded-lg shadow-sm">
      <div className="widget-header p-4 border-b cursor-move">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="widget-content p-4">
        {children}
      </div>
    </div>
  );
};

export default Widget;
