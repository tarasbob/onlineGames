Edge Connect
===========

The objective of the game is to acquire as many edge cells as possible and to have as few groups as possible.
Groups that have only 1 edge cell are given to the opponent.

The score is calculated as follows:
score = num_edge_cells + num_center_cells + (num_opponent_groups - num_groups) * 2

Note: num_center_cells is 0 or 1.
