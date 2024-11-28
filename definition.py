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
    pass
#endregion