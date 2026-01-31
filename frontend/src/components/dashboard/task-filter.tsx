// frontend/src/components/dashboard/task-filter.tsx
interface TaskFilterProps {
  filter: {
    status: string;
    category: string;
  };
  setFilter: (filter: { status: string; category: string }) => void;
}

const TaskFilter = ({ filter, setFilter }: TaskFilterProps) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, status: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, category: e.target.value });
  };

  return (
    <div className="flex gap-4 mt-4">
      <div>
        <label htmlFor="status-filter" className="text-sm text-slate-400">Status</label>
        <select
          id="status-filter"
          value={filter.status}
          onChange={handleStatusChange}
          className="ml-2 text-sm bg-slate-800/50 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200"
        >
          <option value="all" className="bg-slate-800">All</option>
          <option value="Pending" className="bg-slate-800">Pending</option>
          <option value="In-Progress" className="bg-slate-800">In Progress</option>
          <option value="Completed" className="bg-slate-800">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="category-filter" className="text-sm text-slate-400">Category</label>
        <select
          id="category-filter"
          value={filter.category}
          onChange={handleCategoryChange}
          className="ml-2 text-sm bg-slate-800/50 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200"
        >
          <option value="all" className="bg-slate-800">All</option>
          <option value="Personal" className="bg-slate-800">Personal</option>
          <option value="Work" className="bg-slate-800">Work</option>
          <option value="Urgent" className="bg-slate-800">Urgent</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;