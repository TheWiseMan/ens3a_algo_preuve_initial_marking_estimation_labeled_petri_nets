def compare(a:list[int], b:list[int]):
    """Function to compare two marking
    
    Args:
        a (list[int]) : first marking
        b (list[int]) : second marking
    
    Returns:
        int : 1 if b>a, O otherwise"""
    if len(a) != len(b):
        raise IndexError
    for i in range(len(a)):
        if a[i]>b[i]:
            return 0
    return 1


#region class:Place
class Place:

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
#endregion

#region class:Transition
class Transition:

    def __init__(self, id:int, label:str, name:str=None):
        self.id: int = id
        self.label : str = label
        self.name = name
        if name == None:
            self.name="t{}".format(id + 1)
    
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

#region class:Incident
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
            marking (list[int]) : a line vectore representing the marking"""
        ic(marking)
        ic(self.b)
        # b * marking
        """Raa = []
        for i in range(len(self.b)):
            Raa.append([])
            for j in range(len(marking)):
                ic(i, j, self.b[i][j], marking[j])
                Raa[-1].append(self.b[i][j] * marking[j])
            ic(Raa)

        ic([[self.b[i][j]* marking[j] for j in range(len(marking))] for i in range(len(self.b))])"""
        return [sum([self.b[i][j]* marking[j] for j in range(len(marking))]) for i in range(len(self.b))]
#endregion

#region class:LabelPetriNet
class LabelPetriNet:

    def __init__(self, places:set[Place], transitions:set[Transition], arcs:set[list[int]]):
        self.places: set[Place] = places
        self.transitions: set[Transition] = transitions
        self.B = Incident(arcs, len(places), len(transitions))
    
    def find_minimum_marking(self, observed_label:list[str]):
        """Return the minimum marking of the Petri net
        
        Args :
            observed_label (list[str]): the oserved sequence
            
        Returns :
            dict{places}
        """
        k = len(observed_label)
        # Step 1
        C = [ [ [ [0 for _ in range(len(self.transitions))], [[0 for _ in range(len(self.places)) ]] ]] ]
        
        # Step 2
        j = 1

        # Step 3
        while j < k:
            ic(j)
            C.append([])
            ic(C)
            for R in C[j-1]:
                ic(R)
                for trans in self.transitions:
                    if trans.label != observed_label[j]:
                        continue
                    ic(R[1])
                    for M0 in R[1]:
                        ic(M0)
                        M1 = [M0[i] + list(self.B @ R[0])[i] for i in range(len(M0))]
                        ic(M1)
                        ic(R)
                        ic(R[1])
                        #ic(self.B @ R[1])
                        M2 = [self.B.bMinus[:][trans.id][i] - list(self.B @ R[1][0])[i] for i in range(len(self.B.bMinus[:][trans.id]))]
                        ic(M2)
                        if compare(M1, M2) == 1:
                            M0p = M2
                        else:
                            M0p = M1
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
        ic(C)
        Min = sum(C[k-1][0][1])
        iMin=0
        for R in C[k]:
            Min_i = min([sum(x for x in R[1])])
            if Min_i < Min:
                Min = Min_i
                iMin = i
        print(C[k][iMin][0])




#endregion