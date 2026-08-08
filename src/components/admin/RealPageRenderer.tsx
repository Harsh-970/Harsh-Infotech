import React, { Suspense, lazy } from 'react';
import { PageItem } from '../../context/CMSContext';
import { EditingEngine } from '../../engine/EditingEngine';
import { EditorErrorBoundary } from './EditorErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load real React page components (One Source of Truth)
const HomeApp = lazy(() => import('../../App'));
const AboutApp = lazy(() => import('../../AboutApp'));
const MainServicesApp = lazy(() => import('../../MainServicesApp'));
const ProductsApp = lazy(() => import('../../ProductsApp'));
const CustomizationsApp = lazy(() => import('../../CustomizationsApp'));
const OffersApp = lazy(() => import('../../OffersApp'));
const JobsApp = lazy(() => import('../../JobsApp'));
const CaseStudiesApp = lazy(() => import('../../CaseStudiesApp'));

interface RealPageRendererProps {
  page: PageItem | null;
  onElementClick?: (elementId: string, elementType: string, data?: any) => void;
  onNavigatePage?: (slug: string) => void;
}

export const RealPageRenderer: React.FC<RealPageRendererProps> = ({ page, onElementClick, onNavigatePage }) => {
  if (!page) {
    return (
      <div className="p-12 text-center text-white/50 bg-[#0b1329] border border-white/10 rounded-2xl">
        <p className="text-sm font-semibold mb-2">No Page Selected</p>
        <p className="text-xs text-white/40">Please select a page from the Site Blueprint to view and edit.</p>
      </div>
    );
  }

  // Render authentic React Component based on page.slug
  const renderAuthenticPageComponent = () => {
    switch (page.slug) {
      case 'home':
        return <HomeApp />;
      case 'about':
        return <AboutApp />;
      case 'services':
        return <MainServicesApp />;
      case 'products':
        return <ProductsApp />;
      case 'customizations':
        return <CustomizationsApp />;
      case 'offers':
        return <OffersApp />;
      case 'jobs':
        return <JobsApp />;
      case 'case-studies':
        return <CaseStudiesApp />;
      default:
        return <HomeApp />;
    }
  };

  // Intercept click on rendered page elements to notify EditingEngine & Inspector
  const handlePageContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked element is an anchor link or button with link target
    const linkTarget = target.closest('a, button[data-href], [data-auth-href]');
    if (linkTarget) {
      const href = linkTarget.getAttribute('href') || linkTarget.getAttribute('data-href') || linkTarget.getAttribute('data-auth-href');
      
      if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        // Prevent default browser navigation away from editor shell
        e.preventDefault();

        // Extract target page slug
        let targetSlug = 'home';
        if (href.includes('services')) targetSlug = 'services';
        else if (href.includes('products')) targetSlug = 'products';
        else if (href.includes('customizations')) targetSlug = 'customizations';
        else if (href.includes('about')) targetSlug = 'about';
        else if (href.includes('offers')) targetSlug = 'offers';
        else if (href.includes('jobs')) targetSlug = 'jobs';
        else if (href.includes('case-studies')) targetSlug = 'case-studies';
        else if (href === '/' || href.includes('index.html')) targetSlug = 'home';

        if (onNavigatePage) {
          onNavigatePage(targetSlug);
        }
      }
    }

    // Find closest element with editable data tag or element type
    const editableTarget = target.closest('[data-editor-id], [data-editor-type], [data-editable-id], button, img, h1, h2, h3, p, [data-card-id], section, a');

    if (editableTarget) {
      const editorId = editableTarget.getAttribute('data-editor-id') || editableTarget.getAttribute('data-editable-id') || `${editableTarget.tagName.toLowerCase()}-${Date.now()}`;
      const editorType = editableTarget.getAttribute('data-editor-type');
      const editorLabel = editableTarget.getAttribute('data-editor-label');
      
      const tagName = editableTarget.tagName.toLowerCase();
      let elementType: any = editorType || 'text';
      if (!editorType) {
        if (tagName === 'button' || tagName === 'a') elementType = 'button';
        else if (tagName === 'img') elementType = 'image';
        else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') elementType = 'text';
        else if (tagName === 'p') elementType = 'text';
        else if (tagName === 'section') elementType = 'spacing';
      }

      const textContent = editableTarget.textContent?.trim() || '';
      const src = (editableTarget as HTMLImageElement).src || '';
      const elementName = editorLabel || (
        elementType === 'button' ? `Button (${textContent.slice(0, 15) || 'CTA'})` :
        elementType === 'image' ? `Image (${editableTarget.getAttribute('alt') || 'Asset'})` :
        elementType === 'card' ? `Card Component` :
        `${tagName.toUpperCase()} Element`
      );

      EditingEngine.selectElement({
        selectedId: editorId,
        componentId: getComponentIdForSlug(page.slug),
        elementName,
        elementType,
        data: { textContent, src, tag: tagName }
      });

      if (onElementClick) {
        onElementClick(editorId, elementType, { textContent, src });
      }
    }
  };

  const getComponentIdForSlug = (slug: string) => {
    switch (slug) {
      case 'home': return 'hero-section';
      case 'services': return 'services-section';
      case 'products': return 'products-section';
      case 'customizations': return 'customizations-section';
      case 'about': return 'hero-section';
      case 'offers': return 'hero-section';
      case 'jobs': return 'hero-section';
      default: return 'hero-section';
    }
  };

  return (
    <EditorErrorBoundary fallbackTitle={`Error Loading Component (${page.title})`}>
      <div 
        onClick={handlePageContainerClick}
        className="real-page-editor-container relative w-full min-h-full bg-[#070b13] text-white"
      >
        <Suspense fallback={
          <div className="min-h-[400px] p-12 flex flex-col items-center justify-center text-center space-y-4 bg-[#070b13]">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-white tracking-wide">Loading Authentic Webpage ({page.title})...</p>
              <p className="text-[10px] text-white/40 font-mono">1 Source of Truth • React Component Component Lazy Bundle</p>
            </div>
          </div>
        }>
          <div className="real-component-wrapper">
            {renderAuthenticPageComponent()}
          </div>
        </Suspense>
      </div>
    </EditorErrorBoundary>
  );
};

