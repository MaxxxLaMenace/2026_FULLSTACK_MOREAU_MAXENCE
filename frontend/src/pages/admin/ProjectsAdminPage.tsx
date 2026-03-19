import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { Project, ProjectFormData } from '../../types';

const emptyForm: ProjectFormData = {
  title: '',
  description: '',
  longDescription: '',
  technologies: [],
  imageUrl: '',
  images: [],
  githubUrl: '',
  liveUrl: '',
  featured: false,
  order: 0,
  category: '',
};

const ProjectsAdminPage: React.FC = () => {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [techInput, setTechInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setTechInput('');
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      technologies: [...project.technologies],
      imageUrl: project.imageUrl,
      images: [...project.images],
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      featured: project.featured,
      order: project.order,
      category: project.category,
    });
    setTechInput('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject._id, data: form });
      } else {
        await createProject.mutateAsync(form);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !form.technologies.includes(tech)) {
      setForm((prev) => ({ ...prev, technologies: [...prev.technologies, tech] }));
    }
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }));
  };

  const isSubmitting = createProject.isPending || updateProject.isPending;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-100">Projets</h1>
            <Link to="/admin" className="text-sm text-primary-400 hover:text-primary-100 mt-1 inline-block">
              &larr; Retour au tableau de bord
            </Link>
          </div>
          <Button onClick={openCreate} variant="primary">
            + Nouveau projet
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-primary-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-primary-400 mb-4">Aucun projet pour le moment.</p>
            <Button onClick={openCreate} variant="primary">Créer le premier projet</Button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700 bg-primary-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-400 uppercase">Titre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-400 uppercase hidden sm:table-cell">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-400 uppercase hidden md:table-cell">Technologies</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase">Featured</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-primary-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-primary-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary-100 truncate max-w-[200px]">{project.title}</p>
                      <p className="text-xs text-primary-500 truncate max-w-[200px]">{project.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-primary-300">{project.category || '-'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-xs bg-primary-700 text-primary-300 px-2 py-0.5 rounded">{tech}</span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-primary-500">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${project.featured ? 'text-accent-400' : 'text-primary-600'}`}>
                        {project.featured ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(project)}>
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm(project._id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Titre *</label>
                <input
                  type="text"
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Catégorie</label>
                <input
                  type="text"
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="web, mobile, data..."
                />
              </div>
            </div>

            <div>
              <label className="label">Description courte *</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="label">Description longue</label>
              <textarea
                className="input resize-none"
                rows={4}
                value={form.longDescription}
                onChange={(e) => setForm((p) => ({ ...p, longDescription: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">URL image principale</label>
                <input
                  type="url"
                  className="input"
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="label">Ordre</label>
                <input
                  type="number"
                  className="input"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">URL GitHub</label>
                <input
                  type="url"
                  className="input"
                  value={form.githubUrl}
                  onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="label">URL Live</label>
                <input
                  type="url"
                  className="input"
                  value={form.liveUrl}
                  onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="label">Technologies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  placeholder="React, Node.js..."
                />
                <Button type="button" variant="secondary" onClick={addTech}>Ajouter</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 bg-accent-900/50 text-accent-300 border border-accent-800 px-2.5 py-1 rounded-lg text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="text-accent-500 hover:text-red-400 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 accent-accent-600"
              />
              <label htmlFor="featured" className="text-sm text-primary-300">Mettre en vedette</label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingProject ? 'Sauvegarder' : 'Créer'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete confirm modal */}
        <Modal
          isOpen={Boolean(deleteConfirm)}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmer la suppression"
          size="sm"
        >
          <p className="text-primary-300 mb-6">
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button
              variant="danger"
              isLoading={deleteProject.isPending}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Supprimer
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ProjectsAdminPage;
