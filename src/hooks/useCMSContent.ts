import { useState, useEffect } from 'react';
import { CMSData } from '../context/CMSContext';

export function useCMSContent(pageSlug: string = 'home') {
  const [content, setContent] = useState<any>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previewMode = params.get('preview') === 'draft';
    setIsPreview(previewMode);

    const loadContent = () => {
      const storageKey = previewMode ? 'hi_cms_drafts' : 'hi_cms_published';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed: CMSData = JSON.parse(saved);
          const page = parsed.pages.find(p => p.slug === pageSlug);
          if (page) {
            setContent(page.content);
            return;
          }
        } catch {}
      }

      // Fetch from API server endpoint if not in localStorage
      fetch('/api/admin/data')
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            const targetData = previewMode ? data.drafts : data.published;
            const page = targetData?.pages?.find((p: any) => p.slug === pageSlug);
            if (page) {
              setContent(page.content);
            }
          }
        })
        .catch(() => {});
    };

    loadContent();
  }, [pageSlug]);

  return { content, isPreview };
}
