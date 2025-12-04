import { Link } from "react-router-dom";
import { ExternalLink, FileText, Search, X } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/button";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <span>{text}</span>;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "ig");
  const parts = text.split(regex);
  const loweredQuery = query.toLowerCase();

  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part}`;
        if (part.toLowerCase() === loweredQuery) {
          return (
            <mark key={key} className="rounded bg-primary/20 px-1 text-primary">
              {part}
            </mark>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </>
  );
};

const SearchPanel = () => {
  const { isVisible, query, results, closeSearch } = useSearch();

  return (
    <div
      className={`absolute left-0 right-0 top-full z-40 origin-top transform transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="rounded-b-2xl border border-border bg-card shadow-lg shadow-primary/5">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {query.trim() ? (
              <span>
                Showing {results.length} result{results.length === 1 ? "" : "s"} for "{query.trim()}"
              </span>
            ) : (
              <span>Search will scan across all sections of this site.</span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={closeSearch} aria-label="Close search panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              <FileText className="mx-auto mb-3 h-10 w-10 opacity-60" />
              <p>No matching content found. Try different keywords.</p>
            </div>
          ) : null}
          {!query.trim() ? (
            <div className="px-6 py-6 text-sm text-muted-foreground">
              <p>Type a keyword to search programs, notices, events, downloads, and more.</p>
            </div>
          ) : null}
          {results.map((result) => (
            <Link
              key={result.id}
              to={result.route}
              onClick={closeSearch}
              className="block border-b border-border/60 px-6 py-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    <HighlightedText text={result.title} query={query} />
                  </h3>
                  {result.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      <HighlightedText text={result.description} query={query} />
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    <HighlightedText text={result.snippet} query={query} />
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
