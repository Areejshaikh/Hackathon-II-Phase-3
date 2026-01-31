// frontend/src/types/index.ts

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In-Progress' | 'Completed';
  category: 'Personal' | 'Work' | 'Urgent';
  due_date?: string;
  priority: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Session {
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

export interface Theme {
  primary_color: string;
  background_color: string;
  card_color: string;
  theme_name: string;
}

export interface TaskSummaryCardData {
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
}

export interface FilterData {
  status?: 'All' | 'Pending' | 'In-Progress' | 'Completed';
  category?: 'All' | 'Personal' | 'Work' | 'Urgent';
  search_query?: string;
}