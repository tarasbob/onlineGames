import starLogic
import random

g = starLogic.Game(2)
for coord in g.grid:
    print coord
    print g.getNeighbors(coord)
    print "---------"
