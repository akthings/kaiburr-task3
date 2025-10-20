import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, message, Popconfirm, Card } from 'antd';
import { DeleteOutlined, SearchOutlined, HistoryOutlined } from '@ant-design/icons';
import { Task, tasksApi } from '../api/tasksApi'; 
import ExecutionModal from './ExecutionModal';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      message.success(`Task ${id} deleted successfully.`);
      onUpdate();
    } catch (error: any) {
      message.error(`Failed to delete task: ${error.message}`);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      onUpdate();
      return;
    }
    try {
      const results = await tasksApi.searchTasks(searchTerm);
      // Handles the case where search returns a single object vs an array
      setTasks(Array.isArray(results) ? results : [results]);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
          message.info('No tasks found matching the search term.');
      } else {
          message.error(`Search failed: ${error.message}`);
      }
      setTasks([]);
    }
  };

  const handleExecuteClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    // Update the task list in state after execution
    setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask); // Update modal content
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { 
      title: 'Command', 
      dataIndex: 'command', 
      key: 'command',
      render: (cmd: string) => <code style={{ fontSize: '11px' }}>{cmd}</code> 
    },
    {
      title: 'Runs',
      key: 'executions',
      render: (text: any, record: Task) => (
        <span>{record.taskExecutions.length}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Task) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<HistoryOutlined />}
            size="small"
            onClick={() => handleExecuteClick(record)}
          >
            Run / View
          </Button>

          <Popconfirm
            title={`Delete task ${record.id}?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Task Records" hoverable>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by task name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 250 }}
        />
        <Button type="default" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
        <Button onClick={() => { setSearchTerm(''); onUpdate(); }}>
          Reset
        </Button>
      </Space>

      <Table dataSource={tasks} columns={columns} rowKey="id" />

      {selectedTask && (
        <ExecutionModal
          task={selectedTask}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onTaskUpdated={handleTaskUpdate}
        />
      )}
    </Card>
  );
};

export default TaskList;