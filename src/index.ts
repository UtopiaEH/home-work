type Clues = number[];
type Solutions = number[][];

class SkyscraperSolver {
    private ascFactors: Map<string, number> = new Map();
    private descFactors: Map<string, number> = new Map();
    private listOfNumbers: string[] = [];
    private listOfSolutions: string[] = [];

    public solve(clues: Clues): Solutions {
        this.generatePermutations();

        const firstRow = this.filterRows(clues[15], clues[4]);
        const secondRow = this.filterRows(clues[14], clues[5]);
        const thirdRow = this.filterRows(clues[13], clues[6]);
        const fourthRow = this.filterRows(clues[12], clues[7]);

        let numbersFirstRow: string[] = [];
        let numbersSecondRow: string[] = [];
        let numbersThirdRow: string[] = [];

        for (const first of firstRow) {
            numbersFirstRow = this.splitRow(first);

            for (const second of secondRow) {
                if (this.isValidRow(numbersFirstRow, second)) {
                    numbersSecondRow = this.addRow(numbersFirstRow, second);

                    for (const third of thirdRow) {
                        if (this.isValidRow(numbersSecondRow, third)) {
                            numbersThirdRow = this.addRow(numbersSecondRow, third);

                            for (const fourth of fourthRow) {
                                if (this.isValidRow(numbersThirdRow, fourth)) {
                                    if (this.isValidColumn(numbersThirdRow, fourth, clues)) {
                                        this.addSolution(first, second, third, fourth);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return this.convertToGrid();
    }

    private generatePermutations() {
        for (let i = 1233; i <= 4321; i++) {
            const str = i.toString();
            if (str.includes('1') && str.includes('2') && str.includes('3') && str.includes('4')) {
                this.listOfNumbers.push(str);
                this.ascFactors.set(str, this.getAsc(str));
                this.descFactors.set(str, this.getDesc(str));
            }
        }
    }

    private filterRows(ascClue: number, descClue: number): string[] {
        return this.listOfNumbers.filter(
            (num) =>
                (this.ascFactors.get(num) === ascClue || ascClue === 0) &&
                (this.descFactors.get(num) === descClue || descClue === 0)
        );
    }

    private splitRow(row: string): string[] {
        return row.split('');
    }

    private addRow(previousRow: string[], newRow: string): string[] {
        return previousRow.map((num, index) => num + newRow.charAt(index));
    }

    private isValidRow(previousRow: string[], newRow: string): boolean {
        return previousRow.every((num, index) => !num.includes(newRow.charAt(index)));
    }

    private isValidColumn(
        numbersThirdRow: string[],
        fourthRow: string,
        clues: Clues
    ): boolean {
        const fourth = this.splitRow(fourthRow);
        const cols = this.combineColumns(numbersThirdRow, fourth);

        for (let colIndex = 0; colIndex < cols.length; colIndex++) {
            const ascClue = clues[colIndex];
            const descClue = clues[11 - colIndex];
            const column = cols[colIndex];

            if (
                (this.ascFactors.get(column) !== ascClue && ascClue !== 0) ||
                (this.descFactors.get(column) !== descClue && descClue !== 0)
            ) {
                return false;
            }
        }

        return true;
    }

    private combineColumns(
        previousColumns: string[],
        newColumn: string[]
    ): string[] {
        return previousColumns.map((col, index) => col + newColumn[index]);
    }

    private addSolution(first: string, second: string, third: string, fourth: string) {
        this.listOfSolutions.push(first, second, third, fourth);
    }

    private convertToGrid(): Solutions {
        return this.listOfSolutions.map((row) =>
            row.split('').map((num) => parseInt(num))
        );
    }

    private getAsc(str: string): number {
        const digits = str.split('').map(Number);

        if (new Set(digits).size !== digits.length) return 9;

        let counter = 1;
        let max = digits[0];

        for (let i = 1; i < digits.length; i++) {
            if (digits[i] > max) {
                max = digits[i];
                counter++;
            }
        }

        return counter;
    }

    private getDesc(str: string): number {
        const digits = str.split('').map(Number).reverse();

        if (new Set(digits).size !== digits.length) return 9;

        let counter = 1;
        let max = digits[0];

        for (let i = 1; i < digits.length; i++) {
            if (digits[i] > max) {
                max = digits[i];
                counter++;
            }
        }

        return counter;
    }
}

// Example usage
const clues: Clues = [0, 0, 1, 2, 0, 2, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0];
const solver = new SkyscraperSolver();
const solution = solver.solve(clues);
console.log('Solved Puzzle:');
console.table(solution);