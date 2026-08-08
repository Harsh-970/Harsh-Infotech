import React, { useState } from 'react';
import { useCMS, PageItem } from '../../context/CMSContext';
import { Plus, Edit2, Copy, Trash2, Eye, Save, X, Search, FileText, CheckCircle } from 'lucide-react';

export const PagesManager: React.FC = () => {
  const { drafts, addPage, updatePage, duplicatePage, deletePage, saveDraft } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New page form state
  const [newPageData, setNewPageData] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    primaryCtaLabel: 'Get Started',
    secondaryCtaLabel: 'Learn More'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPages = drafts.pages.filter(
    p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageData.title || !newPageData.slug) return;

    addPage({
      title: newPageData.title,
      slug: newPageData.slug.toLowerCase().replace(/\s+/g, '-'),
      status: 'draft',
      seoTitle: newPageData.seoTitle || newPageData.title,
      seoDescription: newPageData.seoDescription || newPageData.heroDescription,
      content: {
        heroTitle: newPageData.heroTitle || newPageData.title,
        heroSubtitle: newPageData.heroSubtitle || 'Welcome to Harsh Infotech',
        heroDescription: newPageData.heroDescription || 'Explore our complete accounting solutions.',
        primaryCtaLabel: newPageData.primaryCtaLabel,
        secondaryCtaLabel: newPageData.secondaryCtaLabel
      }
    });

    setIsAddModalOpen(false);
    setNewPageData({
      title: '',
      slug: '',
      seoTitle: '',
      seoDescription: '',
      heroTitle: '',
      heroSubtitle: '',
      heroDescription: '',
      primaryCtaLabel: 'Get Started',
      secondaryCtaLabel: 'Learn More'
    });
    showToast('New page added as Draft!');
  };

  const handleSavePageEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    updatePage(editingPage.id, {
      title: editingPage.title,
      slug: editingPage.slug,
      status: 'draft',
      seoTitle: editingPage.seoTitle,
      seoDescription: editingPage.seoDescription,
      content: editingPage.content
    });

    setEditingPage(null);
    showToast(`Updated "${editingPage.title}" as Draft!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" /> {toastMessage}
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" /> Site Pages ({drafts.pages.length})
          </h2>
          <p className="text-xs text-white/60">Create, edit, duplicate, or preview your site pages in safe Draft mode.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Page
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map(page => (
          <div 
            key={page.id}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-white/60 border border-white/10">
                  /{page.slug === 'home' ? '' : `${page.slug}.html`}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${page.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {page.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{page.title}</h3>
              <p className="text-xs text-white/50 line-clamp-2 mb-4">
                {page.content.heroDescription || 'No description provided.'}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <a
                href={`/${page.slug === 'home' ? 'index.html' : `${page.slug}.html`}?preview=draft`}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Preview Draft"
              >
                <Eye className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingPage(page)}
                  className="px-3 py-1.5 text-xs text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Edit
                </button>
                <button
                  onClick={() => {
                    duplicatePage(page.id);
                    showToast(`Duplicated "${page.title}"!`);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Duplicate Page"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                      deletePage(page.id);
                      showToast(`Removed "${page.title}"`);
                    }
                  }}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#D4AF37]" /> Edit Page: {editingPage.title}
              </h3>
              <button 
                onClick={() => setEditingPage(null)}
                className="p-1 text-white/60 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePageEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">Page Title</label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Hero Heading Title</label>
                <input
                  type="text"
                  value={editingPage.content.heroTitle || ''}
                  onChange={e => setEditingPage({
                    ...editingPage,
                    content: { ...editingPage.content, heroTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={editingPage.content.heroSubtitle || ''}
                  onChange={e => setEditingPage({
                    ...editingPage,
                    content: { ...editingPage.content, heroSubtitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Hero Description</label>
                <textarea
                  rows={3}
                  value={editingPage.content.heroDescription || ''}
                  onChange={e => setEditingPage({
                    ...editingPage,
                    content: { ...editingPage.content, heroDescription: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={editingPage.content.primaryCtaLabel || ''}
                    onChange={e => setEditingPage({
                      ...editingPage,
                      content: { ...editingPage.content, primaryCtaLabel: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={editingPage.content.secondaryCtaLabel || ''}
                    onChange={e => setEditingPage({
                      ...editingPage,
                      content: { ...editingPage.content, secondaryCtaLabel: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Page Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/20 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Create New Page
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Tally Cloud"
                  value={newPageData.title}
                  onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewPageData({ ...newPageData, title, slug });
                  }}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. enterprise-tally-cloud"
                  value={newPageData.slug}
                  onChange={e => setNewPageData({ ...newPageData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Hero Heading</label>
                <input
                  type="text"
                  placeholder="Main hero headline"
                  value={newPageData.heroTitle}
                  onChange={e => setNewPageData({ ...newPageData, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Hero Description</label>
                <textarea
                  rows={2}
                  placeholder="Short introductory description"
                  value={newPageData.heroDescription}
                  onChange={e => setNewPageData({ ...newPageData, heroDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Page as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
