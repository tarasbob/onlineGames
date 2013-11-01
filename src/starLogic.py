import itertools
import random
import math

class Node:
    def __init__(self, col, coord):
        self.color = col
        self.coordinates = coord
        self.group = -10
        self.special = False

    def __str__(self):
        return self.color

class Game:
    def __init__(self, boardRadius=11):
        self.board = GameBoard(boardRadius)
        self.state = "waiting"
        self.players = []
        self.numPlayers = 0
        self.curTurn = 1
        self.movesLeft = 1
        self.movesPerTurn = 2
        self.moveHistory = []
        self.result = None

    def addPlayer(self, playerName):
        """
        Add a player to the game, if there are two players, start the game
        """
        if self.state == "waiting":
            self.players.append(playerName)
            self.numPlayers += 1
            if len(self.players) == 2:
                self.startGame()

    def startGame(self):
        random.shuffle(self.players)
        self.pieceColor = dict()
        self.pieceColor[self.players[0]] = 1
        self.pieceColor[self.players[1]] = 2
        self.state = "playing"

    def doMove(self, playerName, location):
        try:
            moveColor = self.pieceColor[playerName]
        except KeyError:
            #PlayerName is not in this game
            return
        except AttributeError:
            #game has not started yet
            return
        if moveColor != self.curTurn:
            return
        if self.state != "playing":
            return
        self.moveHistory.append((playerName, location))
        if location == "pass":
            if len(self.moveHistory) > 1 and self.moveHistory[-1][1] == "pass" and self.moveHistory[-2][1] == "pass":
                #both passed, calculate score
                self.state = "finished"
                print "game finished"
                self.result = self.board.computeScore()
            else:
                self.curTurn = 3 - self.curTurn
                self.movesLeft = self.movesPerTurn
            return
        if location == "resign":
            self.state = "finished"
            self.result = dict()
            self.result["type"] = "resign"
            self.result["winner"] = 1 if self.players[0] != playerName else 2
            return
        if self.board.grid[location].color != 0:
            print "location not empty"
            return
        print "perform the move"
        self.board.grid[location].color = moveColor
        self.moveHistory.append((playerName, location))
        self.movesLeft -= 1
        if self.movesLeft == 0:
            self.curTurn = 3 - self.curTurn
            self.movesLeft = self.movesPerTurn

class GameBoard:
    def __init__(self, radius):
        self.radius = min(15, max(2, radius))
        self.grid = dict()

        for (x, y, z) in itertools.product(range(-self.radius, self.radius+1), repeat=3):
            if x == y == z == 0:
                #do not create node 0 0 0
                pass
            elif x + y + z == 0:
                self.grid[(x, y, z)] = Node(0, (x, y, z))

        #randomly select 5 special cells for tie break
        self.specialCells = random.sample(self.grid, 5)
        for cell in self.specialCells:
            self.grid[cell].special = True

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

    def computeScore(self, iters=10):
        print "computing score"
        for coord in self.grid:
            self.grid[coord].tmpCol = self.grid[coord].color

        finished = False
        while iters > 0 and not finished:
            finished = True
            print iters
            iters -= 1
            numWhiteGroups = 0
            numBlackGroups = 0

            #set all nodes to group -10
            for coord in self.grid:
                self.grid[coord].group = -10

            #add all white and black nodes to a group
            numGroups = [0, 0, 0]
            fin = False
            while fin == False:
                fin = True
                for coord in self.grid:
                    if self.grid[coord].group == -10 and self.grid[coord].tmpCol > 0:
                        self.explore(coord, numGroups[self.grid[coord].tmpCol])
                        numGroups[self.grid[coord].tmpCol] += 1
                        fin = False

            #count how many edge nodes are in each group
            numEdgeNodes = [None, [0 for i in range(numGroups[1])], [0 for i in range(numGroups[2])]]
            print numEdgeNodes
            edgeNodes = self.getEdgeNodes()

            #go through all the edge nodes and increment the number of edgeNodes for the respective group
            for edge in edgeNodes:
                if self.grid[edge].tmpCol > 0:
                    numEdgeNodes[self.grid[edge].tmpCol][self.grid[edge].group] += 1

            #toggle the group colors
            print numGroups
            print numEdgeNodes
            for col in range(1,3):
                for groupNum in range(numGroups[col]):
                    print col, groupNum
                    if numEdgeNodes[col][groupNum] < 2:
                        finished = False
                        self.toggleGroupColor(col, groupNum)

        #calculate final score
        if not finished:
            raise Exception("not finished")

        scoreOut = dict()
        scoreOut["type"] = "score"
        print "score out ready"
        edgeScore = [0, 0, 0]
        edgeNodes = self.getEdgeNodes()
        for edge in edgeNodes:
            if self.grid[edge].tmpCol > 0:
                edgeScore[self.grid[edge].tmpCol] += 1
            else:
                #edges not filled, not finished
                scoreOut["winner"] = 2
                scoreOut["edgeScore"] = [0, 0, 1]
                scoreOut["reward"] = [0, 0, 1]
                scoreOut["bonus"] = [0, 0, 1]
                scoreOut["finCells"] = dict()
                return scoreOut
        reward = [0, 0, 0]
        reward[1] = (numGroups[2] - numGroups[1])*2
        reward[2] = -reward[1]

        totalScore = [0, 0, 0]
        for i in range(3):
            totalScore[i] = edgeScore[i] + reward[i]

        bonus = [0, 0, 0]
        if totalScore[1] == totalScore[2]:
            for coord in self.specialCells:
                bonus[self.grid[coord].tmpCol] += 1
            if bonus[1] > bonus[2]:
                totalScore[1] += 1
            else:
                totalScore[2] += 1

        scoreOut["winner"] = 1 if totalScore[1] > totalScore[2] else 2
        scoreOut["edgeScore"] = edgeScore
        scoreOut["reward"] = reward
        scoreOut["bonus"] = bonus
        scoreOut["finCells"] = dict()
        for coord in self.grid:
            scoreOut["finCells"][coord] = self.grid[coord].tmpCol
        return scoreOut

    def toggleGroupColor(self, col, groupNum):
        for coord in self.grid:
            if self.grid[coord].group == groupNum and self.grid[coord].tmpCol == col:
                self.grid[coord].tmpCol = 3 - self.grid[coord].tmpCol

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
