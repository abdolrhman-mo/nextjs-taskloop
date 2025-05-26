/**
 * API Endpoints Configuration
 * This file defines all the API endpoints used in the application.
 * Each endpoint has:
 * - path: The URL path for the endpoint
 * - operationId: Unique identifier for the operation
 * - method: HTTP method (GET, POST, PUT, DELETE)
 */

export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    // User login endpoint
    LOGIN: {
      path: '/auth/login',
      operationId: 'auth_login_create',
      method: 'POST',
    },
    // User registration endpoint
    REGISTER: {
      path: '/auth/register',
      operationId: 'auth_register_create',
      method: 'POST',
    },
    // Get current user's profile
    ME: {
      path: '/auth/me',
      operationId: 'auth_me_read',
      method: 'GET',
    },
    // Update current user's profile
    UPDATE_PROFILE: {
      path: '/auth/me',
      operationId: 'auth_me_update',
      method: 'PUT',
    },
  },

  // Session management endpoints
  SESSIONS: {
    // List all sessions
    LIST: {
      path: '/sessions/',
      operationId: 'sessions_list',
      method: 'GET',
    },

    // Create a new session
    CREATE: {
      path: '/sessions/create',
      operationId: 'sessions_create_create',
      method: 'POST',
    },

    // Get a specific session by ID
    READ: {
      path: (id: string) => `/sessions/${id}`,
      operationId: 'sessions_read',
      method: 'GET',
    },

    // Session management endpoints
    MANAGE: {
      // Update session details (name)
      UPDATE: {
        path: (id: string) => `/sessions/${id}/manage`,
        operationId: 'sessions_manage_update',
        method: 'PUT',
      },
      // Delete session
      DELETE: {
        path: (id: string) => `/sessions/${id}/manage`,
        operationId: 'sessions_manage_delete',
        method: 'DELETE',
      },
      // Get session participants
      USERS: {
        path: (id: string) => `/sessions/${id}/users`,
        operationId: 'sessions_manage_users_read',
        method: 'GET',
      },
    },

    // Leave a session
    LEAVE: {
      path: (uuid: string) => `/sessions/${uuid}/leave`,
      operationId: 'sessions_leave_create',
      method: 'POST',
    },

    // Task management within sessions
    TASKS: {
      // List all tasks in a session
      LIST: {
        path: (id: string) => `/sessions/${id}/tasks`,
        operationId: 'sessions_tasks_list',
        method: 'GET',
      },

      // Add a new task to a session
      ADD: {
        path: (id: string) => `/sessions/${id}/tasks/add`,
        operationId: 'sessions_tasks_add_create',
        method: 'POST',
      },

      // Update an existing task
      UPDATE: {
        path: (id: string, taskId: string) => `/sessions/${id}/tasks/${taskId}`,
        operationId: 'sessions_tasks_update',
        method: 'PUT',
      },

      // Delete a task
      DELETE: {
        path: (id: string, taskId: string) => `/sessions/task/${id}/delete/${taskId}`,
        operationId: 'sessions_tasks_delete',
        method: 'DELETE',
      },
    },

    // User management for sessions
    USERS: {
      // List all available users
      LIST: {
        path: '/sessions/users',
        operationId: 'users_list',
        method: 'GET',
      },
    },
  },
} as const;

/**
 * Usage Examples:
 * 
 * 1. Authentication:
 *    - Login: ENDPOINTS.AUTH.LOGIN.path
 *    - Register: ENDPOINTS.AUTH.REGISTER.path
 *    - Get Profile: ENDPOINTS.AUTH.ME.path
 *    - Update Profile: ENDPOINTS.AUTH.UPDATE_PROFILE.path
 * 
 * 2. Sessions:
 *    - List sessions: ENDPOINTS.SESSIONS.LIST.path
 *    - Create session: ENDPOINTS.SESSIONS.CREATE.path
 *    - Get session: ENDPOINTS.SESSIONS.READ.path(sessionId)
 *    - Delete session: ENDPOINTS.SESSIONS.DELETE.path(sessionId)
 *    - Leave session: ENDPOINTS.SESSIONS.LEAVE.path(sessionId)
 * 
 * 3. Session Management:
 *    - Update session: ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(sessionId)
 *    - Delete session: ENDPOINTS.SESSIONS.MANAGE.DELETE.path(sessionId)
 *    - Get participants: ENDPOINTS.SESSIONS.MANAGE.USERS.path(sessionId)
 * 
 * 4. Tasks:
 *    - List tasks: ENDPOINTS.SESSIONS.TASKS.LIST.path(sessionId)
 *    - Add task: ENDPOINTS.SESSIONS.TASKS.ADD.path(sessionId)
 *    - Update task: ENDPOINTS.SESSIONS.TASKS.UPDATE.path(sessionId, taskId)
 *    - Delete task: ENDPOINTS.SESSIONS.TASKS.DELETE.path(sessionId, taskId)
 * 
 * 5. Users:
 *    - List users: ENDPOINTS.SESSIONS.USERS.LIST.path



ENDPOINTS
├── AUTH
│   ├── LOGIN (POST /auth/login)
│   ├── REGISTER (POST /auth/register)
│   ├── ME (GET /auth/me)
│   └── UPDATE_PROFILE (PUT /auth/me)
│
└── SESSIONS
    ├── LIST (GET /sessions/)
    ├── CREATE (POST /sessions/create)
    ├── READ (GET /sessions/:id)
    ├── UPDATE (PUT /sessions/:id)
    ├── DELETE (DELETE /sessions/:id)
    │
    ├── MANAGE
    │   ├── UPDATE (PUT /sessions/:id/manage)
    │   ├── DELETE (DELETE /sessions/:id/manage)
    │   ├── USERS (GET /sessions/:id/users)
    │   └── LEAVE (POST /sessions/:id/leave)
    │
    ├── TASKS
    │   ├── LIST (GET /sessions/:id/tasks)
    │   ├── ADD (POST /sessions/:id/tasks/add)
    │   ├── UPDATE (PUT /sessions/:id/tasks/:taskId)
    │   └── DELETE (DELETE /sessions/task/:id/delete/:taskId)
    │
    └── USERS
        └── LIST (GET /sessions/users)


 */ 