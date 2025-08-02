import React from 'react';
import { useParams } from 'react-router-dom';

const ContentPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  
  return (
    <div>
      <h1>Content View</h1>
      <p>Viewing {type}: {id}</p>
    </div>
  );
};

export default ContentPage;