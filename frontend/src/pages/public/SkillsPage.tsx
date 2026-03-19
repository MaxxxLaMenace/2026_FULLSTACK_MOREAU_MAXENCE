import React from 'react';
import Layout from '../../components/layout/Layout';
import SkillBadge from '../../components/ui/SkillBadge';
import { useSkills } from '../../hooks/useSkills';
import { Skill } from '../../types';

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Outils',
  language: 'Langage',
  other: 'Autres',
};

const categoryOrder = ['frontend', 'backend', 'tools', 'language', 'other'];

const SkillsPage: React.FC = () => {
  const { data: skills, isLoading, error } = useSkills();

  const groupedSkills = React.useMemo(() => {
    if (!skills) return {};
    return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      const cat = skill.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});
  }, [skills]);

  const sortedCategories = categoryOrder.filter((cat) => groupedSkills[cat]?.length > 0);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary-100 mb-3">Compétences</h1>
          <p className="text-primary-400 text-lg">
            Mes technologies et outils maîtrisés
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((section) => (
              <div key={section}>
                <div className="h-6 bg-primary-700 rounded w-32 mb-4 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card animate-pulse p-4">
                      <div className="h-4 bg-primary-700 rounded w-1/2 mb-3" />
                      <div className="h-2 bg-primary-700 rounded w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">Erreur lors du chargement des compétences.</p>
          </div>
        ) : sortedCategories.length > 0 ? (
          <div className="space-y-12">
            {sortedCategories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-primary-100 mb-6 pb-2 border-b border-primary-700">
                  {categoryLabels[category] || category}
                  <span className="text-sm text-primary-500 font-normal ml-2">
                    ({groupedSkills[category].length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedSkills[category].map((skill) => (
                    <SkillBadge key={skill._id} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-primary-400 text-lg">Aucune compétence à afficher pour le moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SkillsPage;
