import React from "react";
import FileDashboard from "./components/FileDashboard";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">File Management Dashboard</h1>
      <FileDashboard />
    </div>
  );
};

export default App;
