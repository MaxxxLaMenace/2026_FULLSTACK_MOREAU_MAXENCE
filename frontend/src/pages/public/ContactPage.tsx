import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const validate = (): boolean => {
    const newErrors: Partial<ContactForm> = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "L'email n'est pas valide";
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    else if (form.message.trim().length < 10) newErrors.message = 'Le message doit faire au moins 10 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary-100 mb-3">Contact</h1>
          <p className="text-primary-400 text-lg">
            Une question, un projet ? N'hésitez pas à me contacter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">&#10003;</div>
                <h2 className="text-xl font-semibold text-green-400 mb-2">Message envoyé !</h2>
                <p className="text-primary-400">Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-accent-400 hover:text-accent-300 text-sm"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Votre nom"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className={`input resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Votre message..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Envoyer le message
                </Button>
              </form>
            )}
          </div>

          {/* Social links */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-primary-100 mb-4">Retrouvez-moi sur</h2>
              <div className="space-y-4">
                <a
                  href="https://github.com/MaxxxLaMenace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-primary-800 border border-primary-700 rounded-lg hover:border-accent-600 transition-colors"
                >
                  <svg className="h-6 w-6 text-primary-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <div>
                    <p className="font-medium text-primary-100">GitHub</p>
                    <p className="text-sm text-primary-400">Voir mes projets open-source</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/maxence-moreau-a93054258/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-primary-800 border border-primary-700 rounded-lg hover:border-accent-600 transition-colors"
                >
                  <svg className="h-6 w-6 text-primary-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <div>
                    <p className="font-medium text-primary-100">LinkedIn</p>
                    <p className="text-sm text-primary-400">Mon profil professionnel</p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary-100 mb-4">Email direct</h2>
              <a
                href="mailto:contact@portfolio.com"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                contact@portfolio.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
