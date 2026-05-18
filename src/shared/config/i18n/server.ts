import type { Language } from "@/modules/cargo/entities/cargo/model/types";
import type { Dictionary } from "./types";
import uz from "./messages/uz.json";
import ru from "./messages/ru.json";
import en from "./messages/en.json";

const dictionaries: Record<Language, Dictionary> = { uz, ru, en };

export const languages: Language[] = ["uz", "ru", "en"];
export const languageLabels: Record<Language, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN"
};

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] ?? dictionaries.uz;
}
