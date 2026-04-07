# 🎬 MovieFinder

A high-performance movie discovery application built with **React 19**, **TypeScript**, and **Vite**. This project allows users to browse popular films, search for specific titles using the TMDB API, and manage a personalized favorites list.

---

## 🚀 Features

* **Real-time Search:** Interactive search bar with debounced input and a preview dropdown to find movies instantly.
* **Dynamic Filtering:** Filter movies by genre using a dedicated sidebar navigation.
* **Advanced Sorting:** Organize results by popularity, rating, release year, or title.
* **Favorites System:** Save movies to a local "Favorites" list that persists across browser sessions using `localStorage`.
* **Infinite Loading:** "Show More" functionality to fetch and display additional movies dynamically.
* **Responsive UI:** Fully responsive design built with **Tailwind CSS 4** for seamless viewing on mobile and desktop.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 19 (TypeScript) |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **State/Hooks** | `react-use` (for debouncing) |
| **Data Source** | TMDB (The Movie Database) API |
| **Deployment** | GitHub Pages |

---

## 📦 Getting Started

### Prerequisites

* **Node.js** (v18.0 or higher)
* **npm** or **yarn**
* A **TMDB API Key** (Get one at [themoviedb.org](https://www.themoviedb.org/documentation/api))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/MegaKabanos/MovieFinder.git](https://github.com/MegaKabanos/MovieFinder.git)
    cd MovieFinder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your API key:
    ```env
    VITE_TMDB_API_KEY=your_api_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

---

## 🔧 Available Scripts

* `npm run dev`: Start the local development server.
* `npm run build`: Build the application for production.
* `npm run deploy`: Build and deploy the project to GitHub Pages.
* `npm run lint`: Run ESLint to identify code quality issues.

---

## 🔑 Security Note

This project uses an external API. Ensure your `.env` file is never committed to version control to protect your `VITE_TMDB_API_KEY`.

---

**Author:** [MegaKabanos](https://github.com/MegaKabanos)
