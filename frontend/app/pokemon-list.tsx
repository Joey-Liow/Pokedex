"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, use, Suspense, type RefObject } from "react";

export type Pokemon = {
    name: string;
    types: string[];
    image: string;
};

type PokemonListProps = {
  initialPokemons: Promise<Pokemon[]>;
  apiUrl: string;
  pageNumber: number;
  limit: number;
};

function PokemonCards({
  initialPokemons,
  apiUrl,
  pageNumber,
  limit,
  query,
  scrollBoxRef
}: PokemonListProps & {
  query:string;
  scrollBoxRef: RefObject<HTMLDivElement | null>;
}) {
  const firstBatch = use(initialPokemons);
  const [pokemons, setPokemons] = useState(firstBatch);
  const [page, setPage] = useState(pageNumber);
  const [hasMore, setHasMore] = useState(firstBatch.length === limit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const visiblePokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query),
  );

  const listEndRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError("");

    try {
      const nextPage = page + 1;
      const url = new URL(apiUrl);
      url.searchParams.set("page", String(nextPage));
      url.searchParams.set("limit", String(limit));

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Could not load the next page");
      }

      const nextPokemons: Pokemon[] = await response.json();
      setPokemons((existing) => [...existing, ...nextPokemons]);
      setPage(nextPage);
      setHasMore(nextPokemons.length === limit);
    } catch {
      setError("Could not load more Pokémon. Please try again...");
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, hasMore, isLoading, page, limit]);

  useEffect(() => {
    const root = scrollBoxRef.current;
    const target = listEndRef.current;

    if (!root || !target || !hasMore || isLoading || error || query != "") return;

    const observer = new IntersectionObserver(
        ([entry]) => {
        if (entry.isIntersecting) void loadMore();
        },
        { root, rootMargin: "0px 0px 100px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
    }, [error, hasMore, isLoading, loadMore, query, scrollBoxRef]);

  return (
    <>
        <ul className="grid grid-cols-3 gap-x-3 gap-y-5">
            {visiblePokemons.map((pokemon) => (
            <li key={pokemon.name} className="flex items-center gap-4 rounded-lg border border-gray-300 p-4">
                {pokemon.image && (
                <Image
                    src={pokemon.image}
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    className="shrink-0"
                />
                )}
                <div>
                <h2 className="font-semibold capitalize">{pokemon.name}</h2>
                <div className="mt-1 flex gap-2">
                    {pokemon.types.map((type) => (
                    <span key={type} className="rounded-sm bg-gray-200 px-1.5 py-0.5 text-xs text-gray-800 capitalize">
                        {type}
                    </span>
                    ))}
                </div>
                </div>
            </li>
            ))}
        </ul>

        {query && visiblePokemons.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">
            No matching Pokémon in the loaded list.
          </p>
        )}

        <div ref={listEndRef} className="h-px" aria-hidden="true" />
        {isLoading && <p role="status" className="py-4">Loading more Pokémon…</p>}
        
        {error && (
        <div className="flex items-center gap-3 py-4">
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={loadMore}
              className="shrink-0 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try again
            </button>
        </div>
        )}

        {!hasMore && pokemons.length > 0 && (
          <p className="py-4 text-center text-sm text-gray-500">
            You’ve reached the end of the list.
          </p>
        )}
    </>
  );
}

export default function PokemonList(props: PokemonListProps) {
  const [query, setQuery] = useState("");
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  return (
    <section className="min-w-0">
        <form
          className="mb-6 flex items-center gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("pokemonName");
            setQuery(String(value ?? "").trim().toLowerCase());
            scrollBoxRef.current?.scrollTo({ top: 0 });
          }}
        >
            <input
              type="search"
              name="pokemonName"
              aria-label="Search Pokémon by name"
              placeholder="Pokémon Name"
              className="min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-900 shadow-sm placeholder:font-medium placeholder:text-gray-600"
            />
            
            <button
              type="submit"
              className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-gray-100"
            >
                Search
            </button>
        </form>

        <div
          ref={scrollBoxRef}
          className="h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
            <Suspense fallback={<p role="status">Loading Pokémon…</p>}>
            <PokemonCards {...props} query={query} scrollBoxRef={scrollBoxRef} />
            </Suspense>
        </div>
    </section>
  );
}