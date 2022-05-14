function deepCopy(obj) {
	var clone = {};
	for (var i in obj) {
		if (Array.isArray(obj[i])) {
			clone[i] = [];
			for (var z in obj[i]) {
				if (typeof(obj[i][z]) == "object" && obj[i][z] != null) {
					clone[i][z] = deepCopy(obj[i][z]);
				} else {
					clone[i][z] = obj[i][z];
				}
			}
		} else if (typeof(obj[i]) == "object" && obj[i] != null)
			clone[i] = deepCopy(obj[i]);
		else
			clone[i] = obj[i];
	}
	return clone;
}

function inCamera(camera, x, y){
	return (Math.abs(camera.position.x - x)<camera.width*0.5 && Math.abs(camera.position.y - y)<camera.height*0.5);
}

const bridgeB={
	itemmove:[],
	moveindex:0,
	cap:6,

	create(block,team){
		this.super$create(block,team);
		this.items = extend(ItemModule,{
			onTake:null,
			take(){
				var itm = this.super$take();
				if(this.onTake){
					this.onTake.get(itm);
				}
				return itm;
			},
			setTakeCons(s){
				this.onTake=s;
			}
		});
		this.cap=6;
		if(this.block.bufferCapacity){
			this.cap=this.block.bufferCapacity;
		}
		this.items.setTakeCons(cons((item)=>{
			if(this.link!=-1){
				this.itemmove[this.moveindex] = {item:item, t:Time.time}
				this.moveindex = (this.moveindex+1)%this.cap;
			}
		}));
		return this;
	},
	draw(){
		this.super$draw();
		Draw.z(Layer.power);
		if(!inCamera(Core.camera, this.x, this.y)) return;
		var loti = 0;
    	if(this.items){
            for(var iid = 0; iid < 16; iid++){
            if(this.items.get(iid) > 0){
                    for(var itemid = 1; itemid <= this.items.get(iid); itemid++){
                        Draw.rect(
                        Vars.content.item(iid).icon(Cicon.medium), 
                        this.x, 
                        this.y - Vars.tilesize/2 + 1 + 0.6 * loti,
                        4,
                        4
                        );
                        loti++;
                    }
                }
            }
        }
		Draw.color();
		let other = Vars.world.tile(this.link);
		if(!this.block.linkValid(this.tile, other,true)){ return;}
		
		let i = this.tile.absoluteRelativeTo(other.x, other.y);
		
		let ex = other.worldx() - this.x;
        let ey = other.worldy() - this.y;
		let ttime = this.block.transportTime*10;
		if(this.block.bufferCapacity){
			ttime = this.block.transportTime*10+ 3600/this.block.speed;
		}
		for(var m = 0;m<this.itemmove.length;m++){
			if(this.itemmove[m] && this.itemmove[m].item && this.itemmove[m].t+ttime>Time.time){
				var tlerp = (Time.time-this.itemmove[m].t)/ttime;
				Draw.rect(this.itemmove[m].item.icon(Cicon.medium), this.x+ex*tlerp, this.y+ey*tlerp, 4,4);
			}
		}
		
		Draw.reset();
	}
}
Blocks.itemBridge.buildType = () =>{
	return extendContent(BufferedItemBridge.BufferedItemBridgeBuild, Blocks.itemBridge,deepCopy(bridgeB));
}
Blocks.phaseConveyor.buildType = () =>{
	return extendContent(ItemBridge.ItemBridgeBuild, Blocks.phaseConveyor,deepCopy(bridgeB));
}