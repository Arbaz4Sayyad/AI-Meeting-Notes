import React from 'react';

const TestSimple = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400">
        Test Page - Landing Page Working!
      </h1>
      <p className="text-center text-gray-700 dark:text-gray-300 mt-4">
        If you can see this, the basic setup is working.
      </p>
      <div className="mt-8 text-center">
        <button 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => alert('Button works!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestSimple;
