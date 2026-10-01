/** The hero portrait's parts the transformation plays on (see Portrait.tsx). */
export interface PortraitRefs {
  /** The photo frame; holds both photos. */
  frame: HTMLElement;
  /** Square stage centred on the face, larger than the frame; holds the
   *  canvas the hologram is projected on. */
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
}

let refs: PortraitRefs | null = null;

export function setPortraitRefs(next: PortraitRefs | null) {
  refs = next;
}

export function getPortraitRefs() {
  return refs;
}
