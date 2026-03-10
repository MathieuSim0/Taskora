import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface TaskCommentsProps {
  taskId: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const toast = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for task:', taskId);
      const response = await axios.get(`http://localhost:3000/api/tasks/${taskId}/comments`);
      console.log('Comments fetched:', response.data);
      setComments(response.data);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error(error.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    setPosting(true);
    try {
      console.log('Posting comment:', newComment);
      const response = await axios.post(
        `http://localhost:3000/api/tasks/${taskId}/comments`,
        { content: newComment }
      );
      console.log('Comment response:', response.data);
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success(t('common.success'));
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/tasks/${taskId}/comments/${commentId}`,
        { content: editContent }
      );
      setComments(comments.map(c => c.id === commentId ? response.data : c));
      setEditingId(null);
      setEditContent('');
      toast.success(t('common.success'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm(t('tasks.comments.deleteConfirm'))) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success(t('common.success'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {t('tasks.comments.title')}
      </h3>

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>{t('tasks.comments.empty')}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {comment.user.id === user?.id ? t('tasks.comments.you') : comment.user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(comment.createdAt)}
                      {comment.createdAt !== comment.updatedAt && (
                        <span className="ml-1 italic">{t('tasks.comments.edited')}</span>
                      )}
                    </p>
                  </div>
                </div>
                {comment.user.id === user?.id && editingId !== comment.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      title={t('tasks.comments.edit')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title={t('tasks.comments.delete')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {editingId === comment.id ? (
                <div className="space-y-2 mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="input text-sm min-h-[80px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="btn btn-primary btn-sm"
                    >
                      {t('common.save')}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('tasks.comments.placeholder')}
          className="input text-sm min-h-[100px]"
          disabled={posting}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleAddComment(e as any);
            }
          }}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddComment}
            disabled={posting || !newComment.trim()}
            className="btn btn-primary btn-sm"
          >
            {posting ? t('tasks.comments.posting') : t('tasks.comments.post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
