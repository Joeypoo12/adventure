// extend LevelEntity so that only our player triggers level changes, not any other objects
game.LevelChangeEntity = me.LevelEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			this.goTo(this.gotolevel);
		}
	}
});

// Coin entity -- simple gets collected and adds to the score when it does.
// TO DO: Fix so guns don't collect/destroy them
game.CoinEntity = me.CollectableEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			me.game.HUD.updateItemValue("score", 250);
			this.collidable = false;
			me.game.remove(this);
		}
	}
});

game.PickupEntity = me.CollectableEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.item = settings.item;
		this.itemType = settings.itemType;
		this.animationpause = true;
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			if(this.itemType === 'weapon') {
				obj.weapons.push(this.item);
				if(obj.currentWep != null) {
					obj.currentWep = obj.currentWep++;
				} else {
					obj.currentWep = 0;
				}
				obj.equipWep(this.item);
			} else {
				obj.gear.push(this.item);
				obj.equipGear(this.item);
			}
			this.collidable = false;
			me.game.remove(this);
		}
	}
});

game.EventEntity = me.LevelEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.item = settings.item;
		this.event = settings.event;
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			if(this.event === 'remove') {
				obj.equippedGear = null;
				obj.removeCompositionItem(this.item);
			} else if (this.event === 'theend') {
				var credits = new game.CreditsEntity(obj.pos.x, obj.pos.y);
				me.game.add(credits, 3);
				me.game.sort();
				me.input.unbindKey(me.input.KEY.LEFT, "left");
				me.input.unbindKey(me.input.KEY.RIGHT, "right");
				me.input.unbindKey(me.input.KEY.X, "jump", true);
				me.input.unbindKey(me.input.KEY.Z, "attack");
				me.input.unbindKey(me.input.KEY.C, "switch", true);
				me.input.unbindKey(me.input.KEY.SPACE, "fly");
			}
			this.collidable = false;
			me.game.remove(this);
		}
	}
});

// Score object for the HUD. Just text that gets updated
game.ScoreObject = me.HUD_Item.extend({
	init:function(x, y) {
		this.parent(x, y);
		this.font = new me.Font('century gothic', 24, 'white');
	},
	draw: function(context, x, y){
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}	
});


game.HealthObject = me.HUD_Item.extend({
	init:function(x, y) {
		this.parent(x, y, game.persistent.player.hp);
		this.image = me.loader.getImage("health");
	},
	draw: function(context){
		for(var i = 0; i < this.value; i++) {
			context.drawImage(this.image,this.pos.x+(i*32),this.pos.y);
		}
	}	
});

game.CreditsEntity = me.ObjectEntity.extend({
	init: function(x, y) {
		var self = this;
		self.parent(x, y, {image: "explode", spritewidth: 1});

		self.credits1 = "      The End";
		self.credits2 = "By: Justin Oblak";
		console.log('here');

		self.creditsSize = 24;

		self.creditsX = this.pos.x - me.game.viewport.pos.x + 100;
		self.creditsY = this.pos.y - me.game.viewport.pos.y + 100;

		self.credits = new me.Font('century gothic', self.creditsSize, 'black');

		var tween = new me.Tween(self)
			.to({creditsX: self.creditsX,
				 creditsY: -200,
				 creditsSize: 24
				}, 15000);
		tween.start();

	},

	draw: function(context) {
		this.credits.draw(context, this.credits1, this.creditsX, this.creditsY);
		this.credits.draw(context, this.credits2, this.creditsX, this.creditsY + 50);
		this.credits.set('century gothic', this.creditsSize, 'black');
	}
});
