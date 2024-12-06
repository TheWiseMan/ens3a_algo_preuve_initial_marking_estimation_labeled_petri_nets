"""
Author :
 - DEPIN Emeric
 - GRILLET Jean-Dorian
Student at Ecole Normale Superieure de Rennes
December 2024 
"""


class Transition:

    def __init__(self, id:int, label:str, name:str=None):
        self.id: int = id
        self.label : str = label
        self.name = name
        if name == None:
            self.name="t{}".format(id + 1)