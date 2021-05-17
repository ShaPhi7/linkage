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
            
            this.debugMode = "true"; //used to turn console logging on and off

            this.possibleMoves = []; //from game.php, shows where pieces could be played each turn
            this.playedPieces  = []; //useful to track this in js mainly just as a helper

            this.colourToPlay  = ""; 
            this.horizontalToPlay = "false"; 

            //if you change these, you must also update constants in game.php, .css and .tpl
            this.BLUE = "blue";
            this.WHITE = "white";
            this.RED = "red";
            this.YELLOW = "yellow";

            this.takenTurn = "false"; //only used to stop players placing more than one piece
        },
        
        logIfDebugMode: function(log)
        {
            if (this.debugMode == "true")
            {
                console.log(log);
            }
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
           
            hStr = h.toString();
            if (hStr == 'true')
            {
                dojo.style('piece_' + x_y, "transform", "rotate(90deg)");
                x2 = Number(x) + 1;
            }
            else
            {
                y2 = Number(y) + 1;
            }

            this.addToPlayedPieces(x1=x, y1=y, x2=x2.toString(), y2=y2.toString(), color=colour);
            
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
            this.addTooltip( 'lastPlayedMarker_0', '', _('This green marker indicates the piece that was played previously.') );
        },

        moveLastPlayedMarker: function(x, y)
        {
            this.slideToObject('lastPlayedMarker_0', 'piece_' + x + '_' + y).play();
        },

        addLastPlayedMarkerToStockIfNeeded: function()
        {
            if (!dojo.query('.lastPlayedMarker')[0])
            {
                dojo.place(this.format_block('jstpl_last_played_marker', {n: 0}), 'stockHolder_lastPlayed');
                this.addTooltip( 'lastPlayedMarker_0', '', _('This green marker indicates the piece that was played previously.') );
            }
        },

        addOmmittedSpaceMarkerOnBoard: function(piece)
        {
            dojo.place(this.format_block('jstpl_ommitted_space_marker', {n: 0}), 'board');
            this.placeOnObject('ommittedSpaceMarker_0', 'space_' + piece.x1 + '_' + piece.y1);
            this.addTooltip( 'ommittedSpaceMarker_0', '', _('This black marker indicates that pieces may not be placed on this square.') );
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
            this.logIfDebugMode("Starting game setup");
            
            for(var player_id in gamedatas.players)
            {
                var player = gamedatas.players[player_id];

                var player_board_div = $('player_board_'+player_id);
                dojo.place(this.format_block('jstpl_player_goal', player), player_board_div);
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
            this.addLastPlayedMarkerToStockIfNeeded();

            this.setupStock();
            this.setupColourGroupsCounter(gamedatas.colourGroups);

            dojo.query('.possibleMove').connect('onmousemove', this, 'onMouseMoveOverPossibleMove');
            dojo.query('.unplayedPiece').connect('onmousemove', this, 'onMouseMoveOverUnplayedPiece');
            dojo.query('#stock').connect('onmousemove', this, 'onMouseMoveOverStock');
            
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            this.logIfDebugMode("Ending game setup");
        },

        setupStock: function()
        {
            this.setupStockColour(this.BLUE);
        	this.setupStockColour(this.WHITE);
        	this.setupStockColour(this.RED);
            this.setupStockColour(this.YELLOW);

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
            this.removeUnplayedPiecesIfStockEmpty(this.BLUE);
        	this.removeUnplayedPiecesIfStockEmpty(this.WHITE);
        	this.removeUnplayedPiecesIfStockEmpty(this.RED);
            this.removeUnplayedPiecesIfStockEmpty(this.YELLOW);
        },

        removeUnplayedPiecesIfStockEmpty: function(color)
        {
            if (!this.getNumberOfPiecesInStockForColor(color) > 0)
            {
                dojo.destroy('unplayed_piece_v' + '_' + color);
                dojo.destroy('unplayed_piece_h' + '_' + color);
            }
        },

        setupColourGroupsCounter: function(numberOfColourGroups)
        {
            this.addTooltip( 'colourGroupsCounter', '', _('This indicates the number of colour groups currently on the board.') );
            dojo.place(this.format_block('jstpl_cg_text', {}) , 'colourGroupsCounter');
    
            var element = document.getElementById("cgText");
            element.innerHTML = numberOfColourGroups;

            this.setCgCounterColouring(numberOfColourGroups);
        },

        setCgCounterColouring: function(numberOfColourGroups)
        {
            if (numberOfColourGroups > 11)
            {
                dojo.style('colourGroupsCounter', "background-color", "black");
                dojo.style('cgText', "color", "white");
            }
            else
            {
                dojo.style('colourGroupsCounter', 'background-color', 'white');
                dojo.style('cgText', 'color', 'black');
            }
        },

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function(stateName, args)
        {
            this.logIfDebugMode('Entering state: '+ stateName);
            
            switch(stateName)
            {
                case 'playerTurn':
                    this.takenTurn = 'false';
                    this.possibleMoves = args.args.possibleMoves;
                    this.updateMovesToShow();
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
            this.logIfDebugMode( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            this.logIfDebugMode( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
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

       updateMovesToShow: function()
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
                        dojo.place(this.format_block('jstpl_' + moveToShow + '_move', {x_y: x + '_' + y, x: x, y: y}), 'space_' + x + '_' + y);
                    }
               }            
           }
             
           dojo.query('.possibleMove').connect('onmousemove', this, 'onMouseMoveOverPossibleMove');
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

       updateColourGroupsCounter: function(numberOfColourGroups)
       {
            var element = document.getElementById("cgText");
            element.innerHTML = numberOfColourGroups;
            this.setCgCounterColouring(numberOfColourGroups);
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
                id = event.currentTarget.id;
                this.updatePossibleMoveIfNeeded(dojo.getAttr(id, 'x'), dojo.getAttr(id, 'y'));
            }
        },

        updatePossibleMoveIfNeeded : function(x, y)
        {
            //if the move isn't valid, try a neighbouring space.
            if (!this.isValidMove(x, y))
            {
                if (this.isValidMove(x-1, y))
                {
                    x = Number(x)-1;
                }
                else if (this.isValidMove(x, y-1))
                {
                    y = Number(y)-1;
                }
                else if (this.isValidMove(Number(x)+1, y))
                {
                    x = Number(x)+1;
                }
                else if (this.isValidMove(x, Number(y)+1))
                {
                    y = Number(y)+1;
                }
                else if (this.isValidMove(Number(x)-1, Number(y)-1))
                {
                    x = Number(x)-1;
                    y = Number(y)-1;
                }
                else if (this.isValidMove(Number(x)-1, Number(y)+1))
                {
                    x = Number(x)-1;
                    y = Number(y)+1;
                }
                else if (this.isValidMove(Number(x)+1, Number(y)-1))
                {
                    x = Number(x)+1;
                    y = Number(y)-1;
                }
                else if (this.isValidMove(Number(x)+1, Number(y)+1))
                {
                    x = Number(x)+1;
                    y = Number(y)+1;
                }
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
            //we try to show the possible move show nearby (see updatePossibleMoveIfNeeded).

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
                if (x == dojo.getAttr(potential_piece.id, "x")
                &&  y == dojo.getAttr(potential_piece.id, "y"))
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
                return this.possibleMoves[x][y]
                    && this.possibleMoves[Number(x)+1][y];
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
                return this.possibleMoves[x][y]
                    && this.possibleMoves[x][Number(y)+1];
            }
        },

        destroyPotentialPieceIfPresent : function()
        {
            potential_piece = dojo.query('.potentialPiece')[0]; //if piece is on board
            if (potential_piece)
            {
                dojo.destroy(potential_piece.id);
            }
        },

        placePotentialPiece : function(x, y)
        {
            x_y = x + '_' + y;

            dojo.place(this.format_block('jstpl_potential_piece', {
                x_y: x_y,
                x: x,
                y: y,
                color: this.colourToPlay,
                h: this.horizontalToPlay //sometimes debugger appears to show h as unset, even though it is.
            }) , 'space_' + x_y);

            if (this.horizontalToPlay == 'true')
            {
                dojo.style('potential_piece_' + x_y, "transform", "rotate(90deg)");
            }

            dojo.query('.potentialPiece').connect('onclick', this, 'onPotentialPiece');
        },

        onUnplayedPiece: function(event)
        {
            dojo.stopEvent(event);

            if (!this.isCurrentPlayerActive())
            {
                this.showMessage(_("It is not your turn"), "error");
                return;
            }
            var unplayedPiece = event.currentTarget;
            var id = unplayedPiece.id;

            this.logIfDebugMode('id: ' + id);

            this.colourToPlay = dojo.attr(id, 'color');
            this.horizontalToPlay = dojo.attr(id, 'h');            

            this.logIfDebugMode('colourToPlay: ' + this.colourToPlay);
            this.logIfDebugMode('horizontalToPlay: ' + this.horizontalToPlay);

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

            if(!this.checkAction('placePiece'))    // Check that this action is possible at this moment
            {
                this.showMessage(_("It is not your turn"), "error");
                return;      
            }  

            if (!this.isValidMove(dojo.getAttr(event.currentTarget.id, "x"), dojo.getAttr(event.currentTarget.id, "y")))
            {
                this.showMessage(_("That is not a valid move"), "error");
                return;
            }

            if (this.takenTurn == 'true')
            {
                this.showMessage(_("You have already played this turn"), "error");
                return;
            }

            if (!this.getNumberOfPiecesOnBoardForColor(this.colourToPlay) > 5)
            {
                this.showMessage(_("There are no pieces of that colour remaining"), "error");
                return;
            }

            this.ajaxcall( "/linkage/linkage/placePiece.html", {
                lock: true,
                x: dojo.getAttr(event.currentTarget.id, "x"),
                y: dojo.getAttr(event.currentTarget.id, "y"),
                color: this.colourToPlay,
                h: this.horizontalToPlay, //sometimes debugger appears to show h as unset, even though it is.
            }, this, function(result){});

            this.takenTurn = 'true';
            this.destroyPotentialPieceIfPresent();
            this.colourToPlay = "";
            //horizontalToPlay is just a boolean so is not reset here
        },
        
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
            this.logIfDebugMode( 'notifications subscriptions setup' );
            
            dojo.subscribe('addToken', this, "notif_addToken");
            this.notifqueue.setSynchronous('addToken', 500);
            dojo.subscribe('updateStock', this, "notif_updateStock");
            this.notifqueue.setSynchronous('updateStock', 100);
            dojo.subscribe('log', this, "notif_log");
            this.notifqueue.setSynchronous('log', 100);
            dojo.subscribe('removeLastPlayedPiece', this, "notif_removeLastPlayedPiece");
            this.notifqueue.setSynchronous('removeLastPlayedPiece', 500);
            dojo.subscribe('updateColourGroups', this, "notif_updateColourGroups");
        },  
        
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
           this.showMessage(_("No available moves - this turn is skipped"), "info"),
           this.slideToObject('lastPlayedMarker_0', 'stockHolder_lastPlayed').play();
       },

       notif_updateColourGroups: function(notif)
       {
           this.updateColourGroupsCounter(notif.args.cg);
       },

       notif_log: function(notif)
       {
           //need to check if not null if you want to actually log
           //this.logIfDebugMode(notif.args.logging);
       }
   });             
});
