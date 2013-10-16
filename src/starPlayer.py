import starLogic
import random

def playRandomly():
    g = starLogic.Game(11)
    legalmoves = g.getLegalMoves()
    numMoves = 0
    while len(legalmoves) > 0:
        move = random.choice(legalmoves)
        g.makeMove(g.curTurn, move)
        legalmoves = g.getLegalMoves()
        numMoves += 1
    return g.calculatePoints()
r = playRandomly()
print r
