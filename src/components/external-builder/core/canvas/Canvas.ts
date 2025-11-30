import { DragDropManager } from './DragDropManager';
import { DeleteElementHandler } from './DeleteElement';
import { LandingPageTemplate } from './../templates/LandingPageTemplate';

import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  VideoComponent,
  TextComponent,
  ContainerComponent,
  TwoColumnContainer,
  ThreeColumnContainer,
  TableComponent,
  LinkComponent,
} from '../components/index';
import { HistoryManager } from '../services/HistoryManager';
import { JSONStorage } from '../services/JSONStorage';
import { ComponentControlsManager } from './ComponentControls';
import { CustomizationSidebar } from '../sidebar/CustomizationSidebar';
import { MultiColumnContainer } from '../services/MultiColumnContainer';
import { GridManager } from './GridManager';
import interact from 'interactjs';

export class Canvas {
  private static components: HTMLElement[] = [];
  private static canvasElement: HTMLElement;
  private static sidebarElement: HTMLElement;
  public static controlsManager: ComponentControlsManager;
  private static gridManager: GridManager;
  private static editable: boolean | null;
  public static layoutMode: 'grid' | 'absolute';

  public static historyManager: HistoryManager;
  public static jsonStorage: JSONStorage;
  public static lastCanvasWidth: number | null;
  private static tableAttributeConfig: ComponentAttribute[] | undefined;
  private static textAttributeConfig: ComponentAttribute[] | undefined;
  private static headerAttributeConfig: ComponentAttribute[] | undefined;
  private static ImageAttributeConfig: Function | undefined;

  private static snapTargets: { left: number; top: number; right: number; bottom: number; centerX: number; centerY: number }[] = [];
  private static guides: HTMLElement[] = [];

  static clearGuides() {
    this.guides.forEach(guide => guide.remove());
    this.guides = [];
  }

  static drawGuide(type: 'vertical' | 'horizontal', position: number) {
    const guide = document.createElement('div');
    guide.classList.add('guide-line', type);
    if (type === 'vertical') {
      guide.style.left = `${position}px`;
    } else {
      guide.style.top = `${position}px`;
    }
    this.canvasElement.appendChild(guide);
    this.guides.push(guide);
  }

  public static getComponents(): HTMLElement[] {
    return Canvas.components;
  }

  public static setComponents(components: HTMLElement[]): void {
    Canvas.components = components;
  }

  private static componentFactory: { [key: string]: () => HTMLElement | null } =
    {
      button: () => new ButtonComponent().create(),
      header: () =>
        new HeaderComponent().create(1, 'Header', this.headerAttributeConfig),
      image: () =>
        new ImageComponent().create(undefined, this.ImageAttributeConfig),
      video: () =>
        new VideoComponent(() => Canvas.historyManager.captureState()).create(),
      table: () =>
        new TableComponent().create(2, 2, undefined, this.tableAttributeConfig),
      text: () => new TextComponent().create(this.textAttributeConfig),
      container: () => new ContainerComponent().create(),
      twoCol: () => new TwoColumnContainer().create(),
      threeCol: () => new ThreeColumnContainer().create(),
      landingpage: () => new LandingPageTemplate().create(),
      link: () => new LinkComponent().create(),
    };

  private static deleteElementHandler = new DeleteElementHandler();

  static init(
    initialData: PageBuilderDesign | null = null,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent[],
    layouMode: 'absolute' | 'grid'
  ) {
    this.editable = editable;
    this.layoutMode = layouMode;
    const tableComponent = basicComponentsConfig.find(
      component => component.name === 'table'
    );

    this.tableAttributeConfig = tableComponent?.attributes;

    const textComponent = basicComponentsConfig.find(
      component => component.name === 'text'
    );

    this.textAttributeConfig = textComponent?.attributes;

    const headerComponent = basicComponentsConfig.find(
      component => component.name === 'header'
    );
    this.headerAttributeConfig = headerComponent?.attributes;

    const ImageComponent = basicComponentsConfig.find(
      component => component.name === 'image'
    );
    this.ImageAttributeConfig = ImageComponent?.globalExecuteFunction;

    if (
      tableComponent &&
      tableComponent.attributes &&
      tableComponent.attributes.length > 0
    ) {
    }
    Canvas.canvasElement = document.getElementById('canvas')!;
    Canvas.sidebarElement = document.getElementById('sidebar')!;
    window.addEventListener('table-design-change', () => {
      Canvas.dispatchDesignChange();
    });

    Canvas.canvasElement.addEventListener('drop', Canvas.onDrop.bind(Canvas));
    Canvas.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );
    Canvas.canvasElement.addEventListener('click', (event: MouseEvent) => {
      const selected = document.querySelector('.editable-component.selected');
      if (selected) {
        selected.classList.remove('selected');
      }
      const target = event.target as HTMLElement;
      if (target !== Canvas.canvasElement) {
        Canvas.deleteElementHandler.selectElement(target);
      }
    });
    Canvas.canvasElement.classList.add('preview-desktop');
    Canvas.canvasElement.addEventListener('click', (event: MouseEvent) => {
      const component = event.target as HTMLElement;
      if (component) {
        CustomizationSidebar.showSidebar(component.id);
      }
    });
    if (layouMode == 'grid') {
      Canvas.canvasElement.classList.add('grid-layout-active');
    }
    Canvas.canvasElement.style.position = 'relative';
    this.lastCanvasWidth = Canvas.canvasElement.offsetWidth;
    Canvas.historyManager = new HistoryManager(Canvas.canvasElement);
    Canvas.jsonStorage = new JSONStorage();
    Canvas.controlsManager = new ComponentControlsManager(Canvas);

    Canvas.gridManager = new GridManager();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);

    const dragDropManager = new DragDropManager(
      Canvas.canvasElement,
      Canvas.sidebarElement
    );
    dragDropManager.enable();
    if (initialData) {
      Canvas.restoreState(initialData);
    } else {
      const savedState = Canvas.jsonStorage.load();
      if (savedState) {
        Canvas.restoreState(savedState);
      }
    }
  }

  /**
   * Dispatches a custom event indicating that the canvas design has changed.
   * The event detail contains the current design state.
   */
  static dispatchDesignChange() {
    if (Canvas.canvasElement && this.editable !== false) {
      const currentDesign = Canvas.getState();
      const event = new CustomEvent('design-change', {
        detail: currentDesign,
        bubbles: true,
        composed: true,
      });
      Canvas.canvasElement.dispatchEvent(event);
      Canvas.jsonStorage.save(currentDesign);
    }
  }

  static clearCanvas() {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    Canvas.historyManager.captureState();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    Canvas.dispatchDesignChange();
  }
  static getState(): PageBuilderDesign {
    const canvasElement = Canvas.canvasElement;
    const computedStyles = window.getComputedStyle(canvasElement);
    const canvasStyles: { [key: string]: string } = {};
    [
      'background-color',
      'background-image',
      'background-size',
      'background-position',
      'background-repeat',
      'min-height',
      'padding',
      'margin',
    ].forEach(prop => {
      const value = computedStyles.getPropertyValue(prop);
      if (
        value &&
        value !== 'initial' &&
        value !== 'auto' &&
        value !== 'none'
      ) {
        canvasStyles[prop] = value;
      }
    });
    const canvasState = {
      id: 'canvas',
      type: 'canvas',
      content: '',
      position: { x: 0, y: 0 },
      dimensions: {
        width: canvasElement.offsetWidth,
        height: canvasElement.offsetHeight,
      },
      style: canvasStyles,
      inlineStyle: canvasElement.getAttribute('style') || '',
      classes: Array.from(canvasElement.classList),
      dataAttributes: {},
      props: {},
    } as PageComponent;
    const componentStates = Canvas.components.map((component: HTMLElement) => {
      const baseType = component.classList[0]
        .split(/\d/)[0]
        .replace('-component', '');

      const imageElement = component.querySelector('img') as HTMLImageElement;
      const imageSrc = imageElement ? imageElement.src : null;

      const videoElement = component.querySelector('video') as HTMLVideoElement;
      const videoSrc = videoElement ? videoElement.src : null;

      const computedStyles = window.getComputedStyle(component);
      const styles: { [key: string]: string } = {};

      for (let i = 0; i < computedStyles.length; i++) {
        const prop = computedStyles[i];
        const value = computedStyles.getPropertyValue(prop);

        // Exclude values that are not useful for static HTML
        if (
          value &&
          value !== 'initial' &&
          value !== 'auto' &&
          value !== 'none' &&
          value !== ''
        ) {
          styles[prop] = value;
        }
      }

      const dataAttributes: { [key: string]: string } = {};
      Array.from(component.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .forEach(attr => {
          dataAttributes[attr.name] = attr.value;
        });

      let componentProps: Record<string, any> = {};
      if (component.classList.contains('custom-component')) {
        const propsJson = component.getAttribute('data-component-props');
        if (propsJson) {
          try {
            componentProps = JSON.parse(propsJson);
          } catch (e) {
            console.error('Error parsing data-component-props:', e);
          }
        }
      }

      return {
        id: component.id,
        type: baseType,
        content: component.innerHTML,
        position: {
          x: component.offsetLeft,
          y: component.offsetTop,
        },
        dimensions: {
          width: component.offsetWidth,
          height: component.offsetHeight,
        },
        style: styles,
        inlineStyle: component.getAttribute('style') || '',
        classes: Array.from(component.classList),
        dataAttributes: dataAttributes,
        imageSrc: imageSrc,
        videoSrc: videoSrc,
        props: componentProps,
      } as PageComponent;
    });

    return [canvasState, ...componentStates];
  }

  static restoreState(state: any) {
    const canvasDataIndex = state.findIndex(
      (data: any) => data.id === 'canvas' && data.type === 'canvas'
    );
    if (canvasDataIndex !== -1) {
      const canvasData = state[canvasDataIndex];
      const canvasElement = Canvas.canvasElement;

      if (canvasData.inlineStyle) {
        canvasElement.setAttribute('style', canvasData.inlineStyle);
      }

      canvasElement.className = '';
      canvasData.classes.forEach((cls: string) => {
        canvasElement.classList.add(cls);
      });

      state.splice(canvasDataIndex, 1);
    }

    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];

    state.forEach((componentData: any) => {
      const customSettings =
        componentData.dataAttributes['data-custom-settings'] || null;
      const component = Canvas.createComponent(
        componentData.type,
        customSettings,
        componentData.content
      );
      if (component) {
        if (!componentData.classes.includes('custom-component')) {
          component.innerHTML = componentData.content;
        }

        const deleteButton = component.querySelector('.component-controls');
        if (deleteButton && this.editable === false) {
          deleteButton.remove();
        }

        component.className = '';
        componentData.classes.forEach((cls: string) => {
          component.classList.add(cls);
        });

        if (component.classList.contains('selected')) {
          component.classList.remove('selected');
        }

        if (this.editable === false) {
          if (component.classList.contains('component-resizer')) {
            component.classList.remove('component-resizer');
          }
        }

        if (componentData.type === 'video' && componentData.videoSrc) {
          const videoElement = component.querySelector(
            'video'
          ) as HTMLVideoElement;
          const uploadText = component.querySelector(
            '.upload-text'
          ) as HTMLElement;

          videoElement.src = componentData.videoSrc;
          videoElement.style.display = 'block';
          uploadText.style.display = 'none';
        }

        // Restore inline styles
        if (componentData.inlineStyle) {
          component.setAttribute('style', componentData.inlineStyle);
        }

        // Restore computed styles
        if (componentData.computedStyle) {
          Object.keys(componentData.computedStyle).forEach(prop => {
            component.style.setProperty(
              prop,
              componentData.computedStyle[prop]
            );
          });
        }

        // Restore data attributes
        if (componentData.dataAttributes) {
          Object.entries(componentData.dataAttributes).forEach(
            ([key, value]) => {
              component.setAttribute(key, value as string);
            }
          );
        }
        if (this.editable !== false) {
          // Add control buttons and listeners
          Canvas.controlsManager.addControlButtons(component);
          Canvas.addDraggableListeners(component);
        }

        // Component-specific restoration
        if (component.classList.contains('container-component')) {
          ContainerComponent.restoreContainer(component, this.editable);
        }

        // column-specific restoration
        if (
          component.classList.contains('twoCol-component') ||
          component.classList.contains('threeCol-component')
        ) {
          MultiColumnContainer.restoreColumn(component);
        }

        if (componentData.type === 'image') {
          ImageComponent.restoreImageUpload(
            component,
            componentData.imageSrc,
            this.editable
          );
        }

        if (componentData.type === 'table') {
          TableComponent.restore(component, this.editable);
        }

        if (componentData.type === 'link') {
          LinkComponent.restore(component);
        }
        if (componentData.type === 'header') {
          HeaderComponent.restore(component);
        }
        if (componentData.type === 'text') {
          TextComponent.restore(component);
        }

        Canvas.canvasElement.appendChild(component);
        Canvas.components.push(component);
      }
    });
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
  }

  static onDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    // Check if target is a container or child of a container
    if (
      target.classList.contains('container-component') ||
      target.closest('.container-component')
    ) {
      return;
    }

    const componentType = event.dataTransfer?.getData('component-type');
    let customSettings = event.dataTransfer?.getData('custom-settings');

    if (!componentType) {
      return;
    }

    if (!customSettings || customSettings.trim() === '') {
      const draggableElement = document.querySelector(
        `[data-component="${componentType}"]`
      );
      if (draggableElement) {
        if (
          (window as any).customComponents &&
          (window as any).customComponents[componentType]
        ) {
          const componentConfig = (window as any).customComponents[
            componentType
          ];
          if (componentConfig.settings) {
            customSettings = JSON.stringify(componentConfig.settings);
          }
        }
      }
    }

    const { gridX, gridY } = this.gridManager.mousePositionAtGridCorner(
      event,
      Canvas.canvasElement
    );

    const component = Canvas.createComponent(componentType, customSettings);

    if (component && this.editable !== false) {
      const uniqueClass = Canvas.generateUniqueClass(componentType);
      component.id = uniqueClass;
      component.classList.add(uniqueClass);
      if (Canvas.layoutMode === 'absolute') {
        component.style.position = 'absolute';

        if (
          componentType === 'container' ||
          componentType === 'twoCol' ||
          componentType === 'threeCol'
        ) {
          component.style.top = `${event.offsetY}px`;
        } else {
          component.style.position = 'absolute';
          component.style.left = `${gridX}px`;
          component.style.top = `${gridY}px`;
        }

        Canvas.addDraggableListeners(component);
      } else if (Canvas.layoutMode === 'grid') {
        component.style.position = '';
        if (component.hasAttribute('draggable')) {
          component.removeAttribute('draggable');
          component.style.cursor = 'default';
        }
      }
      Canvas.components.push(component);
      Canvas.canvasElement.appendChild(component);
      Canvas.historyManager.captureState();
    }

    Canvas.dispatchDesignChange();
  }

  public static reorderComponent(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= this.components.length ||
      toIndex >= this.components.length
    ) {
      console.error('Invalid indices for reordering');
      return;
    }

    const [movedComponent] = this.components.splice(fromIndex, 1);
    this.components.splice(toIndex, 0, movedComponent);

    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      this.components.forEach(component => {
        canvasContainer.appendChild(component);
      });
    }
    this.historyManager.captureState();
    Canvas.dispatchDesignChange();
  }

  static createComponent(
    type: string,
    customSettings: string | null = null,
    props?: string
  ): HTMLElement | null {
    let element: HTMLElement | null = null;

    const componentFactoryFunction = Canvas.componentFactory[type];
    if (componentFactoryFunction) {
      element = componentFactoryFunction();
    } else {
      const tagNameElement = document.querySelector(
        `[data-component='${type}']`
      );

      const tagName = tagNameElement?.getAttribute('data-tag-name');

      if (tagName) {
        element = document.createElement(tagName);

        element.classList.add(`${type}-component`, 'custom-component');
        element.classList.add(`${type}-component`, 'custom-component');

        element.setAttribute('data-component-type', type);
      } else {
        return null;
      }
    }

    if (element && this.editable !== false) {
      const resizeObserver = new ResizeObserver(entries => {
        Canvas.dispatchDesignChange();
      });
      resizeObserver.observe(element);
      element.classList.add('editable-component');
      if (type != 'container') {
        if (Canvas.layoutMode !== 'grid') {
          element.classList.add('component-resizer');
        }
      }

      if (type === 'image') {
        element.setAttribute('contenteditable', 'false');
      } else {
        if (type !== 'header' && type !== 'text' && type !== 'table') {
          element.setAttribute('contenteditable', 'true');
        }
        element.addEventListener('input', () => {
          Canvas.historyManager.captureState();
          this.dispatchDesignChange();
        });
      }

      Canvas.controlsManager.addControlButtons(element);
      Canvas.addResizeHandles(element);
    }
    if (element) {
      const uniqueClass = Canvas.generateUniqueClass(type);
      element.setAttribute('id', uniqueClass);
      const label = document.createElement('span');
      label.className = 'component-label';
      label.setAttribute('contenteditable', 'false');
      label.textContent = uniqueClass;
      element.appendChild(label);
    }
    return element;
  }

  static generateUniqueClass(
    type: string,
    isContainerComponent: boolean = false,
    containerClass: string | null = null
  ): string {
    if (isContainerComponent && containerClass) {
      let containerElement: any = Canvas.components.find(component =>
        component.classList.contains(containerClass)
      );

      if (!containerElement) {
        containerElement = document.querySelector(`.${containerClass}`);
        if (!containerElement) {
          return `${containerClass}-${type}1`;
        }
      }

      const containerComponents = Array.from(
        containerElement.children
      ) as HTMLElement[];
      const typePattern = new RegExp(`${containerClass}-${type}(\\d+)`);

      let maxNumber = 0;
      containerComponents.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) {
            const number = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, number);
          }
        });
      });

      return `${containerClass}-${type}${maxNumber + 1}`;
    } else {
      const typePattern = new RegExp(`${type}(\\d+)`);
      let maxNumber = 0;

      Canvas.components.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) {
            const number = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, number);
          }
        });
      });

      return `${type}${maxNumber + 1}`;
    }
  }

  static addDraggableListeners(element: HTMLElement) {
    // Remove native draggable attribute if it exists, as interact.js handles it
    element.removeAttribute('draggable');
    element.style.cursor = 'grab';
    element.style.touchAction = 'none'; // Required for interact.js

    interact(element)
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true,
          }),
          // Removed grid snap to prevent conflict with alignment guides
        ],
        autoScroll: {
          container: Canvas.canvasElement,
          margin: 50,
          speed: 300,
        },
        listeners: {
          start(event) {
            const target = event.target as HTMLElement;
            target.style.cursor = 'grabbing';

            // Initialize data attributes for transform
            const x = (parseFloat(target.getAttribute('data-x') || '0'));
            const y = (parseFloat(target.getAttribute('data-y') || '0'));

            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());

            // Collect snap targets (all other components)
            Canvas.snapTargets = Canvas.components
              .filter(c => c !== element && document.body.contains(c)) // Exclude self and detached elements
              .map(c => {
                const rect = c.getBoundingClientRect();
                // Convert to canvas-relative
                const canvasRect = Canvas.canvasElement.getBoundingClientRect();
                const left =
                  rect.left - canvasRect.left + Canvas.canvasElement.scrollLeft;
                const top =
                  rect.top - canvasRect.top + Canvas.canvasElement.scrollTop;
                return {
                  left,
                  top,
                  right: left + rect.width,
                  bottom: top + rect.height,
                  centerX: left + rect.width / 2,
                  centerY: top + rect.height / 2,
                };
              });
          },
          move(event) {
            const target = event.target as HTMLElement;

            // Current transform values
            let x = (parseFloat(target.getAttribute('data-x') || '0')) + event.dx;
            let y = (parseFloat(target.getAttribute('data-y') || '0')) + event.dy;

            // Calculate absolute position for snapping
            const currentLeft = parseFloat(target.style.left) || 0;
            const currentTop = parseFloat(target.style.top) || 0;

            let absLeft = currentLeft + x;
            let absTop = currentTop + y;

            const width = target.offsetWidth;
            const height = target.offsetHeight;
            const right = absLeft + width;
            const bottom = absTop + height;
            const centerX = absLeft + width / 2;
            const centerY = absTop + height / 2;

            Canvas.clearGuides();
            const SNAP_THRESHOLD = 5;
            let snappedX = false;
            let snappedY = false;

            // Check X alignment
            for (const snap of Canvas.snapTargets) {
              if (Math.abs(absLeft - snap.left) < SNAP_THRESHOLD) {
                x += snap.left - absLeft; // Adjust transform x
                absLeft = snap.left;
                snappedX = true;
                Canvas.drawGuide('vertical', absLeft);
              } else if (Math.abs(absLeft - snap.right) < SNAP_THRESHOLD) {
                x += snap.right - absLeft;
                absLeft = snap.right;
                snappedX = true;
                Canvas.drawGuide('vertical', absLeft);
              } else if (Math.abs(right - snap.left) < SNAP_THRESHOLD) {
                x += (snap.left - width) - absLeft;
                absLeft = snap.left - width;
                snappedX = true;
                Canvas.drawGuide('vertical', snap.left);
              } else if (Math.abs(right - snap.right) < SNAP_THRESHOLD) {
                x += (snap.right - width) - absLeft;
                absLeft = snap.right - width;
                snappedX = true;
                Canvas.drawGuide('vertical', snap.right);
              } else if (Math.abs(centerX - snap.centerX) < SNAP_THRESHOLD) {
                x += (snap.centerX - width / 2) - absLeft;
                absLeft = snap.centerX - width / 2;
                snappedX = true;
                Canvas.drawGuide('vertical', snap.centerX);
              }

              if (snappedX) break;
            }

            // Check Y alignment
            for (const snap of Canvas.snapTargets) {
              if (Math.abs(absTop - snap.top) < SNAP_THRESHOLD) {
                y += snap.top - absTop; // Adjust transform y
                absTop = snap.top;
                snappedY = true;
                Canvas.drawGuide('horizontal', absTop);
              } else if (Math.abs(absTop - snap.bottom) < SNAP_THRESHOLD) {
                y += snap.bottom - absTop;
                absTop = snap.bottom;
                snappedY = true;
                Canvas.drawGuide('horizontal', absTop);
              } else if (Math.abs(bottom - snap.top) < SNAP_THRESHOLD) {
                y += (snap.top - height) - absTop;
                absTop = snap.top - height;
                snappedY = true;
                Canvas.drawGuide('horizontal', snap.top);
              } else if (Math.abs(bottom - snap.bottom) < SNAP_THRESHOLD) {
                y += (snap.bottom - height) - absTop;
                absTop = snap.bottom - height;
                snappedY = true;
                Canvas.drawGuide('horizontal', snap.bottom);
              } else if (Math.abs(centerY - snap.centerY) < SNAP_THRESHOLD) {
                y += (snap.centerY - height / 2) - absTop;
                absTop = snap.centerY - height / 2;
                snappedY = true;
                Canvas.drawGuide('horizontal', snap.centerY);
              }

              if (snappedY) break;
            }

            // Apply transform instead of top/left
            target.style.transform = `translate(${x}px, ${y}px)`;

            // Update data attributes
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
          },
          end(event) {
            const target = event.target as HTMLElement;
            target.style.cursor = 'grab';
            Canvas.clearGuides();

            // Apply final position to top/left and reset transform
            const x = (parseFloat(target.getAttribute('data-x') || '0'));
            const y = (parseFloat(target.getAttribute('data-y') || '0'));
            const currentLeft = parseFloat(target.style.left) || 0;
            const currentTop = parseFloat(target.style.top) || 0;

            target.style.left = `${currentLeft + x}px`;
            target.style.top = `${currentTop + y}px`;
            target.style.transform = 'none';

            // Reset data attributes
            target.setAttribute('data-x', '0');
            target.setAttribute('data-y', '0');

            Canvas.historyManager.captureState();
            Canvas.dispatchDesignChange();
          },
        },
      })
      .resizable({
        // resize from all edges and corners
        edges: {
          left: '.resize-handle-left',
          right: '.resize-handle-right',
          bottom: '.resize-handle-bottom',
          top: '.resize-handle-top',
        },

        listeners: {
          move(event) {
            const target = event.target as HTMLElement;
            let x = parseFloat(target.style.left) || 0;
            let y = parseFloat(target.style.top) || 0;

            // update the element's style
            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            // translate when resizing from top or left edges
            x += event.deltaRect?.left || 0;
            y += event.deltaRect?.top || 0;

            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
          },
          end(event) {
            Canvas.historyManager.captureState();
            Canvas.dispatchDesignChange();
          },
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent',
          }),

          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 20, height: 20 },
          }),
        ],

        inertia: false,
      });
  }
  static addResizeHandles(element: HTMLElement) {
    const handles = ['top', 'bottom', 'left', 'right'];
    handles.forEach(handle => {
      const div = document.createElement('div');
      div.classList.add(`resize-handle-${handle}`);
      element.appendChild(div);
    });
  }
}
