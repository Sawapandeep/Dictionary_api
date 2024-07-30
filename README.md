# Dictionary API Server

This project is a simple dictionary API server built with Node.js and Express. It reads word data from a CSV file and provides endpoints to fetch random words and their meanings. Once a word ID has been used in a response, it won't be used again in future responses.

## Features

- **Random Word Fetching:** Retrieve a single random word and its meaning.
- **Batch Word Fetching:** Retrieve 30 random words and their meanings.
- **Word Lookup:** Post a word to get its meaning if it exists in the dictionary.
- **Non-repetitive Responses:** Ensures word IDs are not reused in subsequent responses.

## Endpoints

- `GET /random`: Get a single random word and its meaning.
- `GET /random-30`: Get 30 random words and their meanings.
- `POST /post`: Post a word to get its meaning.

## Usage

1. Place your `data.csv` file in the project directory.
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the server:
    ```sh
    node server.js
    ```
4. Access the API at `http://localhost:3000`.

## CSV Format

The `data.csv` file should have the following format:
```
word,pos,def
A,, "The first letter of the English and many other alphabets..."
B,, "The second letter of the English alphabet..."
...
```

## Dependencies

- express
- body-parser
- csv-parser
- fs

## License

This project is licensed under the MIT License.
