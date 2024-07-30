const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(bodyParser.json());

let words = [];

// Function to load words from SQL file using regex
const loadWordsFromSQL = () => {
  const sqlData = fs.readFileSync("data.sql", "utf8");
  const valuesRegex = /\((\d+), '([^']+)', '([^']+)', '([^']+)'\)/g;
  let match;

  while ((match = valuesRegex.exec(sqlData)) !== null) {
    words.push({
      word_id: parseInt(match[1], 10),
      letter: match[2],
      word: match[3].replace(/\\n/g, "\n"),
      meaning: match[4].replace(/\\n/g, "\n"),
    });
  }
};

// Load words when server starts
loadWordsFromSQL();

// Function to get a random integer between 0 and max (exclusive)
const getRandomInt = (max) => Math.floor(Math.random() * max);

// Endpoint to get 30 random words with meanings
app.get("/random-30", (req, res) => {
  const randomWords = [];
  const wordsCopy = [...words];
  for (let i = 0; i < 30 && wordsCopy.length > 0; i++) {
    const index = getRandomInt(wordsCopy.length);
    randomWords.push(wordsCopy.splice(index, 1)[0]);
  }
  res.json(randomWords);
});

// Endpoint to get a single random word with meaning
app.get("/random", (req, res) => {
  const index = getRandomInt(words.length);
  res.json(words[index]);
});

// Endpoint to post a word and return its meaning if it exists
app.post("/post", (req, res) => {
  const { word } = req.body;
  const foundWord = words.find(
    (w) => w.word.toLowerCase() === word.toLowerCase(),
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
