class Graph {
    adj: Map<string, string[]> = new Map();
    wordLists: string[] = [];

    constructor(words: string[] = []) {
        this.wordLists = words
    }

    private isWord(word: string): boolean {
        return this.wordLists.includes(word);
    }

    addEdge(v: string, w: string): void {
        if (!this.adj.has(v)) this.adj.set(v, []);
        if (!this.adj.has(w)) this.adj.set(w, []);
        this.adj.get(v)!.push(w);
        this.adj.get(w)!.push(v);
    }

    private deepFirstSearch(
        startNode: string,
        validWords: Set<string>
    ): void {
        const stack: [string, string, Set<string>][] = [[startNode, '', new Set<string>()]];

        while (stack.length > 0) {
            const [currentNode, currentWord, visitedEdges] = stack.pop()!;
            const newWord = currentWord + currentNode;

            if (this.isWord(newWord)) {
                validWords.add(newWord);
            }

            for (const neighbor of this.adj.get(currentNode) || []) {
                const edge = `${currentNode}-${neighbor}`;

                if (!visitedEdges.has(edge)) {
                    const newVisitedEdges = new Set(visitedEdges);
                    newVisitedEdges.add(edge);
                    stack.push([neighbor, newWord, newVisitedEdges]);
                }
            }
        }
    }

    findAllWords(): string[] {
        const validWords = new Set<string>();

        for (const node of this.adj.keys()) {
            this.deepFirstSearch(node, validWords);
        }

        return Array.from(validWords).sort();
    }
}


const wordLists = ["pop", "rom", "corn", "popcorn", "rock", "mock", "ok", 'cork', 'porc'];

// Create the graph
let graph = new Graph(wordLists);
graph.addEdge('p', 'o');
graph.addEdge('p', 'p');
graph.addEdge('o', 'n');
graph.addEdge('n', 'r');
graph.addEdge('r', 'o');
graph.addEdge('o', 'm');
graph.addEdge('o', 'c');
graph.addEdge('o', 'k');
graph.addEdge('p', 'c');
graph.addEdge('c', 'k');
graph.addEdge('m', 'o');

const validWords = graph.findAllWords();
console.log(validWords);