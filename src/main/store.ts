// Use import ao invés de require
import Store from 'electron-store';
import { app } from 'electron';
import path from 'path';

// Defina a interface para o tipo de armazenamento
interface StoreType {
  documents: Record<string, any>;
}

// Inicialize o electron-store
export const store = new Store<StoreType>({
  defaults: {
    documents: {},
  },
});

// Em vez de usar store.path, você pode determinar o caminho do arquivo de configuração manualmente:
const storeFilePath = path.join(app.getPath('userData'), 'config.json');
console.log(storeFilePath);
