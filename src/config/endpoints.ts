export const ENDPOINTS = {
  AUTH: {
    LOGIN: {
      path: '/auth/login',
      operationId: 'auth_login_create',
      method: 'POST',
    },
    REGISTER: {
      path: '/auth/register',
      operationId: 'auth_register_create',
      method: 'POST',
    },
  },
  SESSIONS: {
    LIST: {
      path: '/sessions/',
      operationId: 'sessions_list',
      method: 'GET',
    },
    CREATE: {
      path: '/sessions/create',
      operationId: 'sessions_create_create',
      method: 'POST',
    },
    READ: {
      path: (id: string) => `/sessions/${id}`,
      operationId: 'sessions_read',
      method: 'GET',
    },
    TASKS: {
      LIST: {
        path: (id: string) => `/sessions/${id}/tasks`,
        operationId: 'sessions_tasks_list',
        method: 'GET',
      },
      ADD: {
        path: (id: string) => `/sessions/${id}/tasks/add`,
        operationId: 'sessions_tasks_add_create',
        method: 'POST',
      },
      UPDATE: {
        path: (id: string, taskId: string) => `/sessions/${id}/tasks/${taskId}`,
        operationId: 'sessions_tasks_update',
        method: 'PUT',
      },
    },
    USERS: {
      LIST: {
        path: '/sessions/users',
        operationId: 'users_list',
        method: 'GET',
      },
    },
  },
} as const; 