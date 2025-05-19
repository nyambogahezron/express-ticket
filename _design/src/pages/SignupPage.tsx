import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const SignupPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;