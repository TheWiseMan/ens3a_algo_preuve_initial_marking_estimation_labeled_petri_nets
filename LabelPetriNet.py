"""
Author :
 - DEPIN Emeric
 - GRILLET Jean-Dorian
Student at Ecole Normale Superieure de Rennes
December 2024 
"""


from Place import Place
from Transition import Transition
from Incident import Incident
from definition import compare, maximum, substract

class LabelPetriNet:
    """
    This class represent a labeled Petri in order to find the minimum initial marking  """
    def __init__(self, places:set[Place], transitions:set[Transition], arcs:set[list[int]]):
        """Initialization of the labeld petri net

        Args:
            places (set[Place]) : set of the places of the net
            transitions (set[Transition]) : set of the transitions of the net
            arcs (set[list[int]]) : set of the arc, represent by a lits : [i, j, bij-, bij+]
        """
        
        self.places: set[Place] = places
        self.transitions: set[Transition] = transitions
        self.B = Incident(arcs, len(places), len(transitions))
    
    def find_minimum_marking(self, observed_label:list[str]):
        """
        Return the minimum marking of the Petri net
        
        Args :
            observed_label (list[str]): the oserved sequence
            
        Returns :
            ymin (list[int]) : the  transition list
            M0min (list[int]) : the minimum marking found with the algorithm
        """
        k = len(observed_label)
        # Step 1
        C = [ [ [ [0 for _ in range(len(self.transitions))], [[0 for _ in range(len(self.places)) ]] ]] ]
        
        # Step 2
        j = 1

        # Step 3
        while j < k+1:
            C.append([])
            for R in C[j-1]:
                for trans in self.transitions:
                    if trans.label != observed_label[j-1]:
                        continue
                    for M0 in R[1]:
                        M1 = [M0[i] + list(self.B @ R[0])[i] for i in range(len(M0))]
                        #ic(self.B @ R[1])
                        M2 = [self.B.bMinus[i][trans.id] for i in range(len(self.B.bMinus))]
                        M0p = substract(maximum(M1, M2), self.B @ R[0])
                        yp = [x for x in R[0]] # deep copy
                        yp[trans.id] += 1
                        if yp not in [x[0] for x in C[j]]: # if yp has no appeared in C(j)
                            C[j].append([yp, [M0p]])
                        else:
                            flag = True
                            for i,Rp in enumerate(C[j]):
                                if Rp[0]==yp:
                                    break
                            for M0ex in Rp[1]:
                                if compare(M0ex, M0p) == 1:
                                    flag = False
                                elif compare(M0p, M0ex) == 1 and M0p != M0ex:
                                    C[j][i][1].remove(M0ex)
                            if flag:
                                Rp[1].append(M0p)
            j = j+1
        
        # Step 8
        Min = sum(C[k-1][0][1][0])
        M0min = C[k-1][0][1][0] 
        ymin = C[k-1][0][0]
        for R in C[k-1]:
            for M in R[1]:
                Min_i = sum(M)
                if Min_i < Min:
                    Min = Min_i
                    M0min = M
                    ymin = R[0]
        return ymin, M0min