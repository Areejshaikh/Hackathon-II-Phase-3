// frontend/src/components/dashboard/task-tabs.tsx
'use client';

interface TaskTabsProps {
  activeTab: 'All' | 'Pending' | 'In-Progress' | 'Completed';
  setActiveTab: (tab: 'All' | 'Pending' | 'In-Progress' | 'Completed') => void;
}

const TaskTabs = ({ activeTab, setActiveTab }: TaskTabsProps) => {
  const tabs = [
    { id: 'All', label: 'All Tasks' },
    { id: 'Pending', label: 'Pending' },
    { id: 'In-Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' },
  ];

  return (
    <div className="flex border-b border-slate-700 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-3 px-6 font-medium text-sm transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab(tab.id as 'All' | 'Pending' | 'In-Progress' | 'Completed')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TaskTabs;