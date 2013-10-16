import web
import json
import starLogic

urls = ('/', 'index',
        '/login_action', 'login_attempt',
        '/lobby', 'lobby',
        '/creategame', 'game'
        )
render = web.template.render('templates/')


users = dict()
games = []

g = starLogic.Game(5)

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

class game:
    def GET(self):
        gamename = web.input()
        games.append(gamename)
        if username:
            return render.lobby(username)
        else:
            return render.login()

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
