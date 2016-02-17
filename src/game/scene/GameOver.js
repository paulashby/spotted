(function () {
	
	"use strict";
	
	PrimeEight.Spotted.GameOver = function (game) {
		return this;
	};

	PrimeEight.Spotted.GameOver.prototype = {

	  create: function () {  
	
			this.PLAY_X = PrimeEight.Spotted.viewWidth * 0.33;
			this.SHARE_X =  PrimeEight.Spotted.viewWidth * 0.67; 
			this.BUTTON_Y = PrimeEight.Spotted.viewHeight * 0.7;
		
			this.mainFontSize = Math.floor(PrimeEight.Spotted.viewHeight/9.4); 
			this.newBestFontSize  = Math.floor(PrimeEight.Spotted.viewHeight/18);
		
			this.background = this.game.add.sprite(0,0, 'background'); 
		
			this.totalScore = PrimeEight.Spotted.totalScore.toString();
			this.bestScore = localStorage.getItem('bestScore');
	
			if(this.bestScore === null || parseInt(this.bestScore, 10) < parseInt(this.totalScore, 10)){
				this.bestScore = this.totalScore;
				localStorage.setItem('bestScore', this.bestScore);
				this.newBestScoreLabel = this.game.add.bitmapText(0, PrimeEight.Spotted.viewHeight * 0.32, 'LuckiestGuyPrime8', 'new', this.newBestFontSize); 
				this.newBestScoreLabel.x = (PrimeEight.Spotted.viewWidth * 0.24) - this.newBestScoreLabel.width;
			} 
		
			this.scoreGroup = this.add.group(); 
			this.buttonGroup = this.add.group();
		  
			this.buttonGroup.y = PrimeEight.Spotted.viewHeight * 1.2;
		
			this.scoreLabel = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.25, PrimeEight.Spotted.viewHeight * 0.15, 'LuckiestGuyPrime8', 'score', this.mainFontSize);
			this.bestScoreLabel = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.25, PrimeEight.Spotted.viewHeight * 0.3, 'LuckiestGuyPrime8', 'best', this.mainFontSize);
		
			this.scoreText = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.57, PrimeEight.Spotted.viewHeight * 0.15, 'LuckiestGuyPrime8', this.totalScore, this.mainFontSize);
			this.bestScoreText = this.game.add.bitmapText(PrimeEight.Spotted.viewWidth * 0.57, PrimeEight.Spotted.viewHeight * 0.3, 'LuckiestGuyPrime8', this.bestScore, this.mainFontSize);  
		
		 	this.scoreGroup.add(this.scoreLabel);
			this.scoreGroup.add(this.bestScoreLabel);
			this.scoreGroup.add(this.scoreText);
			this.scoreGroup.add(this.bestScoreText);
		
	    this.playBg = this.game.add.sprite(this.PLAY_X, this.BUTTON_Y, 'gameOveButtonBg');
			this.playBg.anchor.setTo(0.5, 0.5);
			this.playBg.inputEnabled = true;
			this.playBg.events.onInputDown.add(this.onPlayAgain, this);
			this.playLink = this.game.add.bitmapText(this.PLAY_X, 0, 'LuckiestGuyPrime8', 'play', this.mainFontSize);
			this.playLink.x = this.PLAY_X - (this.playLink.width/2.2);
			this.playLink.y = this.BUTTON_Y - (this.playLink.height/2); 
		
			this.shareBg = this.game.add.button(0, 0, 'gameOveButtonBg', this.onMenu, this, 0, 0, 0, 0);
			this.shareBg.x = this.SHARE_X - (this.shareBg.width/2);
			this.shareBg.y = this.BUTTON_Y - (this.shareBg.height/2);
			this.shareLink = this.game.add.bitmapText(0, 0, 'LuckiestGuyPrime8', 'menu', this.mainFontSize);
			this.shareLink.x = this.SHARE_X - (this.shareLink.width/2.2);
			this.shareLink.y = this.BUTTON_Y - (this.shareLink.height/2); 
		
		 	this.buttonGroup.add(this.playBg);
			this.buttonGroup.add(this.playLink);
			this.buttonGroup.add(this.shareBg);
			this.buttonGroup.add(this.shareLink); 
		
			this.woosh = this.game.add.audio('woosh');
		
			this.buttonGroupTween = this.game.add.tween(this.buttonGroup).to({y: 0}, 500, Phaser.Easing.Bounce.Out, true, 250); 
		
			this.playAgainBgTween = this.game.add.tween(this.buttonGroup).to({y: - PrimeEight.Spotted.viewHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.playAgainBgTween.onComplete.add(this.onplayAgainBgTweenComplete, this);
		
			this.playAgainFgTween = this.game.add.tween(this.scoreGroup).to({y: + PrimeEight.Spotted.viewHeight/5}, 200, Phaser.Easing.Quadratic.InOut, false, 250);
			this.playAgainFgTween.onComplete.add(this.onplayAgainFgTweenComplete, this);
		},
		onplayAgainBgTweenComplete: function(){ 
			this.woosh.play(); 
			this.playAgainTweenCallbackTween = this.game.add.tween(this.buttonGroup).to({y: PrimeEight.Spotted.viewHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true); 
		},
		onplayAgainFgTweenComplete: function(){
			this.playAgainTweenFCallbackTween = this.game.add.tween(this.scoreGroup).to({y: - PrimeEight.Spotted.viewHeight * 1.2}, 200, Phaser.Easing.Quadratic.In, true);
			this.playAgainTweenFCallbackTween.onComplete.add(this.onStartGame, this);
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
		shutdown: function(){
			this.buttonGroup.destroy(true);
			this.scoreGroup.destroy(true);
			this.background.destroy();
			this.removeSound(this.woosh);
			this.removeTween(this.playAgainFgTween);
			this.removeTween(this.playAgainBgTween);
			this.removeTween(this.buttonGroupTween);
		},
	  onPlayAgain: function () { 
			this.playAgainBgTween.start();
			this.playAgainFgTween.start();
		},
		onStartGame: function (){
			this.game.state.start('Game');
		},
		onMenu: function () {
	    //back to main menu
			window.location.href = 'http://www.primitive.co/games/starmites/';
		}
	};
}());