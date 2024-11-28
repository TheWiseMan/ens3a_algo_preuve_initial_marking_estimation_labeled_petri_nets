Defined interfaces

- [ ] Place
- [ ] Transition
- [ ] LabeledPetriNet

On pourrait juste faire

```py
class Transition:
    Bminus: list[list[int]] # Bminus[i][0] if id of p_i, and Bminus[i][1] is weight = B(p_i->t)
    Bplus: list[list[int]]
    label: str
class PetriNet:
    marking: list[int]
    transitions: list[Transition]
```