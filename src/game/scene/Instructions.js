(function () {
	
	"use strict";
	
	PrimeEight.Spotted.Instructions = function (game) {

		this.music = null; 

	};

	PrimeEight.Spotted.Instructions.prototype = {

		create: function () {
		
			this.SCORE_TEXT_Y = PrimeEight.Spotted.viewY +  PrimeEight.Spotted.viewHeight * 0.7;
		
			this.mainFontSize = Math.floor(PrimeEight.Spotted.viewWidth/15);
			this.instructionFontSize = Math.floor(PrimeEight.Spotted.viewWidth/25);
		
			this.background = this.game.add.sprite(0,0, 'background');  
		
			this.background.inputEnabled = true;
			this.background.events.onInputDown.add(this.onOK, this);
		
			this.backgroundElements = this.add.group();  
			this.backgroundElements.y = PrimeEight.Spotted.gameHeight * 1.2;
			this.foregroundElements = this.add.group(); 
			this.foregroundElements.y = - PrimeEight.Spotted.gameHeight * 1.2;
		
			this.title = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.06, PrimeEight.Spotted.viewY +  PrimeEight.Spotted.viewHeight * 0.1, 'LuckiestGuyPrime8', 'tap to move ladybird', this.mainFontSize); 
			this.backgroundElements.add(this.title);
		
		
			// Scoring info
		
			this.aphid = this.add.sprite(PrimeEight.Spotted.viewWidth * 0.1, 0, 'aphid');
			this.aphid.anchor.setTo(0.5, 0.5); 
			this.aphid.scale.setTo(0.9);
			this.aphid.rotation = 1.6;
			this.backgroundElements.add(this.aphid); 
			this.scoreInfoAphid = this.game.add.bitmapText(0, this.SCORE_TEXT_Y, 'LuckiestGuyPrime8', '10', this.instructionFontSize); 
			this.backgroundElements.add(this.scoreInfoAphid);
		
			// set these after adding to groups so we can query their coordinates/dimensions
			this.scoreInfoAphid.x = this.aphid.x - (this.scoreInfoAphid.width/2);  
			this.aphid.y = this.scoreInfoAphid.y - (this.aphid.height * 0.6);
		
    
			this.aphidPrecious = this.add.sprite(PrimeEight.Spotted.viewWidth * 0.25, 0, 'aphid');
			this.aphidPrecious.anchor.setTo(0.5, 0.5);
			this.aphidPrecious.rotation = 1.6; 
			this.aphidPrecious.scale.setTo(0.8);
			this.aphidPrecious.frame = 7;
			this.backgroundElements.add(this.aphidPrecious); 
			this.scoreInfoAphidPrecious = this.game.add.bitmapText(0, this.SCORE_TEXT_Y, 'LuckiestGuyPrime8', '25', this.instructionFontSize); 
			this.backgroundElements.add(this.scoreInfoAphidPrecious); 
		
			// set these after adding to groups so we can query their coordinates/dimensions
			this.scoreInfoAphidPrecious.x = this.aphidPrecious.x - (this.scoreInfoAphidPrecious.width/2);
			this.aphidPrecious.y = this.scoreInfoAphidPrecious.y - (this.aphidPrecious.height * 0.6);
		
			this.aphidAngry = this.add.sprite(PrimeEight.Spotted.viewWidth * 0.4, PrimeEight.Spotted.viewY +  PrimeEight.Spotted.viewHeight * 0.34, 'aphid');
			this.aphidAngry.anchor.setTo(0.5, 0.5);
			this.aphidAngry.rotation = 1.6; 
			this.aphidAngry.frame = 4;
			this.backgroundElements.add(this.aphidAngry);
			this.scoreInfoAphidAngry = this.game.add.bitmapText(0, this.SCORE_TEXT_Y, 'LuckiestGuyPrime8', 'avoid!', this.instructionFontSize); 
			this.backgroundElements.add(this.scoreInfoAphidAngry);   
		
			// set these after adding to groups so we can query their coordinates/dimensions
			this.scoreInfoAphidAngry.x = this.aphidAngry.x - (this.scoreInfoAphidAngry.width/2);
			this.aphidAngry.y = this.scoreInfoAphidAngry.y - (this.aphidAngry.height * 0.6); 
		
			this.scoreText = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.06, this.aphidAngry.y - (this.aphidAngry.height * 1.2), 'LuckiestGuyPrime8', 'score by catching grubs', this.instructionFontSize); 
			this.backgroundElements.add(this.scoreText);
		
			this.instructionsBounce = this.game.add.sprite(PrimeEight.Spotted.viewWidth * 0.92, PrimeEight.Spotted.viewY + PrimeEight.Spotted.viewHeight * 0.035, 'instructionsBounce'); 
			this.instructionsBounce.anchor.setTo(0, 0);
			this.instructionsBounce.angle = 46.3;  
			this.backgroundElements.add(this.instructionsBounce); 
		   
			this.instruction = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.06, PrimeEight.Spotted.viewY + PrimeEight.Spotted.viewHeight * 0.27, 'LuckiestGuyPrime8', 'closer tap = faster bounce', this.instructionFontSize);
			this.backgroundElements.add(this.instruction);
		
			this.instructionsOKbg = this.game.add.sprite(PrimeEight.Spotted.viewWidth, PrimeEight.Spotted.viewHeight, 'instructionsOKbg');
			this.instructionsOKbg.anchor.setTo(1, 1);
		  this.foregroundElements.add(this.instructionsOKbg); 
			this.okLink = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.87, 0, 'LuckiestGuyPrime8', 'ok', this.mainFontSize);
			this.okLink.y = PrimeEight.Spotted.viewHeight - this.okLink.height * 1.7;
			this.foregroundElements.add(this.okLink); 
		
			this.woosh = this.game.add.audio('woosh');
		
			this.backgroundTween = this.game.add.tween(this.backgroundElements).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true, 250);
			this.foregroundTween = this.game.add.tween(this.foregroundElements).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true, 400);
			this.woosh.play(); 
		
			this.okBackgroundTween = this.game.add.tween(this.backgroundElements).to({y: - PrimeEight.Spotted.gameHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.okBackgroundTween.onComplete.add(this.onOKBackgroundTweenComplete, this);
		
			this.okForegroundTween = this.game.add.tween(this.foregroundElements).to({y: + PrimeEight.Spotted.gameHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.okForegroundTween.onComplete.add(this.onOKForegroundTweenComplete, this); 
		
			PrimeEight.Spotted.music = this.game.add.audio('bgLoop', 1,true);
			PrimeEight.Spotted.music.volume = 0.9;  
			PrimeEight.Spotted.music.play('',0,1,true);
			var chrome = window.chrome;
			if(chrome){
				// Workaround as Chrome has deprecated 'webkitAudioContext'
				PrimeEight.Spotted.music.onLoop.add(this.playMusic, this);
			}		 
		}, 
		playMusic: function() {
			PrimeEight.Spotted.music.play('', 0, 1, true);
		},
		onOKBackgroundTweenComplete: function(){
			this.okTweenCallbackTween = this.game.add.tween(this.backgroundElements).to({y: PrimeEight.Spotted.gameHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
			this.woosh.play();  
		},
		onOKForegroundTweenComplete: function(){
			this.okTweenFCallbackTween = this.game.add.tween(this.foregroundElements).to({y: - PrimeEight.Spotted.gameHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
			this.okTweenFCallbackTween.onComplete.add(this.onStartGame, this);
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
		onOK: function() {
			this.okBackgroundTween.start();
			this.okForegroundTween.start();
		},
		shutdown: function(){
			this.backgroundElements.destroy(true);
			this.foregroundElements.destroy(true);
			this.background.destroy();
			this.removeSound(this.woosh);
			this.removeTween(this.okForegroundTween);
			this.removeTween(this.okBackgroundTween);
		},
		onStartGame: function(){
			 this.game.state.start('Game');
		}
	};
}());