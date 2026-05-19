import { media } from "@/content/media";
import type { System } from "@/content/systems";

export function getRelatedVideoUrl(system: System): string | undefined {
  if (!system.relatedVideoId) return undefined;
  return media.find((m) => m.id === system.relatedVideoId)?.url;
}
