import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

interface ActivityLog {
  id: string;
  userId: string;
  projectId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ActivityLogListProps {
  projectId: string;
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ projectId }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchLogs();
  }, [projectId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/projects/${projectId}/logs?limit=50`
      );
      setLogs(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string, entityType: string) => {
    if (action === 'created') {
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      );
    }
    if (action === 'updated') {
      return (
        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      );
    }
    if (action === 'deleted') {
      return (
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      );
    }
    if (action === 'invited') {
      return (
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
      );
    }
    if (action === 'removed') {
      return (
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  const formatAction = (log: ActivityLog): string => {
    const { action, entityType, details, user } = log;
    const userName = user.name;

    if (entityType === 'task') {
      const taskTitle = details?.title || 'a task';
      if (action === 'created') return `${userName} created task "${taskTitle}"`;
      if (action === 'updated') return `${userName} updated task "${taskTitle}"`;
      if (action === 'deleted') return `${userName} deleted task "${taskTitle}"`;
    }

    if (entityType === 'member') {
      const memberName = details?.memberName || 'a member';
      const role = details?.role || '';
      if (action === 'invited') return `${userName} invited ${memberName} as ${role}`;
      if (action === 'removed') return `${userName} removed ${memberName} from the project`;
      if (action === 'updated') return `${userName} updated ${memberName}'s role to ${role}`;
    }

    if (entityType === 'project') {
      const projectName = details?.name || 'the project';
      if (action === 'created') return `${userName} created project "${projectName}"`;
      if (action === 'updated') return `${userName} updated project "${projectName}"`;
      if (action === 'deleted') return `${userName} deleted project "${projectName}"`;
    }

    return `${userName} ${action} ${entityType}`;
  };

  const formatTimestamp = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  if (logs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No activity yet</h3>
        <p className="text-slate-600">Project activity will appear here as team members work.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex-shrink-0">
            {getActionIcon(log.action, log.entityType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-900">{formatAction(log)}</p>
            <p className="text-xs text-slate-500 mt-1">{formatTimestamp(log.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLogList;
