(function () {
	
	"use strict";
	
	PrimeEight.Spotted.MainMenu = function (game) {

		this.music = null; 

	};

	PrimeEight.Spotted.MainMenu.prototype = {

		create: function () {  
			this.playFontSize = Math.floor(PrimeEight.Spotted.gameHeight/9.4);
			this.strapFontSize =  Math.floor(PrimeEight.Spotted.viewWidth/22);  
		
			this.background = this.game.add.sprite(0,0, 'background'); 
			this.backgroundElements = this.add.group();
			this.foregroundElements = this.add.group();
		
			this.menuLadybird = this.game.add.sprite(0,0, 'menuLadybird');  
			this.menuLadybird.anchor.setTo(0.5,0);
			this.menuLadybird.x = PrimeEight.Spotted.gameWidth/2.05; 
			this.menuLadybird.y = PrimeEight.Spotted.viewHeight * 0.05; 
			this.backgroundElements.add(this.menuLadybird); 
		
			this.playLink = this.game.add.bitmapText(0, PrimeEight.Spotted.viewHeight * 0.57, 'LuckiestGuyPrime8', 'play', this.playFontSize);
			this.playLink.x = (PrimeEight.Spotted.gameWidth/2) - this.playLink.width/2;  
		
			this.backgroundElements.add(this.menuLadybird);
			this.backgroundElements.add(this.playLink);
		
	    this.logo = this.game.add.sprite(0,0, 'logo');
			this.foregroundElements.add(this.logo);
			this.logo.anchor.setTo(0.5,0);
			this.logo.x = PrimeEight.Spotted.gameWidth * 0.5; 
			this.logo.y = PrimeEight.Spotted.viewHeight * 0.2; 
		
			this.menuAphid = this.game.add.sprite(0,0, 'menuAphid');
			this.menuAphid.x = PrimeEight.Spotted.gameWidth * 0.67;
			this.menuAphid.y = PrimeEight.Spotted.viewHeight * 0.38;
			this.foregroundElements.add(this.menuAphid);
		
			this.strapLine = this.game.add.bitmapText(0, 0, 'LuckiestGuyPrime8', 'get the grubs before they get you!', this.strapFontSize);
	    this.foregroundElements.add(this.strapLine); 
			this.strapLine.x = (PrimeEight.Spotted.viewWidth/2) - this.strapLine.width * 0.5; 
			this.strapLine.y = PrimeEight.Spotted.viewHeight - (this.strapLine.height * 2);

			this.backgroundTween = this.add.tween(this.backgroundElements);
		  this.backgroundTween.to( { y: this.backgroundElements.y - PrimeEight.Spotted.gameHeight * 0.2 }, 200, Phaser.Easing.Quadratic.InOut)
		  .to( { y: PrimeEight.Spotted.gameHeight }, 200, Phaser.Easing.Quadratic.In);
			this.backgroundTween._lastChild.onComplete.add(this.onBackgroundTweenComplete, this);
			
			this.foregroundTween = this.add.tween(this.foregroundElements);
		  this.foregroundTween.to( { y: this.foregroundElements.y + PrimeEight.Spotted.gameHeight * 0.5 }, 200, Phaser.Easing.Quadratic.InOut)
		  .to( { y: - PrimeEight.Spotted.gameHeight }, 200, Phaser.Easing.Quadratic.In); 
		
			this.background.inputEnabled = true;
			this.background.events.onInputDown.add(this.onPlay, this, this);
		}, 
		onBackgroundTweenComplete: function(){
			this.game.state.start('Instructions');
		},
		removeTween: function(_tween) {
			if (_tween) {
				_tween.onComplete.removeAll();
				_tween.stop();
				_tween = null;
			}
		}, 
		shutdown: function(){
			this.removeTween(this.foregroundTween);
			this.removeTween(this.backgroundTween); 
			this.backgroundElements.destroy(true);
			this.foregroundElements.destroy(true);
			this.background.destroy();
		},
		onPlay: function(game) {  
			this.foregroundTween.start();
			this.backgroundTween.start();
		}
	};
}());