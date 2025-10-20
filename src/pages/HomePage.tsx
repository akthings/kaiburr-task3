import React, { useState, useEffect, useCallback } from 'react'; // useEffect and useCallback are used
import { Layout, message, Spin, Row, Col } from 'antd';
import TaskCreationForm from '../components/TaskCreationForm';
import TaskList from '../components/TaskList';
import { tasksApi, Task } from '../api/tasksApi';

const { Content, Header } = Layout;

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // useCallback is used for stable function reference
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tasksApi.fetchTasks();
      // Ensure the response is treated as an array if only one task is returned
      setTasks(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
         setTasks([]); // 404 usually means no tasks were found, treat as empty list
      } else {
         message.error('Failed to load tasks from backend.');
         console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function definition is stable

  // useEffect is used to trigger data fetch on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // fetchTasks is stable due to useCallback

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontSize: 24, padding: '0 24px' }}>
        Kaiburr K8s Task Manager UI
      </Header>
      <Content style={{ padding: 24 }}>
        <Spin spinning={isLoading} tip="Loading tasks...">
          <Row gutter={24}>
            <Col xs={24} lg={8}>
              <TaskCreationForm onSuccess={fetchTasks} />
            </Col>
            <Col xs={24} lg={16}>
              <TaskList tasks={tasks} setTasks={setTasks} onUpdate={fetchTasks} />
            </Col>
          </Row>
        </Spin>
      </Content>
    </Layout>
  );
};

export default HomePage;