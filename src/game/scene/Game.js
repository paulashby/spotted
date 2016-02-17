(function () {
	
	"use strict";
	
	PrimeEight.Spotted.Game = function (game) {
		return this;
	};

	PrimeEight.Spotted.Game.prototype = {

		create: function () {
			this.FIRST_APHID_DELAY = 1000;
			this.APHID_BOUNDS_TL = PrimeEight.Spotted.viewWidth/30 + PrimeEight.Spotted.aphidHeight; // Using full (rather than half) aphid height (aphid is square) to allow margin
			this.APHID_BOUNDS_RIGHT = PrimeEight.Spotted.viewWidth - this.APHID_BOUNDS_TL;
			this.APHID_BOUNDS_BOTTOM = PrimeEight.Spotted.viewHeight - this.APHID_BOUNDS_TL;
		
			this.ADD_APHID_RATE = 5000; 
			this.APHID_INIT_POS = -1000;
			this.APHID_INITIAL_SIZE = 0.6;
			this.APHID_BOUNCE_DURATION = 200;
			this.APHID_BOUNCE_HEIGHT = Math.ceil(PrimeEight.Spotted.gameHeight/50);
			this.PULSE_TWEEN_TIME = 250;
			this.COLLISION_TOLERANCE = PrimeEight.Spotted.ladybirdHeight/4;
			this.ABSOLUTE_MAX_APHIDS = 15;
			this.APHID_INACTIVE_DURATION = 5000;
			this.APHID_ATTACK_DURATION = 5000; 
			this.APHID_PRECIOUS_DURATION = 180;  
			this.APHID_ATTACK_DAMPING = this.APHID_PRECIOUS_DURATION - 3; // Aphids would catch ladybird this many frames after they die - otherwise they ALWAYS get the ladybird
			this.APHID_LIFE = ( (this.APHID_ATTACK_DURATION/1000) * 60 ) + this.APHID_PRECIOUS_DURATION; // Assuming full 60fps - no biggie if slower
			this.SCORE_PERIOD = 30; // increment currMaxAphids each time this many points added to score
			this.SCORE_INSET = 4;
			this.LADYBIRD_MIN_WALK_SPEED = 8;
			this.LADYBIRD_MAX_WALK_SPEED = 24;
			this.LADYBIRD_TWEEN_TIME = this.LADYBIRD_MAX_WALK_SPEED*50;
			this.LADYBIRD_INITIAL_DY = PrimeEight.Spotted.gameHeight/10; 
			var i,
			len,
			ppLogoClearance;
			
			ppLogoClearance = PrimeEight.Spotted.desktop ? (this.SCORE_INSET * 2) : 50;			 

			// keep the spacebar from propogating up to the browser
			this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	    this.background = this.add.sprite(0,0,'background');
			this.background.inputEnabled = true;
			this.background.events.onInputDown.add(this.onTap, this);
		
			// array of droplet positions as proportions of gameDimensions
			this.dPsProportional = [{x:6, y:5}, {x:2.5, y:6.4}, {x:1.5, y:6.8}, {x:16, y:2.8}, {x:1.1, y:3.75}, {x:1.6, y:2.3}, {x:3.2, y:1.71}, {x:1.2, y:1.68}, {x:8.7, y:1.14}, {x:1.58, y:1.23}];
			// array for absolute positions
			this.dropletPositions = [];
			len = this.dPsProportional.length;
			for(i = 0; i < len; i++){
				this.dropletPositions[i] = {x: Math.round(PrimeEight.Spotted.gameWidth/this.dPsProportional[i].x), y: Math.round(PrimeEight.Spotted.gameHeight/this.dPsProportional[i].y)};
			}
		
			this.droplets = this.add.group();
			this.addDroplets();
		
			this.pulse = this.game.add.sprite(0,0,'pulse');
			this.pulse.anchor.setTo(0.5, 0.5);
			this.pulseTweenScaleX = this.game.add.tween(this.pulse.scale).to({x: 1}, this.PULSE_TWEEN_TIME, Phaser.Easing.Linear.InOut, false);
			this.pulseTweenScaleY = this.game.add.tween(this.pulse.scale).to({y: 1}, this.PULSE_TWEEN_TIME, Phaser.Easing.Linear.InOut, false);
			this.pulseTweenScaleX.onComplete.add(this.onPulseComplete, this);
			this.pulse.visible = false;
		
			this.aphids = this.add.group();
			this.currMaxAphids = 1;
			this.existingAphids = 0;   
		
			this.ladybirds = this.add.group();
			this.ladybird = this.add.sprite(this.game.width/2, this.game.height/2, 'ladybird');
			this.ladybird.anchor.setTo(0.5, 0.5);
			this.ladybird.dx = 0;
			this.ladybird.dy = this.LADYBIRD_INITIAL_DY;
			this.ladybirds.add(this.ladybird);
			this.ladybird.rotation = -1.6;
			this.ladybird.animations.add('walk', [0, 1]);
			this.ladybird.animations.play('walk', this.LADYBIRD_MIN_WALK_SPEED, true);
			this.moveLadybird();    
	 
			this.scores = this.add.group();
			PrimeEight.Spotted.totalScore = 0;
			this.FONT_SIZE = Math.floor(PrimeEight.Spotted.gameHeight/9.4);
			this.scoreText = this.game.add.bitmapText(ppLogoClearance, PrimeEight.Spotted.viewY + this.SCORE_INSET, 'LuckiestGuyPrime8', PrimeEight.Spotted.totalScore.toString(), this.FONT_SIZE);   
			this.scores.add(this.scoreText);
			this.aphidTimer = this.time.create(false);// autodestroy false
			this.aphidTimer.add(Math.random() * this.FIRST_APHID_DELAY, this.addAphid, this);
			this.aphidTimer.start();  
    
			this.angryTimeSound = this.game.add.audio('angryTime'); 
			this.angryTimeSound.volume = 0.6;
		
			if(PrimeEight.Spotted.music === undefined){
				PrimeEight.Spotted.music = this.game.add.audio('bgLoop', 1,true);
				PrimeEight.Spotted.music.volume = 0.9;
			} 
			if(!PrimeEight.Spotted.music.isPlaying){
				PrimeEight.Spotted.music.play('',0,1,true);
				var chrome = window.chrome;
				if(chrome){
					// Workaround as Chrome has deprecated 'webkitAudioContext'
					PrimeEight.Spotted.music.onLoop.add(this.playMusic, this);
				}				
			}

	    this.bumpSound = this.game.add.audio('bump');
	    this.boundsBumpSound = this.game.add.audio('boundsBump');  

	    this.addAphidSound = this.game.add.audio('aphidIn');  
			this.angryAphidSound = this.game.add.audio('angryAphid');
			this.angryAphidSound.volume = 0.5;       
			this.preciousAphidSound = this.game.add.audio('preciousAphid');
			this.preciousAphidSound.volume = 0.5; 
			this.removeAphidSound = this.game.add.audio('aphidOut');
			this.eatPatientSound = this.game.add.audio('eatPatient');
			this.eatPreciousSound = this.game.add.audio('eatPrecious');
			if(!PrimeEight.Spotted.gameOverSound){
				PrimeEight.Spotted.gameOverSound = this.game.add.audio('gameOver');
			} 
			PrimeEight.Spotted.gameOverSound.volume = 0.7;

			this.soundButton = this.game.add.button(PrimeEight.Spotted.viewWidth - (PrimeEight.Spotted.buttonsSoundWidth * 1.5), Math.round(PrimeEight.Spotted.viewY + this.SCORE_INSET), 'buttonsSound', this.onToggleSound, this, 2, 2, 2, 2);
			this.musicButton = this.game.add.button(PrimeEight.Spotted.viewWidth - (PrimeEight.Spotted.buttonsSoundWidth * 2.7), Math.round(PrimeEight.Spotted.viewY + this.SCORE_INSET), 'buttonsSound', this.onToggleMusic, this, 0, 0, 0, 0);
			if(this.game.soundOff) {
				this.onSoundOff();
			}
			if(this.game.musicOff) {
				this.onMusicOff();
			} 
		},	 
		playMusic: function() {
			PrimeEight.Spotted.music.play('', 0, 1, true);
		},
		update: function () { 
			this.updateLadybird();
			this.updateAphids();
			this.checkPulseCollision();
		},
	
		updateLadybird: function() {
			this.checkLadybirdBounds();
		},
		updateAphids: function(){   
		
			var angryAphid = false; // so we know when to stop angry aphid sound
		
			this.aphids.forEachExists(function(aphid){
			
			var aphidHit = this.spriteCirclesColliding(this.ladybird, aphid, true); 
		
			switch(aphid.mood) {
				case 'patient':
			  	if(aphidHit){ this.collectAphid(aphid); }
			    break;		
			  case 'freaky':
			  	if(aphidHit){ this.deathHandler();  }
				 	else{ aphid.rotation = this.angleToTarget(this.ladybird, aphid); }
				 break;	
			  case 'angry': 
					angryAphid = true; 
					this.aphids.add(aphid);// Want angry aphids in front of patient ones
			  	if(aphidHit){ this.deathHandler(); }
					if(aphid.life === this.APHID_PRECIOUS_DURATION){
						aphid.mood = 'precious';  
						this.preciousAphidSound.play();
						aphid.animations.play('precious', 2, true);
					}								
	        break;
			  default: // 'precious'
					if(aphidHit){ this.collectAphid(aphid); }
					else if (aphid.life > 0){ 
						aphid.dx = 0;
						aphid.dy = 0;
						if(aphid.scale.x > this.APHID_INITIAL_SIZE){
							aphid.scale.setTo(aphid.scale.x - 0.05);
						}
					} 
					else{
						 this.removeAphid(aphid);
					}
				}
			}, this); 
			if(angryAphid){  
				if(!this.angryTimeSound.isPlaying){
					this.angryTimeSound.play();
				}
			} 
			else {
				this.angryTimeSound.stop();
			}
		},   
		updateAphidAttack: function(){ 
			if(this._aphid.mood !== 'patient') {
				this._aphid.x += this._aphid.dx;
				this._aphid.y += this._aphid.dy;
				this._game.setAphidTarget(this._aphid); 
				this._aphid.rotation = this._game.angleToTarget(this._game.ladybird, this._aphid);
				this._aphid.life--;            
			}
		},
	 
		addAphid: function() {
		
			if(this.existingAphids < this.currMaxAphids){  
			
				var recycledAphid = this.aphids.getFirstExists(false);

				if(!recycledAphid) { // No exisitng aphids available - make a new one

					recycledAphid = this.add.sprite(this.APHID_INIT_POS, this.APHID_INIT_POS, 'aphid');
					this.addAnimations(recycledAphid);
				}
				else{ // Use existing ladybird
					recycledAphid.x = this.APHID_INIT_POS;
					recycledAphid.y = this.APHID_INIT_POS;
				}
				this.initAphid(recycledAphid);
			}
			this.aphidTimer.add(Math.random() * this.ADD_APHID_RATE, this.addAphid, this);  
		},
		initAphid: function(aphid){
	    var aphidPosition = this.getAphidPosition();

			aphid.exists = true;
			this.existingAphids++; 
			aphid.life = this.APHID_LIFE;
			aphid.rotation = 1.6;
			aphid.scale.setTo(this.APHID_INITIAL_SIZE);	
			aphid.animations.play('wait', 4, true);
			aphid.visible = true;
			aphid.mood = 'patient';
			this.aphids.add(aphid);
			aphid.x = aphidPosition.x;
			aphid.y = aphidPosition.y;  
			aphid.dx = 0;
			aphid.dy = 0;
			this.aphidTimer.remove(aphid.attackUpdateTimer);
			aphid.attackTimer = this.time.create(true);// autodestroy true
			aphid.attackTimer.add(this.APHID_INACTIVE_DURATION, this.onAphidAngry, this, aphid, aphid.y);
			aphid.attackTimer.start();
			this.addAphidSound.play();

		},
		collectAphid:function(aphid) {
			this.removeAphid(aphid);
			this.onScore(aphid);
		},
		onAphidAngry: function(aphid, aphidY){
			aphid.bounceUp = this.add.tween(aphid).to({y: aphidY - this.APHID_BOUNCE_HEIGHT * 6}, this.APHID_BOUNCE_DURATION, Phaser.Easing.Back.In, true);
			aphid.bounceUp.onComplete.add(this.onBounceUpComplete, {_aphid: aphid, _aphidY: aphidY, _game: this});
			this.angryAphidSound.play();
		},
		onBounceUpComplete: function(){
			this._aphid.scale.setTo(1);
			this._aphid.animations.play('transformation', 2, true);
			this._aphid.mood = 'freaky';
			this._aphid.bounceDown = this._game.add.tween(this._aphid).to({y: this._aphidY}, this._game.APHID_BOUNCE_DURATION * 2, Phaser.Easing.Exponential.In, true);
			this._aphid.bounceDown.onComplete.add(this._game.onAphidBounceComplete, {_aphid: this._aphid, _aphidY: this._aphidY, _game: this._game});
		},		
		onAphidBounceComplete: function(){
			this._aphid.mood = 'angry';
			this._game.setAphidTarget(this._aphid); 
			this._aphid.animations.play('attack', 12, true); 
			this._aphid.attackUpdateTimer = this._game.aphidTimer.loop(20, this._game.updateAphidAttack, this, this._aphid, this._game);
		},
		getAphidPosition: function() {
			var aphidPosition = new Phaser.Point(this.getRandomInt(this.APHID_BOUNDS_TL, this.APHID_BOUNDS_RIGHT),this.getRandomInt(this.APHID_BOUNDS_TL, this.APHID_BOUNDS_BOTTOM) );
			if(this.positionAvailable(aphidPosition)){
				return aphidPosition;
			}
			return this.getAphidPosition();
		},		
	
		/* Returns a point which is the distance between ladybird and aphid/number of frames remaining in aphid's life:
		 * This is the  distance aphid needs to move in next frame
		 */
		setAphidTarget: function(aphid) { 

			aphid.dx = (this.ladybird.x - aphid.x)/(aphid.life - this.APHID_ATTACK_DAMPING);
			aphid.dy = (this.ladybird.y - aphid.y )/(aphid.life - this.APHID_ATTACK_DAMPING);

		},
		removeAphid: function(aphid) { 
			aphid.exists = false;
			this.existingAphids--;
			aphid.visible = false;
			this.removeAphidTweens(aphid); 
		
			this.removeAphidSound.play();
		
			aphid.attackTimer.stop();
		},
		removeAphidTweens: function(aphid){
			if(aphid.bounceUp && aphid.bounceUp.isRunning){ aphid.bounceUp.stop(); }
			if(aphid.bounceDown && aphid.bounceDown.isRunning){ aphid.bounceDown.stop(); }
			//if(aphid.somersault && aphid.somersault.isRunning){ aphid.somersault.stop(); }
		},
	
		checkLadybirdBounds: function() {
		
			var normalisedLadybirdAngle = this.ladybird.angle + 180;
		
			if(this.offScreenH(this.ladybird, normalisedLadybirdAngle)){
				this.ladybird.dx = -this.ladybird.dx;
				this.ladybird.rotation = this.getBounceAngle(this.ladybird.rotation);
				this.moveLadybird();  
				this.boundsBumpSound.play();
			}
			if(this.offScreenV(this.ladybird, normalisedLadybirdAngle)){
				this.ladybird.dy = -this.ladybird.dy;
				this.ladybird.rotation =   this.getBounceAngle(this.ladybird.rotation) + Math.PI;
				this.moveLadybird(); 
				this.boundsBumpSound.play();			
			}
		},
		getLadybirdWalkspeed: function () { // returns values in range this.LADYBIRD_MIN_WALK_SPEED to this.LADYBIRD_MAX_WALK_SPEED
			var proportionalToPulseScale = Math.floor(this.pulse.scale.x * (this.LADYBIRD_MAX_WALK_SPEED - this.LADYBIRD_MIN_WALK_SPEED + 1)) + this.LADYBIRD_MIN_WALK_SPEED,
			inverselyProportional = (this.LADYBIRD_MAX_WALK_SPEED + this.LADYBIRD_MIN_WALK_SPEED) - proportionalToPulseScale;
			return inverselyProportional;
		},
		setLadybirdDelta: function(pulseWidth) {
		
			var dist = this.getInverse(pulseWidth, PrimeEight.Spotted.pulseWidthMax),
			_angle = this.angleToTarget(this.pulse, this.ladybird),
			_target = {x: Math.cos(_angle) * dist, y: Math.sin(_angle) * dist};
		
			// calculate delta values to use in onComplete tween so ladybird extrapolates path
			this.ladybird.dx = _target.x;
			this.ladybird.dy = _target.y;
		},
		angleToTarget: function(p1, p2) {
			return (Math.atan2(p2.y - p1.y, p2.x - p1.x));
		
		},
		getInverse: function(val, maxVal) {
			return  maxVal - val;
		},

		onLadybirdXComplete: function(){
			this.ladybird.walkX = this.add.tween(this.ladybird).to({x: this.ladybird.x + this.ladybird.dx}, this.LADYBIRD_TWEEN_TIME, Phaser.Easing.Linear.InOut, true);
			this.ladybird.walkY = this.add.tween(this.ladybird).to({y: this.ladybird.y + this.ladybird.dy}, this.LADYBIRD_TWEEN_TIME, Phaser.Easing.Linear.InOut, true);
		
			this.ladybird.walkX.onComplete.add(this.onLadybirdXComplete, this);
		},
		moveLadybird: function() {
			this.removeLadybirdTweens();
		
			this.ladybird.walkX = this.add.tween(this.ladybird).to({x: this.ladybird.x + this.ladybird.dx}, this.LADYBIRD_TWEEN_TIME, Phaser.Easing.Linear.InOut, true);
			this.ladybird.walkX.onComplete.add(this.onLadybirdXComplete, this);
			this.ladybird.walkY = this.add.tween(this.ladybird).to({y: this.ladybird.y + this.ladybird.dy}, this.LADYBIRD_TWEEN_TIME, Phaser.Easing.Linear.InOut, true);
		},
		removeLadybirdTweens: function() {
			this.game.tweens.remove(this.ladybird.walkX);
			this.game.tweens.remove(this.ladybird.walkY);
		},

		onScore: function(aphid) {
			var score;
			if(aphid.mood === 'patient'){
				score = this.onScorePatient();
			}
			else {
				score = this.onScorePrecious();
				} // 10 for patient aphid, 25 for precious
			this.showScoreValue(score);
			PrimeEight.Spotted.totalScore += score;
			this.scoreText.setText(PrimeEight.Spotted.totalScore.toString());
			if(this.currMaxAphids < this.ABSOLUTE_MAX_APHIDS){
				this.currMaxAphids = Math.ceil(PrimeEight.Spotted.totalScore/this.SCORE_PERIOD);
			} 
		},
		onScorePatient: function() {
			this.eatPatientSound.play();
			return 10;		
		},
		onScorePrecious: function() {
			this.eatPreciousSound.play();
			return 25;
		},
		showScoreValue: function(val) {
		
			var recycledScore = this.scores.getFirstExists(false);

				if(!recycledScore) { // No exisitng scores available - make a new one

					recycledScore = this.game.add.bitmapText(this.ladybird.x, this.ladybird.y, 'LuckiestGuyPrime8', val.toString(), this.FONT_SIZE);
				}
				else { // Use existing ladybird  
					recycledScore.setText(val.toString());
					recycledScore.x = this.ladybird.x;
					recycledScore.y = this.ladybird.y;
				} 
				this.initScoreVal(recycledScore);
				this.scores.add(recycledScore); 
			
				recycledScore.scaleXtween = this.add.tween(recycledScore.scale).to({x: 1}, 250, Phaser.Easing.Circular.Out, true);
				recycledScore.scaleXtween.onComplete.add(this.onScaleXtweenComplete, {_scoreVal: recycledScore, _game: this});  
			
				recycledScore.scaleYtween = this.add.tween(recycledScore.scale).to({y: 1}, 250, Phaser.Easing.Circular.Out, true);
				recycledScore.scaleYtween.onComplete.add(this.onScaleYtweenComplete, {_scoreVal: recycledScore, _game: this});
		},
		initScoreVal: function(scoreVal) {
			scoreVal.exists = true;
			scoreVal.visible = true;
			scoreVal.scale.setTo(0); 
			scoreVal.align = 'center';		
		}, 
		onScaleXtweenComplete: function() {
			  this._scoreVal.unscaleXtween = this._game.add.tween(this._scoreVal.scale).to({x: 0}, 250, Phaser.Easing.Circular.In, true);
				this._scoreVal.unscaleXtween.onComplete.add(this._game.removeScoreValue, {_scoreVal: this._scoreVal});
		},
		onScaleYtweenComplete: function() {
		  this._scoreVal.unscaleYtween = this._game.add.tween(this._scoreVal.scale).to({y: 0}, 250, Phaser.Easing.Circular.In, true);
		},
		removeScoreValue: function() {
		 this._scoreVal.visible = false;
		 this._scoreVal.exists = false;
		},
		checkPulseCollision: function() {
			if((this.pulseTweenScaleX.isRunning && !this.ladybirdHit) && // if pulse has been initiated, check for collision
					this.spriteCirclesColliding(this.ladybird, this.pulse)){ 
				this.ladybirdHit = true;
				this.onPulseCollision();
			}
		},
		onPulseCollision: function () {
			var pulseWidth = this.pulse.width;
			this.ladybird.animations.stop('walk');
			this.ladybird.animations.play('walk', this.getLadybirdWalkspeed(), true);
			this.pulse.scale.x = 0;
			this.pulse.scale.y = 0;
			this.pulse.visible = false;
			this.ladybird.rotation = this.angleToTarget(this.ladybird,this.pulse);
			this.bumpSound.play();
			this.setLadybirdDelta(pulseWidth);
			this.moveLadybird();
		},
		getBounceAngle: function(currentRotation) {
			return - currentRotation + Math.PI;
		},
		spriteCirclesColliding: function (sprite1, sprite2, lowTolerance) { // is sprite1 within sprite2 radius?
			var tolerance = lowTolerance === undefined ? 0 : this.COLLISION_TOLERANCE;
			return (Phaser.Math.distance(sprite1.x, sprite1.y, sprite2.x, sprite2.y) - tolerance < sprite2.width/2 ? true : false);
		},
		positionAvailable: function(pos){
			var available = false;
		
			if(this.groupPositionAvailable(pos, this.aphids) 
			&& this.groupPositionAvailable(pos, this.droplets)
			&& this.groupPositionAvailable(pos, this.ladybirds)){
				available = true;
			}
			return available;	
		},
		groupPositionAvailable: function(pos, _group){
			var available = true;
		
			_group.forEachExists(function(sprite){
				if(Phaser.Math.distance(pos.x, pos.y, sprite.x, sprite.y) < PrimeEight.Spotted.aphidHeight){
						available = false;
						return;
					}
			}, this);
		
			return available;
		},
		onTap: function() {
			this.ladybirdHit = false;
			this.pulse.x = this.game.input.x;
			this.pulse.y = this.game.input.y;
			this.pulse.scale.x = 0;
			this.pulse.scale.y = 0;
			this.pulse.visible = true;
			this.pulseTweenScaleX.start();
			this.pulseTweenScaleY.start();
		},
	
		/* 
		 * Returns true if ladybird is heading off either side and is still pointing outwards
		 */
		offScreenH: function(sprite, angle) { 
			if(
				(sprite.x <= PrimeEight.Spotted.viewX && (angle > 90 && angle <= 270)) ||
				(sprite.x >= PrimeEight.Spotted.viewWidth && (angle <= 90 || angle > 270))		
				) { return true; }
				return false;
		},
		/* 
		 * Returns true if ladybird is heading off top/bottom and is still pointing outwards
		 */
		offScreenV: function(sprite, angle) {
			if(
				(sprite.y <= PrimeEight.Spotted.viewY && ( angle > 180 ) ) ||
				(sprite.y >= PrimeEight.Spotted.viewHeight && (angle > 0  && angle <= 180) )			
				) { return true; }
				return false;
		},
		onPulseComplete: function() {
			this.pulse.visible = false;
		},
	

		addAnimations: function(aphid) {
			aphid.anchor.setTo(0.5, 0.5);
			aphid.animations.add('wait', [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
			aphid.animations.add('transformation', [3]);
			aphid.animations.add('attack', [3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 5, 6, 5, 6, 3, 4, 3, 4, 3, 4, 5, 6, 5, 6]);
			aphid.animations.add('precious', [7]);
		},
		addDroplets: function() {
			var len = this.dropletPositions.length,
			i,
			dropPos,
			drop;
			for(i = 0; i < len; i++) {
				dropPos = this.dropletPositions[i];
				drop = this.add.sprite(dropPos.x, dropPos.y, 'droplet');
				drop.anchor.setTo(0.5, 0.5);
				this.droplets.add(drop);
			}
		},
	
		onToggleSound: function() {
			if(this.game.soundOff){
				this.onSoundOn();
			}
			else{
				this.onSoundOff();
			}
		},
		onToggleMusic: function() {
			if(this.game.musicOff){
				this.onMusicOn();
			}
			else{
				this.onMusicOff();
			}
		},
		onMusicOn: function() {
			PrimeEight.Spotted.music.play('',0,1,true);
			this.musicButton.setFrames(0, 0, 0, 0);
			this.game.musicOff = false;
		},	
		onMusicOff: function() {
			PrimeEight.Spotted.music.stop();
			this.musicButton.setFrames(1, 1, 1, 1);
			this.game.musicOff = true;
		},
		onSoundOn: function() {
			this.game.sound.volume = 1;
			this.soundButton.setFrames(2, 2, 2, 2);
			this.game.soundOff = false;
		},	
		onSoundOff: function() {
			this.game.sound.volume = 0;
			this.soundButton.setFrames(3, 3, 3, 3);
			this.game.soundOff = true;
		},	
		getRandomInt: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
	
	
		removeSound: function(_sound) {
			_sound.stop();
			_sound = null;		
		},
		removeTween: function(_tween) {
			if (_tween) {
				_tween.onComplete.removeAll();
				_tween.stop();
				_tween = null;
			}
		},
		deathHandler: function(){
			PrimeEight.Spotted.gameOverSound.play();
			this.state.start('GameOver');
		},
		shutdown: function(){
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
			this.aphidTimer.stop();
			this.droplets.destroy(true);
			this.aphids.destroy(true);
			this.ladybirds.destroy(true);
			this.scores.destroy(true);
			this.background.destroy();
			this.pulse.destroy();
			this.dPsProportional = null;
			this.dropletPositions = null;
			this.removeSound(this.bumpSound);
	    this.removeSound(this.boundsBumpSound);  
			this.removeSound(this.addAphidSound);  
			this.removeSound(this.angryAphidSound);
			this.removeSound(this.preciousAphidSound);
			this.removeSound(this.removeAphidSound);
			this.removeSound(this.eatPatientSound);
			this.removeSound(this.eatPreciousSound);
			this.removeSound(this.angryTimeSound);
			this.soundButton.destroy();
			this.musicButton.destroy();
			PrimeEight.Spotted.music.stop();
		}
	};
}());