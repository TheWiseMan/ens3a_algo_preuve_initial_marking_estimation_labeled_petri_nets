// TypeScript implementation of Algorithm 1 from the document

type Marking = number[]; // Represents a marking vector (e.g., [1, 0, 0, 0])
type FiringVector = number[]; // Represents a firing vector (e.g., [1, 1, 0, 0])

type GraphNode = {
    y: FiringVector; // Firing vector
    M0_initial: Marking[]; // Set of minimal initial marking estimates
};

type NetStructure = {
    B: number[][]; // Incident matrix (output-input matrix)
    BMinus: number[][]; // Input matrix
    L: (t: number) => string; // Labeling function
    T: number[]; // Set of transitions
};

function algorithm1(net: NetStructure, observedLabels: string[]): Marking[] {
    const { B, BMinus, L, T } = net;
    const k = observedLabels.length;

    // Step 1: Initialize the data structure C(0)
    let C: GraphNode[][] = [];
    C[0] = [{ y: Array(T.length).fill(0), M0_initial: [Array(B.length).fill(0)] }];

    // Steps 2-7: Iteratively compute for each label in the observed sequence
    for (let j = 1; j <= k; j++) {
        const currentLabel = observedLabels[j - 1];
        C[j] = [];

        for (const R of C[j - 1]) {
            for (const t of T) {
                if (L(t) === currentLabel) {
                    for (const M0 of R.M0_initial) {
                        // Compute M'0 and y'
                        const MPrime0 = elementWiseMax(
                            elementWiseAdd(M0, matrixVectorMultiply(B, R.y)),
                            columnVector(BMinus, t)
                        ).map((value, idx) => value - matrixVectorMultiply(B, R.y)[idx]);

                        const yPrime = R.y.slice();
                        yPrime[t]++;

                        // Check if y' already exists in C(j)
                        let existingNode = C[j].find((node) => arraysEqual(node.y, yPrime));

                        if (!existingNode) {
                            // Create a new node
                            C[j].push({ y: yPrime, M0_initial: [MPrime0] });
                        } else {
                            // Update the existing node
                            let flag = true;
                            for (let i = 0; i < existingNode.M0_initial.length; i++) {
                                const M0_existing = existingNode.M0_initial[i];
                                if (isLessThanOrEqual(M0_existing, MPrime0)) {
                                    flag = false;
                                    break;
                                } else if (isLessThanOrEqual(MPrime0, M0_existing)) {
                                    existingNode.M0_initial.splice(i, 1);
                                    i--;
                                }
                            }

                            if (flag) {
                                existingNode.M0_initial.push(MPrime0);
                            }
                        }
                    }
                }
            }
        }
    }

    // Step 8: Find the minimum initial marking(s)
    const finalNodes = C[k];
    let minimumMarkings: Marking[] = [];
    let minTokenCount = Infinity;
    for (const node of finalNodes) {
        for (const M0 of node.M0_initial) {
            const tokenCount = M0.reduce((sum, tokens) => sum + tokens, 0);

            if (tokenCount < minTokenCount) {
                minTokenCount = tokenCount;
                minimumMarkings = [M0];
            } else if (tokenCount === minTokenCount) {
                minimumMarkings.push(M0);
            }
        }
    }

    return minimumMarkings;
}

// Helper functions
function elementWiseAdd(a: number[], b: number[]): number[] {
    return a.map((value, idx) => value + b[idx]);
}

function elementWiseMax(a: number[], b: number[]): number[] {
    return a.map((value, idx) => Math.max(value, b[idx]));
}

function matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map((row) => row.reduce((sum, value, idx) => sum + value * vector[idx], 0));
}

function columnVector(matrix: number[][], columnIndex: number): number[] {
    return matrix.map((row) => row[columnIndex]);
}

function arraysEqual(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((value, idx) => value === b[idx]);
}

function isLessThanOrEqual(a: number[], b: number[]): boolean {
    return a.every((value, idx) => value <= b[idx]);
}

// Example test case
const net: NetStructure = {
    B: [
        [1, -1, 0, 0],
        [0, 1, -1, 0],
        [0, 0, 1, -1],
        [-1, 0, 0, 1],
    ],
    BMinus: [
        [1, 0, 0, 1],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
    ],
    L: (t) => ["a", "b", "c", "d"][t],
    T: [0, 1, 2, 3],
};

const observedLabels = ["a", "b", "c", "d"];
const result = algorithm1(net, observedLabels);
console.log("Minimum initial markings:", result);


export { NetStructure, algorithm1 as minM0 };