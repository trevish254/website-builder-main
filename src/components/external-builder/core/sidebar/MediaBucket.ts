import { GetMediaFiles } from '@/lib/types';

export class MediaBucket {
    private container: HTMLElement;
    private grid: HTMLElement;
    private uploadInput: HTMLInputElement;
    private uploadBtn: HTMLButtonElement;
    private mediaItems: string[] = [];
    private dbMediaFiles: GetMediaFiles = null;

    constructor(mediaFiles: GetMediaFiles = null) {
        this.container = document.getElementById('media-bucket') as HTMLElement;
        this.grid = document.getElementById('media-grid') as HTMLElement;
        this.uploadInput = document.getElementById('media-upload-input') as HTMLInputElement;
        this.uploadBtn = document.getElementById('media-upload-btn') as HTMLButtonElement;
        this.dbMediaFiles = mediaFiles;

        this.loadMedia();
        this.initializeEventListeners();
    }

    private initializeEventListeners() {
        if (this.uploadBtn && this.uploadInput) {
            this.uploadBtn.addEventListener('click', () => {
                this.uploadInput.click();
            });

            this.uploadInput.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        }
    }

    private handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                if (this.isValidFileType(file)) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        this.addMediaItem(result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert(`File ${file.name} is not a valid image type.`);
                }
            });
        }
        // Reset input
        input.value = '';
    }

    private isValidFileType(file: File): boolean {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return validTypes.includes(file.type);
    }

    private addMediaItem(dataUrl: string) {
        if (!this.mediaItems.includes(dataUrl)) {
            this.mediaItems.push(dataUrl);
            this.saveMedia();
            this.renderMediaItem(dataUrl);
        }
    }

    private renderMediaItem(dataUrl: string, isDbItem: boolean = false) {
        const item = document.createElement('div');
        item.className = 'media-item draggable';
        item.setAttribute('draggable', 'true');
        item.setAttribute('data-component-type', 'image');
        // Store the image source in a data attribute to be picked up by the drop handler
        item.setAttribute('data-image-src', dataUrl);

        // Create custom settings for the image component
        const customSettings = {
            attributes: {
                src: dataUrl
            }
        };
        item.setAttribute('data-custom-settings', JSON.stringify(customSettings));

        item.innerHTML = `
      <div class="media-preview">
        <img src="${dataUrl}" alt="Media">
      </div>
      ${!isDbItem ? '<button class="delete-media-btn" title="Delete">×</button>' : ''}
    `;

        if (!isDbItem) {
            const deleteBtn = item.querySelector('.delete-media-btn');
            deleteBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMediaItem(dataUrl, item);
            });
        }

        // Add drag start listener
        item.addEventListener('dragstart', (e) => {
            if (e.dataTransfer) {
                e.dataTransfer.setData('component-type', 'image');
                e.dataTransfer.setData('custom-settings', JSON.stringify(customSettings));
                e.dataTransfer.effectAllowed = 'copy';
            }
        });

        this.grid.appendChild(item);
    }

    private deleteMediaItem(dataUrl: string, element: HTMLElement) {
        this.mediaItems = this.mediaItems.filter(item => item !== dataUrl);
        this.saveMedia();
        element.remove();
    }

    private saveMedia() {
        try {
            localStorage.setItem('page-builder-media-bucket', JSON.stringify(this.mediaItems));
        } catch (e) {
            console.error('Failed to save media to localStorage:', e);
            // Handle quota exceeded error if necessary
        }
    }

    private loadMedia() {
        // Load DB media first
        if (this.dbMediaFiles && this.dbMediaFiles.data) {
            this.dbMediaFiles.data.forEach((file: any) => {
                if (file.link) {
                    this.renderMediaItem(file.link, true);
                }
            });
        }

        // Load local storage media
        try {
            const saved = localStorage.getItem('page-builder-media-bucket');
            if (saved) {
                this.mediaItems = JSON.parse(saved);
                this.mediaItems.forEach(item => this.renderMediaItem(item));
            }
        } catch (e) {
            console.error('Failed to load media from localStorage:', e);
        }
    }

    public static init(mediaFiles: GetMediaFiles = null) {
        return new MediaBucket(mediaFiles);
    }
}
