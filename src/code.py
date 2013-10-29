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

class commandHandler:
    def getGame(self, sess):
        global games
        return games[sess.gname]

    def logout(self, sess):
        global sessions
        sessions.pop(sess.sessionID)

    def makemove(self, sess, inp):
        g = self.getGame(sess)
        if g.curTurn == 'w' and sess.username == g.w:
            g.makeMove('w', (int(inp.x), int(inp.y), int(inp.z)))
        elif g.curTurn == 'b' and sess.username == g.b:
            g.makeMove('b', (int(inp.x), int(inp.y), int(inp.z)))

    def randommove(self, sess, inp):
        g.playRandomly(1000)

    def newgame(self, sess):
        g = self.getGame(sess)
        g.newGame()

    def calculatescore(self, sess, inp):
        g = self.getGame(sess)
        g.state = "score"
        g.calculatePoints()

    def gamestate(self, sess, inp):
        g = self.getGame(sess)
        gameInfo = dict()
        cellArray = []
        for (x, y, z) in g.grid:
            cellArray.append(x)
            cellArray.append(y)
            cellArray.append(z)
            cellArray.append(g.grid[(x,y,z)].color)
        gameInfo["cells"] = cellArray
        gameInfo["boardSize"] = g.radius
        gameInfo["curTurn"] = g.w if g.curTurn == 'w' else g.b
        gameInfo["movesLeft"] = g.movesLeft
        gameInfo["w_timeLeft"] = "11:35"
        gameInfo["b_timeLeft"] = "14:39"
        gameInfo["w_name"] = g.w
        gameInfo["b_name"] = g.b
        if g.state == "score":
            gameInfo["score"] = g.b


        return json.dumps(gameInfo)

    def getgames(self, sess, inp):
        result = dict()
        waitingGames = [gname for gname in games if not games[gname].w]
        result["waitingGames"] = waitingGames
        return json.dumps(result)

    def create(self, sess, inp):
        global games
        gname = web.input().gname
        if gname not in games:
            g = starLogic.Game(9)
            g.b = sess.username
            g.w = None
            games[gname] = g
            sess.location = "game"
            sess.gname = gname

    def join(self, sess, inp):
        global games
        gname = web.input().gname
        try:
            g = games[gname]
            if not g.w:
                g.w = sess.username
                sess.location = "game"
                sess.gname = gname
                if random.randint(0, 1) == 0:
                    g.w, g.b = g.b, g.w
                g.state="started"
        except KeyError:
            pass

class command:
    def GET(self):
        global sessions
        inp = web.input()
        sessionID = web.cookies().get('sessionID')
        try:
            sess = sessions[sessionID]
        except KeyError:
            web.setcookie('sessionID', '', -1)
            return render.login()
        ch = commandHandler()
        return getattr(ch, inp.cmd_text)(sess, inp)

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
            return render.game()

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
