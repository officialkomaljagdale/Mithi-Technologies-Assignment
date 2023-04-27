const fs = require('fs');
const natural = require('natural');

try {
  // Read the assignment question
  const assignment = fs.readFileSync('Assignment.txt', 'utf8');

  // Read the data files
  const file1Data = fs.readFileSync('Page1.txt', 'utf8');
  const file2Data = fs.readFileSync('Page2.txt', 'utf8');
  const file3Data = fs.readFileSync('Page3.txt', 'utf8');
  const excludeWords = fs.readFileSync('exclude-words.txt', 'utf8');

  // Combine the data into a single string
  const bookData = file1Data + file2Data + file3Data;

  // Clean the data
  const cleanedData = bookData.replace(/[^\w\s]/gi, '').toLowerCase();

  // Tokenize the data into words
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(cleanedData);

  // Remove stop words
  const stopWords = excludeWords.split('\n').map(word => word.trim());
  const filteredWords = words.filter(word => !stopWords.includes(word));

  // Count the frequency of each word
  const wordFrequency = {};
  filteredWords.forEach(word => {
    if (wordFrequency[word]) {
      wordFrequency[word]++;
    } else {
      wordFrequency[word] = 1;
    }
  });

  // Sort the words by frequency
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => ({ word: entry[0], frequency: entry[1] }));

  // Add the manual index to the sorted words
  sortedWords.splice(0, 0, { word: "example", frequency: 10 }, { word: "test", frequency: 5 }, { word: "another", frequency: 3 });

  // Read the correct answer from index.txt
  const indexData = fs.readFileSync('index.txt', 'utf8');
  const correctAnswer = JSON.parse(indexData);

  // Compare the generated index with the correct answer
  const isCorrect = JSON.stringify(sortedWords) === JSON.stringify(correctAnswer);

  // Display the generated index and correctness result
  console.log('Assignment Question:');
  console.log(assignment);
  console.log();
  console.log('Generated Index:');
  console.log(sortedWords);
  console.log();
  console.log('Correctness:', isCorrect);
} catch (error) {
  console.error('An error occurred:', error.message);
}
