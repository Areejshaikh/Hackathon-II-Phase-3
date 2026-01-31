// frontend/src/components/dashboard/ai-sort-placeholder.tsx
const AISortPlaceholder = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
      <div className="flex items-center">
        <div className="mr-4 bg-white/20 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg">AI-Powered Sorting</h3>
          <p className="text-sm opacity-80">Intelligent task prioritization coming soon</p>
        </div>
      </div>
      <p className="mt-3 text-sm opacity-90">
        Our AI analyzes your habits and deadlines to automatically sort and prioritize your tasks.
      </p>
      <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-opacity">
        Enable AI Sorting
      </button>
    </div>
  );
};

export default AISortPlaceholder;