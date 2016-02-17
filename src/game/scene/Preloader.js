(function () {
	
	"use strict";
	
	PrimeEight.Spotted.Preloader = function (game) {

		this.background = null;
		this.preloadBar = null;

		this.ready = false;

	};

	PrimeEight.Spotted.Preloader.prototype = {

		preload: function () {
			this.background = this.add.sprite(0, 0, 'preloaderBackground');
			this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
			this.background.width = PrimeEight.Spotted.srx;
			this.preloadBar.width = PrimeEight.Spotted.srx;
			this.load.setPreloadSprite(this.preloadBar);
			this.load.bitmapFont('LuckiestGuyPrime8', 'assets/' + PrimeEight.Spotted.screen + '/LuckiestGuyPrime8/LuckiestGuyPrime8.png', 'assets/' + PrimeEight.Spotted.screen + '/LuckiestGuyPrime8/LuckiestGuyPrime8.fnt');
			this.load.audio('bgLoop', ['assets/audio/primitive/bugout.mp3', 'assets/audio/primitive/bugout.ogg']);
			this.load.audio('woosh', ['assets/audio/primitive/woosh.mp3', 'assets/audio/primitive/woosh.ogg']);
			this.load.audio('bump', ['assets/audio/primitive/bump.mp3', 'assets/audio/primitive/bump.ogg']);
			this.load.audio('boundsBump', ['assets/audio/primitive/boundsBump.mp3', 'assets/audio/primitive/boundsBump.ogg']);
			this.load.audio('aphidIn', ['assets/audio/primitive/aphidIn.mp3', 'assets/audio/primitive/aphidIn.ogg']);
			this.load.audio('aphidOut', ['assets/audio/primitive/aphidOut.mp3', 'assets/audio/primitive/aphidOut.ogg']);		
			this.load.audio('angryAphid', ['assets/audio/primitive/angry.mp3', 'assets/audio/primitive/angry.ogg']);
			this.load.audio('angryTime', ['assets/audio/primitive/angryTime.mp3', 'assets/audio/primitive/angryTime.ogg']);  
			this.load.audio('preciousAphid', ['assets/audio/primitive/aphidTurnsPrecious.mp3', 'assets/audio/primitive/aphidTurnsPrecious.ogg']);
			this.load.audio('eatPatient', ['assets/audio/primitive/eatPatient.mp3', 'assets/audio/primitive/eatPatient.ogg']); 
			this.load.audio('eatPrecious', ['assets/audio/primitive/eatPrecious.mp3', 'assets/audio/primitive/eatPrecious.ogg']);
			this.load.audio('gameOver', ['assets/audio/primitive/gameOver.mp3', 'assets/audio/primitive/gameOver.ogg']);		

			this.load.image('background','assets/' + PrimeEight.Spotted.screen + '/background.png');
			this.load.image('droplet','assets/' + PrimeEight.Spotted.screen + '/droplet.png');
			this.load.image('pulse','assets/' + PrimeEight.Spotted.screen + '/pulse.png');
			this.load.image('logo','assets/' + PrimeEight.Spotted.screen + '/logo.png'); 
			this.load.image('menuLadybird','assets/' + PrimeEight.Spotted.screen + '/menuLadybird.png'); 
			this.load.image('menuAphid','assets/' + PrimeEight.Spotted.screen + '/menuAphid.png'); 
			this.load.image('instructionsLadybird','assets/' + PrimeEight.Spotted.screen + '/instructionsLadybird.png'); 
			this.load.image('instructionsBounce','assets/' + PrimeEight.Spotted.screen + '/instructionsBounce.png');  
			this.load.image('instructionsOKbg','assets/' + PrimeEight.Spotted.screen + '/instructionsOKbg.png'); 
			this.load.image('gameOveButtonBg','assets/' + PrimeEight.Spotted.screen + '/gameOveButtonBg.png'); 
			this.load.spritesheet('ladybird', 'assets/' + PrimeEight.Spotted.screen + '/ladybird.png', PrimeEight.Spotted.ladybirdHeight, PrimeEight.Spotted.ladybirdHeight, 2);
			this.load.spritesheet('aphid', 'assets/' + PrimeEight.Spotted.screen + '/aphid.png', PrimeEight.Spotted.aphidHeight, PrimeEight.Spotted.aphidHeight, 8);
			this.load.spritesheet('buttonsSound', 'assets/' + PrimeEight.Spotted.screen + '/buttonsSound.png', PrimeEight.Spotted.buttonsSoundWidth, PrimeEight.Spotted.buttonsSoundHeight, 4);
		
		},

		create: function () {
			this.ready = true;
			this.state.start('MainMenu');
		},

		update: function () {

			if (this.cache.isSoundDecoded('titleMusic') && this.ready === false)
			{
				this.ready = true;
				this.state.start('MainMenu');
			}

		}

	};
}());