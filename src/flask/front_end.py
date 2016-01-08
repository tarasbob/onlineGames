import random
import itertools
from flask import Flask, session, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)
app.secret_key = "8edca468f5f7bb849e5d8bedb" + str(random.randint(0, 100000))
app.games = {}
app.users = {}

ASSETS = {'bootstrap_css': 'css/bootstrap.min.css',
    'bootstrap_js': 'js/bootstrap.min.js',
    'jquery_js': 'js/jquery-2.0.3.min.js',
    'd3_js': 'js/d3.v3.min.js',
    'lib_js': 'js/lib.js',
    'game_page_js': 'js/game_page.js',
    'front_page_js': 'js/front_page.js'}

def get_id():
  return ''.join(random.choice('abcdefghijklmnopqrstuvwxyz1234567890') for _ in range(10))

class GameBoard(object):

  def __init__(self, size, handicap):
    self.size = size
    self.handicap = handicap
    self.grid = {}
    self.turn = 1
    self.moves = []
    # How many stones is the current player supposed to place
    self.cells_left = handicap + 1
    self._create_grid()

  def make_move(self, move):
    for (x, y, z) in move:
      if self.grid[(x, y, z)] != 0:
        return False
    for (x, y, z) in move:
      self.grid[(x, y, z)] = self.turn
    self.moves.append(move)
    self.turn = 3 - self.turn

  def _create_grid(self):
    for x, y, z in itertools.product(
        range(-self.size, self.size + 1), repeat=3):
      if x + y + z == 0:
        self.grid[(x, y, z)] = 0

class Game(object):

  def __init__(self, board_size, handicap, time_init, time_added, p2):
    self.game_id = get_id()
    self.time_init = time_init
    self.time_added = time_added
    self.creation_time = 0
    self.p1 = None
    self.p2 = p2
    self.prev_state_id = 'init'
    self.state_id = 'init'
    self.last_move = []
    self.board = GameBoard(board_size, handicap)

  def _update_id(self):
    self.prev_state_id = self.state_id
    self.state_id = get_id()

  def make_move(self, move):
    self.last_move = move
    self.board.make_move(move)
    self._update_id()

  def add_player(self, p1):
    self.p1 = p1
    p1.game = self
    self.creation_time = 0
    self._update_id()

  @property
  def turn(self):
    return self.board.turn

  @property
  def p1_time(self):
    # time left for p1
    return 1000

  @property
  def p2_time(self):
    return 1000

class User(object):
  def __init__(self, username, user_id):
    self.username = username
    self.user_id = user_id

@app.route("/", methods=['GET', 'POST'])
def front_page():
  '''Renders the front page as HTML.'''
  if request.method == 'POST':
    username = request.form['username']
    user_id = get_id()
    app.users[user_id] = User(username, user_id)
    session['username'] = username
    session['user_id'] = user_id
    return redirect(url_for('front_page'))
  if 'username' not in session:
    return '''
        <form action="" method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''
  return render_template('front_page.tmpl', assets=ASSETS)

@app.route('/games/<game_id>')
def join_game(game_id):
  '''Renders a report as HTML. '''
  # Sets current game to game_id
  user_id = session.get('user_id')
  user = app.users.get(user_id)
  if user is None:
    return redirect(url_for('front_page'))
  game = app.games.get(game_id)
  if game is None or game.p1 is not None:
    # if game does not exist or is full
    return redirect(url_for('front_page'))
  game.add_player(user)
  return redirect(url_for('show_game'))

@app.route('/game')
def show_game():
  user_id = session.get('user_id')
  user = app.users.get(user_id)
  if user is None:
    return redirect(url_for('front_page'))
  game = user.game
  if game is None:
    return redirect(url_for('front_page'))
  return render_template('game_page.tmpl', assets=ASSETS)

@app.route('/get_state', methods=['GET', 'POST'])
def get_state():
  user = app.users.get(session.get('user_id'))
  if user is None:
    return None
  game = user.game
  if game is None:
    return None
  cur_player = 1 if game.p1 == user else 2

  client_state_id = request.json['client_state_id']
  if client_state_id == game.state_id:
    return jsonify(update="no_update", game_id=game.game_id)
  elif client_state_id == game.prev_state_id:
    # return all info
    return jsonify(
        update="new_data",
        state_id=game.state_id,
        turn=game.turn,
        last_move=game.last_move,
        p1_time=game.p1_time,
        p2_time=game.p2_time,
        p1_name=game.p1.username if game.p1 else 'Empty',
        p2_name=game.p2.username, handicap=game.board.handicap,
        size=game.board.size,
        game_id=game.game_id,
        cur_player=cur_player)
    pass
  else:
    # client state id is messed up
    return jsonify(update="error")


@app.route('/make_move', methods=['GET', 'POST'])
def make_move():
  user = app.users.get(session.get('user_id'))
  if user is None:
    return None
  game = user.game
  if game is None:
    return None
  move = request.json
  game.make_move(move)
  return ''

@app.route('/create_game')
def create_game():
  '''Renders a report as HTML. '''
  user = app.users.get(session.get('user_id'))
  if user is None: return ''
  try:
    game = Game(
        board_size=int(request.args['board_size']),
        handicap=int(request.args['handicap']),
        time_init=int(request.args['time_init']),
        time_added=int(request.args['time_added']),
        p2=user)
  except:
    return ''
  app.games[game.game_id] = game
  user.game = game
  return 'success'

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)
