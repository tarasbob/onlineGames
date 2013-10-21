import itertools
import random
import math

class Node:
    def __init__(self, col, coord):
        self.color = col
        self.coordinates = coord
        self.group = -10

    def __str__(self):
        return self.color

class Game:
    def __init__(self, radius):
        self.newGame(radius)
        self.numWhiteGroups = 0
        self.numBlackGroups = 0
        self.blackScore = 0
        self.whiteScore = 0
        self.state = "normal"

    def newGame(self, radius=7):
        self.radius = radius
        self.grid = dict()
        self.neigh = dict()
        self.movesPerTurn = 1
        self.curTurn = 'b'
        self.movesLeft = 1
        self.state = "normal"

        for (x, y, z) in itertools.product(range(-self.radius, self.radius+1), repeat=3):
            if x == y == z == 0:
                #do not create node 0 0 0
                pass
            elif x + y + z == 0:
                self.grid[(x, y, z)] = Node('e', (x, y, z))

    def playRandomly(self, numMoves=1):
        for i in range(numMoves):
            legalMoves = self.getLegalMoves()
            if len(legalMoves) > 0:
                move = random.choice(legalMoves)
                self.makeMove(self.curTurn, move)
            else:
                break

    def getNeighbors(self, coord):
        (x, y, z) = coord
        if (x, y, z) not in self.grid: return []
        out = [(i + x, j + y, k + z) for (i, j, k)
              in itertools.permutations((0, 1, -1))
              if (i + x, j + y, k + z) in self.grid]
        aroundCentre = list(itertools.permutations((0, 1, -1)))
        if (x, y, z) in aroundCentre:
            out.extend(aroundCentre)
            out = list(set(out))
        if coord in out:
            out.remove(coord)
        return out

    def getLegalMoves(self):
        legal_moves = []
        for coord in self.grid:
            if self.grid[coord].color == 'e':
                legal_moves.append(coord)
        return legal_moves

    def makeMove(self, col, coord):
        if self.curTurn == col and self.grid[coord].color == 'e':
            self.grid[coord].color = col
            self.movesLeft -= 1
        else:
            message = "color: " + col + " coord: " + str(coord)
            message += " expected col: " + self.curTurn
            message += " coord contains: " + self.grid[coord].color
            raise Exception(message)
        if self.movesLeft < 1:
            #change current player's color
            self.curTurn = 'w' if self.curTurn == 'b' else 'b'
            self.movesLeft = self.movesPerTurn

    def calculatePoints(self, iters=1):
        for coord in self.grid:
            self.grid[coord].tmpCol = self.grid[coord].color

        finished = False
        while iters > 0 and not finished:
            iters -= 1
            numWhiteGroups = 0
            numBlackGroups = 0

            #set all nodes to group -10
            for coord in self.grid:
                self.grid[coord].group = -10

            #add all white and black nodes to a group
            fin = False
            while fin == False:
                fin = True
                for coord in self.grid:
                    if self.grid[coord].group == -10:
                        if self.grid[coord].tmpCol == 'w':
                            self.explore(coord, numWhiteGroups)
                            numWhiteGroups += 1
                            fin = False
                        elif self.grid[coord].tmpCol == 'b':
                            self.explore(coord, numBlackGroups)
                            numBlackGroups += 1
                            fin = False


            #count how many edge nodes are in each group
            numEdgeNodesInWGroup = dict()
            numEdgeNodesInBGroup = dict()
            edgeNodes = self.getEdgeNodes()

            #go through all the edge nodes and increment the number of edgeNodes for the respective group
            for edge in edgeNodes:
                if self.grid[edge].tmpCol == 'w':
                    if self.grid[edge].group < 0:
                        raise Exception("unassigned group")
                    if self.grid[edge].group in numEdgeNodesInWGroup:
                        numEdgeNodesInWGroup[self.grid[edge].group] += 1
                    else:
                        numEdgeNodesInWGroup[self.grid[edge].group] = 1
                elif self.grid[edge].tmpCol == 'b':
                    if self.grid[edge].group < 0:
                        raise Exception("unassigned group")
                    if self.grid[edge].group in numEdgeNodesInBGroup:
                        numEdgeNodesInBGroup[self.grid[edge].group] += 1
                    else:
                        numEdgeNodesInBGroup[self.grid[edge].group] = 1

            #turn all white groups with less than two edge nodes into a black group
            finished = True
            for gr in range(numWhiteGroups):
                if gr not in numEdgeNodesInWGroup or numEdgeNodesInWGroup[gr] < 2:
                    finished = False
                    self.toggleGroupColor('w', gr)

            #turn all black groups into white (similar to above)
            for gr in range(numBlackGroups):
                if gr not in numEdgeNodesInBGroup or numEdgeNodesInBGroup[gr] < 2:
                    finished = False
                    self.toggleGroupColor('b', gr)


        self.numWhiteGroups = numWhiteGroups
        self.numBlackGroups = numBlackGroups
        #calculate final score
        if finished:
            #game ramains stable after two iterations
            whiteScore = 0
            blackScore = 0
            edgeNodes = self.getEdgeNodes()
            for edge in edgeNodes:
                if self.grid[edge].tmpCol == 'w':
                    whiteScore += 1
                elif self.grid[edge].tmpCol == 'b':
                    blackScore += 1
                else:
                    #edges not filled, not finished
                    return (0, 0)
            self.blackScore = blackScore
            self.whiteScore = whiteScore
            blackReward = (numWhiteGroups - numBlackGroups)*2
            whiteReward = -blackReward
            self.blackTotal = blackScore + blackReward
            self.whiteTotal = whiteScore + whiteReward
        else:
            self.blackTotal = 0
            self.whiteTotal = 0

    def toggleGroupColor(self, col, groupNum):
        for coord in self.grid:
            if self.grid[coord].group == groupNum and self.grid[coord].tmpCol == col:
                self.grid[coord].tmpCol = 'b' if col == 'w' else 'w'
                self.grid[coord].group = -1

    def getEdgeNodes(self):
        return [(x, y, z) for (x, y, z) in self.grid if max(abs(x), abs(y), abs(z)) == self.radius]

    def explore(self, coord, num):
        if self.grid[coord].group >= 0:
            raise Exception("trying to explore group that is already explored")
        col = self.grid[coord].tmpCol
        stack = [coord]
        while len(stack) > 0:
            coord = stack.pop()
            self.grid[coord].group = num
            neigh = self.getNeighbors(coord)
            for n in neigh:
                if self.grid[n].group == -10 and self.grid[n].tmpCol == col and n not in stack: stack.append(n)

def getDiagnostic(grid):
    diagnostic = ""
    for (x, y, z) in grid:
        if grid[(x, y, z)].tmpCol == 'w':
            diagnostic += 'context.fillStyle="red";\n'
        elif grid[(x, y, z)].tmpCol == 'b':
            diagnostic += 'context.fillStyle="blue";\n'
        diagnostic += 'drawCell('+str(x)+','+str(y)+','+str(z)+',20);\n'
    return diagnostic

def findProblematicGame(iters):
    for i in range(1, 20):
        g = Game(i)
        print i, len(g.grid)
    maxgame = None
    maxiters = 0
    for i in range(iters):
        g = Game(11)
        curiters = numItersUntilStable(g)
        if curiters > maxiters:
            maxiters = curiters
            maxgame = g
    return maxgame

def numItersUntilStable(g):
    res = (0, 0)
    iters = 0
    while res == (0, 0):
        iters += 1
        g.playRandomly(1000)
        res = g.calculatePoints(iters)
    return iters

g = findProblematicGame(100)
print numItersUntilStable(g)

