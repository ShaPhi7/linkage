<?php

/*
 From this file, you can edit the various meta-information of your game.
 
 Once you modified the file, don't forget to click on "Reload game informations" from the Control Panel in order in can be taken into account.
 
 See documentation about this file here:
 http://en.doc.boardgamearena.com/Game_meta-information:_gameinfos.inc.php
 
 */

$gameinfos = array(
    
// Name of the game in English (will serve as the basis for translation)
    'game_name' => "Linkage",
    
    // Game designer (or game designers, separated by commas)
    'designer' => 'Ethan Larson',
    
    // Game artist (or game artists, separated by commas)
    'artist' => 'Néstor Romeral Andrés',
    
    // Year of FIRST publication of this game. Can be negative.
    'year' => 2009,
    
    // Game publisher
    'publisher' => 'nestorgames',
    
    // Url of game publisher website
    'publisher_website' => 'https://nestorgames.com/',
    
    // Board Game Geek ID of the publisher
    'publisher_bgg_id' => 10094,
    
    // Board game geek ID of the game
    'bgg_id' => 41149,
    
    // Players configuration that can be played (ex: 2 to 4 players)
    'players' => array( 2 ),
    
    // Suggest players to play with this number of players. Must be null if there is no such advice, or if there is only one possible player configuration.
    'suggest_player_number' => null,
    
    // Discourage players to play with these numbers of players. Must be null if there is no such advice.
    'not_recommend_player_number' => null,
    
    // Estimated game duration, in minutes (used only for the launch, afterward the real duration is computed)
    'estimated_duration' => 30,
    
    // Time in second add to a player when "giveExtraTime" is called (speed profile = fast)
    'fast_additional_time' => 30,
    
    // Time in second add to a player when "giveExtraTime" is called (speed profile = medium)
    'medium_additional_time' => 40,
    
    // Time in second add to a player when "giveExtraTime" is called (speed profile = slow)
    'slow_additional_time' => 50,
    
    // If you are using a tie breaker in your game (using "player_score_aux"), you must describe here
// the formula used to compute "player_score_aux". This description will be used as a tooltip to explain
// the tie breaker to the players.
// Note: if you are NOT using any tie breaker, leave the empty string.
//
// Example: 'tie_breaker_description' => totranslate( "Number of remaining cards in hand" ),
    'tie_breaker_description' => "",
    
    // If in the game, all losers are equal (no score to rank them or explicit in the rules that losers are not ranked between them), set this to true
// The game end result will display "Winner" for the 1st player and "Loser" for all other players
    'losers_not_ranked' => false,
    
    // Game is "beta". A game MUST set is_beta=1 when published on BGA for the first time, and must remains like this until all bugs are fixed.
    'is_beta' => 1,
    
    // Is this game cooperative (all players wins together or loose together)
    'is_coop' => 0,
    
    
    // Complexity of the game, from 0 (extremely simple) to 5 (extremely complex)
    'complexity' => 3,
    
    // Luck of the game, from 0 (absolutely no luck in this game) to 5 (totally luck driven)
    'luck' => 3,
    
    // Strategy of the game, from 0 (no strategy can be setup) to 5 (totally based on strategy)
    'strategy' => 3,
    
    // Diplomacy of the game, from 0 (no interaction in this game) to 5 (totally based on interaction and discussion between players)
    'diplomacy' => 3,
    
    // Colors attributed to players
    'player_colors' => array( "ffffff", "000000"),
    
    // Favorite colors support : if set to "true", support attribution of favorite colors based on player's preferences (see reattributeColorsBasedOnPreferences PHP method)
    'favorite_colors_support' => false,
    
    // When doing a rematch, the player order is swapped using a "rotation" so the starting player is not the same
// If you want to disable this, set this to false
    'disable_player_order_swap_on_rematch' => true,
    
    // Game interface width range (pixels)
// Note: game interface = space on the left side, without the column on the right
    'game_interface_width' => array(
        
        // Minimum width
        //  default: 740
        //  maximum possible value: 740 (ie: your game interface should fit with a 740px width (correspond to a 1024px screen)
        //  minimum possible value: 320 (the lowest value you specify, the better the display is on mobile)
        'min' => 740,
        
        // Maximum width
        //  default: null (ie: no limit, the game interface is as big as the player's screen allows it).
        //  maximum possible value: unlimited
        //  minimum possible value: 740
        'max' => null
    ),
    
            // Game presentation
            // Short game presentation text that will appear on the game description page, structured as an array of paragraphs.
            // Each paragraph must be wrapped with totranslate() for translation and should not contain html (plain text without formatting).
            // A good length for this text is between 100 and 150 words (about 6 to 9 lines on a standard display)
    'presentation' => array(
        totranslate("This game is played on a 7x7 board with the center square blacked out. There are 24 pieces, 6 of 4 different colors. Each piece is a domino covering exactly two cells of the board. Both players choose pieces from a shared pool."),        
        totranslate("There are two players in the game: the starting player is called 'More' and the other player is called 'Fewer'."),
        totranslate("The goals of the game are opposite for both players. The 'Fewer' player wins a finished game if the number of distinct groups of cells of the same color is less than 12. Otherwise the 'More' player wins.")
    ),
    
            // Games categories
            //  You can attribute a maximum of FIVE "tags" for your game.
            //  Each tag has a specific ID (ex: 22 for the category "Prototype", 101 for the tag "Science-fiction theme game")
            //  Please see the "Game meta information" entry in the BGA Studio documentation for a full list of available tags:
            //  http://en.doc.boardgamearena.com/Game_meta-information:_gameinfos.inc.php
            //  IMPORTANT: this list should be ORDERED, with the most important tag first.
            //  IMPORTANT: it is mandatory that the FIRST tag is 1, 2, 3 and 4 (= game category)
    'tags' => array( 2 ),
    
    
            //////// BGA SANDBOX ONLY PARAMETERS (DO NOT MODIFY)
    
            // simple : A plays, B plays, C plays, A plays, B plays, ...
            // circuit : A plays and choose the next player C, C plays and choose the next player D, ...
            // complex : A+B+C plays and says that the next player is A+B
    'is_sandbox' => false,
    'turnControl' => 'simple'
    
            ////////
);
