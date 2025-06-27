"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface TravellerFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  phone: string;
}

const Booking = ({params}: {params:Promise<{Id:string}>}) => {
  const {Id} = React.use(params);
  const offerId = decodeURIComponent(Id);
  console.log(offerId);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<TravellerFormData>();

  const flightDetails = {
    flightNumber: 'AF1234',
    departure: 'Paris (CDG)',
    arrival: 'New York (JFK)',
    departureTime: '10:30 AM',
    arrivalTime: '1:30 PM',
    class: 'Business',
    fare: 'Flex',
    basePrice: 1200,
    taxes: 150
  };

  const addOns = [
    { id: 'hotel', name: 'Hotel Reservation', price: 200 },
    { id: 'whatsapp', name: 'WhatsApp Ticket Delivery', price: 5 },
    { id: 'reminder', name: 'Flight Reminder Service', price: 3 },
    { id: 'meal', name: 'Special Meal', price: 25 }
  ];

  const calculateTotal = () => {
    const addOnsTotal = selectedAddOns.reduce((total, id) => {
      const addon = addOns.find(a => a.id === id);
      return total + (addon?.price || 0);
    }, 0);
    return flightDetails.basePrice + flightDetails.taxes + addOnsTotal;
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`h-1 w-32 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between max-w-3xl mx-auto mt-2">
        <span className="text-sm">Traveller Info</span>
        <span className="text-sm">Trip Customization</span>
        <span className="text-sm">Payment</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Flight Details</h3>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-medium">{flightDetails.departure}</p>
              <p className="text-gray-600">{flightDetails.departureTime}</p>
            </div>
            <div className="text-gray-400">→</div>
            <div>
              <p className="text-lg font-medium">{flightDetails.arrival}</p>
              <p className="text-gray-600">{flightDetails.arrivalTime}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Flight {flightDetails.flightNumber}</span>
            <span>•</span>
            <span>{flightDetails.class}</span>
            <span>•</span>
            <span>{flightDetails.fare}</span>
          </div>
        </div>

        <form className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Traveller Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                type="text"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                type="text"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                type="date"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select
                {...register('nationality', { required: 'Nationality is required' })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select nationality</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
              {errors.nationality && (
                <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h3 className="text-xl font-semibold mb-4">Price Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Fare</span>
              <span>${flightDetails.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>${flightDetails.taxes}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
          >
            Continue to Customization
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Add-on Services</h3>
          <div className="space-y-4">
            {addOns.map((addon) => (
              <div key={addon.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{addon.name}</h4>
                  <p className="text-sm text-gray-600">${addon.price}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selectedAddOns.includes(addon.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAddOns([...selectedAddOns, addon.id]);
                      } else {
                        setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h3 className="text-xl font-semibold mb-4">Trip Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Fare</span>
              <span>${flightDetails.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>${flightDetails.taxes}</span>
            </div>
            {selectedAddOns.map((id) => {
              const addon = addOns.find(a => a.id === id);
              return addon && (
                <div key={id} className="flex justify-between text-sm">
                  <span>{addon.name}</span>
                  <span>${addon.price}</span>
                </div>
              );
            })}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentStep(3)}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input type="radio" name="payment" className="form-radio h-5 w-5 text-blue-600" />
                <span className="font-medium">Mobile Money</span>
              </label>
              <div className="mt-4 pl-8">
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input type="radio" name="payment" className="form-radio h-5 w-5 text-blue-600" />
                <span className="font-medium">Orange Money</span>
              </label>
              <div className="mt-4 pl-8">
                <input
                  type="text"
                  placeholder="Enter Orange Money account"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input type="radio" name="payment" className="form-radio h-5 w-5 text-blue-600" />
                <span className="font-medium">Credit/Debit Card</span>
              </label>
              <div className="mt-4 pl-8 space-y-4">
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h3 className="text-xl font-semibold mb-4">Final Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Fare</span>
              <span>${flightDetails.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>${flightDetails.taxes}</span>
            </div>
            {selectedAddOns.map((id) => {
              const addon = addOns.find(a => a.id === id);
              return addon && (
                <div key={id} className="flex justify-between text-sm">
                  <span>{addon.name}</span>
                  <span>${addon.price}</span>
                </div>
              );
            })}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
          <button
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
          >
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {renderProgressBar()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Booking;
