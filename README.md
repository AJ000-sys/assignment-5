# TVmaze Show Gallery (React)

Using the previous assignment as a base to cretae a React single-page application built with Vite. The assignment search for TV shows by title or keyword, browse up to 10 results as cards, and open a detail page for any show. This assignment uses the same TVmaze API as before.

Data provided by [TVmaze.com](https://www.tvmaze.com/).

## How to run

npm install
npm run dev

Then open the local URL that Vite prints (usually http://localhost:5173).

## Required React concepts

1. Components and props: `src/App.jsx`, `src/components/SearchForm.jsx`, `Gallery.jsx`, `ResultsSummary.jsx`, `ShowList.jsx`, `ShowCard.jsx`, `CastList.jsx`, `ShowDetail.jsx` (one component per file; for example `ShowList` receives `shows` and `ShowCard` receives `show`)

2. Lists and keys: `src/components/ShowList.jsx` (`key={show.id}`), `src/components/CastList.jsx` (key built from the person and character IDs)

3. Conditional rendering: `src/components/Gallery.jsx` (empty search, loading, error, no results, results), `src/components/ShowDetail.jsx` (loading, error, cast loading and fallback)

4. Controlled form: `src/components/SearchForm.jsx` (`value`, `onChange`, `onSubmit` with `preventDefault()`)

5. State: `src/App.jsx` (`query`, `shows`, `loading`, `error`, `casts`, `retry`), `src/components/SearchForm.jsx` (`inputValue`), `src/components/ShowCard.jsx` (`castText`), `src/components/ShowDetail.jsx` 

6. Effects and fetch: `src/App.jsx` (default and new searches), `src/components/ShowCard.jsx` (each card's cast request), `src/components/ShowDetail.jsx` (show and cast requests); the `res.ok` check is `statusCheck` in `src/utils.js`, called before `response.json()` |

7. Lifted state: `src/App.jsx` owns `query` and `shows` and passes them down; `SearchForm` sends the search up through `onSearch`; `src/components/ResultsSummary.jsx` shows the result count and search term; `casts` is also kept in `App` so cards do not refetch cast data when returning from a detail page

8. Routing: `src/main.jsx` (`BrowserRouter`), `src/App.jsx` (`Routes` and `Route`), `src/components/ShowCard.jsx` (`Link`), `src/components/ShowDetail.jsx` (`useParams`, `Link`)