import React, { useState, useEffect, useRef } from 'react'
import '../App.css'

const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
}

const INITIAL_COUNT = 8

export default function CountdownApp({
    getRandomWord,
    resetGame,
    gameIsOver,
    setGameIsOver,
    score,
    setFinalScore,
    showScore,
    setLeftInput,
    setRightInput
}) {
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT)
    const [status, setStatus] = useState(STATUS.STOPPED)
    const [running, setRunning] = useState(false);
    const secondsToDisplay = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
    const minutesToDisplay = minutesRemaining % 60

    const handleStart = () => {
        handleReset();
        setRunning(true)
        getRandomWord();
        setStatus(STATUS.STARTED)
    }
    const handleStop = () => {
        setStatus(STATUS.STOPPED)
        setRunning(false)
    }
    const handleReset = () => {
        setRunning(false)
        resetGame();
        setStatus(STATUS.STOPPED)
        setSecondsRemaining(INITIAL_COUNT)
    }

    useEffect(() => {
        if (secondsRemaining === 0) {
            setFinalScore(score);
            const hiScore = localStorage.getItem('HI-SCORE')
            if (score > hiScore) {
                // setTimeout(() => {
                //     alert("Congratulations on your new high score!")
                // }, 1000)
                localStorage.setItem('HI-SCORE', JSON.stringify(score));
            }
        }
    }, [secondsRemaining, score])

    useEffect(() => {
        if (secondsRemaining === 0) {
            setGameIsOver(true)
        }
    }, [gameIsOver])

    useEffect(() => {
        if (gameIsOver) return;
        if (score > 0) {
            setSecondsRemaining(secondsRemaining + 1)
        }
    }, [score])

    useInterval(
        () => {
            if (gameIsOver) {
                setSecondsRemaining(0)
                setLeftInput("")
                setRightInput("")
                return setStatus(STATUS.STOPPED)
            }
            if (secondsRemaining === 0) {
                setLeftInput("")
                setRightInput("")
                setGameIsOver(true)
                setSecondsRemaining(0)
            }
            if (secondsRemaining > 0) {
                setSecondsRemaining(secondsRemaining - 1)
            } else {
                setStatus(STATUS.STOPPED)
            }
        },
        status === STATUS.STARTED ? 1000 : null,
        // passing null stops the interval
    )


    const color = secondsRemaining <= 5 && secondsRemaining > 0 ? "red" : "white"
    return (
        <div className="timer-container">
            <div className='timer-btn-container'>
                <button className="start-btn" onClick={handleStart} type="button" >
                    Start
                </button>
                {/* <button onClick={handleReset} type="button">
                    Reset
                </button> */}
            </div>

            <span style={{ position: 'relative', padding: 20, color: color, fontSize: '30px' }}>
                {twoDigits(minutesToDisplay)}:
                {twoDigits(secondsToDisplay)}
                <span>
                    {
                        showScore && !gameIsOver &&
                        <span className="plus-one">+1</span>
                    }
                </span>
            </span>
        </div>
    )
}

function useInterval(callback, delay) {
    const savedCallback = useRef()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

const twoDigits = (num) => String(num).padStart(2, '0')