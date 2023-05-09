import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// inrerface for the prop
interface guessingBarMessage {
  correctLetter: string[],
  trueString: string,
  id: number
}

// interface for parsing the wrong letters
interface incorrectBarMessage{
  wrongLetters: string[]
  id: number
}

// helper function to make sure user entered a letter
const isLetter = (s: string) => {
  return s.length === 1 && s.match(/[a-z]/i);
}

//header
const Header = () => {
  return(
    <>
      <h1>Hangman</h1>
      <p>Find the hidden word, enter a letter</p>
    </>
  )
}

const Figure = () => {
  // figure svg
  return(
    <div>
      <svg height="250" width="200" className="figure-container">
        <line x1="60" y1="20" x2="140" y2="20" />
        <line x1="140" y1="20" x2="140" y2="50" />
        <line x1="60" y1="20" x2="60" y2="230" />
        <line x1="20" y1="230" x2="100" y2="230" />

        <circle cx="140" cy="70" r="20" className="figure-part" />
        <line x1="140" y1="90" x2="140" y2="150" className="figure-part" />
        <line x1="140" y1="120" x2="120" y2="100" className="figure-part" />
        <line x1="140" y1="120" x2="160" y2="100" className="figure-part" />

        <line x1="140" y1="150" x2="120" y2="180" className="figure-part" />
        <line x1="140" y1="150" x2="160" y2="180" className="figure-part" />
      </svg>
    </div>
  )

}

const IncorrectPopup:FC<incorrectBarMessage> = (props) => {
  let wrongLetters = props.wrongLetters
  // insert comma in between each wrong letters
  wrongLetters = Array.from(wrongLetters.join(","))
  return(
    <div className="popup-container" id="popup-container">
      <div>
        {wrongLetters.length > 0 && <p>Wrong</p>}
        {wrongLetters.map((letter, i) => (<span key={i}>{letter}</span>))}
      </div>
    </div>
  )
}

// handles the rule of the game, whether the word is
const GuessingBar:FC<guessingBarMessage> = (props) => {
  // will need to be replace by an api calling for word
  const word: string = props.trueString
  const correctLetter: string[] = props.correctLetter
  // in exchange with the _, inputting the correct word
  const checkWord = () => {
    // array of singleWords with use state
    let displayedWord = word.split("")
    // replace _ with the letter if the letter is within the word
    let formattedWord = displayedWord.map((letter, i) =>{
      return(
        <span className='letter' key={i}>
          {correctLetter.includes(letter) ? letter : " "}
        </span>
      )
    })
    console.log(formattedWord)
    return formattedWord
  }
  return(
    // could be entered with singlWord types
    <>
      <div className='bar'>{checkWord()}</div>
    </>
    // make enterable 
  )
}

// handles all the user interactions
function App() {
  // id for the user's 
  const guessId: number = 1 
  // target word calling the random api
  const [targetWord, setTargetWord] = useState("sample")
  // state for starting the game
  const [playable, setPlayable] = useState(true)
  // state for correct letters as of right now
  const [correctLetters, setCorrectLetters] = useState(Array<string>)
  // state for wrong letters as of right now
  const [wrongLetters, setWrongLetters] = useState(Array<string>)
  // calling the api to get the random word once
  useEffect(()=>{
    axios.get('https://random-word-api.herokuapp.com/word')
    .then(response => {
      setTargetWord(response.data[0])
    })
  }, [])
  // for responding to key click down
  useEffect(()=>{
    const handleKeyDown = (event: any) => {
      const {key, keycode} = event
      const letter: string = key.toLowerCase()
      // make sure the key is a letter
      if(playable && isLetter(letter)){
        console.log(key)
        // check if the current corect letters contain the pressed letter
        if(targetWord.includes(letter)){
          if(!correctLetters.includes(letter)){
            setCorrectLetters(currentLetters => [...currentLetters, letter])
          } else{
            // showNotification()
          }
        }
        // wrong letters case
        else{
          if(!wrongLetters.includes(letter)){
            setWrongLetters(currentLetters => [...currentLetters, letter])
          }else{
            // showNotification()
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    //make sure only one event listeners runs each time
    return() => window.removeEventListener('keydown',handleKeyDown);
  }, [correctLetters, wrongLetters, playable])

  return (
    <>
      <Header />
      <div className='game-container'>
        <div className='upper-container'>
          <Figure />
          <IncorrectPopup wrongLetters={wrongLetters} id={1}/>
        </div>
        <GuessingBar correctLetter={correctLetters} trueString={targetWord} id={1}/>
      </div>
    </>
  )
}

export default App
