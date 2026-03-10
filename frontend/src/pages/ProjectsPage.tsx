import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/projects');
      setProjects(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? All tasks will become unassigned.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">{t('projects.loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">{t('projects.title')}</h1>
          <p className="text-slate-600 mt-1">{t('projects.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('projects.newProject')}
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-slate-100">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('projects.empty.noProjects')}</h3>
          <p className="text-slate-600 mb-6 max-w-sm mx-auto">{t('projects.empty.createFirst')}</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('projects.create.firstProject')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card card-hover border-t-4"
              style={{ borderTopColor: project.color }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Link to={`/projects/${project.id}`} className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 hover:text-teal-600 transition-colors">
                      {project.name}
                    </h3>
                  </Link>
                  <div
                    className="w-6 h-6 rounded-full ml-3 flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                    title={project.color}
                  />
                </div>

                {project.description && (
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span>{project._count?.tasks || 0} {t('projects.tasksCount')}</span>
                  </div>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex-1 text-center bg-teal-50 text-teal-700 px-4 py-2 rounded hover:bg-teal-100 transition-colors"
                  >
                    {t('common.view')}
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
};

// Placeholder for the form modal component
const ProjectFormModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
  project?: Project;
}> = ({ onClose, onSuccess, project }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || '#14B8A6',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (project) {
        await axios.put(`http://localhost:3000/api/projects/${project.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/projects', formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {project ? t('projects.edit.title') : t('projects.create.title')}
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

        <div className="p-6">
          {error && (
            <div className="alert alert-error mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                {t('projects.form.name')} *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder={t('projects.form.namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                {t('projects.form.description')}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea"
                rows={3}
                placeholder={t('projects.form.descriptionPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-slate-700 mb-2">
                {t('projects.form.color')}
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-12 w-24 rounded-lg cursor-pointer border-2 border-slate-200"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700">{formData.color.toUpperCase()}</div>
                  <div className="text-xs text-slate-500">{t('projects.form.colorHint')}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-secondary"
              >
                {t('common.cancel')}
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
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {project ? t('projects.edit.update') : t('projects.create.create')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
