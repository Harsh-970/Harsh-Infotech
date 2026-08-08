export type EditableFieldType = 
  | 'text' 
  | 'textarea' 
  | 'button' 
  | 'image' 
  | 'color' 
  | 'select' 
  | 'spacing' 
  | 'array';

export interface EditableFieldSchema {
  id: string;
  label: string;
  type: EditableFieldType;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  group?: string; // e.g. 'Typography', 'Action', 'Appearance'
}

export interface ComponentSchema {
  componentId: string;
  name: string;
  category: 'Hero' | 'Services' | 'Products' | 'Customizations' | 'Testimonials' | 'FAQ' | 'Cards' | 'General';
  fields: EditableFieldSchema[];
}

export interface SelectionState {
  selectedId: string | null;
  componentId: string | null;
  elementName: string | null;
  elementType: EditableFieldType | null;
  data: any;
}

export interface HistoryRecord {
  timestamp: number;
  description: string;
  stateSnapshot: any;
}

type EventListener = (state: SelectionState) => void;
type DataChangeListener = (snapshot: any) => void;

class EditingEngineClass {
  private registry = new Map<string, ComponentSchema>();
  private selection: SelectionState = {
    selectedId: null,
    componentId: null,
    elementName: null,
    elementType: null,
    data: null
  };

  private selectionListeners: EventListener[] = [];
  private dataChangeListeners: DataChangeListener[] = [];

  // Undo / Redo History Stack
  private historyStack: HistoryRecord[] = [];
  private historyIndex = -1;
  private maxHistory = 50;

  constructor() {
    this.registerDefaultSchemas();
  }

  // 1. COMPONENT REGISTRATION SYSTEM
  public registerComponent(schema: ComponentSchema) {
    this.registry.set(schema.componentId, schema);
  }

  public getComponentSchema(componentId: string): ComponentSchema | undefined {
    return this.registry.get(componentId);
  }

  public getAllSchemas(): ComponentSchema[] {
    return Array.from(this.registry.values());
  }

  // 2. SELECTION MANAGER
  public selectElement(selection: Partial<SelectionState>) {
    this.selection = {
      ...this.selection,
      ...selection
    };
    this.notifySelectionListeners();
  }

  public clearSelection() {
    this.selection = {
      selectedId: null,
      componentId: null,
      elementName: null,
      elementType: null,
      data: null
    };
    this.notifySelectionListeners();
  }

  public getSelection(): SelectionState {
    return this.selection;
  }

  public subscribeSelection(listener: EventListener): () => void {
    this.selectionListeners.push(listener);
    return () => {
      this.selectionListeners = this.selectionListeners.filter(l => l !== listener);
    };
  }

  private notifySelectionListeners() {
    this.selectionListeners.forEach(l => l(this.selection));
  }

  // 3. UNDO / REDO ENGINE
  public pushStateSnapshot(description: string, snapshot: any) {
    // Truncate future stack if pushing after undo
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }

    this.historyStack.push({
      timestamp: Date.now(),
      description,
      stateSnapshot: JSON.parse(JSON.stringify(snapshot))
    });

    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift();
    } else {
      this.historyIndex += 1;
    }
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.historyStack.length - 1;
  }

  public undo(): HistoryRecord | null {
    if (!this.canUndo()) return null;
    this.historyIndex -= 1;
    const record = this.historyStack[this.historyIndex];
    this.notifyDataChangeListeners(record.stateSnapshot);
    return record;
  }

  public redo(): HistoryRecord | null {
    if (!this.canRedo()) return null;
    this.historyIndex += 1;
    const record = this.historyStack[this.historyIndex];
    this.notifyDataChangeListeners(record.stateSnapshot);
    return record;
  }

  public subscribeDataChange(listener: DataChangeListener): () => void {
    this.dataChangeListeners.push(listener);
    return () => {
      this.dataChangeListeners = this.dataChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyDataChangeListeners(snapshot: any) {
    this.dataChangeListeners.forEach(l => l(snapshot));
  }

  // Register Default Component Self-Describing Schemas
  private registerDefaultSchemas() {
    // Hero Banner Schema
    this.registerComponent({
      componentId: 'hero-section',
      name: 'Hero Banner Section',
      category: 'Hero',
      fields: [
        { id: 'heroTitle', label: 'Main Headline Title', type: 'text', group: 'Typography' },
        { id: 'heroSubtitle', label: 'Headline Subtitle', type: 'text', group: 'Typography' },
        { id: 'heroDescription', label: 'Hero Description', type: 'textarea', group: 'Typography' },
        { id: 'primaryCtaLabel', label: 'Primary Button Text', type: 'text', group: 'Actions' },
        { id: 'secondaryCtaLabel', label: 'Secondary Button Text', type: 'text', group: 'Actions' },
        { id: 'heroBackground', label: 'Background Style', type: 'color', defaultValue: '#070b13', group: 'Appearance' }
      ]
    });

    // Services Grid Schema
    this.registerComponent({
      componentId: 'services-section',
      name: 'Services & Solutions Grid',
      category: 'Services',
      fields: [
        { id: 'servicesHeading', label: 'Section Title', type: 'text', group: 'Typography' },
        { id: 'servicesSubtitle', label: 'Subheading', type: 'text', group: 'Typography' },
        { id: 'servicesCount', label: 'Displayed Grid Count', type: 'select', options: [{ label: '3 Cards', value: '3' }, { label: '6 Cards', value: '6' }], group: 'Appearance' }
      ]
    });

    // Products License Schema
    this.registerComponent({
      componentId: 'products-section',
      name: 'Tally License Products',
      category: 'Products',
      fields: [
        { id: 'productsHeading', label: 'Products Heading', type: 'text', group: 'Typography' },
        { id: 'productsDescription', label: 'Pricing Description', type: 'textarea', group: 'Typography' }
      ]
    });

    // TDL Customizations Schema
    this.registerComponent({
      componentId: 'customizations-section',
      name: 'Custom TDL Modules',
      category: 'Customizations',
      fields: [
        { id: 'modulesHeading', label: 'Modules Title', type: 'text', group: 'Typography' },
        { id: 'modulesSubtitle', label: 'Subtitle Description', type: 'textarea', group: 'Typography' }
      ]
    });

    // FAQ Schema
    this.registerComponent({
      componentId: 'faq-section',
      name: 'Frequently Asked Questions',
      category: 'FAQ',
      fields: [
        { id: 'faqTitle', label: 'FAQ Heading', type: 'text', group: 'Typography' },
        { id: 'faqSubtitle', label: 'Subtitle', type: 'text', group: 'Typography' }
      ]
    });
  }
}

export const EditingEngine = new EditingEngineClass();
