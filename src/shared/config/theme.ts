import type { ThemeName } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "@/shared/config/i18n/types";

export const themes: ThemeName[] = ["light", "dark", "ocean"];

export function getThemeLabel(theme: ThemeName, dictionary: Dictionary): string {
  if (theme === "dark") return dictionary.themeDark;
  if (theme === "ocean") return dictionary.themeOcean;
  return dictionary.themeLight;
}
