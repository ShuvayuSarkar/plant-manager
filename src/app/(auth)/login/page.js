"use client";
import LoginForm from '@/components/auth/loginForm';
import React, { useEffect } from 'react';
import { trackEvent } from '@/lib/mixpanelClient';

const Page = () => {
  useEffect(() => {
    trackEvent('viewed_login');
  }, []);
  return (
    <div>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Side - Visual or Info */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-neutral-600">Log in to access your dashboard and manage your account.</p>
            {/* You can add an image or branding graphic here */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center h-full w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Page;

