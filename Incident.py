"""
Author :
 - DEPIN Emeric
 - GRILLET Jean-Dorian
Student at Ecole Normale Superieure de Rennes
December 2024 
"""


class Incident:
    """
    This class represent, the incident matrix, and it Plus and Minus variant
    """

    def __init__(self, arcs:set[list[int]], n:int, m:int):
        """Class initialization
        
        Arggs :
            arcs (set[int]) : the arc informations [i, j, b-, b+]
            n (int) : the number of places from the Petri net
            m (int) : the number of transitions of the petri net
        """
        self.bMinus = [[0 for _ in range(m)] for __ in range(n)]
        self.bPlus = [[0 for _ in range(m)] for __ in range(n)]
        self.b = [[0 for _ in range(m)] for __ in range(n)]
        for arc in arcs:
            self.bMinus[arc[0]][arc[1]] = arc[2]
            self.bPlus[arc[0]][arc[1]] = arc[3]
            self.b[arc[0]][arc[1]] = arc[3] - arc[2]

    def __matmul__(self, marking:list[int]):
        """return the matrix product between the Incident matrix B and a marking
        Syntax : B:Incident @ mark:list[int]
        
        Args: 
            marking (list[int]) : a line vectore representing the marking
        """
        return [sum([self.b[i][j]* marking[j] for j in range(len(marking))]) for i in range(len(self.b))]