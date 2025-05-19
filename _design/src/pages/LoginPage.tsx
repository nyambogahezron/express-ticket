import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;