function getCorpus(candidate, callback) {
  if (!candidate.corpus) {
    RiTa.loadString(
      "candidates/" + candidate.shortName + "/corpus.txt",
      function(text) {
        candidate.corpus = text;
        candidate.markov = new RiMarkov(3, true, false);
        candidate.markov.useSmoothing(true);
        candidate.markov.loadText(text);
        callback(candidate.corpus);
      }
    );
  } else {
    callback(candidate.corpus);
  }
}

function generateCaption(candidate, prefix, callback, attempts = 0) {
  if (attempts == 4) {
    return;
  }
  fetch(
    "https://api.everyquotecounts.com/?length=100&prefix=" + encodeURI(prefix)
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      var sentences = RiTa.splitSentences(data.text);
      var caption = "";
      for (var i = 0; caption.length < 120 && i < sentences.length; i++) {
        caption += sentences[i] + " ";
      }
      callback(caption);
    })
    .catch(err => {
      generateCaption(candidate, prefix, callback, attempts + 1);
    });
}

function getNextWord(candidate, syllables, words, line, goal, lineCount) {
  var nextWords = candidate.markov.getCompletions(words);
  // console.log(words,'next words',nextWords);
  var newSyllableCount = countSyllables(nextWords[i]) + syllables;

  if (newSyllableCount == goal) {
    lineCount++;
    if (goal == 5) {
      goal = 7;
    } else {
      goal = 5;
    }
  }

  for (var i = 0; i < nextWords.length; i++) {
    var newSyllableCount = countSyllables(nextWords[i]) + syllables;
    var newWords = words.slice();
    newWords.push(nextWords[i]);
    if (newSyllableCount < goal) {
      return getNextWord(
        candidate,
        newSyllableCount,
        newWords,
        line + " " + nextWords[i],
        goal,
        lineCount
      );
    }
    if (newSyllableCount == goal) {
      console.log("**** found ", newSyllableCount, line + " " + nextWords[i]);
      if (lineCount == 2) {
        return line + " " + nextWords[i];
      } else {
        getNextWord(
          candidate,
          syllables,
          newWords,
          line + " " + nextWords[i] + "/",
          goal,
          lineCount
        );
      }
    }
  }
}

function generateHaiku(candidate, callback) {
  getCorpus(candidate, function(corpus) {
    rm.loadText(corpus);
    var syllables = 0;
    var i = 0;
    var results = rm.generateTokens(1);
    console.log(results);
    // while (syllables!=18){
    // 	i++;

    // 	syllables=countSyllables(results[0]);
    // 	console.log(syllables);
    // }
  });
}

function countSyllables(word) {
  word = word.toLowerCase();

  if (word.length <= 3) {
    return 1;
  } //return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ""); //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, ""); //word.sub!(/^y/, '')
  return word.match(/[aeiouy]{1,2}/g).length; //word.scan(/[aeiouy]{1,2}/).size
}
