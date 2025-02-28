/**
 * Asset Loader for managing game assets
 * 
 * This class handles loading and caching of game assets like images, audio, etc.
 */

export type AssetType = 'image' | 'audio' | 'json';

export interface Asset {
  type: AssetType;
  url: string;
  data: any;
}

export class AssetLoader {
  private assets: Map<string, Asset> = new Map();
  private loadPromises: Map<string, Promise<Asset>> = new Map();
  private loadingProgress: number = 0;
  private totalAssets: number = 0;
  private loadedAssets: number = 0;
  
  /**
   * Load an image asset
   * @param key The key to identify the asset
   * @param url The URL of the image
   * @returns A promise that resolves when the image is loaded
   */
  loadImage(key: string, url: string): Promise<HTMLImageElement> {
    if (this.assets.has(key)) {
      return Promise.resolve(this.assets.get(key)!.data as HTMLImageElement);
    }
    
    if (this.loadPromises.has(key)) {
      return this.loadPromises.get(key)!.then(asset => asset.data as HTMLImageElement);
    }
    
    this.totalAssets++;
    
    const promise = new Promise<Asset>((resolve, reject) => {
      const image = new Image();
      
      image.onload = () => {
        const asset: Asset = {
          type: 'image',
          url,
          data: image
        };
        
        this.assets.set(key, asset);
        this.loadedAssets++;
        this.updateProgress();
        
        resolve(asset);
      };
      
      image.onerror = (error) => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      image.src = url;
    });
    
    this.loadPromises.set(key, promise);
    
    return promise.then(asset => asset.data as HTMLImageElement);
  }
  
  /**
   * Load an audio asset
   * @param key The key to identify the asset
   * @param url The URL of the audio
   * @returns A promise that resolves when the audio is loaded
   */
  loadAudio(key: string, url: string): Promise<HTMLAudioElement> {
    if (this.assets.has(key)) {
      return Promise.resolve(this.assets.get(key)!.data as HTMLAudioElement);
    }
    
    if (this.loadPromises.has(key)) {
      return this.loadPromises.get(key)!.then(asset => asset.data as HTMLAudioElement);
    }
    
    this.totalAssets++;
    
    const promise = new Promise<Asset>((resolve, reject) => {
      const audio = new Audio();
      
      audio.oncanplaythrough = () => {
        const asset: Asset = {
          type: 'audio',
          url,
          data: audio
        };
        
        this.assets.set(key, asset);
        this.loadedAssets++;
        this.updateProgress();
        
        resolve(asset);
      };
      
      audio.onerror = (error) => {
        reject(new Error(`Failed to load audio: ${url}`));
      };
      
      audio.src = url;
      audio.load();
    });
    
    this.loadPromises.set(key, promise);
    
    return promise.then(asset => asset.data as HTMLAudioElement);
  }
  
  /**
   * Load a JSON asset
   * @param key The key to identify the asset
   * @param url The URL of the JSON file
   * @returns A promise that resolves when the JSON is loaded
   */
  loadJSON<T = any>(key: string, url: string): Promise<T> {
    if (this.assets.has(key)) {
      return Promise.resolve(this.assets.get(key)!.data as T);
    }
    
    if (this.loadPromises.has(key)) {
      return this.loadPromises.get(key)!.then(asset => asset.data as T);
    }
    
    this.totalAssets++;
    
    const promise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load JSON: ${url}`);
        }
        return response.json();
      })
      .then(json => {
        const asset: Asset = {
          type: 'json',
          url,
          data: json
        };
        
        this.assets.set(key, asset);
        this.loadedAssets++;
        this.updateProgress();
        
        return asset;
      });
    
    this.loadPromises.set(key, promise);
    
    return promise.then(asset => asset.data as T);
  }
  
  /**
   * Get an asset by key
   * @param key The key of the asset
   * @returns The asset data
   */
  getAsset<T = any>(key: string): T | null {
    if (!this.assets.has(key)) {
      return null;
    }
    
    return this.assets.get(key)!.data as T;
  }
  
  /**
   * Get an image asset by key
   * @param key The key of the image asset
   * @returns The image element
   */
  getImage(key: string): HTMLImageElement | null {
    const asset = this.getAsset<HTMLImageElement>(key);
    
    if (!asset || this.assets.get(key)!.type !== 'image') {
      return null;
    }
    
    return asset;
  }
  
  /**
   * Get an audio asset by key
   * @param key The key of the audio asset
   * @returns The audio element
   */
  getAudio(key: string): HTMLAudioElement | null {
    const asset = this.getAsset<HTMLAudioElement>(key);
    
    if (!asset || this.assets.get(key)!.type !== 'audio') {
      return null;
    }
    
    return asset;
  }
  
  /**
   * Get a JSON asset by key
   * @param key The key of the JSON asset
   * @returns The JSON data
   */
  getJSON<T = any>(key: string): T | null {
    const asset = this.getAsset<T>(key);
    
    if (!asset || this.assets.get(key)!.type !== 'json') {
      return null;
    }
    
    return asset;
  }
  
  /**
   * Load multiple assets
   * @param assets An array of assets to load
   * @returns A promise that resolves when all assets are loaded
   */
  loadAssets(assets: { key: string, url: string, type: AssetType }[]): Promise<void> {
    const promises: Promise<any>[] = [];
    
    assets.forEach(asset => {
      switch (asset.type) {
        case 'image':
          promises.push(this.loadImage(asset.key, asset.url));
          break;
        case 'audio':
          promises.push(this.loadAudio(asset.key, asset.url));
          break;
        case 'json':
          promises.push(this.loadJSON(asset.key, asset.url));
          break;
      }
    });
    
    return Promise.all(promises).then(() => {});
  }
  
  /**
   * Get the loading progress
   * @returns The loading progress as a number between 0 and 1
   */
  getProgress(): number {
    return this.loadingProgress;
  }
  
  /**
   * Update the loading progress
   */
  private updateProgress(): void {
    this.loadingProgress = this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 1;
  }
  
  /**
   * Clear all assets
   */
  clear(): void {
    this.assets.clear();
    this.loadPromises.clear();
    this.loadingProgress = 0;
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }
}

// Create and export a singleton instance
export const assetLoader = new AssetLoader();
