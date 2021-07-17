<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Linkage implementation : © Shaun Phillips <smphillips@alumni.york.ac.uk>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * linkage.action.php
 *
 * Linkage main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/linkage/linkage/myAction.html", ...)
 *
 */
  
  
  class action_linkage extends APP_GameAction
  { 
    // Constructor: please do not modify
   	public function __default()
  	{
  	    if( self::isArg( 'notifwindow') )
  	    {
            $this->view = "common_notifwindow";
  	        $this->viewArgs['table'] = self::getArg( "table", AT_posint, true );
  	    }
  	    else
  	    {
            $this->view = "linkage_linkage";
            self::trace( "Complete reinitialization of board game" );
      }
  	} 
    
    public function placePiece()
    {
        self::setAjaxMode();   

        $x = self::getArg("x", AT_posint, true);
        $y = self::getArg("y", AT_posint, true);
        $color = self::getArg("color", AT_alphanum, true);
        $h = self::getArg("h", AT_alphanum, true);

        $result = $this->game->placePiece($x, $y, $color, $h);
        self::ajaxResponse( );
    }

    public function turnOffConfirmationsForPlayer()
    {
        self::setAjaxMode();

        $id = self::getArg("id", AT_int, true);

        $result = $this->game->turnOffConfirmationsForPlayer($id);
        self::ajaxResponse( );
    }
  }
  

