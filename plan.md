# Take-Home Project Plan: Fetch Dog Adoptions (React + TypeScript)

This plan outlines the structure, key features, and implementation details for the Fetch Frontend Take-Home Exercise, adhering to a **Feature-First/Domain-Driven Architecture** and a **Layered Component Structure**, while utilizing robust state management and data fetching strategies.

---

## I. Core Principles & Architecture

### 1. Feature-First / Domain-Driven Architecture

Instead of organizing by file type, we'll create top-level directories for each major feature or domain of the application. This approach promotes co-location, scalability, and clear ownership.

* **Top-Level Directories:**
    * `src/features/Auth/`: Handles user login, logout, and session management.
    * `src/features/Dogs/`: Manages dog search, filtering, favorite selection, and matching.
    * `src/features/Locations/` (Optional but good for future expansion if location filters become a primary feature): Manages location search and data.

* **Within Each Feature Directory:** You'll find sub-folders for components, hooks, services, and types relevant *only* to that feature. For example, `src/features/Auth/components/AuthForm.tsx` or `src/features/Dogs/services/dogService.ts`.

### 2. Layered Component Structure

Components will be organized into layers based on their responsibility, promoting reusability and clear separation of concerns.

* `src/pages/`: For application-wide, top-level routes (e.g., `NotFoundPage.tsx` or `Layout.tsx`). For this project, most "pages" will live within feature folders (e.g., `src/features/Auth/pages/LoginPage.tsx`).
* `src/shared/components/` (or `src/ui/`): For generic, reusable **presentational components** that are *not* tied to a specific feature (e.g., `Button.tsx`, `LoadingSpinner.tsx`, `Modal.tsx`, `Pagination.tsx`, `Select.tsx`, `Checkbox.tsx`, `Input.tsx`).
* **Container Components:** These "smart/stateful" components handle data fetching, state management, and business logic. They'll typically reside within feature `components/` folders if specific to that feature (e.g., `src/features/Dogs/components/DogListContainer.tsx`).
* **Presentational Components:** These "dumb/pure/UI" components focus solely on how things look, receiving data via props. They live in `src/shared/components/` or within feature `components/` if highly specialized but still purely UI-focused.

### 3. State Management Strategy

A robust state management solution is crucial for handling application data effectively.

* **Global State (Shared):**
    * **React Query (TanStack Query):** This will be the **primary solution for server-side data** (dogs, breeds, locations). It excels at caching, revalidation, loading states, and error handling, significantly reducing boilerplate for data fetching.
    * **Zustand (or React Context):** For lightweight, application-wide UI state that isn't server-derived (e.g., user authentication status, global notifications). Zustand offers flexibility without Redux's boilerplate.

* **Component Local State:** Use `useState` and `useReducer` for state specific to a single component or a small subtree (e.g., form input values, modal visibility).

### 4. Data Fetching and API Layer

* **Axios:** We'll use Axios as the HTTP client, given its excellent interceptor support for handling `withCredentials` and potential future error handling.
* `src/api/axiosClient.ts`: A centralized Axios instance configured with `withCredentials: true` and the base API URL.
* `src/features/<FeatureName>/services/<featureName>Service.ts`: Each feature will have a dedicated service file encapsulating API calls related to that feature (e.g., `authService.ts`, `dogService.ts`). These services will use the configured `axiosClient`.

### 5. Utility and Common Helpers

* `src/utils/`: For generic, non-feature-specific utility functions (e.g., `formatters.ts`, `validators.ts`, `constants.ts`).
* `src/hooks/`: For generic custom hooks reusable across features (e.g., `useDebounce.ts`).
* `src/types/`: For global TypeScript interfaces/types that are shared across multiple features or define common API structures.

### 6. Styling Strategy

* **Tailwind CSS:** For rapid UI development, consistent styling, and component-level scoping through utility classes.
* **Chakra UI:** (Optional, but recommended for speed and accessibility) A component library for pre-built, accessible UI components. This will accelerate development and ensure good accessibility.

---

## II. Project Setup & Tooling

* **Project Initialization:** `npx create-react-app fetch-dog-app --template typescript` (or use Vite for a faster setup).
* **Key Dependencies:**
    * `react`, `react-dom`, `react-scripts`, `typescript`
    * `axios`
    * `react-router-dom` (for routing)
    * `@tanstack/react-query`
    * `zustand` (or `react` context)
    * `chakra-ui/react`, `@emotion/react`, `@emotion/styled`, `framer-motion` (if using Chakra UI)
    * `tailwindcss`, `postcss`, `autoprefixer` (if using Tailwind)
* **Code Quality:** ESLint & Prettier will be configured for consistent code quality and formatting.

---

## III. Feature Breakdown & Implementation Plan

### 1. Authentication (`src/features/Auth/`)

* `src/features/Auth/types/AuthTypes.ts`: Defines interfaces for login requests and user details.
* `src/features/Auth/services/authService.ts`: Contains `login(name, email)` to `POST /auth/login` and `logout()` to `POST /auth/logout`.
* `src/features/Auth/hooks/useAuth.ts`: A custom hook to manage authentication state (`isAuthenticated`, `isLoading`, `error`). It will use React Query for the login mutation and Zustand (or Context) for the `isAuthenticated` state.
* `src/features/Auth/pages/LoginPage.tsx`: A form for name and email. Handles submission, calls `authService.login()`, redirects on success, and displays errors on failure.
* **Routing:** `react-router-dom` will protect the search page, redirecting unauthenticated users to `/login`.

### 2. Dog Search & Management (`src/features/Dogs/`)

* `src/features/Dogs/types/DogTypes.ts`: Defines `Dog`, `DogSearchQueryParams`, `DogSearchResult`, and `MatchResult` interfaces.
* `src/features/Dogs/services/dogService.ts`: Contains functions for `getBreeds()`, `searchDogs()`, `getDogsByIds()`, and `matchDogs()`.
* `src/features/Dogs/hooks/useDogSearch.ts`: Manages dog search parameters (filters, pagination, sorting) and uses React Query's `useQuery` to fetch results. Will include debouncing for search inputs.
* `src/features/Dogs/hooks/useFavorites.ts`: Manages the list of favorited dog IDs, providing functions to add/remove favorites (potentially persisted in `localStorage`).
* `src/features/Dogs/pages/DogSearchPage.tsx`:
    * **`BreedFilter.tsx` (Component):** Dropdown/checkboxes for selecting breeds, fetching available breeds via `dogService.getBreeds()`.
    * **`AgeFilter.tsx` (Component):** Input fields for min/max age.
    * **`SortControl.tsx` (Component):** Dropdown for sorting by `breed`, `name`, `age` in `asc`/`desc` order.
    * **`DogListContainer.tsx` (Container Component):** Uses `useDogSearch` to get dog IDs, then `useQuery` (or `useQueries` for multiple fetches) to retrieve full `Dog` objects. It renders `DogCard` components and handles pagination.
    * **`DogCard.tsx` (Presentational Component):** Displays `img`, `name`, `age`, `breed`, `zip_code`. Includes a button/checkbox to favorite/unfavorite the dog.
    * **`FavoriteSummary.tsx` (Component):** Displays the count of favorited dogs and a "Generate Match" button.
* `src/features/Dogs/pages/DogMatchPage.tsx`: Triggered by the "Generate Match" button. It uses `dogService.matchDogs()` (React Query mutation) with favorited IDs and then fetches the matched dog's details. The match will be displayed visually, perhaps in a modal.

### 3. Shared Components (`src/shared/components/`)

* `Button.tsx`, `Input.tsx`, `Select.tsx`, `Checkbox.tsx`: Generic, reusable form elements.
* `Pagination.tsx`: Generic pagination controls.
* `LoadingSpinner.tsx`: For indicating loading states.
* `ErrorMessage.tsx`: For displaying user-friendly error messages.
* `Modal.tsx`: A reusable modal component, ideal for the match result display.

---

## IV. Development Workflow

1.  **Project Initialization:** Create the React app, install dependencies, configure Axios, Tailwind, and Chakra UI (if used), and set up the `QueryClientProvider`.
2.  **Authentication Feature First:** Implement `authService.ts`, build `LoginPage.tsx` and `useAuth.ts`, and set up basic routing. Verify login/logout and cookie handling.
3.  **Dog Search Feature:** Implement `dogService.ts` for search-related endpoints. Develop the `DogSearchPage.tsx` structure and implement the `useDogSearch` hook. Create the filter and sort components, and build the `DogCard.tsx` and `DogListContainer.tsx` components. Integrate React Query for all data fetching.
4.  **Favorites & Matching:** Implement the `useFavorites` hook, integrate favoriting into `DogCard`, build `FavoriteSummary.tsx`, and implement the `DogMatchPage.tsx` or a match modal to display the final result.
5.  **Refinement & Polish:** Add robust error handling, loading indicators, ensure all `Dog` fields are displayed, improve UI/UX with Chakra UI/Tailwind, implement responsive design, and perform thorough testing.

---

## V. Deployment

* Choose a Hosting Platform: Netlify, Vercel, or GitHub Pages are excellent options for React applications.
* CI/CD (Optional but Recommended): Configure automatic deployments from your GitHub repository for a smoother workflow.

---

## VI. Documentation

A comprehensive `README.md` file is crucial for clarity and ease of use. It should include:

* Project title and description.
* Technologies used.
* **How to run locally:** Provide clear, step-by-step instructions (`git clone`, `npm install`, `npm start`).
* Link to the deployed site.
* A brief explanation of key design choices (architecture, state management).
* Any known limitations or future improvement ideas.

---

## VII. Self-Evaluation Checklist

This project will be evaluated based on the following criteria:

* **Code Quality:** Readability, meaningful naming, consistent formatting, strong TypeScript typing.
* **Use of Best Practices:** Adherence to feature-first architecture, layered components, effective React Query usage, proper state management, error handling, and accessibility.
* **Fulfillment of Minimum Requirements:** All specified features must be implemented (login, authentication, search with filters/pagination/sorting, dog details display, favorites, match generation, match display).
* **Site Usability/UX:** Intuitive navigation, clear user feedback (loading, errors), responsive design, and overall aesthetic appeal.
* **Hosting & Source Code:** A deployed application link and a public GitHub repository link must be provided.

---

## VIII. Project Checklist

### Phase 1: Project Setup & Foundation
- [x] Initialize React project (Vite + TypeScript).
- [x] Install dependencies: `axios`, `react-router-dom`, `@tanstack/react-query`, `zustand`, `tailwindcss`.
- [x] Configure Tailwind CSS.
- [x] Establish feature-first project structure (`src/features`, `src/shared`, `src/api`, etc.).
- [x] Create a centralized Axios client (`src/api/axiosClient.ts`).
- [x] Set up React Query `QueryClientProvider`.
- [x] Configure ESLint and Prettier.

### Phase 2: Authentication
- [x] Implement `authService.ts` (`login`, `logout`).
- [x] Create `LoginPage.tsx` with name and email form.
- [x] Implement `useAuth` hook for login mutation and state management.
- [x] Set up protected routes to redirect unauthenticated users.
- [x] Verify login/logout flow and cookie handling.

### Phase 3: Dog Search & Display
- [ ] Implement `dogService.ts` (`getBreeds`, `searchDogs`, `getDogsByIds`).
- [ ] Build `DogSearchPage.tsx` to house all search-related components.
- [ ] Create `useDogSearch` hook for managing filters, sorting, pagination, and data fetching.
- [ ] Implement debouncing for search inputs.
- [ ] Build shared UI components (`Input.tsx`, `Select.tsx`, `Button.tsx`, `Pagination.tsx`).
- [ ] Build feature-specific components: `BreedFilter.tsx`, `AgeFilter.tsx`, `SortControl.tsx`.
- [ ] Build `DogListContainer.tsx` to manage fetching and displaying the list of dogs.
- [ ] Build `DogCard.tsx` to display individual dog details.
- [ ] Implement loading skeletons/spinners and error messages for all API requests.

### Phase 4: Favorites & Matching
- [ ] Create `useFavorites` hook to manage selected dog IDs (persisting to `localStorage`).
- [ ] Add "favorite" functionality to each `DogCard.tsx`.
- [ ] Build `FavoriteSummary.tsx` to show the count of favorites and a "Find a Match" button.
- [ ] Add `matchDogs` function to `dogService.ts`.
- [ ] Implement logic to call `matchDogs` with the list of favorite dog IDs.
- [ ] Display the returned matched dog's details, potentially in a `Modal.tsx`.

### Phase 5: Finalization & Deployment
- [ ] Write a comprehensive `README.md` with setup instructions, design choices, and a link to the deployed site.
- [ ] Review the application for UI/UX polish, responsiveness, and accessibility.
- [ ] Deploy the application to a public host (Netlify, Vercel, etc.).
- [ ] Double-check that all requirements from the prompt have been met.

---

This detailed plan provides a robust framework for your Fetch take-home project, aligning perfectly with your architectural preferences and the exercise requirements. Are there any specific parts you'd like to dive into more deeply, or perhaps a particular challenge you anticipate?


graph TD
    subgraph src
        direction LR
        subgraph features
            direction LR
            subgraph Auth
                direction TB
                A_components[components]
                A_hooks[hooks]
                A_pages[pages]
                A_services[services]
                A_types[types]
            end
            subgraph Dogs
                direction TB
                D_components[components]
                D_hooks[hooks]
                D_pages[pages]
                D_services[services]
                D_types[types]
            end
        end
        subgraph shared
            direction TB
            S_components[components]
            S_hooks[hooks]
            S_utils[utils]
            S_types[types]
        end
        subgraph api
           A_client[axiosClient.ts]
        end
    end

    A_pages --> |e.g. LoginPage.tsx| A_components
    D_pages --> |e.g. DogSearchPage.tsx| D_components
    S_components --> |e.g. Button.tsx, Input.tsx| S_hooks
