'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock users data
const mockUsers = [
  { id: '1', username: 'John Doe', email: 'john@example.com' },
  { id: '2', username: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', username: 'Bob Johnson', email: 'bob@example.com' },
  { id: '4', username: 'Alice Brown', email: 'alice@example.com' },
  { id: '5', username: 'Charlie Wilson', email: 'charlie@example.com' },
];

export default function CreateSessionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    // TODO: Create session with this user
    router.push(`/session/${userId}`);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Find a Partner</h1>
      
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-2">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="p-4 bg-white rounded-md shadow cursor-pointer hover:bg-gray-50"
              onClick={() => handleUserClick(user.id)}
            >
              <div className="font-medium text-gray-800">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
