/** The hero portrait's parts the transformation plays on (see Portrait.tsx). */
export interface PortraitRefs {
  /** The photo frame; holds both photos and the portal layer. */
  frame: HTMLElement;
  /** Square stage centred on the face; holds the canvas and the seal. */
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  /** The energy seal: a wrapper around the ring <svg>s (data-ring). */
  seal: HTMLElement;
  /** An <img> above the photos showing the other photo through the portal. */
  portal: HTMLImageElement;
}

let refs: PortraitRefs | null = null;

export function setPortraitRefs(next: PortraitRefs | null) {
  refs = next;
}

export function getPortraitRefs() {
  return refs;
}
