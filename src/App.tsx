import React from 'react';
import HomePage from './pages/HomePage';
// Ensure basic Ant Design styles are loaded (optional, depends on setup)
import 'antd/dist/reset.css'; 

const App: React.FC = () => {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
};

export default App;