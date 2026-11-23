# OneAtlas --- AI Model Discovery & Intelligence Platform

OneAtlas is an AI model discovery and comparison platform designed to
help users explore AI models, review their specifications, and compare
available information such as pricing, capabilities, providers, and
benchmark results.

## Project Overview

The platform brings AI model information into one place through a
searchable catalogue and dedicated discovery pages. Users can browse
models, inspect model details, and compare selected models side by side.

> **Project status:** This repository is an MVP/demo implementation.
> Some displayed records may be sample data. Check the application's
> data-source labels before treating any value as verified production
> information.

## Key Features

-   **Model discovery:** Browse the available AI model catalogue.
-   **Search and filtering:** Find models using search and available
    filters.
-   **Model details:** View model specifications, capabilities,
    modalities, providers, pricing, and available benchmarks.
-   **Model comparison:** Select up to three models and compare their
    specifications side by side.
-   **Discovery sections:** Dedicated navigation for Models, Compare,
    Rankings, Labs, and Providers.
-   **Responsive interface:** Layout designed for desktop and smaller
    screens.
-   **Light/dark theme support:** Uses the application's theme
    configuration where enabled.

Feature availability depends on the current implementation and the data
available in the connected database.

## Technology Stack

  Area               Technology
  ------------------ --------------------------------------
  Framework          Next.js (App Router)
  Language           TypeScript
  UI                 React
  Styling            Tailwind CSS
  Icons              Lucide React
  Database           PostgreSQL
  ORM                Prisma
  Database hosting   Neon PostgreSQL
  Deployment         Vercel-compatible Next.js deployment

## Getting Started

### Prerequisites

Install the following before running the project:

-   Node.js (LTS recommended)
-   npm
-   Git
-   Access to a PostgreSQL database (the project is configured to use
    Neon PostgreSQL)

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd oneatlas
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the repository URL.

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Add the database connection
string supplied by your PostgreSQL/Neon project:

``` env
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
```

Use the exact environment-variable names required by the Prisma
configuration in this repository. Do not commit `.env` files, database
passwords, API keys, or other secrets to GitHub.

If the repository contains an `.env.example` file, use it as the
reference for all required variables.

### 4. Generate the Prisma client

``` bash
npx prisma generate
```

### 5. Apply database migrations

If the repository includes Prisma migrations and the database is
configured:

``` bash
npx prisma migrate deploy
```

For local development, use the migration workflow documented by the
project. Do not reset or delete a database containing data you need.

### 6. Start the development server

``` bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Available Scripts

  Command           Description
  ----------------- ------------------------------------------------
  `npm run dev`     Starts the local development server
  `npm run build`   Creates a production build
  `npm run start`   Runs the production server
  `npm run lint`    Runs the configured lint command, if available

The scripts available in your checkout are defined in `package.json`. If
a command is not present there, use the script configured by the
repository.

## Main Application Routes

  Route          Purpose
  -------------- -----------------------------
  `/`            Home page
  `/models`      Browse and search AI models
  `/compare`     Compare selected AI models
  `/rankings`    Model rankings section
  `/labs`        AI lab directory
  `/providers`   Provider directory

Some sections may depend on database records or implementation status.

## API Endpoints

The application includes API routes for model discovery and filtering:

  -----------------------------------------------------------------------
  Endpoint                Method                  Purpose
  ----------------------- ----------------------- -----------------------
  `/api/models`           GET                     Returns a model list
                                                  with supported query
                                                  filters and pagination

  `/api/models/[slug]`    GET                     Returns details for a
                                                  model identified by its
                                                  slug

  `/api/filters`          GET                     Returns available
                                                  filter options
  -----------------------------------------------------------------------

Refer to the source code for the exact query parameters and response
schemas.

## Project Structure

The application follows the Next.js App Router structure. Important
areas include:

``` text
src/
├── app/
│   ├── api/
│   │   ├── models/
│   │   └── filters/
│   ├── models/
│   ├── compare/
│   └── page.tsx
├── components/
│   ├── models/
│   ├── compare/
│   └── ui/
├── lib/
│   ├── services/
│   └── db.ts
└── types/
```

The exact structure may contain additional files and folders.

## Model Comparison

The Compare page allows users to select up to three models. The
comparison view presents available information such as:

-   AI lab and model type
-   Release date
-   Context window and maximum output tokens
-   Lowest listed input and output prices per million tokens
-   Providers
-   Capabilities and input/output modalities
-   Benchmark scores when available

Unavailable values are identified in the interface rather than being
presented as confirmed data.

## Database and Data Notes

OneAtlas uses Prisma to access PostgreSQL. The application requires a
reachable database and valid environment configuration for
database-backed pages and API routes.

If the database connection fails:

1.  Confirm that the database project and branch are available.
2.  Check that `DATABASE_URL` points to the correct database.
3.  Verify network access to the database host.
4.  Run `npx prisma generate`.
5.  Check migration status with `npx prisma migrate status`.

Do not publish database credentials or reset the database as a
troubleshooting shortcut.

## Deployment

The application can be deployed to a Next.js-compatible hosting provider
such as Vercel.

1.  Push the project to GitHub.
2.  Import the repository into Vercel.
3.  Configure the required environment variables in the Vercel project
    settings.
4.  Ensure the hosted PostgreSQL database is accessible from the
    deployment.
5.  Configure the build command and install command according to the
    repository.
6.  Deploy and test the main routes.

A successful deployment requires valid database configuration and any
required migrations to be applied.

## Security

-   Keep `.env` and other secret files out of version control.
-   Never publish database URLs containing credentials.
-   Use environment variables for private configuration.
-   Do not expose private API keys in client-side code.

## Future Improvements

Possible future enhancements include:

-   More complete and regularly refreshed model data
-   Additional filtering and sorting options
-   Expanded benchmark coverage and source attribution
-   Shareable comparison links
-   Improved ranking and provider discovery experiences
-   More automated data validation and testing

## Author

**OneAtlas Project**

Built as an AI model discovery and comparison platform.

------------------------------------------------------------------------

*Update this README as the implementation, data sources, and deployment
configuration evolve.*
