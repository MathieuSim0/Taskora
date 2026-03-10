import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

interface Member {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ProjectMembersProps {
  projectId: string;
  projectOwnerId: string;
  currentUserId: string;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({
  projectId,
  projectOwnerId,
  currentUserId,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const toast = useToast();

  const isOwner = currentUserId === projectOwnerId;
  const currentMember = members.find(m => m.userId === currentUserId);
  const isAdmin = currentMember?.role === 'ADMIN';
  const canManageMembers = isOwner || isAdmin;

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/projects/${projectId}/members`,
      );
      setMembers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from this project?`)) {
      return;
    }

    const loadingToast = toast.loading('Removing member...');
    try {
      await axios.delete(
        `http://localhost:3000/api/projects/${projectId}/members/${memberId}`,
      );
      setMembers(members.filter(m => m.id !== memberId));
      toast.dismiss(loadingToast);
      toast.success(`${memberName} has been removed from the project`);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleUpdateRole = async (
    memberId: string,
    newRole: 'ADMIN' | 'MEMBER',
    memberName: string,
  ) => {
    const loadingToast = toast.loading('Updating role...');
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/members/${memberId}`,
        { role: newRole },
      );
      setMembers(members.map(m => (m.id === memberId ? response.data : m)));
      toast.dismiss(loadingToast);
      toast.success(`${memberName}'s role updated to ${newRole}`);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      OWNER: 'bg-violet-100 text-violet-800 border-violet-200',
      ADMIN: 'bg-teal-100 text-teal-800 border-teal-200',
      MEMBER: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return styles[role as keyof typeof styles] || styles.MEMBER;
  };

  const getRoleIcon = (role: string) => {
    if (role === 'OWNER') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    }
    if (role === 'ADMIN') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Project Members</h3>
          <p className="text-sm text-slate-600">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        {canManageMembers && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn btn-primary btn-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {/* Members List */}
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="card border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Member Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">
                    {member.user.name}
                    {member.userId === currentUserId && (
                      <span className="text-xs text-slate-500 ml-2">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 truncate">{member.user.email}</div>
                </div>
              </div>

              {/* Role Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                    member.role,
                  )}`}
                >
                  {getRoleIcon(member.role)}
                  {member.role}
                </span>

                {/* Actions */}
                {canManageMembers && member.role !== 'OWNER' && member.userId !== currentUserId && (
                  <div className="flex items-center gap-1">
                    {/* Change Role */}
                    <button
                      onClick={() =>
                        handleUpdateRole(
                          member.id,
                          member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN',
                          member.user.name,
                        )
                      }
                      className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title={`Change to ${member.role === 'ADMIN' ? 'Member' : 'Admin'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    </button>

                    {/* Remove Member */}
                    <button
                      onClick={() => handleRemoveMember(member.id, member.user.name)}
                      className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            fetchMembers();
          }}
        />
      )}
    </div>
  );
};

// Invite Member Modal Component
const InviteMemberModal: React.FC<{
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ projectId, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const loadingToast = toast.loading('Sending invitation...');
    setLoading(true);

    try {
      await axios.post(
        `http://localhost:3000/api/projects/${projectId}/members/invite`,
        { email: email.trim(), role },
      );
      toast.dismiss(loadingToast);
      toast.success('Member invited successfully!');
      onSuccess();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to invite member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Invite Member</h2>
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
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="member@example.com"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The user must have an account with this email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Role *
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="MEMBER"
                  checked={role === 'MEMBER'}
                  onChange={(e) => setRole(e.target.value as 'MEMBER')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Member</div>
                  <div className="text-sm text-slate-600">
                    Can view and manage tasks in the project
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={(e) => setRole(e.target.value as 'ADMIN')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Admin</div>
                  <div className="text-sm text-slate-600">
                    Can manage project settings and invite members
                  </div>
                </div>
              </label>
            </div>
          </div>

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
                  Inviting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectMembers;
