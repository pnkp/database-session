import * as als from 'async-local-storage';

als.enable();
als.enableLinkedTop();

export class Storage {
  static set<TData>(key: string, value: TData): void {
    als.set(key, value, true);
  }

  static get<TData>(key: string): TData | undefined {
    return als.get(key) ?? undefined;
  }
}
