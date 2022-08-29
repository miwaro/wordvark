import { useState, useEffect, useRef } from 'react';
import randomWords from 'random-words';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Timer from './components/Timer';
import WordStats from './components/WordStats';
import LoadingSpinner from "./components/DelayedSpinner";
import aardvark from './assets/img/AARD.png';
import './App.css';

function App() {
  const [leftInput, setLeftInput] = useState("")
  const [rightInput, setRightInput] = useState("")
  const [joinedWords, setJoinedWords] = useState([])
  const [testWord, setTestWord] = useState("")
  const [rightInputExists, setRightInputExists] = useState(false);
  const [score, setScore] = useState(0)
  const [addedScore, setAddedScore] = useState(null)
  const [showScore, setShowScore] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [strikes, setStrikes] = useState([])
  const [rejectedWords, setRejectedWords] = useState([])
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameIsOver, setGameIsOver] = useState(null);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState([]);
  const [isAlreadyUsed, setIsAlreadyUsed] = useState(false);
  const [noStrikeBonusMessage, setNoStrikeBonusMessage] = useState("");
  const [inputClass, setInputClass] = useState("");

  // const [flexDirection, setFlexDirection] = useState("column");
  const inputRef = useRef(null);

  useEffect(() => {
    const hiScore = localStorage.getItem('HI-SCORE')
    setFinalScore(hiScore)
  }, [finalScore])

  useEffect(() => {
    if (score > 0) {
      setShowScore(true)
    }
    setTimeout(() => {
      setShowScore(false)
    }, 1800)
  }, [score])

  const getRandomWord = (e) => {
    setRightInput("");
    setStreak(0)
    setEditing(true);
    let word = randomWords();
    while (word.length <= 1) {
      word = randomWords();
    }
    let firstTwo = word.slice(0, 2);
    setLeftInput(firstTwo);
    // setLeftInput(word);
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // setIsAlreadyUsed(false);
    if (!leftInput || testWord === "") return;
    setIsLoading(true);
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${testWord}/`;
    axios.get(url)
      .then(response => {

        if (response.data[0].word === testWord) {
          setJoinedWords(prev => [...prev, testWord])
          setLeftInput(testWord)
          setStreak(prev => prev + 1)
        }
        setIsLoading(false)
      }).catch((err) => {
        // Easter Egg
        if (testWord === "wordvark") {
          setJoinedWords(prev => [...prev, testWord])
          getRandomWord();
          setStreak(prev => prev + 5)
        } else {
          if (!testWord) return;
          setRejectedWords(prev => [...prev, testWord]);
          getRandomWord();
          setStreak(0)
          setJoinedWords(prev => [...prev])
          setStrikes(prev => [...prev, '❌'])
        }
        setIsLoading(false)

      });

  }, [testWord])

  useEffect(() => {
    if (gameIsOver && strikes.length === 0) {
      setNoStrikeBonusMessage("No-Strike Bonus!")
      setScore(prev => prev + 3)
      setAddedScore(3)
    }
  }, [gameIsOver])

  useEffect(() => {

    setLongestStreak(prev => [...prev, streak])
    if (joinedWords.length === 0 || streak === 0) return;
    let power = streak - 1
    let newScore = Math.pow(2, power);
    setAddedScore(newScore);
    setScore(prev => prev + newScore)
  }, [joinedWords])

  const handleChangeRightInput = (e) => {
    e.preventDefault();
    let joinedWord = `${leftInput}${e.target.value}`;
    const newRepeats = [];

    if (joinedWords.length > 0) {
      joinedWords.forEach(word => {
        if (joinedWord === word) {
          newRepeats.push(word)
        }
      })
    }

    if (joinedWords.includes(newRepeats[0])) {
      setIsAlreadyUsed(true)
    } else {
      setIsAlreadyUsed(false)

    }

    console.log('newRepeats', newRepeats)

    setRightInput(e.target.value)
    setRightInputExists(true)
  }

  const onKeyPress = (e) => {
    console.log('all ready used', isAlreadyUsed)

    if (isAlreadyUsed) {
      setInputClass("shake")
    } else setInputClass("");
    if (gameIsOver || gameIsOver === null || isAlreadyUsed) return;
    if (e.which === 13 && rightInput === "") {
      getRandomWord()
      setStreak(0)
    }
  }

  const resetGame = () => {
    setLeftInput("")
    setRightInput("")
    setGameIsOver(false)
    setRejectedWords([])
    setStrikes([])
    setScore(0)
    setJoinedWords([])
    setLongestStreak([]);
    setNoStrikeBonusMessage("")
  }

  useEffect(() => {
    if (strikes.length === 3) {
      setGameIsOver(true)
    }
  }, [strikes])

  const handleJoinWord = (e) => {
    e.preventDefault();
    setEditing(true);
    if (gameIsOver === null || isLoading || gameIsOver === true || isAlreadyUsed) return;

    if (e.key === 'Enter' && rightInput === "") {
      getRandomWord();
    }
    setTestWord("");
    if (rightInput === "" || leftInput === "") return;
    let joinedWord = `${leftInput}${rightInput}`;

    setTestWord(joinedWord.toLowerCase())
    setRightInput("")
    setRightInputExists(false)

  }

  const rightInputClasses = isAlreadyUsed ? `error-input ${inputClass}` : "right-input"

  return (
    <div className="App">
      <header className="App-header">
        <span>W<img style={{ transform: 'translate(0, 5px' }} src={aardvark} height="44" width="44" alt="aardvark" />RDVARK</span>
      </header>
      <div className='hi-score'>HI-SCORE: <span style={{ color: 'white', paddingLeft: '10px' }}> {finalScore}</span></div>

      <div className='content-container'>

        <Timer
          getRandomWord={getRandomWord}
          resetGame={resetGame}
          gameIsOver={gameIsOver}
          score={score}
          setFinalScore={setFinalScore}
          showScore={showScore}
          setGameIsOver={setGameIsOver}
          setLeftInput={setLeftInput}
          setRightInput={setRightInput}
        />
        <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onSubmit={handleJoinWord}>

          <input
            className="left-input"
            placeholder="Press Start to Begin"
            type="text"
            readOnly
            value={leftInput}
          />
          {
            showScore && !isLoading ?
              <span style={{ position: 'absolute' }} className="added-score">+{addedScore}</span> : <span style={{ visibility: 'hidden' }}></span>
          }
          <button
            className="hidden-btn"
            type="submit"
            disabled={!rightInputExists || isLoading}>
            Join
          </button>
          {strikes.length === 3 || gameIsOver ?
            <input
              className="right-input"
              placeholder="Press Enter to Submit or Skip"
              value={rightInput}
              readOnly
            /> :
            <input
              className={rightInputClasses}
              placeholder="Press Enter to Submit or Skip"
              ref={inputRef} type="text"
              value={rightInput}
              onChange={handleChangeRightInput}
              onKeyPress={onKeyPress}
            />
          }
          <div style={{ position: 'absolute' }}>
            {isLoading ? <LoadingSpinner /> : <div style={{ visibility: 'hidden' }}>Hi</div>}
          </div>
          <button className="hidden-btn" onClick={getRandomWord}>Next</button>
        </form>
        {gameIsOver && showScore &&
          <span className='added-score'>{noStrikeBonusMessage}</span>
        }
        <div className='score'>SCORE: <span style={{ color: 'white' }}>{score}</span></div>
        {gameIsOver &&
          <WordStats joinedWords={joinedWords} longestStreak={longestStreak} strikes={strikes} gameIsOver={gameIsOver} />

        }
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {gameIsOver && joinedWords.length > 0 &&
            <div className='word-container'>

              <div className="word" style={{ fontWeight: 'bold' }}>Words:</div>
              {
                joinedWords.map((words) => (
                  <div className="word" key={uuidv4()}>{words}, </div>
                ))
              }
            </div>
          }
        </div>
        <div className='strike-container'>
          {
            strikes.map((strike) => (
              <div className="strike" key={uuidv4()}>{strike}</div>
            ))
          }
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {
            rejectedWords.map((word) => (
              <div className="rejected-word" key={uuidv4()}>{word}</div>
            ))
          }
        </div>

      </div>
    </div >
  );
}

export default App;
