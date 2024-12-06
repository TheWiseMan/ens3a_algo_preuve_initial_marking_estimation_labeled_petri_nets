"""
Author :
 - DEPIN Emeric
 - GRILLET Jean-Dorian
Student at Ecole Normale Superieure de Rennes
December 2024 
"""


class Place:
    """This class represent a Place of a Petri Net"""

    def __init__(self, id:int, name:str=None, initial_token_number:int=0):
        self.id = id
        self.tokens: int = initial_token_number
        self.name=name
        if name==None:
            self.label="p{}".format(id+1)

    def giveTokens(self, n: int):
        """Gives n tokens to this place

        Args:
            n (int): number of tokens to give
        """
        self.tokens += n
    def takeTokens(self, n: int):
        """removes tokens in place
        Args:
            n (int): number of tokens to remove
        """
        if (n > self.tokens):
            raise RuntimeError("Tried to take more tokens than available")
        self.tokens -= n