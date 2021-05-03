<?php
 /**
  *------
  * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
  * Linkage implementation : © Shaun Phillips <smphillips@alumni.york.ac.uk>
  * 
  * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
  * See http://en.boardgamearena.com/#!doc/Studio for more information.
  * -----
  * 
  * linkage.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );


class Linkage extends Table
{
    const BLUE = "blue";
    const WHITE = "white";
    const RED = "red";
    const YELLOW = "yellow";

	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();

        self::initGameStateLabels( array( 
            //ommitted_space_marker_variant => 100;
        ) );    

        $this->spacesFound = array();    
	}
	
    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "linkage";
    }	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];
 
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( $values, ',' );
        self::DbQuery( $sql );
        self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();

        //mark the ommitted space token, either player choice or center space.
        $this->insertPlayedPiece(3,3,3,3,"000000",0);

        //Note - if you just want some pieces set on the board to test, you can quickly add them here.
        //$this->insertPlayedPiece(4,3,5,3,"00359f",0);
        //$this->insertPlayedPiece(2,2,2,3,"860000",1);

        /************ Start the game initialization *****/

        // Init global values with their initial values
        //self::setGameStateInitialValue( 'my_first_global_variable', 0 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)
        self::initStat('table', 'pieces_played', 0);
        self::initStat('player', 'pieces_played_player', 0);
        self::initStat('player', 'pieces_played_corner', 0);
        self::initStat('player', 'pieces_played_corner_percentage', 0);

        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();

        /************ End of the game initialization *****/
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();
    
        $current_player_id = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!
    
        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );
  
        //get details of every piece played. Spaces that are empty are not included here. Only one piece is last played.
        $result['playedpiece'] = self::getObjectListFromDB("SELECT x1 x1, 
                                                                   y1 y1,
                                                                   x2 x2,
                                                                   y2 y2,
                                                                   color color,
                                                                   last_played lastPlayed
                                                            FROM playedpiece");

        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        //note this is a quick and simplistic calculation.
        //You could factor in the amount of single spaces left over that means not all pieces will be played.
        return count($this->getPlayedPiecesWithoutMarkers())*100/24;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /*
        In this space, you can put any utility methods useful for your game logic
    */

    function insertPlayedPiece($x1, $x2, $y1, $y2, $color, $last_played)
    {
        $color = '"'.$color.'"'; //extra formatting to deal with this being non-numeric (a . is an append symbol)
        $sql = "INSERT INTO `playedpiece`(`x1`, `y1`, `x2`, `y2`, `color`, `last_played`) VALUES ($x1, $x2, $y1, $y2, $color, $last_played)";
        
        return self::DbQuery($sql);
    }

    function getPlayedPieces()
    {
        $sql = "SELECT `x1` x1, `y1` y1, `x2`, `y2`, `color`, `last_played`
                FROM `playedpiece`";

        return self::getObjectListFromDB($sql);
    }

    function getPlayedPiecesWithoutMarkers()
    {
        $sql = "SELECT `x1`, `y1`, `x2`, `y2`, `color`
        FROM `playedpiece` 
        WHERE `color` <> '000000'";

        return self::getObjectListFromDB($sql);
    }

    function getPlayedPiecesForColor($color)
    {
        $sql = "SELECT `x1`, `y1`, `x2`, `y2`, `color`
        FROM `playedpiece` 
        WHERE `color` = '$color'";

        return self::getObjectListFromDB($sql);
    }

    function getLastPlayedPiece()
    {
        $sql = "SELECT `x1`, `y1`, `x2`, `y2`, `color`, `last_played` 
                FROM `playedpiece` 
                WHERE `last_played` = 1";

        return self::getObjectFromDB($sql);
    }

    function unmarkLastPlayedPiece()
    {
        $sql = "UPDATE playedpiece SET last_played = 0";

        return self::DbQuery($sql);
    }

    function getArrayOfSpaces()
    {
        $possibleMoves = array();

        for($x=0; $x<7; $x++)
        {
            $possibleMoves[$x] = array();
            for($y=0; $y<7; $y++)
            {
                $possibleMoves[$x][$y] = true;
            }
        }

        return $possibleMoves;
    }

    function getNumberOfPossibleMoves()
    {
        $numberOfPossibleMoves = 0;
        $booleanArrayOfPossibleMoves = $this->getBooleanArrayOfPossibleMoves();

        for($x=0; $x<7; $x++)
        {
            for($y=0; $y<7; $y++)
            {
                if($booleanArrayOfPossibleMoves[$x][$y] == true)
                {
                    $numberOfPossibleMoves++;
                }
            }
        }

        return $numberOfPossibleMoves;
    }

    //only rules here are must place on an empty space and must not place adjacent to the last played piece.
    //must also be adjacent to another playable square (i.e. single spaces are not playable).
    function getBooleanArrayOfPossibleMoves()
    {
        $possibleMoves = $this->getArrayOfSpaces();
        $possibleMoves = $this->markPlayedPiecesAsNotPossibleMoves($possibleMoves);
        $possibleMoves = $this->markAdjacentSpacesToLastPlayedPieceAsNotPossibleMovesIfPresent($possibleMoves);
        $possibleMoves = $this->markStandaloneSpacesAsNotPossibleMoves($possibleMoves);
        
        return $possibleMoves;
    }

    function markPlayedPiecesAsNotPossibleMoves($possibleMoves)
    {
        $playedPieces = $this->getPlayedPieces();

        for ($i=0;$i<count($playedPieces);$i++)
        {
            $playedPiece = $playedPieces[$i];
            $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $playedPiece["x1"], $playedPiece["y1"]);
            $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $playedPiece["x2"], $playedPiece["y2"]);
        }

        return $possibleMoves;
    }

    function markAdjacentSpacesToLastPlayedPieceAsNotPossibleMovesIfPresent($possibleMoves)
    {
        $lastPlayedPiece = $this->getLastPlayedPiece();
        if ($lastPlayedPiece)
        {
            $possibleMoves = $this->markAdjacentSpacesToLastPlayedPieceAsNotPossibleMoves($possibleMoves, $lastPlayedPiece);
        }

        return $possibleMoves;
    }

    function markAdjacentSpacesToLastPlayedPieceAsNotPossibleMoves($possibleMoves, $lastPlayedPiece)
    {
        //might have double (or triple!) set some of these but I don't care they'll all end up false.
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x1"]+1, $lastPlayedPiece["y1"]);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x1"]-1, $lastPlayedPiece["y1"]);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x1"], $lastPlayedPiece["y1"]+1);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x1"], $lastPlayedPiece["y1"]-1);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x2"]+1, $lastPlayedPiece["y2"]);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x2"]-1, $lastPlayedPiece["y2"]);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x2"], $lastPlayedPiece["y2"]+1);
        $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $lastPlayedPiece["x2"], $lastPlayedPiece["y2"]-1);

        return $possibleMoves;
    }

    function markStandaloneSpacesAsNotPossibleMoves($possibleMoves)
    {
        for($x=0; $x<count($possibleMoves); $x++)
        {
            $possibleMovesColumn = $possibleMoves[$x];
            for($y=0; $y<count($possibleMovesColumn); $y++)
            {
                if ($possibleMovesColumn[$y])
                {
                    $possibleMoves = $this->markAsNotPossibleMoveIfStandaloneSpace($possibleMoves, $x, $y);
                }
            }
        }

        return $possibleMoves;
    }

    function markAsNotPossibleMoveIfStandaloneSpace($possibleMoves, $x, $y)
    {
        if (!$this->isThereAPlayableSpaceAbove($possibleMoves, $x, $y)
        && !$this->isThereAPlayableSpaceLeft($possibleMoves, $x, $y)
        && !$this->isThereAPlayableSpaceBelow($possibleMoves, $x, $y)
        && !$this->isThereAPlayableSpaceRight($possibleMoves, $x, $y))
        {
            $possibleMoves = $this->markAsNotPossibleMoveIfSpace($possibleMoves, $x, $y);
        }

        return $possibleMoves;
    }

    function markAsNotPossibleMoveIfSpace($possibleMoves, $x, $y)
    {
        if ($this->isSpace($x, $y))
        {
            $possibleMoves[$x][$y] = false;
        }
        return $possibleMoves;
    }

    function isSpace($x, $y)
    {
        return $x >= 0
            && $y >= 0
            && $x < 7
            && $y < 7;
    }

    function isCornerSpace($x, $y)
    {
        //as pieces can span 2 spaces, the x and y correspond to the top left of the piece.
        return ($x == 0 & $y == 0)
            || ($x == 0 & $y == 5)
            || ($x == 0 & $y == 6)
            || ($x == 6 & $y == 0)
            || ($x == 5 & $y == 0)
            || ($x == 5 & $y == 6)
            || ($x == 6 & $y == 5);
    }

    function isPlayableSpace($possibleMoves, $x, $y)
    {
        if ($this->isSpace($x, $y))
        {
            return $possibleMoves[$x][$y];
        }
        else
        {
            return false;
        }
    }

    function isThereAPlayableSpaceAbove($possibleMoves, $x, $y)
    {   
        return $this->isPlayableSpace($possibleMoves, $x, $y-1);
    }

    function isThereAPlayableSpaceLeft($possibleMoves, $x, $y)
    {   
        return $this->isPlayableSpace($possibleMoves, $x-1, $y);
    }

    function isThereAPlayableSpaceBelow($possibleMoves, $x, $y)
    {   
        return $this->isPlayableSpace($possibleMoves, $x, $y+1);
    }

    function isThereAPlayableSpaceRight($possibleMoves, $x, $y)
    {   
        return $this->isPlayableSpace($possibleMoves, $x+1, $y);
    }

    function calculateNumberOfColourGroups()
    {
        $playedPieces = $this->getPlayedPiecesWithoutMarkers();
        $colorToPieceLocation = array(self::BLUE => array(),
                                      self::WHITE => array(),
                                      self::RED => array(),
                                      self::YELLOW => array());
        foreach ($playedPieces as $pp)
        {
            $currentArray = $colorToPieceLocation[$pp["color"]];
            $currentArray[] = array("x" => $pp["x1"], "y" => $pp["y1"]);
            $currentArray[] = array("x" => $pp["x2"], "y" => $pp["y2"]);
            $colorToPieceLocation[$pp["color"]] = $currentArray;
        }

        $colours = array_keys($colorToPieceLocation);
        $this->spacesFound = array();
        $groups = 0; 
        foreach ($colours as $colour)
        {
            $spacesForColour = $colorToPieceLocation[$colour];

            foreach ($spacesForColour as $space)
            {
                if (!in_array($space, $this->spacesFound))
                {
                    $this->findAdjacentSpaces($spacesForColour, $space["x"], $space["y"]);
                    $groups++;
                }
            }   
        }
        return $groups;
    }

    function findAdjacentSpaces($spacesForColour, $x, $y)
    {
        $space = array("x" => $x, "y" => $y);

        if (!$this->isSpace($x, $y))
        {
            return;
        }

        if (in_array($space, $this->spacesFound))
        {
            //already found this space
            return;
        }
        
        if (in_array($space, $spacesForColour))
        {
            array_push($this->spacesFound, $space);   
            $this->findAdjacentSpaces($spacesForColour, $x+1, $y);
            $this->findAdjacentSpaces($spacesForColour, $x, $y+1);
            $this->findAdjacentSpaces($spacesForColour, $x, $y-1);
            $this->findAdjacentSpaces($spacesForColour, $x-1, $y);
        }
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in linkage.action.php)
    */

    function placePiece($x, $y, $color, $h)
    {      
        //check action possible, check action sensible etc.
        self::checkAction('placePiece'); 

        if (!$this->validMove($x, $y, $h))
        {
            throw new feException("Impossible move");
            return;
        }

        if (count($this->getPlayedPiecesForColor($color)) > 5)
        {
            throw new feException("Too many pieces of this colour");
            return;
        }
        
        //we've decided we are playing a piece, so remove any existing last played pieces.
        $this->unmarkLastPlayedPiece();

        $this->insertPiece($x,$y, $color, $h);

        self::notifyAllPlayers("addToken",
            clienttranslate('${player_name} places a token'),
            array(
                    'player_name' => self::getActivePlayerName(),
                    'x' => $x,
                    'y' => $y,
                    'colour' => $color,
                    'h' => $h
                 ) 
            );
        
        self::notifyAllPlayers("updateStock", '', array());

        $this->updateStatsForPiecePlayed($x, $y, $h);

        //TODO - remove - helper to get to stats quicker
        $this->calculateStats($x, $y);

        $this->gamestate->nextState('placePiece');
    }

    function updateStatsForPiecePlayed($x, $y, $h)
    {
        self::incStat(1, 'pieces_played');
        self::incStat(1, 'pieces_played_player', self::getCurrentPlayerId());

        if ($this->isCornerSpace($x, $y, $h))
        {
            self::incStat(1, 'pieces_played_corner', self::getCurrentPlayerId());
        }
    }

    function validMove($x, $y, $h)
    {
        $possibleMoves = $this->getBooleanArrayOfPossibleMoves();
        if ($h == 'true')
        {
            return $this->validMoveHorizontal($x, $y, $possibleMoves);
        }   
        else
        {
            return $this->validMoveVertical($x, $y, $possibleMoves);
        }
    }

    function validMoveHorizontal($x, $y, $possibleMoves)
    {
        return $possibleMoves[$x][$y]
          && $this->isThereAPlayableSpaceRight($possibleMoves, $x, $y);
    }

    function validMoveVertical($x, $y, $possibleMoves)
    {
        return $possibleMoves[$x][$y]
          && $this->isThereAPlayableSpaceBelow($possibleMoves, $x, $y);
    }

    function insertPiece($x, $y, $color, $h)
    {
        if ($h == 'true')
        {
            return $this->insertPlayedPiece($x,$y,$x+1,$y,$color,1);
        }
        else
        {
            return $this->insertPlayedPiece($x,$y,$x,$y+1,$color,1);
        }
    }

    function logStateOfPlay($colourGroups)
    {
        self::notifyAllPlayers("log",
        clienttranslate('There are now '.$colourGroups.' colour groups'),
        array()
        );
    }

    function prepareNextTurn($colourGroups)
    {
        $this->logStateOfPlay($colourGroups);

        $this->activeNextPlayer();
       
        $newActivePlayerId = $this->getActivePlayerId();
        $this->giveExtraTime($newActivePlayerId);
        
        $this->gamestate->nextState('nextPlayer');
    }

    function unmarkLastPieceToPlayOn()
    {
        $this->unmarkLastPlayedPiece();
        $newNumberOfPossibleMoves = $this->getNumberOfPossibleMoves();
            
        return $newNumberOfPossibleMoves > 0;
    }

    function setWinner()
    {
        if ($this->calculateNumberOfColourGroups() >= 12)
        {
            //more wins - white
            $winner = 'ffffff';
        }
        else
        {
            //less wins - black
            $winner = '000000';
        }
        self::DbQuery("UPDATE player SET player_score = 1 WHERE player_color = '${winner}'");
    }
    
    function calculateStats()
    {
        $players = self::loadPlayersBasicInfos();
        foreach($players as $player_id => $player )
        {
            $piecesPlayedPlayer = self::getStat('pieces_played_player', $player_id);
            $piecesPlayedCorner = self::getStat('pieces_played_corner', $player_id);
            
            $piecesPlayedCornerPercentage = 0;
            if ($piecesPlayedPlayer > 0
              && $piecesPlayedCorner > 0)
            {
                $piecesPlayedCornerPercentage = ($piecesPlayedCorner / $piecesPlayedPlayer) * 100;
            }
            
            self::setStat($piecesPlayedCornerPercentage, 'pieces_played_corner_percentage', $player['player_id']);
        }
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */
    function argPlayerTurn()
    {
        return array('possibleMoves' => $this->getBooleanArrayOfPossibleMoves(),
                     'lastPlayedPiece' => $this->getLastPlayedPiece());
    }
    /*
    
    Example for game state "MyGameState":
    
    function argMyGameState()
    {
        // Get some values from the current game situation in database...
    
        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */
    function stNextTurnOrEnd()
    {
        $colourGroups = $this->calculateNumberOfColourGroups();

        if ($this->getNumberOfPossibleMoves() > 0)
        {
            $this->prepareNextTurn($colourGroups);
        }
        else
        {
            if ($this->unmarkLastPieceToPlayOn())
            {
                self::notifyAllPlayers("removeLastPlayedPiece",
                clienttranslate('There are no moves left, so the next turn is used to remove the last played token'),
                array() 
                );

                $this->gamestate->nextState('nextPlayer');
            }
            else
            {
                $this->setWinner();
                $this->calculateStats();
                $this->gamestate->nextState('endGame');    
            }
        }
    }

    /*
    
    Example for game state "MyGameState":

    function stMyGameState()
    {
        // Do some stuff ...
        
        // (very often) go to another gamestate
        $this->gamestate->nextState( 'some_gamestate_transition' );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }    
}