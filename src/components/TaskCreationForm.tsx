import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { tasksApi, Task } from '../api/tasksApi'; // Task is explicitly imported

interface TaskFormProps {
  onSuccess: () => void;
}

const TaskCreationForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // Omit taskExecutions as it is managed by the backend
      const newTask: Omit<Task, 'taskExecutions'> = {
        id: values.id,
        name: values.name,
        owner: values.owner,
        command: values.command,
      };
      await tasksApi.createTask(newTask);
      message.success(`Task ${values.id} created successfully.`);
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      console.error(error);
      // Displaying the 400 Bad Request message from the server (e.g., validation error)
      message.error(`Failed to create task: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Card title="Create New Task" style={{ marginBottom: 24 }} hoverable>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="id"
          label="Task ID (String)"
          rules={[{ required: true, message: 'Please input the Task ID!' }]}
        >
          <Input placeholder="e.g., TSK-005" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Task Name"
          rules={[{ required: true, message: 'Please input the Task Name!' }]}
        >
          <Input placeholder="e.g., Check Disk Space" />
        </Form.Item>
        <Form.Item
          name="owner"
          label="Owner"
          rules={[{ required: true, message: 'Please input the Owner!' }]}
        >
          <Input placeholder="e.g., Jane Doe" />
        </Form.Item>
        <Form.Item
          name="command"
          label="Shell Command (K8s)"
          rules={[{ required: true, message: 'Please input the Shell Command!' }]}
          tooltip="This command will be executed inside a K8s busybox Pod."
        >
          <Input.TextArea placeholder="e.g., df -h /mnt/data" rows={2} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Task
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TaskCreationForm;