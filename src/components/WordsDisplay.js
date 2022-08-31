function WordsDisplay({ words }) {

    return (
        <div>
            {words.map((word) => (
                <div className="word">{word}</div>
            ))}
        </div>
    )
}

export default WordsDisplay;