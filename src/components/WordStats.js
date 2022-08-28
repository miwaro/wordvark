function WordStats({ joinedWords, longestStreak, strikes }) {
    const totalWords = joinedWords.length;


    const streakCount = Math.max(...longestStreak);
    const streakCountMinusOne = Math.max(...longestStreak) - 1;
    console.log('streak', streakCount)
    const points = streakCountMinusOne === 0 ? 1 : Math.pow(2, streakCountMinusOne);

    const longestWord = joinedWords.reduce(
        function (a, b) {
            return a.length > b.length ? a : b;
        }, "NA"
    );

    const gotNoStrikeBonus = strikes.length === 0 ? "Yep (3 points)" : "Nope"

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
            <table>
                <tbody>
                    <tr>
                        <th>Total Words</th>
                        <th>Longest Streak</th>
                        <th>Longest Word</th>
                        <th>No-Strike Bonus</th>
                    </tr>
                    <tr>
                        <td>{totalWords}</td>
                        <td>{streakCount} ({points}points)</td>
                        <td>{longestWord}</td>
                        <td>{gotNoStrikeBonus}</td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}

export default WordStats;