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
              
            this.colourToPlay = "";
        },
        

        addTokenOnBoardForXY: function(x, y)
        {
            this.addTokenOnBoard(x, y, this.colourToPlay);
        },

        addTokenOnBoard: function(x, y, colour)
        {
            x_y = x + '_' + y;
            dojo.place(this.format_block('jstpl_piece', {
                x_y: x_y,
                color: colour,
            }) , 'space_' + x_y);
        },

        addTokenOnBoardForPiece: function(piece)
        {
            //TODO: do you need the safety of checking that x1 and y1 is the start of the piece?
            if (this.isOmmittedSpaceMarker(piece))
            {
                this.addOmmittedSpaceMarkerOnBoard(piece);
            }
            else if (this.isHorizontal(piece))
            {
                //TODO
            }
            else
            {
                x = piece.x1;
                y = piece.y1;
                colour = piece.color;
                this.addTokenOnBoard(x, y, colour);
            
                //TODO not needed?
                //pieceName = 'piece_' + $x_y;
                //this.placeOnObject(pieceName, 'board');
                //dojo.place(pieceName, 'space_' + $x_y);
                //dojo.style(pieceName, "left", "0px");
                //dojo.style(pieceName, "top", "0px");
            }

            if (piece.lastPlayed == "1")
            {
                this.addLastPlayedMarkerOnPiece(piece);
            }
        },
        
        addLastPlayedMarkerOnPiece: function(piece)
        {   
            dojo.place(this.format_block('jstpl_last_played_marker', {n: 0}), 'board');
            this.placeOnObject('lastPlayedMarker_0', 'piece_' + piece.x1 + '_' + piece.y1);
            //dojo.place('last_played_marker', pieceName);
        },

        addOmmittedSpaceMarkerOnBoard: function(piece)
        {
            dojo.place(this.format_block('jstpl_ommitted_space_marker', {n: 0}), 'board');
            this.placeOnObject('ommittedSpaceMarker_0', 'space_' + piece.x1 + '_' + piece.y1);
        },
        
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
            
            for (var i in gamedatas.playedpiece)
            {
                piece = gamedatas.playedpiece[i];
                this.addTokenOnBoardForPiece(piece);
            }
            //this will become a method that checks how many of these there should be and dishes them out.
        	this.setupStock();
            
            dojo.query('.unplayedPiece').connect('onclick', this, 'onUnplayedPiece');
            dojo.query('.possibleMove').connect('onmousemove', this, 'onMouseMoveOverPossibleMove');

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log("Ending game setup");
        },
        
        setupStock: function() {
        	this.setupStockColour("00359f", this.getNumberOfPiecesInStockForColor("00359f"));
        	this.setupStockColour("ffffff", this.getNumberOfPiecesInStockForColor("ffffff"));
        	this.setupStockColour("860000", this.getNumberOfPiecesInStockForColor("860000"));
            this.setupStockColour("e48a01", this.getNumberOfPiecesInStockForColor("e48a01"));
            //TODO - add notifications for when these pieces deplete, and validation against adding extra.
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

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function(stateName, args)
        {
            console.log('Entering state: '+ stateName);
            
            switch(stateName)
            {
                case 'playerTurn':
                    this.updatePossibleMoves(args.args.possibleMoves);
                    break;
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
       getNumberOfPiecesInStockForColor: function(color)
       {
           return 6 - this.getNumberOfPiecesOnBoardForColor(color);
       },

       getNumberOfPiecesOnBoardForColor: function(color)
       {
           var numberOfPiecesForColor = 0;
           for (var i in this.gamedatas.playedpiece)
           {
               piece = this.gamedatas.playedpiece[i];
               
               if (piece.color == color)
               {
                   numberOfPiecesForColor++;
               }
           }

           return numberOfPiecesForColor;
       },

       getX_YFromTwoWordId : function(id)
       {
            xy = this.getXYFromTwoWordId(id);
            return xy[0] + '_' + xy[1];
       },

       getXYFromTwoWordId: function(id)
       {
            parts = id.split('_');

            var xy = [];
            xy[0] = parts[2];
            xy[1] = parts[3];
            
            return xy;
       },

       isHorizontal: function(piece)
       {
            return piece.x1 < piece.x2
              && piece.y1 == piece.y2;
       },

       isOmmittedSpaceMarker: function(piece)
       {
           return piece.x1 == piece.x2
               && piece.y1 == piece.y2;
       },

       updatePossibleMoves: function(possibleMoves)
       {
           // Remove any current moves that are showing
           this.removeAnyShowingMoves();

           for (var x in possibleMoves)
           {
            debugger;
               for (var y in possibleMoves[x])
               {
                    moveToShow = this.getMoveToShow(possibleMoves, x, y);
                    x_y = x + '_' + y;

                    dojo.place(this.format_block('jstpl_' + moveToShow + '_move', {x_y: x_y}), 'space_' + x_y);
               }            
           }
             
           dojo.query('.possibleMove').connect('onmousemove', this, 'onMouseMoveOverPossibleMove');
           //TODO what should this say?
           //this.addTooltipToClass( 'possibleMove', '', _('Place a mo here') );
       },

       removeAnyShowingMoves: function()
       {
            dojo.query('.possibleMove').removeClass('possibleMove');
            dojo.query('.unavailableMove').removeClass('unavailableMove');
       },

       getMoveToShow: function(possibleMoves, x, y)
       {
            if (possibleMoves[x][y]) //gets set true/false in getPossibleMoves in game
            {
                return 'possible';
            }
            return 'unavailable';
       },
        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */

        onMouseMoveOverPossibleMove : function(event) 
        {
            dojo.stopEvent(event);

            xy = this.getXYFromTwoWordId(event.currentTarget.id);
            x = xy[0];
            y = xy[1];

            if (this.shouldUpdatePossibleMove(x, y))
            {
                this.destroyPotentialPieceIfPresent();
                this.placePotentialPiece(x, y);
            }
        },

        shouldUpdatePossibleMove : function(x, y)
        {
            if (!this.isCurrentPlayerActive())
            {
                return false;
            }

            if (this.colourToPlay == "")
            {
                return false;
            }

            if (!this.isValidMove(x, y))
            {
                return false;
            }

            if (this.possibleMoveIsAlreadyShown(x, y))
            {
                return false;
            }

            return true;
        },

        possibleMoveIsAlreadyShown : function(x, y)
        {
            potential_piece = dojo.query('.potentialPiece')[0]; //if piece is on board
            if (potential_piece)
            {
                currentX = this.getXYFromTwoWordId(potential_piece.id)[0];
                currentY = this.getXYFromTwoWordId(potential_piece.id)[1];

                if (x == currentX
                &&  y == currentY)
                {
                    //same piece, do nothing
                    return true;
                }
            }
            return false;
        },

        //TODO - this check should be smarter and allow placement where I'm hovering over the lower part of where a vertical piece would go.
        isValidMove : function(x, y)
        {
            yPlusOne = y;
            yPlusOne++;

            return $('possible_move_' + x + '_' + yPlusOne);
        },

        destroyPotentialPieceIfPresent : function()
        {
            potential_piece = dojo.query('.potentialPiece')[0]; //if piece is on board
            if (potential_piece)
            {
                x_y = this.getX_YFromTwoWordId(potential_piece.id);
                dojo.destroy("potential_piece_" + x_y);
            }
        },

        placePotentialPiece : function(x, y)
        {
            x_y = x + '_' + y;

            dojo.place(this.format_block('jstpl_potential_piece', {
                x_y: x_y,
                color: this.colourToPlay,
            }) , 'space_' + x_y);

            dojo.query('.potentialPiece').connect('onclick', this, 'onPotentialPiece');
        },


        /**
         * this just sets the colour that the player has chosen to play.
         */
        onUnplayedPiece: function(event)
        {
            dojo.stopEvent(event);

            if (!this.isCurrentPlayerActive())
            {
                return;
            }

            var id = event.currentTarget.id;

            console.log('id: ' + id);

            this.colourToPlay = id.split('_')[3];

            console.log('colourToPlay: ' + this.colourToPlay);

            this.destroyPotentialPieceIfPresent();

            /*potentialPiece = dojo.query('.potentialPiece')[0];
            if (potentialPiece)
            {
                

                potentialPieceId = potentialPiece.id; //only ever 0 or 1 potential piece
                xy = this.getXYFromTwoWordId(potentialPieceId);
                x_y = xy[0] + '_' + xy[1];
                dojo.place(this.format_block('jstpl_potential_piece', {
                    x_y: x_y,
                    color: this.colourToPlay,
                }) , 'space_' + x_y, 'only');
            }*/
            
        },

        onPotentialPiece: function(event)
        {
            dojo.stopEvent(event);

            xy = this.getXYFromTwoWordId(event.currentTarget.id);
            x = xy[0];
            y = xy[1];

            //TODO - get this check to work, it's because it is a child not as a class perhaps? Maybe get the elements manually?
            /*if (!dojo.hasClass('space_' + x + '_' + y, 'possibleMove'))
            {
                //not a possible move so do nothing.
                return;
            }*/

            if(this.checkAction('placePiece'))    // Check that this action is possible at this moment
            {        
                debugger;    
                this.ajaxcall( "/linkage/linkage/placePiece.html", {
                    x:x,
                    y:y,
                    color:this.colourToPlay
                }, this, function(result){});
            }

            this.addTokenOnBoardForXY(x,y);
        },

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

