{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- Linkage implementation : © Shaun Phillips <smphillips@alumni.york.ac.uk>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------
-->

<div id="table"> 
	<div id="board">
			<div id="lastPlayedMarker">
	    	</div>
	    <!-- BEGIN space -->
		    <div id = "space_{X}_{Y}" class = "space" style = "left: {LEFT}px; top: {TOP}px;">
		    </div>
	    <!-- END space -->
	        <div id="pieces">
	    	</div>
	</div>
	<div id="stock">
		<div id="stockHolder_blue">
	    </div>
	    <div id="stockHolder_white">
	    </div>
	    <div id="stockHolder_red">
	    </div>
	    <div id="stockHolder_yellow">
	    </div>
	</div>
	<div id ="markerStock">
		<div id="stockHolder_lastPlayed">
		</div>
		<div id="stockHolder_ommittedSpace">
		</div>
	</div>
</div>

<script type="text/javascript">

// Javascript HTML templates

var jstpl_piece = '<div class="piece piece_${color}" id="piece_${x_y}" style="left: 0px; top: 0px;"></div>';

var jstpl_potential_piece = '<div class="piece piece_${color} potentialPiece" id="potential_piece_${x_y}" x="${x}" y="${y}" color="${color}" h="${h}" style="left: 0px; top: 0px;"></div>';

var jstpl_unplayed_piece = '<div class="unplayedPiece piece_${color}" id="${n}_${color}" color="${color}" h="${h}"></div>';

var jstpl_possible_move = '<div class="possibleMove" id="possible_move_${x_y}" x="${x}" y="${y}"></div>'

var jstpl_unavailable_move = '<div class="unavailableMove" id="unavailable_move_${x_y}"></div>'

var jstpl_last_played_marker = '<div class="lastPlayedMarker" id="lastPlayedMarker_${n}"></div>';

var jstpl_ommitted_space_marker = '<div class="ommittedSpaceMarker" id="ommittedSpaceMarker_${n}"></div>';

var jstpl_player_goal = '<div class="goal goal_${color}" id="goal_${color}"></div>';

</script>  

{OVERALL_GAME_FOOTER}
