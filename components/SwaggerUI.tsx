'use client';

import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUIComponent = () => {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      const response = await fetch('/api/docs');
      const data = await response.json();
      setSpec(data);
    };

    fetchSwaggerSpec();
  }, []);

  if (!spec) {
    return <div>Loading Swagger UI...</div>;
  }

  return (
    <SwaggerUI spec={spec} />
  );
};

export default SwaggerUIComponent;
