import web
import json
import starLogic
import random

urls = ('/', 'index',
        '/star', 'star',
        '/creategame', 'creategame',
        '/joingame', 'joingame',
        '/login_action', 'login_action',
        '/command', 'command'
        )
render = web.template.render('templates/')

sessions = dict()
games = dict()

class Session:
    def __init__(self):
        self.sessionID = "".join([random.choice("abcdefghijklmnopqrstuvwxyz1234567890") for i in range(50)])
        self.location = "login"
        self.username = ""

class command:
    def GET(self):
        global pointiter
        global state
        global games
        global sessions
        sessionID = web.cookies().get('sessionID')
        sess = sessions[sessionID]
        g = games[sess.gname]
        inp = web.input()
        if inp.cmd_text == "makemove":
            if g.curTurn == 'w' and sess.username == g.w:
                g.makeMove('w', (int(inp.x), int(inp.y), int(inp.z)))
            elif g.curTurn == 'b' and sess.username == g.b:
                g.makeMove('b', (int(inp.x), int(inp.y), int(inp.z)))
        elif inp.cmd_text == "randommove":
            g.playRandomly(1000)
        elif inp.cmd_text == "newgame":
            g.newGame()
        elif inp.cmd_text == "calculatescore":
            g.state = "score"
            g.calculatePoints()
        elif inp.cmd_text == "gamestate":
            gameInfo = dict()
            gameInfo["boardSize"] = g.radius
            gameInfo["curTurn"] = g.curTurn
            cellArray = []
            for (x, y, z) in g.grid:
                cellArray.append(x)
                cellArray.append(y)
                cellArray.append(z)
                cellArray.append(g.grid[(x,y,z)].color)
            gameInfo["cells"] = cellArray
            gameInfo["state"] = "normal"
            if g.state == "score":
                groups = []
                for (x, y, z) in g.grid:
                    groups.append(x)
                    groups.append(y)
                    groups.append(z)
                    groups.append(g.grid[(x,y,z)].tmpCol)
                gameInfo["whiteGroups"] = g.numWhiteGroups
                gameInfo["blackGroups"] = g.numBlackGroups
                gameInfo["blackScore"] = g.blackScore
                gameInfo["whiteScore"] = g.whiteScore
                gameInfo["groups"] = groups
                gameInfo["state"] = "score"
            return json.dumps(gameInfo)

class creategame:
    def GET(self):
        global sessions
        global games
        sessionID = web.cookies().get('sessionID')
        sess = sessions[sessionID]
        gname = web.input().gname
        if gname not in games:
            g = starLogic.Game(2)
            g.b = sess.username
            g.w = None
            games[gname] = g
            sess.location = "game"
            sess.gname = gname
            return render.star()
        else:
            return "game already exists"

class joingame:
    def GET(self):
        global sessions
        global games
        sessionID = web.cookies().get('sessionID')
        sess = sessions[sessionID]
        gname = web.input().gname
        try:
            g = games[gname]
            g.w = sess.username
            sess.location = "game"
            sess.gname = gname
            return render.star()
        except KeyError:
            return "game does not exist"

class index:
    def GET(self):
        global sessions
        sessionID = web.cookies().get('sessionID')
        try:
            sess = sessions[sessionID]
        except KeyError:
            sess = Session()
            sessions[sess.sessionID] = sess
            web.setcookie('sessionID', sess.sessionID, 3600)
        if sess.location == "login":
            return render.login()
        if sess.location == "lobby":
            return render.lobby()
        if sess.location == "game":
            return render.star()

class login_action:
    def GET(self):
        global sessions
        sessionID = web.cookies().get('sessionID')
        sess = sessions[sessionID]
        sess.username = web.input().username
        sess.location = "lobby"
        return render.lobby()

class star:
    def GET(self):
        return render.star()



if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
