import React, { useContext, useEffect } from 'react';
import TaskContext from '../../context/task/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const taskContext = useContext(TaskContext);
  const { tasks, getTasks, loading } = taskContext;

  useEffect(() => {
    getTasks();
  }, []);

  if (tasks?.length === 0 && !loading) {
    return <h4 className="text-center text-xl mt-4">No tasks to show</h4>;
  }

  return (
    <div className="grid gap-4">
      {tasks?.map(task => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
