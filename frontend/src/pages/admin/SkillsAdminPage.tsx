import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks/useSkills';
import { Skill, SkillFormData } from '../../types';

const emptyForm: SkillFormData = {
  name: '',
  category: 'frontend',
  level: 50,
  icon: '',
  order: 0,
};

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Outils',
  other: 'Autres',
};

const SkillsAdminPage: React.FC = () => {
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [form, setForm] = useState<SkillFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditingSkill(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      order: skill.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill.mutateAsync({ id: editingSkill._id, data: form });
      } else {
        await createSkill.mutateAsync(form);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const isSubmitting = createSkill.isPending || updateSkill.isPending;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-100">Compétences</h1>
            <Link to="/admin" className="text-sm text-primary-400 hover:text-primary-100 mt-1 inline-block">
              &larr; Retour au tableau de bord
            </Link>
          </div>
          <Button onClick={openCreate} variant="primary">
            + Nouvelle compétence
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
        ) : !skills || skills.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-primary-400 mb-4">Aucune compétence pour le moment.</p>
            <Button onClick={openCreate} variant="primary">Ajouter une compétence</Button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700 bg-primary-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-400 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-400 uppercase hidden sm:table-cell">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-400 uppercase">Niveau</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase hidden md:table-cell">Ordre</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-primary-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {skills.map((skill) => (
                  <tr key={skill._id} className="hover:bg-primary-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {skill.icon && <span className="text-lg">{skill.icon}</span>}
                        <span className="font-medium text-primary-100">{skill.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-primary-300">
                        {categoryLabels[skill.category] || skill.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-primary-700 rounded-full h-1.5">
                          <div
                            className="bg-accent-500 h-1.5 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-sm text-primary-300">{skill.level}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-sm text-primary-400">{skill.order}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(skill)}>
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm(skill._id)}
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
          title={editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nom *</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="React, Python..."
                  required
                />
              </div>
              <div>
                <label className="label">Icône (emoji)</label>
                <input
                  type="text"
                  className="input"
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder=""
                />
              </div>
            </div>

            <div>
              <label className="label">Catégorie *</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as SkillFormData['category'] }))}
                required
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="tools">Outils</option>
                <option value="other">Autres</option>
              </select>
            </div>

            <div>
              <label className="label">Niveau: {form.level}%</label>
              <input
                type="range"
                min={1}
                max={100}
                value={form.level}
                onChange={(e) => setForm((p) => ({ ...p, level: parseInt(e.target.value) }))}
                className="w-full accent-accent-500"
              />
              <div className="flex justify-between text-xs text-primary-500 mt-1">
                <span>Novice</span>
                <span>Intermédiaire</span>
                <span>Expert</span>
              </div>
            </div>

            <div>
              <label className="label">Ordre d'affichage</label>
              <input
                type="number"
                className="input"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingSkill ? 'Sauvegarder' : 'Créer'}
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
            Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button
              variant="danger"
              isLoading={deleteSkill.isPending}
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

export default SkillsAdminPage;
