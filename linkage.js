/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Linkage implementation : © Shaun Phillips <smphillips@alumni.york.ac.uk>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * linkage.js
 *
 * Linkage user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (dojo, declare) {
    return declare("bgagame.linkage", ebg.core.gamegui, {
        constructor: function(){
            console.log('linkage constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

        },
        
        addTokenOnBoard: function(headX, headY, color, horizontal)
        {
            if (horizontal)
            {
                
            }
            else
            {
                dojo.place(this.format_block('jstpl_piece', {
                    x_y: headX + '_' + headY,
                    color: color,
                }) , 'pieces');
            
                pieceName = 'piece_' + headX + '_' + headY;
                this.placeOnObject(pieceName, 'board');
                dojo.place(pieceName, 'space_' + headX + '_' + headY);
                dojo.style(pieceName, "left", "0px");
                dojo.style(pieceName, "top", "0px");
            }
        },
        
        /*slideToObjectRelative : function(token, finalPlace, duration, delay, onEnd)
        {
            if (typeof token == 'string')
            {
                token = $(token);
            }

            //var self = this;
            //this.delayedExec(function() {
                //self.stripTransition(token);
                //this.stripPosition(token);
                //var box = this.attachToNewParentNoDestroy(token, finalPlace);

                //self.setTransition(token, "all " + duration + "ms ease-in-out");
                //this.placeOnObjectDirect(token, finalPlace, box.l, box.t);
                //this.placeOnObjectDirect(token, finalPlace, 0, 0);

            //}, function() {
                //self.stripTransition(token);
            //    self.stripPosition(token);
            //    if (onEnd) onEnd(token);
            //}, duration, delay);
        },*/

        /*placeOnObjectDirect : function(mobileObj, targetObj, x, y)
        {
        	//these were gets but were not used.
        	//var left = dojo.style(mobileObj, "left"); 
            //var top = dojo.style(mobileObj, "top");
        	
        	dojo.style(mobileObj, "left", x + "px");
            dojo.style(mobileObj, "top", y + "px");
        },*/
        
        /*delayedExec : function(onStart, onEnd, duration, delay) {
            if (typeof duration == "undefined") {
                duration = 500;
            }
            if (typeof delay == "undefined") {
                delay = 0;
            }
            if (this.instantaneousMode) {
                delay = Math.min(1, delay);
                duration = Math.min(1, duration);
            }
            if (delay) {
                setTimeout(function() {
                    onStart();
                    if (onEnd) {
                        setTimeout(onEnd, duration);
                    }
                }, delay);
            } else {
                onStart();
                if (onEnd) {
                    setTimeout(onEnd, duration);
                }
            }

        },*/
        
        /*stripPosition : function(token) {
            // console.log(token + " STRIPPING");
            // remove any added positioning style
            dojo.style(token, "display", "");
            dojo.style(token, "top", "");
            dojo.style(token, "left", "");
            dojo.style(token, "position", "");
            // dojo.style(token, "transform", null);
        },*/
        /*stripTransition : function(token) {
            this.setTransition(token, "");

        },*/
        /*setTransition : function(token, value) {
            dojo.style(token, "transition", value);
            dojo.style(token, "-webkit-transition", value);
            dojo.style(token, "-moz-transition", value);
            dojo.style(token, "-o-transition", value);

        },*/
        
        /**
         * This method will attach mobile to a new_parent without destroying, unlike original attachToNewParent which
         * destroys mobile and all its connectors (onClick, etc)
         */
        /*attachToNewParentNoDestroy : function(mobile, new_parent) {
            if (mobile === null) {
                console.error("attachToNewParent: mobile obj is null");
                return;
            }
            if (new_parent === null) {
                console.error("attachToNewParent: new_parent is null");
                return;
            }
            if (typeof mobile == "string") {
                mobile = $(mobile);
            }
            if (typeof new_parent == "string") {
                new_parent = $(new_parent);
            }

            var src = dojo.position(mobile);
            //dojo.style(mobile, "position", "absolute");
            dojo.place(mobile, new_parent);
            //dojo.place(mobile, new_parent, "last");
            var tgt = dojo.position(mobile);
            var box = dojo.marginBox(mobile);
            var cbox = dojo.contentBox(mobile);

            var left = box.l + src.x - tgt.x;
            var top = box.t + src.y - tgt.y;
            dojo.style(mobile, "top", top + "px");
            dojo.style(mobile, "left", left + "px");
            box.l += box.w - cbox.w;
            box.t += box.h - cbox.h;
            return box;
        },*/

        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function(gamedatas)
        {
            console.log("Starting game setup");
            
            // Setting up player boards
            for(var player_id in gamedatas.players)
            {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed
            }
            
            // TODO: Set up your game interface here, according to "gamedatas"
            
            for (var i in gamedatas.board)
            {
                piece = gamedatas.board[i];
                if (this.isPieceTopOrLeft(piece)) //the head of a piece is the space that is top/left.
                {
                    this.addTokenOnBoard(piece.x, piece.y, piece.color, this.isPieceHorizontal(piece));
                }
            }
            //this will become a method that checks how many of these there should be and dishes them out.
        	this.setupStock();
        	
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log("Ending game setup");
        },
        
        setupStock: function() {
        	this.setupStockColour("00359f", this.getNumberOfPiecesInStockForColor("00359f"));
        	this.setupStockColour("ffffff", this.getNumberOfPiecesInStockForColor("ffffff"));
        	this.setupStockColour("860000", this.getNumberOfPiecesInStockForColor("860000"));
        	this.setupStockColour("e48a01", this.getNumberOfPiecesInStockForColor("e48a01"));
    	},
        
        setupStockColour: function(color, unplayedPieces) {
        	for(var i=0; i<unplayedPieces; i++)
            {
        		dojo.place(this.format_block('jstpl_unplayed_piece', {
    	            n: i,
    	            color: color,
    	        }) , 'stockHolder_' + color);
    	        dojo.style('unplayed_piece_' + i + '_' + color, "left", "25%");
    	        dojo.style('unplayed_piece_' + i + '_' + color, "top", "100px");
    	        dojo.style('unplayed_piece_' + i + '_' + color, "position", "absolute");
            }
        },
        
        getNumberOfPiecesInStockForColor: function(color)
        {
            return 6 - this.getNumberOfPiecesOnBoardForColor(color);
        },

        getNumberOfPiecesOnBoardForColor: function(color)
        {
            var numberOfPiecesForColor = 0;
            for (var i in this.gamedatas.board)
            {
                piece = this.gamedatas.board[i];
                
                if (this.isPieceTopOrLeft(piece)
                  && piece.color == color)
                {
                    numberOfPiecesForColor++;
                }
            }

            return numberOfPiecesForColor;
        },
        
        isPieceTopOrLeft: function(piece)
        {
            half = piece.half;
            return half == "top"
              || half == "left"; 
        },

        isPieceHorizontal: function(piece)
        {
            half = piece.half;
            return half == "right"
              || half == "left"; 
        },

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
/*               
                 Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */


        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/linkage/linkage/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your linkage.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
