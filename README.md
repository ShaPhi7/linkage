Source code for the Linkage game on boardgamearena.com by smpphillips.

Please be aware that images are not present. Any images derivated from publishers artwork are copyrighted and cannot be licensed under a free license like Creative Commons.

The following is a final checklist:
colours used throughout code is horrible

Metadata and graphics
Game_meta-information: gameinfos.inc.php has correct and up to date information about the game

Server side
You have defined and implemented some meaningful statistics for your game (i.e. total points, point from source A, B, C...)
Game has meaningful notification messages (but don't overkill it, more user logs will slow down the loading)

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

Finally move to Alpha status
Create a build for your game from the "manage game" page (using the Build a new release version section) and check the log to make sure that everything builds fine (after a successful build, you should see a new version in "Versions available for production").
Send an e-mail to studio@boardgamearena.com asking to move the project forward for review. You cannot deploy yourself from the "manage game" page until a first deploy has been done by the admins. Please note that everything must be OK on the licensing side for a project to be moved to production.
When admins publish (push to alpha) they will send an email to the developer with all relevant information about the next steps.