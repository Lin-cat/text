const JunctionB ={
	capacity : 6,
	speed : 26,
	draw(){
		this.super$draw();
		// var color = [Color.red, Color.yellow, Color.blue, Color.green];
		// for(let i = 0; i < 4; i ++){
			// Draw.color(color[i]);//→
			// Lines.circle(this.x, this.y ,this.buffer.indexes[i]);
			// Draw.reset();
		// }
		for(let i = 0; i < 4; i ++){
			var loti = 0;
			var endx = this.x + Geometry.d4[i].x * Vars.tilesize / 2 + Geometry.d4[(i + 1) % 4].x * Vars.tilesize / 4;
        	var endy = this.y + Geometry.d4[i].y * Vars.tilesize / 2 + Geometry.d4[(i + 1) % 4].y * Vars.tilesize / 4;
        	var begx = this.x - Geometry.d4[i].x * Vars.tilesize / 4 + Geometry.d4[(i + 1) % 4].x * Vars.tilesize / 4;
        	var begy = this.y - Geometry.d4[i].y * Vars.tilesize / 4 + Geometry.d4[(i + 1) % 4].y * Vars.tilesize / 4;
			for(var j = 0; j < this.buffer.indexes[i]; j ++){
				var item = Vars.content.item(BufferItem.item(this.buffer.buffers[i][j]));
				var time = BufferItem.time(this.buffer.buffers[i][j]);
				
                Draw.rect(
                	item.icon(Cicon.medium), 
                    begx + ((endx - begx) / this.capacity * Math.min(((Time.time - time) * this.timeScale / this.speed) * this.capacity, this.capacity - loti)), 
                    begy + ((endy - begy) / this.capacity * Math.min(((Time.time - time) * this.timeScale / this.speed) * this.capacity, this.capacity - loti)),
                    4,
                    4),
				loti ++;
				Draw.reset();
			}
		}
		//0→  1↑  2←  3↓
	}
}

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

Blocks.junction.buildType = () =>{
	return extendContent(Junction.JunctionBuild, Blocks.junction, deepCopy(JunctionB));
}
