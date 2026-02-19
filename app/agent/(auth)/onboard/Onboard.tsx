'use client';
import AgencyDetailForm from '@/components/forms/AgencyDetailForm';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Onboard = () => {
  const [currentStep, setCurrentStep] = useState(1); // Step 1 = AgencyDetailForm, Step 2 = Thank you

  return (
    <div className="min-h-screen flex flex-col">
      {/* Single Logo for all steps */}
      <div className="w-full flex justify-center py-8">
        <Link href="/login">
          <Image width={250} height={80} src="/logo-text.png" alt="Quartus Logo" />
        </Link>
      </div>

      <div className="flex-1">
        {currentStep === 1 && (
          <div className="w-full px-8 flex flex-col">
            <div className="flex flex-col items-center justify-center">
              <h1 className="md:text-2xl text-xl font-semibold text-text-secondary-200">
                Welcome to Quartus
              </h1>
              <h2 className="text-sm font-normal text-text-secondary-200">
                Complete your agency details
              </h2>
            </div>
            <div>
              <h2 className="text-text-secondary-200 text-xl font-semibold text-center py-4">
                Agency Details
              </h2>
              <AgencyDetailForm setCurrentStep={setCurrentStep} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full  flex flex-col items-center justify-center px-6 relative">
            {/* Thank You Message */}
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Thank You for Submitting Your
              </h1>
              <h2 className="text-3xl font-bold text-blue-700 mb-3">Application with Quartus</h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                We appreciate your interest! Our team will review your application and get back to
                you shortly.
              </p>
            </div>

            {/* Thank You Icon */}
            <div className="mb-10 animate-scale-in">
              <div className="relative flex flex-col items-center">
                <Image
                  width={220}
                  height={140}
                  src="/thank.png"
                  alt="Thank you illustration"
                  className="drop-shadow-lg rounded-lg"
                />
                {/* Blue badge/label under the icon */}
                <Link href="/login" className="mt-3">
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs tracking-wide shadow-md">
                    COMPLETED
                  </span>
                </Link>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="w-16 h-1 bg-blue-500 rounded-full mb-8 animate-fade-in"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboard;
