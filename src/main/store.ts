// Use import ao invés de require
import Store from 'electron-store';
import { Document } from '../shared/types/ipc';

type StoreType = {
  documents: Record<string, Document>;
}

export const store = new Store<StoreType>({
  defaults: {
    documents: {},
  },
});

console.log(store.path);