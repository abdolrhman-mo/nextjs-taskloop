export interface Participant {
  id: number;
  username: string;
}

export interface Session {
  id: number;
  uuid: string;
  name: string;
  creator: number;
  creator_username: string;
  participants: Participant[];
  participants_count: number;
  created_at: string;
}

export interface Task {
  id: number;
  session: number;
  session_uuid: string;
  user: number;
  creator_username: string;
  text: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
} 