import { useEffect, useState } from 'react';
import {
  FrontendStore,
  getDefaultFrontendStore,
  getFrontendStore,
  subscribeFrontendStore,
  updateFrontendStore,
} from '@/utils/frontendStore';

export function useFrontendStore() {
  const [store, setStore] = useState<FrontendStore>(getDefaultFrontendStore());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      setStore(getFrontendStore());
    } catch {
      setStore(getDefaultFrontendStore());
    } finally {
      setIsHydrated(true);
    }

    return subscribeFrontendStore(() => {
      try {
        setStore(getFrontendStore());
      } catch {
        setStore(getDefaultFrontendStore());
      }
    });
  }, []);

  const patchStore = (updater: (prev: FrontendStore) => FrontendStore) => {
    try {
      updateFrontendStore(updater);
      setStore(getFrontendStore());
    } catch {
      setStore(getDefaultFrontendStore());
    }
  };

  return { store, patchStore, isHydrated };
}
