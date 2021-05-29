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
 * linkage.view.php
 *
 * This is your "view" file.
 *
 * The method "build_page" below is called each time the game interface is displayed to a player, ie:
 * _ when the game starts
 * _ when a player refreshes the game page (F5)
 *
 * "build_page" method allows you to dynamically modify the HTML generated for the game interface. In
 * particular, you can set here the values of variables elements defined in linkage_linkage.tpl (elements
 * like {MY_VARIABLE_ELEMENT}), and insert HTML block elements (also defined in your HTML template file)
 *
 * Note: if the HTML of your game interface is always the same, you don't have to place anything here.
 *
 */
  
  require_once( APP_BASE_PATH."view/common/game.view.php" );
  
  class view_linkage_linkage extends game_view
  {
    function getGameName() {
        return "linkage";
    }    
  	function build_page($viewArgs)
  	{		
  	    // Get players & players number
        $players = $this->game->loadPlayersBasicInfos();
        $players_nbr = count( $players );

        /*********** Place your code below:  ************/

        $this->page->begin_block("linkage_linkage", "space");
        $this->page->begin_block("linkage_linkage", "border");
        $this->page->begin_block("linkage_linkage", "border_h");
        $this->page->begin_block("linkage_linkage", "border_corner");
        
        $horizontal_offset = 49;
        $vertical_offset = 49;
        $horizontal_scale = 44;
        $vertical_scale = 44;
        for ($x=7; $x>=0; $x--)
        {
            for ($y=7; $y>=0; $y--)
            {
                if ($x < 7
                  && $y < 7)
                {
                    $this->page->insert_block("space",
                        array (
                            'X' => $x,
                            'Y' => $y,
                            'LEFT' => $x * $horizontal_scale + $horizontal_offset,
                            'TOP' => $y * $vertical_scale + $vertical_offset));
                }

                if ($y < 7)
                {
                    $this->page->insert_block("border",
                    array (
                        'X' => $x,
                        'Y' => $y,
                        'LEFT' => $x * $horizontal_scale + $horizontal_offset - 2,
                        'TOP' => $y * $vertical_scale + $vertical_offset));
                }

                if ($x < 7)
                {
                    $this->page->insert_block("border_h",
                    array (
                        'X' => $x,
                        'Y' => $y,
                        'LEFT' => $x * $horizontal_scale + $horizontal_offset,
                        'TOP' => $y * $vertical_scale + $vertical_offset - 2));
                }

                $this->page->insert_block("border_corner",
                array (
                    'X' => $x,
                    'Y' => $y,
                    'LEFT' => $x * $horizontal_scale + $horizontal_offset - 2,
                    'TOP' => $y * $vertical_scale + $vertical_offset - 2));
                
            }
        }
        //also insert borders at each sensible place
        
        /*
        
        // Examples: set the value of some element defined in your tpl file like this: {MY_VARIABLE_ELEMENT}

        // Display a specific number / string
        $this->tpl['MY_VARIABLE_ELEMENT'] = $number_to_display;

        // Display a string to be translated in all languages: 
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::_("A string to be translated");

        // Display some HTML content of your own:
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::raw( $some_html_code );
        
        */
        
        /*
        
        // Example: display a specific HTML block for each player in this game.
        // (note: the block is defined in your .tpl file like this:
        //      <!-- BEGIN myblock --> 
        //          ... my HTML code ...
        //      <!-- END myblock --> 
        

        $this->page->begin_block( "linkage_linkage", "myblock" );
        foreach( $players as $player )
        {
            $this->page->insert_block( "myblock", array( 
                                                    "PLAYER_NAME" => $player['player_name'],
                                                    "SOME_VARIABLE" => $some_value
                                                    ...
                                                     ) );
        }
        
        */



        /*********** Do not change anything below this line  ************/
  	}
  }
  

