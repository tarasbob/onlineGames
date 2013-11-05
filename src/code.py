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
        self.gname = ""

class commandHandler:
    def getGame(self, sess):
        global games
        if sess.gname in games:
            return games[sess.gname]

    def logout(self, sess, inp):
        global sessions
        sessions.pop(sess.sessionID)

    def backToLobby(self, sess, inp):
        global games
        g = self.getGame(sess)
        if g.state != "playing":
            sess.location = "lobby"
            sess.gname = ""
            g.numPlayers -= 1
            if g.numPlayers < 1:
                del games['sess.gname']

    def makemove(self, sess, inp):
        g = self.getGame(sess)
        if inp.x == "pass":
            print "pass received"
            g.doMove(sess.username, "pass")
        elif inp.x == "resign":
            print "resign received"
            g.doMove(sess.username, "resign")
        else:
            g.doMove(sess.username, (int(inp.x), int(inp.y), int(inp.z)))

    def gamestate(self, sess, inp):
        g = self.getGame(sess)
        gameInfo = dict()
        cellArray = []
        #transfer the board along with special cells
        for (x, y, z) in g.board.grid:
            cellArray.append(x)
            cellArray.append(y)
            cellArray.append(z)
            cellArray.append(g.board.grid[(x,y,z)].color)
            if (x, y, z) in g.board.specialCells:
                cellArray.append('s')
                cellArray.append('s')
                cellArray.append('s')
                cellArray.append('s')


        gameInfo["cells"] = cellArray
        gameInfo["state"] = g.state
        gameInfo["boardSize"] = g.board.radius
        gameInfo["curTurn"] = g.players[g.curTurn-1]
        gameInfo["movesLeft"] = g.movesLeft
        gameInfo["first_name"] = g.players[0]
        gameInfo["lastTwoMoves"] = []
        print g.moveHistory
        if len(g.moveHistory) > 1:
            locs = [g.moveHistory[-1][1], g.moveHistory[-2][1]]
            if "pass" not in locs:
                for (x, y, z) in locs:
                    gameInfo["lastTwoMoves"].append(x)
                    gameInfo["lastTwoMoves"].append(y)
                    gameInfo["lastTwoMoves"].append(z)
        print gameInfo["lastTwoMoves"]
        if g.state == "playing":
            gameInfo["second_name"] = g.players[1]
        if g.state == "finished":
            gameInfo["winner"] = g.result["winner"]
            gameInfo["type"] = g.result["type"]
            if g.result["type"] == "score":
                gameInfo["edgeScore"] = g.result["edgeScore"]
                gameInfo["reward"] = g.result["reward"]
                gameInfo["bonus"] = g.result["bonus"]
                finCells = []
                for (x, y, z) in g.result["finCells"]:
                    finCells.append(x)
                    finCells.append(y)
                    finCells.append(z)
                    finCells.append(g.result["finCells"][(x, y, z)])
                gameInfo["finCells"] = finCells
        return json.dumps(gameInfo)

    def getgames(self, sess, inp):
        result = dict()
        waitingGames = [gname for gname in games if games[gname].state == "waiting"]
        result["waitingGames"] = waitingGames
        return json.dumps(result)

    def create(self, sess, inp):
        global games
        gname = web.input().gname
        bsize = int(web.input().bsize)
        if gname not in games:
            g = starLogic.Game(bsize)
            g.addPlayer(sess.username)
            games[gname] = g
            sess.location = "game"
            sess.gname = gname

    def join(self, sess, inp):
        global games
        gname = web.input().gname
        try:
            g = games[gname]
            if g.state == "waiting":
                g.addPlayer(sess.username)
                sess.location = "game"
                sess.gname = gname
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
            web.setcookie('sessionID', sess.sessionID, 36000)
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

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
