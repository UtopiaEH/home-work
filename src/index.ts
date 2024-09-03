
/*
* Reffrence: https://www.conceptispuzzles.com/index.aspx?uri=puzzle/skyscrapers/techniques
*
* Online check: https://www.noq.solutions/skyscrapers
*
*  */

type Clues = number[];
type Solutions = number[][];

// Function to get the ascending visibility factor
function getAsc(str: string): number {
    const a = parseInt(str[0]);
    const b = parseInt(str[1]);
    const c = parseInt(str[2]);
    const d = parseInt(str[3]);

    if (a === b || a === c || a === d || b === c || b === d || c === d) return 9;
    if (a < b && b < c && c < d) return 4;
    if (a === 4) return 1;

    let counter = 1;
    let top = a;

    if (b > top) {
        counter++;
        top = b;
    }
    if (c > top) {
        counter++;
        top = c;
    }
    if (d > top) {
        counter++;
    }

    return counter;
}

// Function to get the descending visibility factor
function getDesc(str: string): number {
    const a = parseInt(str[3]);
    const b = parseInt(str[2]);
    const c = parseInt(str[1]);
    const d = parseInt(str[0]);

    if (a === b || a === c || a === d || b === c || b === d || c === d) return 9;
    if (a < b && b < c && c < d) return 4;
    if (a === 4) return 1;

    let counter = 1;
    let top = a;

    if (b > top) {
        counter++;
        top = b;
    }
    if (c > top) {
        counter++;
        top = c;
    }
    if (d > top) {
        counter++;
    }

    return counter;
}

function solveSkyscraper(clues: Clues): Solutions {
    const ascFactors: Map<string, number> = new Map();
    const descFactors: Map<string, number> = new Map();
    const listOfNumbers: string[] = [];
    const listOfSolutions: string[] = [];

    // Generate all permutations of the numbers 1, 2, 3, 4
    for (let i = 1233; i <= 4322; i++) {
        const str = i.toString();
        if (str.includes('1') && str.includes('2') && str.includes('3') && str.includes('4')) {
            listOfNumbers.push(str);
            ascFactors.set(str, getAsc(str));
            descFactors.set(str, getDesc(str));
        }
    }

    // Find possible rows based on the given clues
    const possibleRows: string[][] = Array(4).fill([]).map(() => []);

    for (const number of listOfNumbers) {
        if ((ascFactors.get(number) === clues[15] || clues[15] === 0) &&
            (descFactors.get(number) === clues[4] || clues[4] === 0)) {
            possibleRows[0].push(number);
        }
        if ((ascFactors.get(number) === clues[14] || clues[14] === 0) &&
            (descFactors.get(number) === clues[5] || clues[5] === 0)) {
            possibleRows[1].push(number);
        }
        if ((ascFactors.get(number) === clues[13] || clues[13] === 0) &&
            (descFactors.get(number) === clues[6] || clues[6] === 0)) {
            possibleRows[2].push(number);
        }
        if ((ascFactors.get(number) === clues[12] || clues[12] === 0) &&
            (descFactors.get(number) === clues[7] || clues[7] === 0)) {
            possibleRows[3].push(number);
        }
    }

    // Variables to store used digits (to avoid repetitions)
    const numbersFirstRow: string[] = Array(4);
    const numbersSecondRow: string[] = Array(4);
    const numbersThirdRow: string[] = Array(4);

    // Begin searching for a valid solution
    for (const firstRow of possibleRows[0]) {
        numbersFirstRow[0] = firstRow[0];
        numbersFirstRow[1] = firstRow[1];
        numbersFirstRow[2] = firstRow[2];
        numbersFirstRow[3] = firstRow[3];

        for (const secondRow of possibleRows[1]) {
            if (numbersFirstRow.every((num, index) => !num.includes(secondRow[index]))) {
                numbersSecondRow[0] = numbersFirstRow[0] + secondRow[0];
                numbersSecondRow[1] = numbersFirstRow[1] + secondRow[1];
                numbersSecondRow[2] = numbersFirstRow[2] + secondRow[2];
                numbersSecondRow[3] = numbersFirstRow[3] + secondRow[3];

                for (const thirdRow of possibleRows[2]) {
                    if (numbersSecondRow.every((num, index) => !num.includes(thirdRow[index]))) {
                        numbersThirdRow[0] = numbersSecondRow[0] + thirdRow[0];
                        numbersThirdRow[1] = numbersSecondRow[1] + thirdRow[1];
                        numbersThirdRow[2] = numbersSecondRow[2] + thirdRow[2];
                        numbersThirdRow[3] = numbersSecondRow[3] + thirdRow[3];

                        for (const fourthRow of possibleRows[3]) {
                            if (numbersThirdRow.every((num, index) => !num.includes(fourthRow[index]))) {
                                let isVerticallyOk = true;

                                for (let col = 0; col < 4; col++) {
                                    const colStr = `${firstRow[col]}${secondRow[col]}${thirdRow[col]}${fourthRow[col]}`;
                                    const topClue = clues[col];
                                    const bottomClue = clues[11 - col];
                                    if ((ascFactors.get(colStr) === topClue || topClue === 0) &&
                                        (descFactors.get(colStr) === bottomClue || bottomClue === 0)) {
                                        isVerticallyOk = isVerticallyOk && true;
                                    } else {
                                        isVerticallyOk = false;
                                    }
                                }

                                if (isVerticallyOk) {
                                    listOfSolutions.push(firstRow);
                                    listOfSolutions.push(secondRow);
                                    listOfSolutions.push(thirdRow);
                                    listOfSolutions.push(fourthRow);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Convert the solution to the matrix form
    const solutions: Solutions = Array(4).fill([]).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            solutions[i][j] = parseInt(listOfSolutions[i][j]);
        }
    }

    return solutions;
}

// Example usage
const clues: Clues = [0, 0, 1, 2, 0, 2, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0];
const solution = solveSkyscraper(clues);
console.table(solution);