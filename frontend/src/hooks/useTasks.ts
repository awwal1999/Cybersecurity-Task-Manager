import { useContext } from 'react';
import { TasksContext, type TasksContextType } from '../contexts';

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  
  return context;
};
