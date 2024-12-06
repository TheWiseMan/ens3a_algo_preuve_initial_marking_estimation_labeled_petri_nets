"""
Author :
 - DEPIN Emeric
 - GRILLET Jean-Dorian
Student at Ecole Normale Superieure de Rennes
December 2024 
"""

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

def maximum(a:list[int], b:list[int]):
    """This function return the max of two markings
    
    Args:
        a (list[int]) : first marking
        b (list[int]) : second marking
    
    Return:
        list[int] : the max of the two marking
        """
    if len(a) != len(b):
        raise IndexError
    return [max(a[i], b[i]) for i in range(len(a))]

def substract(a:list[int], b:list[int]):
    """This function return the difference between two lists
    
    Args:
        a (list[int]) : first list
        b (list[int]) : second list
    
    Return:
        list[int] : the max of the two marking
        """
    if len(a) != len(b):
        raise IndexError
    return [a[i] - b[i] for i in range(len(a))]