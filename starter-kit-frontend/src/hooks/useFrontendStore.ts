import { useEffect, useState } from 'react';
import {
  FrontendStore,
  getFrontendStore,
  subscribeFrontendStore,
  updateFrontendStore,
} from '@/utils/frontendStore';

export function useFrontendStore() {
  const [store, setStore] = useState<FrontendStore>(getFrontendStore());

  useEffect(() => {
    setStore(getFrontendStore());
    return subscribeFrontendStore(() => {
      setStore(getFrontendStore());
    });
  }, []);

  const patchStore = (updater: (prev: FrontendStore) => FrontendStore) => {
    updateFrontendStore(updater);
    setStore(getFrontendStore());
  };

  return { store, patchStore };
}
