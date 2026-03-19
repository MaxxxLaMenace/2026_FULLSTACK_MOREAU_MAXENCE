import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { useSkills } from '../../hooks/useSkills';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();

  const stats = [
    {
      label: 'Projets',
      value: projects?.length ?? 0,
      featured: projects?.filter((p) => p.featured).length ?? 0,
      link: '/admin/projects',
      color: 'accent',
    },
    {
      label: 'Compétences',
      value: skills?.length ?? 0,
      link: '/admin/skills',
      color: 'green',
    },
  ];

  const quickLinks = [
    { to: '/admin/projects', label: 'Gérer les projets', description: 'Ajouter, modifier ou supprimer des projets' },
    { to: '/admin/skills', label: 'Gérer les compétences', description: 'Ajouter, modifier ou supprimer des compétences' },
    { to: '/', label: 'Voir le site public', description: 'Visualiser votre portfolio en ligne', external: false },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-primary-100">Tableau de bord</h1>
            <p className="text-primary-400 mt-1">Bienvenue, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-primary-400 hover:text-red-400 transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="card p-6 hover:border-accent-600 transition-colors"
            >
              <p className="text-primary-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-4xl font-bold text-primary-100 mb-1">{stat.value}</p>
              {'featured' in stat && typeof stat.featured === 'number' && (
                <p className="text-xs text-accent-400">{stat.featured} en vedette</p>
              )}
              <p className="text-xs text-primary-500 mt-2">Cliquer pour gérer &rarr;</p>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-xl font-semibold text-primary-100 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="card p-5 hover:border-accent-600 transition-colors group"
              >
                <p className="font-medium text-primary-100 group-hover:text-accent-400 transition-colors mb-1">
                  {link.label}
                </p>
                <p className="text-sm text-primary-400">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
