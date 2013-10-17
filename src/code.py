import web
import json
import starLogic

urls = ('/', 'star',
        '/gamestate', 'gamestate',
        '/command', 'command'
        )
render = web.template.render('templates/')


state = "normal"
pointiter = 0

g = starLogic.Game(2)

class command:
    def GET(self):
        global pointiter
        global state
        global g
        inp = web.input()
        if inp.cmd_text == "makemove":
            g.makeMove(g.curTurn, (int(inp.x), int(inp.y), int(inp.z)))
        elif inp.cmd_text == "randommove":
            g.playRandomly()
        elif inp.cmd_text == "inc_iter":
            print "increase iter"
            state = "points"
            g.calculatePoints(pointiter)
            pointiter += 1
        elif inp.cmd_text == "changestate":
            print "change state"
            state = "points"
            pointiter = 0
            g = starLogic.findProblematicGame(100)
            g.calculatePoints(pointiter)
        elif inp.cmd_text == "calculatescore":
            (bs, ws) = g.calculatePoints();
            scores = dict()
            scores['black'] = bs
            scores['white'] = ws
            return json.dumps(scores)


class star:
    def GET(self):
        return render.star()


class gamestate:
    def GET(self):
        global state
        global pointiter
        gameInfo = dict()
        gameInfo["boardSize"] = g.radius
        gameInfo["curTurn"] = g.curTurn
        cellArray = []
        for (x, y, z) in g.grid:
            cellArray.append(x)
            cellArray.append(y)
            cellArray.append(z)
            if state == "normal":
                cellArray.append(g.grid[(x,y,z)].color)
            elif state == "points":
                cellArray.append(g.grid[(x,y,z)].tmpCol)

        gameInfo["cells"] = cellArray

        return json.dumps(gameInfo)


if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
