import { Assets, Spritesheet, SpritesheetData, Texture } from "pixi.js";

interface SpriteSheetItem {
  json: SpritesheetData;
  pngAlias: string;
}

export class SpriteFrameLoader {
  private static instance: SpriteFrameLoader;
  private spriteFramesCache: Map<string, Texture[]> = new Map();

  private constructor() {}

  public static getInstance(): SpriteFrameLoader {
    if (!SpriteFrameLoader.instance) {
      SpriteFrameLoader.instance = new SpriteFrameLoader();
    }
    return SpriteFrameLoader.instance;
  }

  private getSpriteCacheKey(
    resource: SpriteSheetItem | SpriteSheetItem[]
  ): string {
    if (Array.isArray(resource)) {
      return resource
        .sort((a, b) => a.pngAlias.localeCompare(b.pngAlias))
        .map((item) => item.pngAlias)
        .join("|");
    }
    return resource.pngAlias;
  }

  public async getFrames(
    resource: SpriteSheetItem | SpriteSheetItem[]
  ): Promise<Texture[]> {
    const cacheKey = this.getSpriteCacheKey(resource);
    if (this.spriteFramesCache.has(cacheKey)) {
      return this.spriteFramesCache.get(cacheKey)!;
    }
    const frames: Texture[] = [];
    const frameKeys: string[] = [];
    const textures: Record<string, Texture> = {};
    const resources = Array.isArray(resource) ? resource : [resource];
    for (const item of resources) {
      const { json, pngAlias } = item;
      const texture = await Assets.load(pngAlias);
      const spriteSheet = new Spritesheet(texture, json);
      spriteSheet.parse();
      frameKeys.push(...Object.keys(spriteSheet.data.frames));
      Object.assign(textures, spriteSheet.textures);
    }

    frameKeys.sort();
    frameKeys.forEach((name) => {
      frames.push(textures[name]);
    });
    this.spriteFramesCache.set(cacheKey, frames);
    return frames;
  }

  public clearCache(): void {
    this.spriteFramesCache.clear();
  }

  public removeFromCache(resource: SpriteSheetItem | SpriteSheetItem[]): void {
    const cacheKey = this.getSpriteCacheKey(resource);
    this.spriteFramesCache.delete(cacheKey);
  }
}

export const getSpriteFrames = async (
  resource: SpriteSheetItem | SpriteSheetItem[]
) => {
  return SpriteFrameLoader.getInstance().getFrames(resource);
};
