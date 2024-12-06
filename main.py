from icecream import install
from icecream import ic
install()

from definition import LabelPetriNet, Place, Transition, Incident;

def main():
    places = {Place(i) for i in range(4)}
    transitions = {Transition(0, "a"), Transition(1, "a"), Transition(2, "b"), Transition(3, "c")}
    observed_sequence = ["a", "a", "b", "c"]
    arcs = [[0,0,1,0], [1,0,0,1], [1,1,1,0], [2,1,0,1], [2,2,1,0], [1,2,0,1], [1,3,1,0], [3,3,0,1]]
    LPN = LabelPetriNet(places, transitions, arcs)
    LPN.find_minimum_marking(observed_sequence)

if __name__=="__main__":
    main()