"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const joint = __importStar(require("@joint/core"));
/*type GraphPlace = {
    id: string,
    name: string,
    tokens: number
};

type GraphArc = {
    place: string
    weight: number
};

type GraphTransition = {
    inputArcs: GraphArc[],
    outputArcs: GraphArc[]
};

type GraphMarking = { [id: string]: number };

class Transition {
    inputArcs: GraphArc[] = [];
    outputArcs: GraphArc[] = [];
    constructor(input: [string, number][], output: [string, number][]) {
        this.inputArcs = input.map((v) => { return { place: v[0], weight: v[1] } })
        this.outputArcs = output.map((v) => { return { place: v[0], weight: v[1] } })
    }
}

console.log('x:', graphBBox.x, 'y:', graphBBox.y)
console.log('width:', graphBBox.width, 'height:', graphBBox.height);
    private currentMarking: GraphMarking = {};
    constructor(places: GraphPlace[], transitions: GraphTransition[]) {
        places.forEach((p) => {
            this.places[p.id] = p;
            this.initialMarking[p.id] = p.tokens;
        });
        this.transitions = transitions;
        this.currentMarking = this.initialMarking;
    }
    get marking() {
        return this.currentMarking;
    }
    reset() {
        this.currentMarking = this.initialMarking;
    }
    step() {

    }
}

let g = new Graph(
    [{ id: "1", name: "A", tokens: 0 }, { id: "2", name: "B", tokens: 0 }],
    [new Transition([["1", 2]], [["2", 2]])],
)
console.log(g.marking);*/
const layout_directed_graph_1 = require("@joint/layout-directed-graph");
const algo_1 = require("./algo");
const namespace = joint.shapes;
const graph = new joint.dia.Graph({}, { cellNamespace: namespace });
var rect = document.getElementById('paper').getBoundingClientRect();
const paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    model: graph,
    width: rect.width,
    height: rect.height,
    background: { color: '#F5F5F5' },
    cellViewNamespace: namespace
});
function layout(petriNet) {
    let cells;
    try {
        cells = adjacencyListToCells(petriNet);
    }
    catch (error) {
        // the adjacency list does not make sense
        console.log(error);
        return;
    }
    graph.resetCells(cells);
    layout_directed_graph_1.DirectedGraph.layout(graph, {
        setLinkVertices: true,
        /*marginX: 5,
        marginY: 5*/
    });
}
function adjacencyListToCells(graph) {
    const elements = [];
    const links = [];
    graph.places.forEach((pid, i) => {
        elements.push(makeElement(pid, graph.marking[i]));
    });
    graph.transitions.forEach((transition, i) => {
        let t = makeTransition(i, transition.label);
        if (graph.isEnabled(i)) {
            t.attr("body/stroke", "green");
        }
        elements.push(t);
        transition.inputArcs.forEach((inputArc) => {
            let link = makeLink(inputArc[0], "t" + i);
            link.appendLabel({
                attrs: {
                    text: {
                        "text": inputArc[1].toString()
                    }
                }
            });
            if (graph.marking[graph.places.indexOf(inputArc[0])] >= inputArc[1]) {
                link.attr("line/stroke", "green");
            }
            links.push(link);
        });
        transition.outputArcs.forEach((outputArc) => {
            let link = makeLink("t" + i, outputArc[0]);
            link.appendLabel({
                attrs: {
                    text: {
                        "text": outputArc[1].toString()
                    }
                }
            });
            links.push(link);
        });
    });
    // Links must be added after all the elements. This is because when the links
    // are added to the graph, link source/target
    // elements must be in the graph already.
    const cells = elements.concat(links);
    return cells;
}
function makeTransition(id, label) {
    const maxLineLength = label.split('\n').reduce((max, l) => {
        return Math.max(l.length, max);
    }, 0);
    const letterSize = 12;
    const width = (letterSize * (0.6 * maxLineLength + 1));
    const height = ((label.split('\n').length + 1) * letterSize);
    let rect = new namespace.standard.Rectangle({
        id: "t" + id,
        tid: id,
        size: { width: width, height: height },
        attrs: {
            body: {
                stroke: 'lightgrey',
            },
            label: {
                text: label,
                fontSize: letterSize,
                fontFamily: 'monospace',
                fill: '#131E29',
            }
        }
    });
    rect.attr("label/text", label);
    return rect;
}
function makeLink(parentElementLabel, childElementLabel) {
    return new namespace.standard.Link({
        source: { id: parentElementLabel, anchor: { name: 'bottom' } },
        target: { id: childElementLabel, anchor: { name: 'top' } },
        connector: { name: 'straight', args: { cornerType: 'cubic' } },
        attrs: {
            line: {
                stroke: '#F68E96',
                targetMarker: {
                    d: 'M 4 -4 0 0 4 4'
                }
            }
        }
    });
}
function makeElement(label, marking) {
    const maxLineLength = label.split('\n').reduce((max, l) => {
        return Math.max(l.length, max);
    }, 0);
    // Compute width/height of the rectangle based on the number
    // of lines in the label and the letter size. `0.6 * letterSize` is
    // an approximation of the monospace font letter width.
    const letterSize = 12;
    const width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    const height = 2 * ((label.split('\n').length + 1) * letterSize);
    let place = new namespace.standard.Circle({
        id: label,
        size: { width: width, height: height },
        attrs: {
            body: {
                stroke: '#226CE0',
                /*width: width,
                height: height,*/
            },
            label: {
                text: label + "\n" + (marking > 5 ? marking.toString() : "∙".repeat(marking)),
                fontSize: letterSize,
                fontFamily: 'monospace',
                fill: '#131E29',
            }
        }
    });
    return place;
}
/*layout({
    places: ["A", "B", "C", "D", "E"],
    marking: [1, 3, 2, 0],
    transitions: [
        {
            label: "t1",
            inputArcs: [["A", 1], ["C", 1]],
            outputArcs: [["B", 2]]
        },
        {
            label: "t2",
            inputArcs: [["B", 3]],
            outputArcs: [["D", 2]]
        }
    ]
});*/
const logElement = document.getElementById("log");
class Graph {
    constructor(data) {
        this.places = [];
        this.transitions = [];
        this.marking = [];
        this.places = data.places;
        this.transitions = data.transitions;
        this.marking = Array(this.places.length).fill(0);
        this.draw();
    }
    isEnabled(tid) {
        let t = this.transitions[tid];
        if (!t)
            return false;
        return t.inputArcs.every(a => {
            let placeI = this.places.indexOf(a[0]);
            if (placeI < 0)
                return false;
            return this.marking[placeI] >= a[1];
        });
    }
    fire(tid) {
        let t = this.transitions[tid];
        if (!t)
            return false;
        if (!this.isEnabled(tid))
            return;
        t.inputArcs.forEach(a => {
            let placeI = this.places.indexOf(a[0]);
            this.marking[placeI] -= a[1];
        });
        t.outputArcs.forEach(a => {
            let placeI = this.places.indexOf(a[0]);
            this.marking[placeI] += a[1];
        });
        let preElt = document.createElement("pre");
        preElt.innerHTML = t.label;
        logElement.appendChild(preElt);
    }
    draw() {
        paper.off("cell:pointerclick");
        paper.on("cell:pointerclick", (cellView) => {
            let model = cellView.model;
            console.log("Clicked", model.attributes.tid, model);
            this.fire(model.attributes.tid);
            layout(this);
        });
        layout(this);
        paper.transformToFitContent({ padding: 10 });
    }
    minM0(omega) {
        let n = this.places.length;
        let m = this.transitions.length;
        let B = Array(n).fill(null).map(() => Array(m).fill(0));
        let BMinus = Array(n).fill(null).map(() => Array(m).fill(0));
        this.transitions.forEach((t, i) => {
            t.inputArcs.forEach((iA) => {
                let placeI = this.places.indexOf(iA[0]);
                B[placeI][i] -= iA[1];
                BMinus[placeI][i] = iA[1];
            });
            t.outputArcs.forEach((oA) => {
                let placeI = this.places.indexOf(oA[0]);
                B[placeI][i] += oA[1];
            });
        });
        let T = this.transitions.map((t, i) => i);
        let Larray = this.transitions.map((t) => t.label);
        console.log({
            B, BMinus, T
        });
        let result = (0, algo_1.minM0)({
            B, BMinus, T, L: (t) => Larray[t]
        }, omega);
        return result;
    }
}
var g = new Graph({
    places: ["P1", "P2", "P3", "P4"],
    transitions: [
        {
            label: "a",
            inputArcs: [["P1", 1]],
            outputArcs: [["P2", 1]]
        },
        {
            label: "a",
            inputArcs: [["P2", 1]],
            outputArcs: [["P3", 1]]
        },
        {
            label: "b",
            inputArcs: [["P3", 1]],
            outputArcs: [["P2", 1]]
        },
        {
            label: "c",
            inputArcs: [["P2", 1]],
            outputArcs: [["P4", 1]]
        }
    ]
});
document.getElementById("graph1").onclick = () => {
    g = new Graph({
        places: ["P1", "P2", "P3", "P4"],
        transitions: [
            {
                label: "a",
                inputArcs: [["P1", 1]],
                outputArcs: [["P2", 1]]
            },
            {
                label: "a",
                inputArcs: [["P2", 1]],
                outputArcs: [["P3", 1]]
            },
            {
                label: "b",
                inputArcs: [["P3", 1]],
                outputArcs: [["P2", 1]]
            },
            {
                label: "c",
                inputArcs: [["P2", 1]],
                outputArcs: [["P4", 1]]
            }
        ]
    });
};
document.getElementById("graph2").onclick = () => {
    g = new Graph({
        places: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"],
        transitions: [
            {
                label: "a",
                inputArcs: [["P1", 2]],
                outputArcs: [["P2", 1], ["P3", 1]]
            },
            {
                label: "a",
                inputArcs: [["P2", 1]],
                outputArcs: [["P4", 2]]
            },
            {
                label: "b",
                inputArcs: [["P3", 1], ["P4", 1]],
                outputArcs: [["P5", 1]]
            },
            {
                label: "c",
                inputArcs: [["P5", 1]],
                outputArcs: [["P6", 1]]
            },
            {
                label: "d",
                inputArcs: [["P6", 1]],
                outputArcs: [["P7", 1], ["P1", 1]]
            },
            {
                label: "a",
                inputArcs: [["P7", 2]],
                outputArcs: [["P8", 1]]
            },
            {
                label: "b",
                inputArcs: [["P8", 1]],
                outputArcs: [["P4", 1]]
            },
            {
                label: "c",
                inputArcs: [["P3", 1]],
                outputArcs: [["P6", 1]]
            }
        ]
    });
};
document.getElementById("minM0").onclick = () => {
    let ta = document.getElementById("graphdata");
    let labels = ta.value.split(" ");
    let result = g.minM0(labels);
    g.marking = result[0];
    console.log(labels, result);
    g.draw();
};
const clearButton = document.getElementById("clearLog");
clearButton.onclick = () => {
    logElement.innerHTML = "";
};
exports.default = g;
//paper.translate((paperArea.width - contentArea.width) / 2, (paperArea.height - contentArea.height) / 2);
