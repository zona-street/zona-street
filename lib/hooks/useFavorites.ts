import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "favorites";
const FAVORITES_EVENT = "favorites-changed";

// Event personalizado para sincronizar favoritos entre componentes
const dispatchFavoritesChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    const loadFavorites = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(FAVORITES_KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      }
    };

    loadFavorites();

    // Listener para mudanças entre abas (storage event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        loadFavorites();
      }
    };

    // Listener para mudanças dentro da mesma aba (custom event)
    const handleFavoritesChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(FAVORITES_EVENT, handleFavoritesChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(FAVORITES_EVENT, handleFavoritesChange);
    };
  }, []);

  // Adicionar favorito
  const addFavorite = useCallback((productId: string) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const current = stored ? JSON.parse(stored) : [];

      if (!current.includes(productId)) {
        const updated = [...current, productId];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        setFavorites(updated);
        dispatchFavoritesChange();
        return true;
      }
      return false;
    }
    return false;
  }, []);

  // Remover favorito
  const removeFavorite = useCallback((productId: string) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const current = stored ? JSON.parse(stored) : [];
      const updated = current.filter((id: string) => id !== productId);

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
      dispatchFavoritesChange();
      return true;
    }
    return false;
  }, []);

  // Toggle favorito
  const toggleFavorite = useCallback(
    (productId: string) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(FAVORITES_KEY);
        const current = stored ? JSON.parse(stored) : [];

        if (current.includes(productId)) {
          removeFavorite(productId);
          return false; // Removido
        } else {
          addFavorite(productId);
          return true; // Adicionado
        }
      }
      return false;
    },
    [addFavorite, removeFavorite],
  );

  // Verificar se é favorito
  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites],
  );

  // Limpar todos os favoritos
  const clearFavorites = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
      setFavorites([]);
      dispatchFavoritesChange();
    }
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
