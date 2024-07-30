const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

let words = [];
let usedWordIds = new Set();

// Function to load words from CSV file
const loadWordsFromCSV = () => {
  const results = [];
  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      words = results.map((row, index) => ({
        word_id: index + 1,
        letter: row.word,
        word: row.word,
        meaning: row.def,
      }));
    });
};

// Load words when server starts
loadWordsFromCSV();

// Function to get a random integer between 0 and max (exclusive)
const getRandomInt = (max) => Math.floor(Math.random() * max);

// Function to get a random word that hasn't been used
const getRandomWord = () => {
  const availableWords = words.filter((word) => !usedWordIds.has(word.word_id));
  if (availableWords.length === 0) return null;
  const randomIndex = getRandomInt(availableWords.length);
  const randomWord = availableWords[randomIndex];
  usedWordIds.add(randomWord.word_id);
  return randomWord;
};

// Endpoint to get 30 random words with meanings
app.get("/random-30", (req, res) => {
  const randomWords = [];
  for (let i = 0; i < 30; i++) {
    const randomWord = getRandomWord();
    if (!randomWord) break;
    randomWords.push(randomWord);
  }
  res.json(randomWords);
});

// Endpoint to get a single random word with meaning
app.get("/random", (req, res) => {
  const randomWord = getRandomWord();
  if (!randomWord) {
    return res.status(404).json({ message: "No more words available" });
  }
  res.json(randomWord);
});

// Endpoint to post a word and return its meaning if it exists
app.post("/post", (req, res) => {
  const { word } = req.body;
  const foundWord = words.find(
    (w) => w.word.toLowerCase() === word.toLowerCase()
  );
  if (foundWord) {
    res.json(foundWord);
  } else {
    res.status(404).json({ message: "Word not found" });
  }
});

app.listen(port, () => {
  console.log(`Dictionary API listening at http://localhost:${port}`);
});
