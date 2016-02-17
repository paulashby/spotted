Production notes
----------------- 

Issues on htc
• Instructions don't fit screen. 
• Line spacing too tight on heading. 
• Green missing asset boxes appeared initially for droplets (I think) but were OK on reload.
• Tween for 'Play' on GameOver moves elements to the wrong position - perhaps this should be based on viewHeight rather than gameHeight



Happy with sounds?

A few bugs fixed:

Ocassionally getting infinity for aphid positions- due, I think, to dy dx being set in my slowing down effort in updateAphids(mood 'precious')
Losing this and resetting life also helped - had to do this in fact because the execution order of the functions varied slightly due to update running out of sync with updateAphidAttack
(frame rate vs timer).

THis was also causing a problem with resetting the rotation as initAphid would occasionally be called before updateAphidAttack, so the latter reset rotation after init dset it.

OK, Game done apart from score font and sounds!!

The number of aphids at any given time goes up by one for every 30 pts scored up to an arbitrarily decided maximum of 15

////////////////////
// TO DO ////////////


Graphics more saturated.

Need to do in-game buttons.

Aphids are no longer added over water droplets

Refactored movement using tweens. Ladybird done, aphid to tackle next.

Start game with background sprite in front fading to 0 opacity - or leave as it is???
    
 Aphid walk is completely mental - what happened??? Also, it's not updated when ladybird is bounced.


this._aphid.attackUpdateTimer only running once.





Have added a speedCoefficient based on screen size to get consistent speed across screen sizes (the squared pulse width was causing problems);

BUT the performance on the iPad retina really sucks. The frame rate is ~15 fps.

So we could adjust for frame rate on movement of ladybird and aphid.

No - going to try using tweens instead of dy/dx



var _fps = this.time.fps;
var performanceAdjustment = 1;

if(_fps > 0){
	performanceAdjustment = 60/_fps;
}

then for speeds do ladybird.dx * performanceAdjustment



Palm shadow now incorporated into background.png





////////////////////
//////////////////

12 dots

try dot size 45 for small and normal

              |  gameWidth    gameHeight			aphid H				Ladybird H		water droplet	W		font			Percent				palm H as per gameHeight
---------------------------------------------------------------------------------------------------------------------------------------------

small      |  360                240					35						30						20								25*			75
               
normal     |  480                320					46						40						24								34			100
               
large      |  720                480					70						60						40								51			150
               
xlarge     |   960               640					92						80						48								68			200
               
xxlarge    |   1440              960					138						120						72								102*			300
,


Don't feel sorry for them - they're not as harmless as they look!

Click where the ladybird is going to be

To do
------

Are we sure we want the shadow in front - it looks a it like a mistake. If in bg, redo all the bg files with it in place.

water droplets slightly see through?

No instructions button. Play goes to instructions. Give THAT an ok button.

Just a thought - what if instead of angry aphids being totally dominant, they only eat you if they come from behind? If you get them from the front it's a big score?
Pizzicato music?

Refactored updateAphids using switch so it's more focussed on aphid.mood.

* Would be good if we could move angry aphid in short lunges, rather than smooth motion:


Set a random number of frames, update after that, get new number of random frames, update.
That won't work as it would teleport. Need to adjust dy/dx so it clumps - could do minus 1 for random num frames, then add quadruple that random number back on for a quarter as many frames....

Could we have an aphidAttack group in front of ladybird - move aphids to this when they change and back to regular aphids group when they die?
Animate ladybird walk - Nah.






Everything working apart from scoring.

I'm going to try changing the whole game to 'spotted'

with a ladybird instead of an ant and aphids instead of jewels.

I'm going to try controlling the ladybird by tapping at target - this was too easy. Reverted to pulse.



I could use the expanding circle control for a sheepdog game - or some sort of herding game

IDEAS
-----------------------------------------
-----------------------------------------
Jewels begin as quite camouflaged?

Factor proximity into jewels chasing ant?


Jewels are placed along diagonals so can position ant then pick up a few.

Not worth the hassle. 




-----------------------------------------
-----------------------------------------


Ants now bounce off edge of screen.

Ant/Jewel collision is flaky. Either sort some sort of bounding box (expensive I should think)
or have jewels react to close misses, so there are no more of those 'wait a minute, I HIT that!' moments.

----------------------------------------

Pulse/Ant collision working.

Jewels no longer appear in overlapping positions.

Jewels use quintic easing, so grow more quickly just before changing to anty matter.

Ant spins (at rate inversely proportional to pulse size at point of collision).


Change forEach to forEachExists





Touching edge is game over - this requires constant bounds check, so maybe expensive?

Might be good to have nasty obstacles lurking off-screen to encourage players to avoid going off

Faster you go, the more anty matter obstacles appear?

Tips: line shots up like pool balls



// Graphics
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Do we want to use the swirling autoscroll borders?
If we do and need to obscure the corners, could have:
Score
Sound
Health
Summat else??



// Bug fixes
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Jewels are occasionally disappearing before they go to matter frame.
-----------------------------------------------------------------------------------------------------------
Believe this was caused by timer events persisting after jewels were removed. 
Now fixed by adding the timer events to a var on the jewel objects.
This allowed removal of the event via the jewel var.