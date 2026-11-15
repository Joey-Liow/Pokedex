# AI usage

I used OpenAI Codex during development for focused implementation examples, debugging, code review, and drafting this documentation. I made the project changes in my editor and used the feedback to check how the Laravel API, React state, and browser behavior fit together.

The following prompts are condensed for readability.

| Prompt | My reasoning and the resulting change |
| --- | --- |
| “Check the returned types. They don’t seem correct.” | PokéAPI returns nested type records, while the cards need an array of names. I extracted each `type.name` within the loop for its Pokémon and returned the completed page as a JSON array. |
| “Can I keep the banners, side images, and search bar visible while just the card list loads?” | The page was waiting for Laravel before rendering. I started the request in the server page, passed the promise to the cards, and put the `Suspense` boundary around the cards. The search bar and banners can render while the first batch loads. |
| “Why does it keep loading more Pokémon when I search?” | Filtering shortened the visible list and brought the infinite-scroll marker into view. I paused the observer while a search was active and resumed it when the search was cleared. Search filters the batches already loaded. |
| “React reports two children with the same key, `metapod`. What is causing this?” | Two observer callbacks could start the same page request before the loading state updated. I added a ref that records the requested page immediately and resets after a failure so Retry can request that page again. |

Codex helped verify the API mapping with mocked PokéAPI responses. It also ran an isolated check of the pagination function: duplicate callbacks requested a page only once, and a failed request could be retried. ESLint and TypeScript checks passed after the pagination fix.
