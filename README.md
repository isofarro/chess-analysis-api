# fen-analysis

A high-performance, read-only Node.js API for retrieving chess engine analysis results from a local SQLite database.

## Prerequisites

- **Node.js**: v22.12 or higher
- **Yarn**: v4.x
- **Data**: A valid SQLite database at `data/analysis.db` with the `analysis` table and a `fen` column index.

## Setup

1.  **Install Dependencies**

    ```bash
    yarn install
    ```

2.  **Verify Database**
    Ensure your database file is present at `data/analysis.db`.
    _Note: The application runs in immutable/read-only mode for maximum performance._

## Running the Application

### Development

```bash
yarn dev
```

Starts the server with hot-reload enabled.

### Production

```bash
yarn start
```

Starts the server in production mode.

## API Usage

The API exposes a single endpoint to retrieve analysis data for a given FEN string.

### GET `/analysis/:fen`

Retrieves all analysis records for the specified FEN.

- **URL Param**: The FEN string. **Must be URL-encoded** (including slashes).
- **Response**: JSON array of analysis objects.

#### Example

**Request:**

```bash
# FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
curl "http://localhost:3000/analysis/rnbqkbnr%2Fpppppppp%2F8%2F8%2F8%2F8%2FPPPPPPPP%2FRNBQKBNR%20w%20KQkq%20-%200%201"
```

**Response:**

```json
[
  {
    "createdAt": "2025-12-27T17:05:05.489Z",
    "updatedAt": "2025-12-27T17:05:05.489Z",
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
    "engine": "dragon-2",
    "bestMove": "e2e4",
    "depth": 34,
    "score": 65,
    "mate": 0,
    "time": 219805,
    "bestMoves": "e2e4 e7e6 d2d4 d7d5..."
  }
]
```

## Testing

Run the integration test suite:

```bash
yarn vitest run
```
