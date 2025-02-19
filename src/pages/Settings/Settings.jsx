import React from 'react';

const Settings = () => {
  const settingsData = {
    general: [
      { property: 'Language', value: 'English' },
      { property: 'Timezone', value: 'GMT-5' },
      { property: 'Currency', value: 'USD' },
    ],
    notifications: [
      { property: 'Email Alerts', value: 'Enabled' },
      { property: 'SMS Alerts', value: 'Disabled' },
      { property: 'Push Notifications', value: 'Enabled' },
    ],
    security: [
      { property: 'Two-Factor Authentication', value: 'Enabled' },
      { property: 'Password Change', value: 'Last Updated 01/2023' },
      { property: 'Login Alerts', value: 'Enabled' },
    ],
    dataStorage: [
      { property: 'Account Backup', value: 'Weekly' },
      { property: 'Storage Used', value: '15 GB' },
      { property: 'Data Retention', value: '1 Year' },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-10">Settings Page</h1>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">General</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-white">Property</th>
                <th className="py-3 px-4 text-left text-white">Value</th>
              </tr>
            </thead>
            <tbody>
              {settingsData.general.map((item, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="py-3 px-4 text-gray-300">{item.property}</td>
                  <td className="py-3 px-4 text-gray-300">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Notification</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-white">Property</th>
                <th className="py-3 px-4 text-left text-white">Value</th>
              </tr>
            </thead>
            <tbody>
              {settingsData.notifications.map((item, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="py-3 px-4 text-gray-300">{item.property}</td>
                  <td className="py-3 px-4 text-gray-300">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Security</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-white">Property</th>
                <th className="py-3 px-4 text-left text-white">Value</th>
              </tr>
            </thead>
            <tbody>
              {settingsData.security.map((item, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="py-3 px-4 text-gray-300">{item.property}</td>
                  <td className="py-3 px-4 text-gray-300">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Data & Storage </h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-white">Property</th>
                <th className="py-3 px-4 text-left text-white">Value</th>
              </tr>
            </thead>
            <tbody>
              {settingsData.dataStorage.map((item, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="py-3 px-4 text-gray-300">{item.property}</td>
                  <td className="py-3 px-4 text-gray-300">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Settings;