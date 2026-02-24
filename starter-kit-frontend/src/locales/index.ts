import { fr } from '@/locales/fr';
import { en } from '@/locales/en';
import { Language } from '@/utils/frontendStore';

export const dictionaries = { fr, en } as const;

type Dict = typeof fr;
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Extract<keyof T, string>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
      }[Extract<keyof T, string>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

export type TranslationKey = DotNestedKeys<Dict>;

function deepGet(object: Record<string, unknown>, path: string): string | undefined {
  const segments = path.split('.');
  let current: unknown = object;
  for (const segment of segments) {
    if (!current || typeof current !== 'object' || !(segment in current)) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === 'string' ? current : undefined;
}

export function tx(language: Language, key: TranslationKey): string {
  return deepGet(dictionaries[language] as unknown as Record<string, unknown>, key) ?? key;
}
