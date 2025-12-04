import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { staticSearchEntries } from "@/lib/staticSearchEntries";

export interface SearchEntry {
  id: string;
  route: string;
  title: string;
  content: string;
  description?: string;
  tags?: string[];
}

export interface SearchHit extends SearchEntry {
  snippet: string;
  score: number;
}

interface SearchContextValue {
  isVisible: boolean;
  query: string;
  results: SearchHit[];
  openSearch: () => void;
  closeSearch: () => void;
  performSearch: (value: string) => void;
  updateEntries: (id: string, entries: SearchEntry[]) => void;
  removeEntries: (id: string) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSnippet = (text: string, query: string) => {
  if (!query) return text.slice(0, 140);
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) {
    return text.slice(0, 140);
  }
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, index + query.length + 60);
  return text.slice(start, end);
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const sourcesRef = useRef<Map<string, SearchEntry[]>>(
    new Map([["__static__", staticSearchEntries]])
  );
  const queryRef = useRef("");

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const gatherEntries = useCallback(() => {
    const merged = new Map<string, SearchEntry>();
    sourcesRef.current.forEach((items) => {
      if (!Array.isArray(items) || !items.length) return;
      items.forEach((entry) => {
        merged.set(entry.id, entry);
      });
    });
    return Array.from(merged.values());
  }, []);

  const performSearch = useCallback(
    (value: string) => {
      queryRef.current = value;
      const trimmed = value.trim();
      setQuery(value);
      if (!trimmed) {
        setResults([]);
        return;
      }
      const entries = gatherEntries();
      const normalizedQuery = trimmed.toLowerCase();
      const queryPattern = new RegExp(escapeRegExp(trimmed), "i");

      const hits = entries
        .map((entry) => {
          const haystack = [
            entry.title,
            entry.description,
            entry.content,
            entry.tags?.join(" "),
          ]
            .filter(Boolean)
            .join(" \u2022 ")
            .toLowerCase();

          const matchIndex = haystack.indexOf(normalizedQuery);
          if (matchIndex === -1) {
            return null;
          }

          const combined = [entry.title, entry.description, entry.content]
            .filter(Boolean)
            .join(" ");

          const snippetSource = combined || entry.title;
          const snippet = buildSnippet(snippetSource, trimmed);
          const score = matchIndex === 0 ? 100 : 100 - matchIndex / 2;

          return {
            ...entry,
            snippet,
            score,
          } satisfies SearchHit;
        })
        .filter((item): item is SearchHit => Boolean(item))
        .sort((a, b) => b.score - a.score);

      setResults(hits);
    },
    [gatherEntries]
  );

  const openSearch = useCallback(() => {
    setIsVisible(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsVisible(false);
    setQuery("");
    setResults([]);
    queryRef.current = "";
  }, []);

  const updateEntries = useCallback(
    (id: string, entries: SearchEntry[]) => {
      sourcesRef.current.set(id, entries);
      if (queryRef.current.trim()) {
        performSearch(queryRef.current);
      }
    },
    [performSearch]
  );

  const removeEntries = useCallback((id: string) => {
    sourcesRef.current.delete(id);
    if (queryRef.current.trim()) {
      performSearch(queryRef.current);
    }
  }, [performSearch]);

  const value = useMemo(
    () => ({
      isVisible,
      query,
      results,
      openSearch,
      closeSearch,
      performSearch,
      updateEntries,
      removeEntries,
    }),
    [isVisible, query, results, openSearch, closeSearch, performSearch, updateEntries, removeEntries]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};

export const useRegisterSearchSource = (
  id: string,
  getEntries: () => SearchEntry[],
  deps: unknown[] = []
) => {
  const { updateEntries, removeEntries, performSearch, query } = useSearch();
  const getEntriesRef = useRef(getEntries);
  const querySnapshotRef = useRef(query);

  useEffect(() => {
    getEntriesRef.current = getEntries;
  }, [getEntries]);

  useEffect(() => {
    querySnapshotRef.current = query;
  }, [query]);

  useEffect(() => {
    const entries = getEntriesRef.current();
    updateEntries(id, entries);
    if (querySnapshotRef.current.trim()) {
      performSearch(querySnapshotRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, updateEntries, performSearch, ...deps]);

  useEffect(() => {
    return () => {
      removeEntries(id);
    };
  }, [id, removeEntries]);
};
