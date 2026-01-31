// frontend/src/components/dashboard/task-search.tsx
'use client';

import { useState } from 'react';

interface TaskSearchProps {
  onSearch: (query: string) => void;
}

const TaskSearch = ({ onSearch }: TaskSearchProps) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500"
      />
      <div className="absolute left-3 top-2.5 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

export default TaskSearch;