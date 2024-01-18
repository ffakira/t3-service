/**
 * @dev The core logic for checking available moves and etc...
 */

export function checkWin(board: Array<boolean | null | undefined>) {
    const winArr: Array<[number, number, number]> = [
        // Rows
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
  
        // Columns
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
  
        // Diagonals
        [0, 4, 8], [6, 4, 2]
    ];

    for (const [a, b, c] of winArr) {
        if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
            return { player: board[a], board: [a, b, c] };
        }
    }

    // No win
    return null;
}
