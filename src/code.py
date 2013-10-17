import web
import json
import starLogic

urls = ('/', 'star',
        '/login_action', 'login_attempt',
        '/lobby', 'lobby',
        '/creategame', 'game',
        '/gamestate', 'gamestate',
        '/randommove', 'randommove',
        '/calculatescore', 'calculatescore',
        '/makemove', 'makemove'
        )
render = web.template.render('templates/')


users = dict()
games = []

g = starLogic.Game(2)

class index:
    def GET(self):
        username = web.cookies().get('username')
        if username:
            location, gamename = users[username]
            if location == 'lobby':
                return render.lobby(username + location)
            elif location == 'game':
                return render.game()
        else:
            return render.login()

class lobby:
    def GET(self):
        username = web.cookies().get('username')
        if username:
            return render.lobby(username)
        else:
            return render.login()

class makemove:
    def GET(self):
        moveData = web.input()
        g.makeMove(g.curTurn, (int(moveData.x), int(moveData.y), int(moveData.z)))

class randommove():
    def GET(self):
        g.playRandomly()

class calculatescore():
    def GET(self):
        (bs, ws) = g.calculatePoints();
        scores = dict()
        scores['black'] = bs
        scores['white'] = ws
        return json.dumps(scores)

class star:
    def GET(self):
        return render.star()

class game:
    def GET(self):
        gamename = web.input()
        games.append(gamename)
        if username:
            return render.lobby(username)
        else:
            return render.login()

class gamestate:
    def GET(self):
        global g
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

        return json.dumps(gameInfo)

class login_attempt:
    def GET(self):
        user_data = web.input()
        web.setcookie('username', user_data.user, 3600)
        users[user_data.user] = ('lobby', '')
        raise web.seeother('/')

class req:
    def GET(self):
        contents = dict()
        contents["day"] = 17
        contents["year"] = 2005
        return json.dumps(contents)

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
