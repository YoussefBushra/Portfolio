/* Shared by the server layout (boot script) and the client provider, so it
   lives outside any "use client" module. */

export type View = "recruiter" | "engineer";

export const VIEW_STORAGE_KEY = "yb.view";

/**
 * Runs in <head> before first paint so a `?view=engineer` link or a remembered
 * choice never flashes the recruiter layer. The URL wins over storage.
 */
export const VIEW_BOOT_SCRIPT = `(function(){var d=document.documentElement,v=null;try{var q=new URLSearchParams(location.search).get("view");if(q==="engineer"||q==="recruiter")v=q;if(!v)v=localStorage.getItem("${VIEW_STORAGE_KEY}")}catch(e){}d.dataset.view=v==="engineer"?"engineer":"recruiter"})();`;
