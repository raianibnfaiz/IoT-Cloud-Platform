import React from 'react';

// Sample data for purchases
const purchases = [
  { id: 1, item: 'Smartphone', date: '2023-10-01', amount: '$699', status: 'Completed' },
  { id: 2, item: 'Laptop', date: '2023-09-15', amount: '$1,199', status: 'Completed' },
  { id: 3, item: 'Wireless Headphones', date: '2023-08-21', amount: '$199', status: 'Pending' },
  { id: 4, item: 'Smartwatch', date: '2023-07-11', amount: '$299', status: 'Completed' },
  { id: 5, item: 'Tablet', date: '2023-06-16', amount: '$499', status: 'Cancelled' },
];

const ViewAllPurchases = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-10">View All Purchases</h1>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-white">Item</th>
                <th className="py-3 px-4 text-left text-white">Date</th>
                <th className="py-3 px-4 text-left text-white">Amount</th>
                <th className="py-3 px-4 text-left text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-600">
                  <td className="py-3 px-4 text-gray-300">{purchase.item}</td>
                  <td className="py-3 px-4 text-gray-300">{purchase.date}</td>
                  <td className="py-3 px-4 text-gray-300">{purchase.amount}</td>
                  <td className={purchase.status === 'Completed' ? "py-3 px-4 text-green-500" : purchase.status === 'Pending' ? "py-3 px-4 text-yellow-500" : "py-3 px-4 text-red-500"}>
                    {purchase.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-secondary mt-4">Download All Purchases</button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllPurchases;