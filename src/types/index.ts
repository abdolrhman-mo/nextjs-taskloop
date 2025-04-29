export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: string;
  session_id: string;
  text: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user1_id: string;
  user2_id: string;
  tasks: Task[];
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 