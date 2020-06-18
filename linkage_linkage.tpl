{OVERALL_GAME_HEADER}

<!-- 
--------
-- TODO:
--	understand why code in .js works and get rid of what is not needed.
--	curved edges on game board should be transparent
-- 	board doesn't line up exactly with pixels
-- 
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- Linkage implementation : © Shaun Phillips <smphillips@alumni.york.ac.uk>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------
-->

<div id="table"> 
	<div id="board">
	    <!-- BEGIN space -->
		    <div id = "space_{X}_{Y}" class = "space" style = "left: {LEFT}px; top: {TOP}px;">
		    </div>
	    <!-- END space -->
	        <div id="pieces">
	    	</div>
	</div>
	<div id="stock">
		<div id="stockHolder_00359f">
	    </div>
	    <div id="stockHolder_ffffff">
	    </div>
	    <div id="stockHolder_860000">
	    </div>
	    <div id="stockHolder_e48a01">
	    </div>
	</div>
</div>

<script type="text/javascript">

// Javascript HTML templates

var jstpl_piece = '<div class="piece piece_${color}" id="piece_${x_y}" style="left: 0px; top: 0px;"></div>';

var jstpl_unplayed_piece = '<div class="unplayedPiece piece_${color}" id="unplayed_piece_${n}_${color}"></div>';

</script>  

{OVERALL_GAME_FOOTER}
