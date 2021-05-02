Source code for the Linkage game on boardgamearena.com by smpphillips.

Please be aware that images are not present. Any images derivated from publishers artwork are copyrighted and cannot be licensed under a free license like Creative Commons.

The following is a final checklist:
ommitted marker variation?
stats
game infos
colours used throughout code is horrible
Metadata and graphics
Game_meta-information: gameinfos.inc.php has correct and up to date information about the game
Game box graphics is 3D version of the game box (if available) and publisher icon is correct (see Game art: img directory). Space around the box has to be transparent, not white.
You have added a game_banner.jpg and some game_displayX.jpg images to make the game page pretty (NB: on the studio, you have to create a build for these images to appear on the studio game page)
Server side
When giving their turn to a player, you give them some extra time with the giveExtraTime() function
Zombie turn is implemented (zombieTurn() in php). Note: it can only be tested if you explicitly click on the quit button to create a zombie. If you are expelled it does not generated a Zombie.
You have defined and implemented some meaningful statistics for your game (i.e. total points, point from source A, B, C...)
Game has meaningful notification messages (but don't overkill it, more user logs will slow down the loading)
Client side
Special testing
Game is tested with spectator (non player observer): change the testuser in the URL to see the game as another user (same URL as when clicking on red arrow). As a spectator, you should be able to see the game as if you were sitting beside of the players at a real table: all public information, no private information.
Game is tested with in-game replay from last move feature (by clicking on notification log items)
Game works in Chrome and Firefox browsers at least. Also very recommended to test in IE 11 and Edge.
Game works on mobile device (if you don't have mobile device to test at least test in Chrome with smaller screen, they have a mode for that)
Test your game in realtime mode. Usually people will run out of time if you use default times unless you add call giveExtraTime($active_player_id) before each turn
Test your game in 3D mode (if it makes sense; 3D mode can also be disabled through the 'enable_3d' parameter for gameinfos.inc.php, but if it "mostly works", it can be nice to keep it activated even if 2D is more appropriate for the game, just because it's fun to look at)
Cleanup
Remove all extra console.log from your js code
Remove all unnecessary debug logging from your php code
Copyright headers in all source files have your name
User Interface
Review BGA UI design Guidelines BGA_Studio_Guidelines
Check all your english message for proper use of punctuation, capitalization, usage of present tense in notification (not past) and gender nuturality. See Translations for English rules.
If the elements in your game zone don't occupy all the available horizontal space, they should be centered.
If your game elements become blurry or pixellated when using the browser zoom, you may want to consider higher resolution images with background-size
Non-self explanatory graphic elements should have tooltips
If graphic elements appear in notification log they should have titles (i.e. title attribute of div) so can be read in non rendered form (i.e. as text only)
Strings in your source code are ready for translation. See Translations. You can generate dummy translations for checking that everything is ready for translation from your "Manage game" page.
A prefix for example a trigram for your game that you append to all the css classes to avoid namespace conflicts, i.e. vla_selected vs selected
If you are looking for advice on design and some 3rd party testing you can post a message on the developers forum, and ask other developers, there are a lot of people who will gladly do it.
Finally move to Alpha status
If possible (meaning if there is not already a project with that name) copy your project to a new project matching exactly the name of the game (no prefix or suffix). If not possible move on to the next steps, admin will have to retrieve the other project and overwrite it.
Create a build for your game from the "manage game" page (using the Build a new release version section) and check the log to make sure that everything builds fine (after a successful build, you should see a new version in "Versions available for production").
Send an e-mail to studio@boardgamearena.com asking to move the project forward for review. You cannot deploy yourself from the "manage game" page until a first deploy has been done by the admins. Please note that everything must be OK on the licensing side for a project to be moved to production.
When admins publish (push to alpha) they will send an email to the developer with all relevant information about the next steps.