# Pokédex

A Next.js Pokédex backed by a Laravel API. Laravel combines PokéAPI's paginated list and detail responses into a single array for the frontend. The frontend displays Pokémon that can be browsed with infinite scroll.

## Local setup

Use PHP 8.4.1 or newer within PHP 8.x with the PDO SQLite extension, Composer, Node.js 22.13 or newer within Node.js 22.x, and npm. An internet connection is needed to install dependencies and fetch Pokémon data and artwork.

Clone the repository:

```bash
git clone https://github.com/Joey-Liow/pokedex.git
cd pokedex
```

### Backend

From the repository root, run the following in one terminal:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Laravel runs at [http://127.0.0.1:8000](http://127.0.0.1:8000). The SQLite database supports Laravel's default session, cache, and queue settings. Pokémon data comes from PokéAPI.

### Frontend

From the repository root, run the following in a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep both servers running.

The frontend defaults to `http://127.0.0.1:8000/api/pokemons`. If Laravel runs on a different port or host, create `frontend/.env.local` next to `frontend/package.json`, add the full endpoint, and restart the Next.js dev server. For example, if Laravel runs on port `8001`:

```dotenv
LARAVEL_API_URL=http://127.0.0.1:8001/api/pokemons
```

Scroll within the card list to load the next batch. Search matches part of a Pokémon's name, regardless of case, among cards already loaded. Clear the input and submit again to restore the list and resume infinite scrolling.

## API

### `GET /api/pokemons`

The endpoint is public and requires no API key or sign-in.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | Integer, at least 1 | `1` | Page to retrieve. |
| `limit` | Integer, at least 1 | `10` | Maximum number of Pokémon to return for this page. |

Both parameters are optional. Laravel uses `(page - 1) * limit` as the PokéAPI offset, then fetches the detail record for each result. Keep the same `limit` when requesting successive pages.

```bash
curl -i 'http://127.0.0.1:8000/api/pokemons?page=2&limit=1'
```

A successful request returns HTTP `200` and a JSON array. For example:

```json
[
  {
    "name": "ivysaur",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    "types": ["grass", "poison"],
    "height": 10,
    "weight": 130
  }
]
```

`image` is the official artwork URL and may be `null` if unavailable. `types` contains type names. Height is in decimeters and weight is in hectograms. [PokéAPI Pokémon reference](https://pokeapi.co/docs/v2#pokemon)

If PokéAPI returns an empty page, the endpoint responds with `200` and `[]`. An invalid value, such as `page=0`, returns `422` with a JSON validation error.

## AI usage

See [AI usage notes](AI_USAGE.md) for selected prompts, implementation decisions, and verification.
