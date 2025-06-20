import React from 'react';
import { useAuth } from '../../Auth/hooks/useAuth';

const DogSearchPage = () => {
  const { logout } = useAuth();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dog Search</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p>Search functionality will be implemented here.</p>
    </div>
  );
};

export default DogSearchPage;
