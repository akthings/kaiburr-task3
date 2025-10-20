import React, { useState } from 'react';
import { Modal, Table, Button, message, Tag } from 'antd';
import { ClockCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Task, TaskExecution, tasksApi } from '../api/tasksApi'; // Task and TaskExecution imported

interface ExecutionModalProps {
  task: Task;
  isVisible: boolean;
  onClose: () => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const ExecutionModal: React.FC<ExecutionModalProps> = ({ task, isVisible, onClose, onTaskUpdated }) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    message.info(`Executing task ${task.id} in a new K8s Pod...`);
    try {
      const updatedTask = await tasksApi.executeTask(task.id);
      
      const lastOutput = updatedTask.taskExecutions.at(-1)?.output || "";
      const success = lastOutput.includes('Exit Code: 0');
      
      message.success(`Task execution complete. Status: ${success ? 'SUCCESS' : 'FAILED'}`);
      onTaskUpdated(updatedTask);
    } catch (error: any) {
      message.error(`Execution failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const columns = [
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time: string) => new Date(time).toLocaleTimeString(),
    },
    {
      title: 'Status',
      dataIndex: 'output',
      key: 'status',
      render: (output: string) => {
        const success = output.includes('Exit Code: 0');
        return <Tag color={success ? 'success' : 'error'}>{success ? 'SUCCESS' : 'FAILED'}</Tag>;
      },
    },
  ];

  return (
    <Modal
      title={`Execution History: ${task.name} (${task.id})`}
      width={800}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="execute"
          type="primary"
          icon={<ThunderboltOutlined />}
          onClick={handleExecute}
          loading={isExecuting}
        >
          Execute Command in K8s Pod
        </Button>,
      ]}
    >
      <p>
        <strong>Command:</strong> <code>{task.command}</code>
      </p>
      
      <p>
        <ClockCircleOutlined /> **Last Execution Output:**
      </p>
      <pre style={{ backgroundColor: '#f0f0f0', padding: 10, maxHeight: 150, overflow: 'auto' }}>
        {task.taskExecutions.length > 0
          ? task.taskExecutions.at(-1)?.output
          : 'No execution history available.'}
      </pre>

      <h4>History ({task.taskExecutions.length})</h4>
      <Table
        dataSource={[...task.taskExecutions].reverse()}
        columns={columns}
        rowKey="startTime"
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default ExecutionModal;