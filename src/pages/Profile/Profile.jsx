import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const billingInfo = {
    name: 'Raian Ibn Faiz',
    cardNumber: '**** **** **** 1234',
    expiryDate: '08/27',
    billingAddress: 'Baridhara J Block, Badda, Dhaka, Bangladesh',
  };

  const purchaseHistory = [
    { id: 1, item: 'Smartphone', date: '2024-10-01', amount: '$699' },
    { id: 2, item: 'Laptop', date: '2023-09-15', amount: '$1,199' },
    { id: 3, item: 'Wireless Headphones', date: '2024-08-23', amount: '$199' },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800 to-black py-5">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-10">Profile Page</h1>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Billing Information</h2>
          <div className="border-b pb-4">
            <p className="font-medium text-white">Name: <span className="font-normal">{billingInfo.name}</span></p>
            <p className="font-medium text-white">Card Number: <span className="font-normal">{billingInfo.cardNumber}</span></p>
            <p className="font-medium text-white">Expiry Date: <span className="font-normal">{billingInfo.expiryDate}</span></p>
            <p className="font-medium text-white">Billing Address: <span className="font-normal">{billingInfo.billingAddress}</span></p>
          </div>
          <Link to='/edit-billing-information'><button className="btn btn-primary mt-4">Edit Billing Information</button></Link>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Purchase History</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-white">Item</th>
                <th className="py-2 px-4 text-white">Date</th>
                <th className="py-2 px-4 text-white">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-600">
                  <td className="py-2 px-4 text-gray-300">{purchase.item}</td>
                  <td className="py-2 px-4 text-gray-300">{purchase.date}</td>
                  <td className="py-2 px-4 text-gray-300">{purchase.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to='/view-all-purchases'><button className="btn btn-secondary mt-4">View All Purchases</button></Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;