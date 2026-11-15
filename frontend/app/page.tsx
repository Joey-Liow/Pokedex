import Image from "next/image";
import Carousel from "./carousel";
import leftStaticImage from "../public/leftStaticImage.png";
import rightStaticImage from "../public/rightStaticImage.png";
import topStaticBannerImage from "../public/staticBannerTop.png";
import bottomStaticBannerImage from "../public/staticBannerBottom.png";

export default async function Home() {
  const response = await fetch(
    "http://127.0.0.1:8000/api/pokemons?page=1&limit=50",
  );

  if (!response.ok) {
    throw new Error(`Laravel returned ${response.status}`);
  }

  type Pokemon = {
    name: string;
    types: string[];
    image: string;
    height: number;
    weight: number;
  };

  const pokemons: Pokemon[] = await response.json();

  return (
    <main className="px-4 py-4">
      <section className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Carousel />

        <div className="grid h-80 grid-rows-2 gap-3">
          <div className="relative overflow-hidden">
            <Image
              src={topStaticBannerImage}
              alt=""
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>

          <div className="relative overflow-hidden">
            <Image
              src={bottomStaticBannerImage}
              alt=""
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[12em_minmax(0,1fr)_20rem]">
        <aside className="relative hidden lg:block h-90 overflow-hidden">
          <Image
            src={leftStaticImage}
            alt=""
            fill
            sizes="192px"
            className="object-cover"
          />
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex items-center gap-6">
            <input
              type="search"
              aria-label="Search Pokémon by name"
              placeholder="Pokémon Name"
              className="min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-900 shadow-sm placeholder:font-medium placeholder:text-gray-600"
            />
            <button
              type="button"
              className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-gray-100"
            >
              Search
            </button>
          </div>

          <div className="h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <ul className="grid grid-cols-3 gap-x-3 gap-y-5">
              {pokemons.map((pokemon) => (
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
          </div>
        </section>

        <aside className="relative hidden lg:block h-100 overflow-hidden">
          <Image
            src={rightStaticImage}
            alt=""
            fill
            sizes="320px"
            className="object-cover"
          />
        </aside>
      </div>
    </main>
  );
}
