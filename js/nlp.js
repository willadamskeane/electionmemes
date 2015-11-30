function getCorpus(candidate, callback) {
	if (!candidate.corpus) {
		RiTa.loadString('candidates/' + candidate.shortName + '/corpus.txt', function (text) {
			candidate.corpus = text;
			candidate.markov = new RiMarkov(3, true, false);
			candidate.markov.sentenceAware();
			candidate.markov.useSmoothing(true);
			candidate.markov.loadText(text);
			callback(candidate.corpus);
		});
	}else {
		callback(candidate.corpus);
	}
}

function generateCaption(candidate, callback) {
	
	getCorpus(candidate, function (corpus) {
		
		var results = candidate.markov.generateSentences(2);
		var text = results[0];
		for (var i = 1; i < results.length; i++) {
			text += ' ' + results[i];
		}
		console.log(text);
		callback('"'+text+'"');
	})
}

function getNextWord(syllables,words,line,goal,lineCount){
	var nextWords = rm.getCompletions(words);
	// console.log(words,'next words',nextWords);

	for (var i=0;i<nextWords.length;i++){
		var newSyllableCount = countSyllables(nextWords[i])+syllables;

		var newWords = words.slice();
		newWords.push(nextWords[i]);
		if (newSyllableCount<goal){
			getNextWord(newSyllableCount,newWords,line+' '+nextWords[i],goal,lineCount);
		}
		if (newSyllableCount==goal){
			console.log('**** found ',newSyllableCount,line+' '+nextWords[i]);
			lineCount++;
			if (goal==5){
				goal=7;
			}else{
				goal=5;
			}
			if (lineCount==3){
				return line+' '+nextWords[i];
			}else{
				getNextWord(0,newWords,line+' '+nextWords[i]+'/',goal,lineCount);
			}
		}
	}
	return false;
}

function generateHaiku(candidate,callback){
	getCorpus(candidate, function (corpus) {
		rm.loadText(corpus);
		var syllables=0;
		var i=0;
		var results = rm.generateTokens(1);
		console.log(results);
		// while (syllables!=18){
		// 	i++;
			
		// 	syllables=countSyllables(results[0]);
		// 	console.log(syllables);
		// }
		
	})
}


function countSyllables(word) {
  word = word.toLowerCase();
  var syllables = RiTa.getSyllables(word);  

  syllables=syllables.split('/');
  return (syllables.length+1);

  if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
  return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}