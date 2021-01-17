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
            
            this.possibleMoves = [];
            this.playedPieces  = [];

            this.colourToPlay  = "";
            this.horizontalToPlay = "false";
        },
        
        addTokenOnBoard: function(x, y, colour, h)
        {
            x_y = x + '_' + y;
            dojo.place(this.format_block('jstpl_piece', {
                x_y: x_y,
                color: colour,
                h: h,
            }) , 'space_' + x_y);

            x2 = x;
            y2 = y;

            //TODO - find a better way
            if (h == true
              || h == 'true')
            {
                dojo.style('piece_' + x + '_' + y, "transform", "rotate(90deg)");
                x2++;
                x2 = '' + x2 + '';
            }
            else
            {
                y2++;
                y2 = '' + y2 + '';
            }

            this.addToPlayedPieces(x1=x, y1=y, x2=x, y2=y2, color=colour);
            
        },

        addToPlayedPieces: function(x, y, x2, y2, colour)
        {
            this.playedPieces.push({x1:x, y1:y, x2: x2, y2: y2, color: colour});
        },

        addTokenOnBoardForPiece: function(piece)
        {
            if (this.isOmmittedSpaceMarker(piece))
            {
                this.addOmmittedSpaceMarkerOnBoard(piece);
            }
            else
            {
                x = piece.x1;
                y = piece.y1;
                colour = piece.color;
                h = this.isHorizontal(piece)
                this.addTokenOnBoard(x, y, colour, h);
            }
        },
        
        addLastPlayedMarkerOnPiece: function(piece)
        {   
            dojo.place(this.format_block('jstpl_last_played_marker', {n: 0}), 'board');
            this.placeOnObject('lastPlayedMarker_0', 'piece_' + piece.x1 + '_' + piece.y1);
            //dojo.place('last_played_marker', pieceName);
        },

        moveLastPlayedMarker: function(x, y)
        {
            this.slideToObject('lastPlayedMarker_0', 'piece_' + x + '_' + y).play();
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
            }

            for (var i in gamedatas.playedpiece)
            {
                piece = gamedatas.playedpiece[i];
                this.addTokenOnBoardForPiece(piece);
                if (piece.lastPlayed == 1)
                {
                    this.addLastPlayedMarkerOnPiece(piece);
                }
            }

            //either put it on the last played piece, or put it at the side of the board.
            this.placeLastPlayedMarkerOnBoardIfNeeded();

            //this will become a method that checks how many of these there should be and dishes them out.
            this.setupStock();
            
            dojo.query('.possibleMove').connect('onmousemove', this, 'onMouseMoveOverPossibleMove');
            dojo.query('.unplayedPiece').connect('onmousemove', this, 'onMouseMoveOverUnplayedPiece');
            dojo.query('#stock').connect('onmousemove', this, 'onMouseMoveOverStock');
            //TODO - do I need to care about removing these connectors?
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log("Ending game setup");
        },
        
        placeLastPlayedMarkerOnBoardIfNeeded: function()
        {
            lastPlayedMarker = dojo.query('.lastPlayedMarker')[0]; //if piece is on board
            if (lastPlayedMarker)
            {
                //already on board
            }
            else
            {
                //TODO - put somewhere nice
                dojo.place(this.format_block('jstpl_last_played_marker', {n: 0}), 'board');
            }
        },

        setupStock: function()
        {
            this.setupStockColour("00359f");
        	this.setupStockColour("ffffff");
        	this.setupStockColour("860000");
            this.setupStockColour("e48a01");

            dojo.query('.unplayedPiece').connect('onclick', this, 'onUnplayedPiece');
        },
        
        setupStockColour: function(color)
        {
            if (this.getNumberOfPiecesInStockForColor(color) > 0)
            {
                this.addUnplayedPieceToStockVertical(color);
                this.addUnplayedPieceToStockHorizontal(color);
            }
        },

        addUnplayedPieceToStockVertical: function(color)
        {
            id = 'unplayed_piece_v';
            this.addUnplayedPieceToStock(id, color, false);

            dojo.style(id + '_' + color, "left", "10px");
            dojo.style(id + '_' + color, "transform", "scale(0.5, 0.5)");
        },
        
        addUnplayedPieceToStockHorizontal: function(color)
        {
            id = 'unplayed_piece_h';
            this.addUnplayedPieceToStock(id, color, true);

            dojo.style(id + '_' + color, "transform", "scale(0.5, 0.5) rotate(90deg)");
            dojo.style(id + '_' + color, "left", "60px");
        },

        addUnplayedPieceToStock: function(id, color, horizontal)
        {
            dojo.place(this.format_block('jstpl_unplayed_piece', {
                n: id,
                color: color,
                h: horizontal,
            }) , 'stockHolder_' + color);
            dojo.style(id + '_' + color, "left", "25%");
            dojo.style(id + '_' + color, "position", "absolute");
        },

        updateStock: function()
        {
            this.removeUnplayedPiecesIfStockEmpty("00359f");
        	this.removeUnplayedPiecesIfStockEmpty("ffffff");
        	this.removeUnplayedPiecesIfStockEmpty("860000");
            this.removeUnplayedPiecesIfStockEmpty("e48a01");
        },

        removeUnplayedPiecesIfStockEmpty: function(color)
        {
            if (!this.getNumberOfPiecesInStockForColor(color) > 0)
            {
                dojo.destroy('unplayed_piece_v' + '_' + color);
                dojo.destroy('unplayed_piece_h' + '_' + color);
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
                    this.possibleMoves = args.args.possibleMoves;
                    this.updatePossibleMoves();
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
           for (var i in this.playedPieces)
           {
               piece = this.playedPieces[i];
               
               if (piece.color == color)
               {
                   numberOfPiecesForColor++;
               }
           }

           return numberOfPiecesForColor;
       },

       //TODO - can we make these use dojo.attr instead
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

       updatePossibleMoves: function()
       {
           // Remove any current moves that are showing
           this.removeAnyShowingMoves();

           for (var x in this.possibleMoves)
           {
               for (var y in this.possibleMoves[x])
               {
                    if (!this.isPlayedPieceOnSpace(x, y))
                    {
                        moveToShow = this.getMoveToShow(x, y);
                        x_y = x + '_' + y;

                        dojo.place(this.format_block('jstpl_' + moveToShow + '_move', {x_y: x_y}), 'space_' + x_y);
                    }
               }            
           }
             
           dojo.query('.possibleMove').connect('onmousemove', this, 'onMouseMoveOverPossibleMove');
           //TODO what should this say?
           //this.addTooltipToClass( 'possibleMove', '', _('Place a mo here') );
       },

       removeAnyShowingMoves: function()
       {
           this.removeDivs('.possibleMove');
           this.removeDivs('.unavailableMove');
       },

       removeDivs: function(classToRemove)
       {
            divsToRemove = dojo.query(classToRemove);
            while (divsToRemove.length > 0)
            {
                divsToRemove[0].parentNode.removeChild(divsToRemove[0]);
                divsToRemove.shift();
            }
       },

       isPlayedPieceOnSpace: function(x, y)
       {
            for (var pp in this.playedPieces)
            {
                playedPiece = this.playedPieces[pp];
                if (x == playedPiece.x1
                 && y == playedPiece.y1)
                {
                    return true;
                }
                
                if (x == playedPiece.x2
                 && y == playedPiece.y2)
                {
                    return true;
                }
            }

            return false;
       },

       getMoveToShow: function(x, y)
       {
            if (this.possibleMoves[x][y]) //gets set true/false in getPossibleMoves in game
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

            if (!this.shouldIgnoreMouseOverPossibleMove())
            {
                xy = this.getXYFromTwoWordId(event.currentTarget.id);
                this.updatePossibleMoveIfNeeded(xy[0], xy[1])
            }
        },

        updatePossibleMoveIfNeeded : function(x, y)
        {
            //TODO - does this need to be even better at placing the piece?
            //adjust the move for the board limits
            if (this.horizontalToPlay == 'true'
                && !this.isValidMove(x, y))
            {
                x = x-1;
            }
            else if (this.horizontalToPlay == 'false'
            && !this.isValidMove(x, y))
            {
                y = y-1;
            }

            if (this.shouldUpdatePossibleMove(x, y))
            {
                this.destroyPotentialPieceIfPresent();
                this.placePotentialPiece(x, y);
            }
        },

        shouldIgnoreMouseOverPossibleMove : function()
        {
            if (!this.isCurrentPlayerActive())
            {
                return true;
            }

            if (this.colourToPlay == "")
            {
                return true;
            }

            if (this.getNumberOfPiecesOnBoardForColor(this.colourToPlay) > 5)
            {
                return true;
            }

            //we don't check if it's a valid move here, because if it is,
            //we let the possible move show nearby (see updatePossibleMoveIfNeeded).

            return false;
        },

        shouldUpdatePossibleMove : function(x, y)
        {
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

        isSpace : function(x, y)
        {
            return x >= 0
            && y >= 0
            && x < 7
            && y < 7;
        },

        isValidMove : function(x, y)
        {
            if (!this.isSpace(x, y))
            {
                return false;
            }

            if (this.horizontalToPlay == 'true')
            {
                return this.isValidMoveHorizontal(x, y);
            }
            else
            {
                return this.isValidMoveVertical(x, y);
            }
        },

        isValidMoveHorizontal : function(x, y)
        {
            if (x == 6)
            {
                return false;
            }
            else
            {
                xPlusOne = x;
                xPlusOne++;

                return this.possibleMoves[xPlusOne][y]
                    && this.possibleMoves[x][y];
            }
        },

        isValidMoveVertical : function(x, y)
        {
            if (y == 6)
            {
                return false;
            }
            else
            {
                yPlusOne = y;
                yPlusOne++;

                return this.possibleMoves[x][y]
                    && this.possibleMoves[x][yPlusOne];
            }
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
                h: this.horizontalToPlay //note - sometimes shows as unset in debugger, but it is set
            }) , 'space_' + x_y);

            if (this.horizontalToPlay == 'true')
            {
                dojo.style('potential_piece_' + x + '_' + y, "transform", "rotate(90deg)");
            }

            dojo.query('.potentialPiece').connect('onclick', this, 'onPotentialPiece');
        },

        onUnplayedPiece: function(event)
        {
            dojo.stopEvent(event);

            if (!this.isCurrentPlayerActive())
            {
                return;
            }
            var unplayedPiece = event.currentTarget;
            var id = unplayedPiece.id;

            console.log('id: ' + id);

            this.colourToPlay = dojo.attr(id, 'color');
            this.horizontalToPlay = dojo.attr(id, 'h');            

            console.log('colourToPlay: ' + this.colourToPlay);
            console.log('horizontalToPlay: ' + this.horizontalToPlay);

            this.destroyPotentialPieceIfPresent();
            this.updatePossibleMoveIfNeeded(6, 6);
        },

        onMouseMoveOverUnplayedPiece: function(event)
        {
            dojo.stopEvent(event);

            if (!this.isCurrentPlayerActive())
            {
                return;
            }

            var unplayedPiece = event.currentTarget;
            var id = unplayedPiece.id;
            
            dojo.style(id, "opacity", 0.7);
        },

        onMouseMoveOverStock: function(event)
        {
            dojo.stopEvent(event);

            if (!this.isCurrentPlayerActive())
            {
                return;
            }
            
            unplayedPieces = dojo.query('.unplayedPiece');
            for (var i in unplayedPieces)
            {
                piece = unplayedPieces[i];
                id = piece.id;
                if (id)
                {
                    dojo.style(id, "opacity", 1);
                }
            }
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

            if(!this.checkAction('placePiece'))    // Check that this action is possible at this moment
            {
                //TODO - error handling for all of these cases
                return;      
            }  

            if (!this.isValidMove(x, y))
            {
                return;
            }

            //TODO - add check to make sure they can only play one tile per turn - global variable check or something?

            if (!this.getNumberOfPiecesOnBoardForColor(this.colourToPlay) > 5)
            {
                return;
            }

            this.ajaxcall( "/linkage/linkage/placePiece.html", {
                x: x,
                y: y,
                color: this.colourToPlay,
                h: this.horizontalToPlay, //note - sometimes debugger shows h as unset, even though it is.
            }, this, function(result){});

            this.destroyPotentialPieceIfPresent();
            this.colourToPlay = "";
            //horizontalToPlay is just a boolean so is not reset here
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
            dojo.subscribe('addToken', this, "notif_addToken");
            this.notifqueue.setSynchronous('addToken', 500);
            dojo.subscribe('updateStock', this, "notif_updateStock");
            this.notifqueue.setSynchronous('updateStock', 100);
            dojo.subscribe('log', this, "notif_log");
            this.notifqueue.setSynchronous('log', 100);
            dojo.subscribe('removeLastPlayedPiece', this, "notif_removeLastPlayedPiece");
            this.notifqueue.setSynchronous('removeLastPlayedPiece', 500);
        },  
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
        },    
        
        */
       notif_addToken: function(notif)
       {
           this.addTokenOnBoard(notif.args.x, notif.args.y, notif.args.colour, notif.args.h);
           this.moveLastPlayedMarker(notif.args.x, notif.args.y);
       },

       notif_updateStock: function(notif)
       {
            this.updateStock();
       },

       notif_removeLastPlayedPiece: function(notif)
       {
           this.slideToObject('lastPlayedMarker_0', 'ommittedSpaceMarker_0').play();
       },

       notif_log: function(notif)
       {
           console.log(notif.args.logging);
       }
   });             
});
