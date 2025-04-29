# Tasks Sharing Application - Project Plan

## Project Overview
A Next.js application for sharing and managing tasks between users. The application will allow users to create, share, and track tasks collaboratively.

## Phase 1: Project Setup and Basic Structure
- [x] Initialize Next.js project with TypeScript and Tailwind CSS
- [x] Set up project documentation structure
- [x] Set up project folder structure
- [x] Create basic layout components

## Phase 2: Core Features
- [ ] User Authentication
  - [ ] Sign up functionality
  - [ ] Login functionality
- [ ] Home Page
  - [ ] Start session link that redirects you to start a session page
  - [ ] List of created sessions (create it with mock data)
- [ ] Start a Session Page
  - [ ] Title: find a partener
  - [ ] Search for users
  - [ ] When click on a user it starts a session with this user and redirects you to the session page at session/{id}
- [ ] Session Page
  - [ ] A page that is divided to two parts each contains the username of the first user at the session at the top, then add task form, then tasks list, then done list which is a list of finished tasks
    - [ ] Delete tasks
    - [ ] Mark tasks as complete moves them from tasks to done

## Phase 3: Advanced Features
- [ ] Task Organization
  - [ ] Task lists/boards
  - [ ] Task filtering and sorting
  - [ ] Task search functionality
- [ ] Collaboration Features
  - [ ] Comments on tasks
  - [ ] Task activity history
  - [ ] Real-time updates
- [ ] Task Analytics
  - [ ] Task completion statistics
  - [ ] User productivity metrics
  - [ ] Task timeline visualization

## Phase 4: UI/UX Enhancement
- [ ] Responsive design implementation
- [ ] Dark/Light mode toggle
- [ ] Customizable user interface
- [ ] Accessibility improvements
- [ ] Performance optimization

## Phase 5: Testing and Deployment
- [ ] Unit testing
- [ ] Integration testing
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Deployment setup
- [ ] CI/CD pipeline implementation

## Technical Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- State Management: React Context/Redux
- API: mock api not real
- Authentication: users/register mock api not real
- Testing: Jest, React Testing Library
- Deployment: Vercel

## Notes
- This plan is subject to change based on requirements and feedback
- Each phase can be broken down into smaller tasks as needed
- Priority of features may be adjusted based on user needs 

## Data Models

### User
- id: string
- username: string
- email: string
- created_at: timestamp

### Task
- id: string
- session_id: string
- text: string
- is_done: boolean
- created_at: timestamp
- updated_at: timestamp

### Session
- id: string
- user1_id: string
- user2_id: string
- tasks: Task[]
- created_at: timestamp

## Mock API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Sessions
- POST /api/sessions/create -> Creates new session, returns session ID
<!-- - GET /api/sessions/{id} -> Get session details -->
- GET /api/sessions -> List user's sessions

### Tasks
- GET /api/sessions/{id}/tasks -> Get all tasks in session
- POST /api/sessions/{id}/tasks/add -> Add new task
- PUT /api/sessions/{id}/tasks/{taskId} -> Update task status
- DELETE /api/sessions/{id}/tasks/{taskId} -> Delete task 