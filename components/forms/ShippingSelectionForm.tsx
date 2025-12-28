'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  createApplicationShipping,
  getShippingServices,
  getShippingServicesQuote,
} from '@/services/shippingService';
import { toast } from 'sonner';
import handleAsync from '@/lib/handleAsync';
import { Loader } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

const ShippingSelectionForm = () => {
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [agree, setAgree] = useState(false);

  const [shippingDataLoading, setShippingDataLoading] = useState(false);
  const [shippingData, setShippingData] = useState<Record<string, any[]>>({});
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  const [quote, setQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch shipping services
  const fetchServices = handleAsync(async () => {
    try {
      setShippingDataLoading(true);
      const data = await getShippingServices();
      console.log(data, 'Shipping Services Data');
      if (data) {
        setShippingData(data);
      } else {
        toast.error('Failed to load shipping services.');
      }
    } finally {
      setShippingDataLoading(false);
    }
  });
  useEffect(() => {
    fetchServices();
  }, []);

  // ✅ Select carrier/service (Fixed)
  const handleSelectService = (carrier: string, service: any) => {
    setSelectedCarrier(carrier);
    setSelectedService(service);
    setSelectedPackage('');

    console.log('✅ Selected Carrier:', carrier);
    console.log('✅ Selected Service:', service);
  };

  // ✅ Select package type
  const handleSelectPackage = (pkgCode: string) => {
    setSelectedPackage(pkgCode);
  };

  // ✅ Get Quote (optional)
  const getQuote = handleAsync(async () => {
    try {
      setQuoteLoading(true);
      const payload = {
        carrierCode: selectedCarrier,
        serviceCode: selectedService.serviceCode,
        packageTypeCode: selectedPackage,
        sender: { country: 'US', zip: '77002' },
      };

      const data = await getShippingServicesQuote(payload);
      if (data) {
        setQuote(data);
      } else {
        toast.error('Failed to fetch quote data');
      }
    } finally {
      setQuoteLoading(false);
    }
  });

  // ✅ Submit Final Shipping (Place Order)
  const handlePlaceOrder = handleAsync(async () => {
    if (!agree) {
      toast.error('Please agree to the Terms of Use before placing order.');
      return;
    }
    if (!selectedCarrier || !selectedPackage) {
      toast.error('Please select a carrier and package before placing order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        applicationIds: ['68e834654610ca2ccaea567a'], // TODO: Replace dynamically
        carrierCode: selectedCarrier,
        packageTypeCode: selectedPackage,
        totalAmount: Number(quote.totalAmount || 0),
        sender: {
          name: 'John Doe',
          company: 'JD Services',
          address1: '2427 FM 1092 RD',
          address2: 'Suite A',
          city: 'Missouri City',
          state: 'TX',
          zip: '77477',
          country: 'US',
          phone: '+1-713-534-1245',
          email: 'john.doe@example.com',
        },
      };

      const data = await createApplicationShipping(payload);
      console.log(data, 'data');
      //   const redirectURL = data?.data?.redirectURL || data?.redirectURL;

      //   if (redirectURL) {
      //     window.location.href = redirectURL; // 🔁 Redirect to Stripe Checkout
      //   } else {
      //     alert('✅ Shipping created, but no redirect URL found.');
      //   }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-blue-900">Shipping Selection</h2>

          {/* 🚚 Shipping List */}
          {shippingDataLoading ? (
            <div className="py-10 grid place-content-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <>
              {Object.entries(shippingData).map(([carrier, services]) => {
                const staticService = services.find(
                  (srv: any) => srv.serviceLabel === 'UPS® Ground',
                );

                if (!staticService) return null;

                const isSelected = selectedService?.serviceCode === staticService.serviceCode;

                return (
                  <div key={carrier} className="mb-4">
                    <h4 className="font-semibold capitalize text-gray-800 mb-2">{carrier}</h4>

                    <button
                      onClick={() => handleSelectService(carrier, staticService)}
                      className={`
          w-full px-4 py-3 rounded-md text-sm font-medium border
          transition-all duration-200
          ${
            isSelected
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'
          }
        `}
                    >
                      {staticService.serviceLabel}
                    </button>
                  </div>
                );
              })}

              {/* 📦 Package Selector */}
              {selectedService && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Select Package Type:
                  </label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => handleSelectPackage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">-- Select Package --</option>
                    {selectedService.packageTypes?.map((pkg: any) => (
                      <option key={pkg.packageTypeCode} value={pkg.packageTypeCode}>
                        {pkg.packageTypeLabel}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 💰 Get Quote Button */}
              {selectedPackage && (
                <Button
                  disabled={quoteLoading}
                  onClick={getQuote}
                  className="bg-blue-600 text-white"
                >
                  {quoteLoading ? 'Quote Data Loading...' : 'Get Shipping Quote'}
                </Button>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Billing Address</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="address"
                      checked={!useDifferentAddress}
                      onChange={() => setUseDifferentAddress(false)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Bill to this Address:</span>
                  </label>
                  <div className="pl-6 text-sm text-gray-700">
                    <p>Carlos Sebastian</p>
                    <p>47 Main Street, New York, NY 10011</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="address"
                      checked={useDifferentAddress}
                      onChange={() => setUseDifferentAddress(true)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Use Different Address</span>
                  </label>
                </div>
                {useDifferentAddress && (
                  <div className="mt-4 space-y-3 pl-6">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Agreement */}
              <div className="mt-6 flex items-start gap-2">
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} id="agree" />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I acknowledge that I have reviewed and agree with the{' '}
                  <a
                    href="/terms-and-condition"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a href="/privacy-policy" target="_blank" className="text-blue-600 underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </>
          )}

          {/* 🚀 Place Order */}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="border-blue-500 text-blue-600">
              ← Back to Traveler Info
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={!agree || isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Processing...' : 'Place Order →'}
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        {quote && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 h-fit shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Order Summary</h3>

            <ul className="text-sm text-gray-700 space-y-2">
              {
                <>
                  <li className="flex justify-between text-blue-800">
                    <span>Base Shipping Cost</span>
                    <span>{formatCurrency({ amount: quote?.baseShippingCost || 0 })}</span>
                  </li>
                  <li className="flex justify-between text-blue-800">
                    <span>Application Charge</span>
                    <span>{formatCurrency({ amount: quote?.applicationCharge || 0 })}</span>
                  </li>
                </>
              }
            </ul>

            <hr className="my-4 border-gray-300" />

            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency({ amount: quote?.totalAmount || 0 })}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ShippingSelectionForm;
