import axios from 'axios';

// --- Types (Matching Java Backend Models) ---

export interface TaskExecution {
  startTime: string; 
  endTime: string;   
  output: string;
}

export interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  taskExecutions: TaskExecution[];
}

// --- API Service ---

// !!! UPDATE THIS URL WITH YOUR FINAL K8S NODEPORT !!!
const BASE_URL = 'http://localhost:32496/tasks'; 

export const tasksApi = {
  // GET all tasks or GET by ID
  fetchTasks: async (id?: string): Promise<Task | Task[]> => {
    const url = id ? `${BASE_URL}?id=${id}` : BASE_URL;
    // Use generic type to tell TypeScript the expected data structure
    const response = await axios.get<Task | Task[]>(url); 
    return response.data;
  },

  // PUT: Create a new task or update an existing one
  createTask: async (task: Omit<Task, 'taskExecutions'>): Promise<Task> => {
    const response = await axios.put<Task>(BASE_URL, task);
    return response.data;
  },

  // DELETE: Delete a task by ID
  deleteTask: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // GET: Find tasks by name (partial match)
  searchTasks: async (name: string): Promise<Task[]> => {
    const response = await axios.get<Task[]>(`${BASE_URL}/search?name=${name}`);
    return response.data;
  },

  // PUT: Execute a task command (Triggers K8s Pod creation)
  executeTask: async (id: string): Promise<Task> => {
    const response = await axios.put<Task>(`${BASE_URL}/${id}/execute`);
    return response.data;
  },
};