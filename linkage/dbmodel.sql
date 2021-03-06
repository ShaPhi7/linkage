
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- Linkage implementation : © Shaun Phillips <smphillips@alumni.york.ac.uk>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

CREATE TABLE IF NOT EXISTS `playedpiece` (
  `x1` smallint(5) unsigned NOT NULL,
  `y1` smallint(5) unsigned NOT NULL,
  `x2` smallint(5) unsigned NOT NULL,
  `y2` smallint(5) unsigned NOT NULL,
  `color` char(6) DEFAULT NULL,
  `last_played` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`x1`,`y1`, `x2`,`y2`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `player` ADD `player_confirmation` smallint(5) unsigned NOT NULL DEFAULT '1';