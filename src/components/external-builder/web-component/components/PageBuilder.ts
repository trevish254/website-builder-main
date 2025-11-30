import { PageBuilder } from '../../core/PageBuilder';
import { svgs } from '../../core/icons/svgs';
import { GetMediaFiles } from '@/lib/types';

export interface PageBuilderDesign {
  pages?: Array<{
    id: string;
    components: Array<{
      type: string;
      id: string;
      props: Record<string, any>;
    }>;
  }>;
  [key: string]: any;
}
export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;
  private initialized = false;
  private _initialDesign: PageBuilderDesign | null = null;
  private _editable: boolean | null = null;
  private _brandTitle?: string;
  private _showAttributeTab?: boolean;
  private _layoutMode?: 'absolute' | 'grid';
  private _mediaFiles: GetMediaFiles = null;
  private config = { Basic: [], Extra: [], Custom: [] };
  private template = `<div id="app">
      <div id="left-sidebar-container">
        <div id="sidebar-tabs">
          <button id="tab-components" class="sidebar-tab active" title="Components">
            ${svgs.sidebarMenu}
          </button>
          <button id="tab-settings" class="sidebar-tab" title="Settings">
            ${svgs.edit}
          </button>
        </div>
        <div id="sidebar-content">
          <div id="sidebar" class="tab-pane active">
            <div class="sidebar-sub-tabs">
              <button id="subtab-basic" class="sub-tab active">Basic</button>
              <button id="subtab-media" class="sub-tab">Media Bucket</button>
            </div>
            <div id="basic-components" class="sub-tab-content active"></div>
            <div id="media-bucket" class="sub-tab-content">
              <div id="media-grid" class="media-grid"></div>
              <div class="media-upload-container">
                <button id="media-upload-btn" class="media-upload-btn">
                  ${svgs.upload || '<span class="icon">📁</span>'} Upload Media
                </button>
                <input type="file" id="media-upload-input" accept="image/*,.gif" style="display: none;" multiple>
              </div>
            </div>
          </div>
          <div id="customization" class="tab-pane">
            <h4 id="component-name">Component: None</h4>
            <div id="controls"></div>
            <div id="layers-view" class="hidden"></div>
          </div>
        </div>
      </div>
      <div id="canvas" class="canvas"></div>
      <div id="notification" class="notification hidden"></div>
      <div id="dialog" class="dialog hidden">
        <div class="dialog-content">
          <p id="dialog-message"></p>
          <button id="dialog-yes" class="dialog-btn">Yes</button>
          <button id="dialog-no" class="dialog-btn">No</button>
        </div>
      </div>
    </div>`;

  constructor() {
    super();
    // Set inner HTML only if no child elements exist
  }

  set editable(value: boolean | null) {
    if (this._editable !== value) {
      this._editable = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  // Corrected getter for 'editable'
  get editable(): boolean | null {
    return this._editable;
  }

  set brandTitle(value: string | undefined) {
    if (this._brandTitle !== value) {
      this._brandTitle = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get brandTitle(): string | undefined {
    return this._brandTitle;
  }

  set showAttributeTab(value: boolean | undefined) {
    if (this._showAttributeTab !== value) {
      this._showAttributeTab = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get showAttributeTab(): boolean | undefined {
    return this._showAttributeTab;
  }
  set layoutMode(value: 'absolute' | 'grid' | undefined) {
    if (this._layoutMode !== value) {
      this._layoutMode = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get layoutMode(): 'absolute' | 'grid' | undefined {
    return this._layoutMode;
  }

  set mediaFiles(value: GetMediaFiles) {
    if (this._mediaFiles !== value) {
      this._mediaFiles = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get mediaFiles(): GetMediaFiles {
    return this._mediaFiles;
  }

  set initialDesign(value: PageBuilderDesign | null) {
    if (this._initialDesign !== value) {
      this._initialDesign = value;
      if (this.initialized) {
        this.initialized = false;
        if (value !== null || this.initialized) {
          this.initialized = false;
          this.initializePageBuilder();
        }
      }
    }
  }

  get initialDesign(): PageBuilderDesign | null {
    return this._initialDesign;
  }

  // Lifecycle method: Called when the element is added to the DOM
  connectedCallback() {
    if (this.initialized) {
      return;
    }

    setTimeout(() => {
      if (!this.firstElementChild) {
        this.innerHTML = this.template;
      }

      // if (this.hasValidConfig()) {
      this.initializePageBuilder();
      // }
    }, 0);
  }

  private hasValidConfig(): boolean {
    return (
      this.config &&
      (this.config.Basic?.length > 0 ||
        this.config.Extra?.length > 0 ||
        (this.config.Custom && Object.keys(this.config.Custom).length > 0))
    );
  }

  set configData(value: any) {
    this.config = value;
    this.initialized = false;
    this.initializePageBuilder();
  }

  get configData() {
    return this.config;
  }
  // Initializes the PageBuilder instance
  private initializePageBuilder() {
    if (this.initialized) {
      return;
    }

    try {
      const app = this.querySelector('#app');
      if (app === null) {
        console.error('Error: #app element not found.');
        return;
      }
      if (app && this.pageBuilder) {
        app.innerHTML = '';
        this.innerHTML = this.template;
      }
      this.pageBuilder = new PageBuilder(
        this.config,
        this._initialDesign,
        this._editable,
        this._brandTitle,
        this.showAttributeTab,
        this._layoutMode,
        this._mediaFiles
      );
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize PageBuilder:', error);
      this.initialized = false;
    }
  }
}

// Define the custom element if it hasn't been registered already
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
