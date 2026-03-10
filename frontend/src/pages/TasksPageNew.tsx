import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    color: string;
  };
}

interface Project {
  id: string;
  name: string;
  color: string;
}

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');

  const toast = useToast();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/projects');
      setProjects(response.data);
    } catch (error: any) {
      console.error('Failed to load projects', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete task "${title}"?`)) return;

    const loadingToast = toast.loading('Deleting task...');
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.dismiss(loadingToast);
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // Filtrage des tâches
  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
    if (projectFilter !== 'ALL' && task.project?.id !== projectFilter) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      TODO: 'bg-slate-100 text-slate-800',
      IN_PROGRESS: 'bg-sky-100 text-sky-800',
      DONE: 'bg-emerald-100 text-emerald-800',
    };
    return styles[status as keyof typeof styles] || styles.TODO;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      LOW: 'bg-emerald-100 text-emerald-800',
      MEDIUM: 'bg-amber-100 text-amber-800',
      HIGH: 'bg-rose-100 text-rose-800',
      URGENT: 'bg-red-100 text-red-900 border-red-200',
    };
    return styles[priority as keyof typeof styles] || styles.MEDIUM;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="text-slate-600 mt-1">Manage and track your tasks</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Filtre Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Filtre Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Filtre Project */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="input"
            >
              <option value="ALL">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset filters */}
        {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || projectFilter !== 'ALL') && (
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setProjectFilter('ALL');
            }}
            className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-slate-100">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          </h3>
          <p className="text-slate-600 mb-6 max-w-sm mx-auto">
            {tasks.length === 0
              ? 'Get started by creating your first task.'
              : 'Try adjusting your filters to see more tasks.'}
          </p>
          {tasks.length === 0 && (
            <button onClick={handleCreate} className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card card-hover">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.project && (
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.project.color }}
                      />
                      <span className="text-sm text-slate-600">{task.project.name}</span>
                    </div>
                  )}

                  {task.dueDate && (
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 mt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex-1 text-center bg-teal-50 text-teal-700 px-4 py-2 rounded hover:bg-teal-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id, task.title)}
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TaskFormModal
          task={editingTask}
          projects={projects}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

// Task Form Modal Component
const TaskFormModal: React.FC<{
  task: Task | null;
  projects: Project[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ task, projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'TODO',
    priority: task?.priority || 'MEDIUM',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    projectId: task?.project?.id || '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const loadingToast = toast.loading(task ? 'Updating task...' : 'Creating task...');
    setLoading(true);

    try {
      const data = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        projectId: formData.projectId || null,
      };

      if (task) {
        await axios.put(`http://localhost:3000/api/tasks/${task.id}`, data);
        toast.dismiss(loadingToast);
        toast.success('Task updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/tasks', data);
        toast.dismiss(loadingToast);
        toast.success('Task created successfully!');
      }
      onSuccess();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea"
              rows={4}
              placeholder="Task description (optional)"
            />
          </div>

          {/* Row: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="input"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="input"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Row: Due Date & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 mb-2">
                Project
              </label>
              <select
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="input"
              >
                <option value="">No Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {task ? 'Update Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TasksPage;
