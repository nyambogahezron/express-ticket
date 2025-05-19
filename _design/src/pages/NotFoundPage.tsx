import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <MapPin className="h-16 w-16 text-primary-500 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/events" className="btn-secondary">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;