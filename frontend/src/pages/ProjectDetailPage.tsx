import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProjectMembers from '../components/ProjectMembers';
import ActivityLogList from '../components/ActivityLogList';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string | null;
  createdAt: string;
}

interface ProjectStats {
  project: {
    id: string;
    name: string;
    owner: {
      id: string;
      email: string;
      name: string;
    };
  };
  overview: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    completionRate: number;
    overdueTasks: number;
    totalMembers: number;
  };
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
  tasksByPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    URGENT: number;
  };
  progression: Array<{
    date: string;
    completed: number;
  }>;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'members' | 'activity'>('overview');
  const [userRole, setUserRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER' | null>(null);

  useEffect(() => {
    fetchProject();
    fetchProjectStats();
    fetchUserRole();
  }, [id]);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`http://localhost:3000/api/projects/${id}/members`);
      const members = response.data;
      const currentMember = members.find((m: any) => m.userId === user.id);
      
      if (currentMember) {
        setUserRole(currentMember.role);
      }
    } catch (err) {
      console.error('Failed to fetch user role:', err);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/projects/${id}`);
      setProject(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/projects/${id}/stats`);
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch project stats:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? All tasks will become unassigned.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`);
      navigate('/projects');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

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

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="alert alert-error">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error || 'Project not found'}
        </div>
        <Link to="/projects" className="btn btn-secondary mt-4 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </div>
    );
  }

  const tasksByStatus = {
    TODO: project.tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: project.tasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/projects" className="btn btn-secondary inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </div>

      {/* Project Info */}
      <div className="card mb-8 border-l-4 relative overflow-visible" style={{ borderLeftColor: project.color }}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{project.name}</h1>
              <div
                className="w-10 h-10 rounded-xl shadow-md flex-shrink-0"
                style={{ backgroundColor: project.color }}
                title={project.color}
              />
            </div>
            {project.description && (
              <p className="text-slate-600 mb-4 text-lg">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">{project.tasks.length}</span>
                <span>tasks</span>
              </div>
            </div>
          </div>
          <div className="flex md:flex-col gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card border-l-4 border-slate-400 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-slate-900">{tasksByStatus.TODO.length}</div>
              <div className="text-sm text-slate-600 font-medium">To Do</div>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-sky-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-sky-900">{tasksByStatus.IN_PROGRESS.length}</div>
              <div className="text-sm text-sky-600 font-medium">In Progress</div>
            </div>
            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-900">{tasksByStatus.DONE.length}</div>
              <div className="text-sm text-emerald-600 font-medium">Done</div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-8">
        <div className="border-b border-slate-200">
          <nav className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Tasks
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {project.tasks.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Members
              </div>
            </button>
            {/* Activity tab - Only visible for OWNER and ADMIN */}
            {(userRole === 'OWNER' || userRole === 'ADMIN') && (
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'activity'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Activity
                </div>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Completion Rate"
              value={stats.overview.completionRate}
              suffix="%"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="emerald"
            />
            <StatCard
              title="Total Members"
              value={stats.overview.totalMembers}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              color="sky"
            />
            <StatCard
              title="In Progress"
              value={stats.overview.inProgressTasks}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              color="violet"
            />
            <StatCard
              title="Overdue Tasks"
              value={stats.overview.overdueTasks}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color={stats.overview.overdueTasks > 0 ? "rose" : "slate"}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution - Pie Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'To Do', value: stats.tasksByStatus.TODO, color: '#64748b' },
                      { name: 'In Progress', value: stats.tasksByStatus.IN_PROGRESS, color: '#0ea5e9' },
                      { name: 'Done', value: stats.tasksByStatus.DONE, color: '#10b981' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'To Do', value: stats.tasksByStatus.TODO, color: '#64748b' },
                      { name: 'In Progress', value: stats.tasksByStatus.IN_PROGRESS, color: '#0ea5e9' },
                      { name: 'Done', value: stats.tasksByStatus.DONE, color: '#10b981' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Distribution - Bar Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tasks by Priority</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Low', tasks: stats.tasksByPriority.LOW, fill: '#10b981' },
                    { name: 'Medium', tasks: stats.tasksByPriority.MEDIUM, fill: '#f59e0b' },
                    { name: 'High', tasks: stats.tasksByPriority.HIGH, fill: '#f43f5e' },
                    { name: 'Urgent', tasks: stats.tasksByPriority.URGENT, fill: '#dc2626' },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
                    {[
                      { name: 'Low', tasks: stats.tasksByPriority.LOW, fill: '#10b981' },
                      { name: 'Medium', tasks: stats.tasksByPriority.MEDIUM, fill: '#f59e0b' },
                      { name: 'High', tasks: stats.tasksByPriority.HIGH, fill: '#f43f5e' },
                      { name: 'Urgent', tasks: stats.tasksByPriority.URGENT, fill: '#dc2626' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Progression - Line Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">7-Day Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={stats.progression.map(p => ({
                  date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  completed: p.completed,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={{ fill: '#0d9488', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Tasks Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
            <Link
              to="/tasks"
              className="btn btn-secondary btn-sm inline-flex items-center gap-2"
            >
              View all tasks
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

        {project.tasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600 mb-4">No tasks in this project yet.</p>
            <Link
              to="/tasks"
              className="btn btn-primary btn-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create a task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">{task.title}</h3>
                    {task.description && (
                      <p className="text-slate-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-slate-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && user && (
        <div className="card">
          <ProjectMembers
            projectId={project.id}
            projectOwnerId={project.userId}
            currentUserId={user.id}
          />
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Activity</h2>
            <p className="text-slate-600">Recent changes and updates to this project</p>
          </div>
          <ActivityLogList projectId={id!} />
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <ProjectEditModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchProject();
          }}
        />
      )}
    </div>
  );
};

// Edit Modal Component
const ProjectEditModal: React.FC<{
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    color: project.color,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`http://localhost:3000/api/projects/${project.id}`, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="color" className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer border border-slate-300"
              />
              <span className="text-sm text-slate-600">{formData.color}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
