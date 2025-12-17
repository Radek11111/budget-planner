# 🧮 Budget Planner -- Aplikacja do zarządzania finansami domowymi

Aplikacja służy do zarządzania budżetem domowym, monitorowania
przychodów, wydatków, oszczędności oraz celów oszczędnościowych. Zawiera
panel użytkownika, panel administratora, integrację z Clerk do logowania
oraz backend w Fastify + Prisma.

Projekt jest zaprojektowany pod skalowanie do tysięcy użytkowników, z
możliwością dalszego rozwoju o subskrypcje, automatyczne OCR paragonów
oraz zaawansowane wykresy statystyczne.

------------------------------------------------------------------------

# 🚀 Stack technologiczny

## Frontend

-   Vue 3 (Composition API)
-   TypeScript
-   Pinia
-   Vue Router
-   Tailwind CSS
-   Chart.js + vue-chartjs
-   Axios
-   Clerk
-   VueUse
-   SweetAlert2

## Backend

-   Fastify
-   TypeScript
-   Prisma ORM
-   PostgreSQL
-   Clerk Auth
-   Zod
-   Tesseract.js (OCR)

------------------------------------------------------------------------

# 💡 Funkcjonalności

## Dla użytkownika

-   Logowanie / rejestracja (Clerk)
-   Dodawanie przychodów, wydatków, oszczędności
-   Cele oszczędnościowe
-   Dashboard miesięczny z wykresami
-   OCR paragonów
-   Historia transakcji
-   Edytowanie i usuwanie wpisów

## Panel Administratora

-   Lista użytkowników
-   Lista budżetów
-   Globalne statystyki
-   Dashboard admina
-   Endpointy `/admin`

------------------------------------------------------------------------

# 🗂 Struktura projektu

## Backend

    backend/
    ├── dist/
    ├── prisma/
    └── src/
        ├── db/
        ├── lib/
        ├── middleware/
        ├── plugins/
        ├── routes/
        │   ├── admin/
        │   ├── budget/
        ├── types/
        ├── validation/
        └── index.ts

## Frontend

    frontend/
    ├── public/
    └── src/
        ├── api/
        ├── assets/
        ├── components/
        │   ├── forms/
        │   ├── transactionReview/
        │   └── ui/
        ├── composables/
        ├── router/
        ├── stores/
        ├── utils/
        ├── views/
        ├── App.vue
        └── main.ts

------------------------------------------------------------------------

# 🔧 Instalacja

## Backend

    cd backend
    npm install
    npm run dev

## Frontend

    cd frontend
    npm install
    npm run dev

------------------------------------------------------------------------

# 🔐 Zmienne środowiskowe

## Backend `.env`

    DATABASE_URL=""
    CLERK_SECRET_KEY=""

## Frontend `.env`

    VITE_CLERK_PUBLISHABLE_KEY=""
    VITE_API_URL="http://localhost:3000"

------------------------------------------------------------------------

# 📅 Roadmap

-   [ ] Subskrypcje premium
-   [ ] Eksport PDF/Excel
-   [ ] Automatyczna kategoryzacja
-   [ ] Dark mode
-   [ ] Notyfikacje push

------------------------------------------------------------------------

# 📄 Licencja

Projekt prywatny / do portfolio.
