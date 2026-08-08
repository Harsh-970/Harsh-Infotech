import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastModified: string;
  seoTitle?: string;
  seoDescription?: string;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    [key: string]: any;
  };
}

export interface LinkItem {
  id: string;
  label: string;
  type: 'navigation' | 'whatsapp' | 'call' | 'qr_code' | 'external' | 'button';
  target: string;
  category: string;
  phone?: string;
  message?: string;
  active: boolean;
}

export interface FlowItem {
  id: string;
  source: string;
  target: string;
  actionType: string;
  description: string;
}

export interface CMSSettings {
  adminPasscode: string;
  siteName: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  autoSaveDrafts: boolean;
  lastPublishedAt?: string;
}

export interface CMSData {
  pages: PageItem[];
  links: LinkItem[];
  visualFlow: FlowItem[];
  settings: CMSSettings;
}

interface CMSContextType {
  drafts: CMSData;
  published: CMSData;
  isDraftModified: boolean;
  isLoading: boolean;
  saveDraft: (updatedData: Partial<CMSData>) => Promise<void>;
  publishAll: () => Promise<void>;
  addPage: (page: Omit<PageItem, 'id' | 'lastModified'>) => void;
  updatePage: (id: string, pageData: Partial<PageItem>) => void;
  duplicatePage: (id: string) => void;
  deletePage: (id: string) => void;
  addLink: (link: Omit<LinkItem, 'id'>) => void;
  updateLink: (id: string, linkData: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  addFlowStep: (flow: Omit<FlowItem, 'id'>) => void;
  deleteFlowStep: (id: string) => void;
  updateSettings: (settings: Partial<CMSSettings>) => void;
}

const defaultData: CMSData = {
  pages: [],
  links: [],
  visualFlow: [],
  settings: {
    adminPasscode: 'admin123',
    siteName: 'Harsh Infotech Consultancy Services',
    contactPhone: '+917558604483',
    contactWhatsApp: '917558604483',
    contactEmail: 'info@harshinfotech.com',
    autoSaveDrafts: true
  }
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drafts, setDrafts] = useState<CMSData>(() => {
    const saved = localStorage.getItem('hi_cms_drafts');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [published, setPublished] = useState<CMSData>(() => {
    const saved = localStorage.getItem('hi_cms_published');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [isDraftModified, setIsDraftModified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from Vite server endpoint
  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const res = await fetch('/api/admin/data');
        if (res.ok) {
          const json = await res.json();
          if (json.ok && json.drafts) {
            setDrafts(json.drafts);
            localStorage.setItem('hi_cms_drafts', JSON.stringify(json.drafts));
          }
          if (json.ok && json.published) {
            setPublished(json.published);
            localStorage.setItem('hi_cms_published', JSON.stringify(json.published));
          }
        }
      } catch (e) {
        console.warn('Vite API server endpoint not responding, using localStorage fallback');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const saveDraftToDiskAndStorage = async (data: CMSData) => {
    setDrafts(data);
    setIsDraftModified(true);
    localStorage.setItem('hi_cms_drafts', JSON.stringify(data));

    try {
      await fetch('/api/admin/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {
      // Local fallback saved
    }
  };

  const saveDraft = async (updated: Partial<CMSData>) => {
    const next = { ...drafts, ...updated };
    await saveDraftToDiskAndStorage(next);
  };

  const publishAll = async () => {
    const publishedPayload = {
      ...drafts,
      settings: {
        ...drafts.settings,
        lastPublishedAt: new Date().toISOString()
      }
    };
    setPublished(publishedPayload);
    setDrafts(publishedPayload);
    setIsDraftModified(false);

    localStorage.setItem('hi_cms_published', JSON.stringify(publishedPayload));
    localStorage.setItem('hi_cms_drafts', JSON.stringify(publishedPayload));

    try {
      await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishedPayload)
      });
    } catch {
      // Local fallback saved
    }
  };

  const addPage = (pageData: Omit<PageItem, 'id' | 'lastModified'>) => {
    const newPage: PageItem = {
      ...pageData,
      id: `page-${Date.now()}`,
      lastModified: new Date().toISOString().split('T')[0]
    };
    saveDraftToDiskAndStorage({
      ...drafts,
      pages: [...drafts.pages, newPage]
    });
  };

  const updatePage = (id: string, pageData: Partial<PageItem>) => {
    const updatedPages = drafts.pages.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...pageData,
          lastModified: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });
    saveDraftToDiskAndStorage({
      ...drafts,
      pages: updatedPages
    });
  };

  const duplicatePage = (id: string) => {
    const existing = drafts.pages.find(p => p.id === id);
    if (!existing) return;
    const duplicated: PageItem = {
      ...existing,
      id: `page-${Date.now()}`,
      title: `${existing.title} (Copy)`,
      slug: `${existing.slug}-copy`,
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0]
    };
    saveDraftToDiskAndStorage({
      ...drafts,
      pages: [...drafts.pages, duplicated]
    });
  };

  const deletePage = (id: string) => {
    saveDraftToDiskAndStorage({
      ...drafts,
      pages: drafts.pages.filter(p => p.id !== id)
    });
  };

  const addLink = (linkData: Omit<LinkItem, 'id'>) => {
    const newLink: LinkItem = {
      ...linkData,
      id: `link-${Date.now()}`
    };
    saveDraftToDiskAndStorage({
      ...drafts,
      links: [...drafts.links, newLink]
    });
  };

  const updateLink = (id: string, linkData: Partial<LinkItem>) => {
    const updatedLinks = drafts.links.map(l => (l.id === id ? { ...l, ...linkData } : l));
    saveDraftToDiskAndStorage({
      ...drafts,
      links: updatedLinks
    });
  };

  const deleteLink = (id: string) => {
    saveDraftToDiskAndStorage({
      ...drafts,
      links: drafts.links.filter(l => l.id !== id)
    });
  };

  const addFlowStep = (flowData: Omit<FlowItem, 'id'>) => {
    const newFlow: FlowItem = {
      ...flowData,
      id: `flow-${Date.now()}`
    };
    saveDraftToDiskAndStorage({
      ...drafts,
      visualFlow: [...drafts.visualFlow, newFlow]
    });
  };

  const deleteFlowStep = (id: string) => {
    saveDraftToDiskAndStorage({
      ...drafts,
      visualFlow: drafts.visualFlow.filter(f => f.id !== id)
    });
  };

  const updateSettings = (settingsData: Partial<CMSSettings>) => {
    saveDraftToDiskAndStorage({
      ...drafts,
      settings: {
        ...drafts.settings,
        ...settingsData
      }
    });
  };

  return (
    <CMSContext.Provider
      value={{
        drafts,
        published,
        isDraftModified,
        isLoading,
        saveDraft,
        publishAll,
        addPage,
        updatePage,
        duplicatePage,
        deletePage,
        addLink,
        updateLink,
        deleteLink,
        addFlowStep,
        deleteFlowStep,
        updateSettings
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
