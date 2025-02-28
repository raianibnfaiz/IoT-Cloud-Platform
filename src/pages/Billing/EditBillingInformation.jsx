import React, { useState } from 'react';

const EditBillingInformation = () => {
  const [billingInfo, setBillingInfo] = useState({
    name: 'Raian Ibn Faiz',
    cardNumber: '**** **** **** 1234',
    expiryDate: '08/24',
    billingAddress: 'Baridhara J Block, Badda, Dhaka, Bangladesh',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({
      ...billingInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., API call to save updated billing info
    alert('Billing information updated successfully!');
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-10">Edit Billing Information</h1>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-yellow-600 font-semibold mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={billingInfo.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-yellow-600 font-semibold mb-2" htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                value={billingInfo.cardNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-yellow-600 font-semibold mb-2" htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                id="expiryDate"
                value={billingInfo.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full p-3 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-yellow-600 font-semibold mb-2" htmlFor="billingAddress">Billing Address</label>
              <input
                type="text"
                name="billingAddress"
                id="billingAddress"
                value={billingInfo.billingAddress}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            <button type="submit" className="mt-4 w-full bg-yellow-600 text-white font-bold py-3 rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600">
              Update Billing Information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBillingInformation;