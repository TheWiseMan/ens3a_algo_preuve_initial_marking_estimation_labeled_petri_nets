#region class:Place
class Place:
    tokens: int = 0

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
#endregion

#region class:Transition
class Transition:
    bMinus: int = 0
    bPlus: int = 0
    label: str = "defaultlabel"
    def isEnabled(self) -> bool:
        """Checks if the current transition is enabled

        Returns:
            bool: duh
        """
        pass
    def fire(self):
        """Fires the transition and redistributes tokens.
        The underlying checks are left to the `Place` class
        """
        pass
#endregion

#region class:LabelPetriNet
class LabelPetriNet:
    places: set[Place] = set()
    transitions: set[Transition] = set()
#endregion