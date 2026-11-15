import Image from "next/image";
import Carousel from "./carousel";
import leftStaticImage from "../public/leftStaticImage.png";
import rightStaticImage from "../public/rightStaticImage.png";
import topStaticBannerImage from "../public/staticBannerTop.png";
import bottomStaticBannerImage from "../public/staticBannerBottom.png";
import PokemonList, { type Pokemon } from "./pokemon-list";

export default async function Home() {
  
  const apiUrl = process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/pokemons";
  const pageNumber = 1;
  const limit = 10;

  const url = new URL(apiUrl);
  url.searchParams.set("page", String(pageNumber));
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Laravel returned ${response.status}`);
  }

  const pokemons: Pokemon[] = await response.json();

  return (
    <main className="px-4 py-4">
      <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
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

        <PokemonList initialPokemons={pokemons} apiUrl={apiUrl} pageNumber={pageNumber} limit={limit} />

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
