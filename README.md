# 🌐 Project Nebula: Kubernetes Task Manager UI (Task 3)

This repository contains the official frontend web application for Project Helios. It provides a functional, accessible, and intuitive interface for interacting with the Kubernetes Executor API (developed in Tasks 1 & 2), enabling full management and dynamic execution of commands within the Kubernetes cluster.

---

## ✨ Design & Technology

The UI is built to ensure a robust and accessible user experience, featuring immediate feedback, clear form validation, and streamlined execution workflows.

### Core Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 18+ (TypeScript) | Modern, strongly typed, and component-based structure. |
| **UI Library** | Ant Design (AntD) | Enterprise-level component library ensuring accessibility and clean, consistent design. |
| **Styling** | CSS Modules | Encapsulated styling for component isolation. |
| **API Client** | Axios | Promise-based HTTP client for secure backend communication. |

### Usability Highlights
*   **Real-Time Data Refresh:** Tables update instantly upon creation, update, or deletion.
*   **Form Validation:** Clear, immediate feedback during task creation prevents submission errors.
*   **Execution Modal:** Provides a dedicated, isolated view for triggering K8s execution and displaying detailed output history.

---

## ⚙️ Prerequisites & Installation

This application relies entirely on the successful deployment and accessibility of the **Kubernetes Executor API** (Tasks 1 & 2 Backend).

### 1. Backend Connectivity Verification

Ensure the backend service is running, and confirm the `BASE_URL` configuration is correct.

**Crucial Step:** Locate the service file and update the `BASE_URL` to point to your running NodePort or LoadBalancer IP.

```typescript
// src/api/tasksApi.ts
// Example assumes the backend NodePort is 30080
export const BASE_URL = 'http://localhost:30080/tasks'; 
```

### 2. Local Setup

Install dependencies and run the application locally.

```bash
# Install required Node dependencies
npm install

# Run the React application in development mode
npm start

# Access the application, typically at:
# http://localhost:3000
```

---

## ✅ UI Validation Proofs

The following table demonstrates the application's ability to successfully execute all required API operations (CRUD, Search, and the core K8s execution flow).

| ID | Feature Demonstrated | Action & Input | Proof Screenshot |
| :--- | :--- | :--- | :--- |
| **1.** | **UI Initial State** | Successful application load and data fetch on component mount. | *[Screenshot: Initial State]* |
| **2.** | **Task Creation (C)** | Creating a new task (`TSK-01`) via the form input. **Input:** `command: date` | *[Screenshot: Creation Form (PUT)]* |
| **3.** | **Table & Data Refresh (GET)** | Main table displaying the newly created task (`TSK-01`). | *[Screenshot: Table & Data Refresh (GET)]* |
| **4.** | **Search Functionality** | Filtering the table contents using a partial name match (e.g., `Demo` or `TSK`). | *[Screenshot: Search Functionality]* |
| **5.** | **Record Deletion (D)** | Successful removal of an existing record (e.g., `TSK-02`) from the persistent store. | *[Screenshot: Deletion Proof]* |
| **6.** | **Execution Modal View** | Clicking 'Run / View' to open the detailed history and execution modal. | *[Screenshot: Execution Modal (View)]* |
| **7.** | **K8s Run Success & Output** | Triggering the **Execute Command in K8s Pod** action, waiting for execution, and displaying the streamed output/status in the history table. | *[Screenshot: K8s Run Success & Output]* |
