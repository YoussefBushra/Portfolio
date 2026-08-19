/**
 * Minimal ambient types for the vendored @ybouane/liquidglass bundle (MIT).
 * The prebuilt bundle in index.js already inlines its patched html-to-image.
 */
export interface GlassConfig {
  blurAmount: number;
  refraction: number;
  chromAberration: number;
  edgeHighlight: number;
  specular: number;
  fresnel: number;
  distortion: number;
  cornerRadius: number;
  zRadius: number;
  opacity: number;
  saturation: number;
  tintStrength: number;
  brightness: number;
  shadowOpacity: number;
  shadowSpread: number;
  shadowOffsetY: number;
  floating: boolean;
  button: boolean;
  bevelMode: 0 | 1;
}

export interface LiquidGlassOptions {
  root: HTMLElement;
  glassElements: NodeListOf<Element> | Element[];
  defaults?: Partial<GlassConfig>;
}

export interface LiquidGlassInstance {
  readonly fps: number;
  destroy(): void;
  markChanged(element?: HTMLElement): void;
}

export declare const LiquidGlass: {
  init(options: LiquidGlassOptions): Promise<LiquidGlassInstance>;
};
export declare const DEFAULTS: GlassConfig;
export declare function invalidateFontEmbedCache(): void;
