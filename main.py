"""
Author :
 - DEPIN Emeric
 - GRILLET Jean-Dorian
Student at Ecole Normale Superieure de Rennes
December 2024 
"""


from Transition import Transition
from Place import Place
from LabelPetriNet import LabelPetriNet

def exemple_net():
    """Here we implement the exemple of the article"""
    places = {Place(i) for i in range(4)}
    transitions = {Transition(0, "a"), Transition(1, "a"), Transition(2, "b"), Transition(3, "c")}
    observed_sequence = ["a", "a", "a", "a", "a"]
    arcs = [[0,0,1,0], [1,0,0,1], [1,1,1,0], [2,1,0,1], [2,2,1,0], [1,2,0,1], [1,3,1,0], [3,3,0,1]]
    LPN = LabelPetriNet(places, transitions, arcs)
    ymin, M0min = LPN.find_minimum_marking(observed_sequence)
    print(" - Transition list : {} \n - Minimum marking : {}".format(ymin, M0min))


if __name__=="__main__":
    exemple_net()