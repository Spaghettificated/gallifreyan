
const Modes = {
	SELECT: 0,
	DENT:   1,
	RING:   2,
	DOT:    3,
	LINE:   4,
	VOWEL:  5,
}

class PlacementPosition{
	constructor(word, letter) {
		this.word = word
		this.letter = letter
	}
}

class RingPlacer{
	constructor(parent) {
		this.parent = parent
		this.sketch = null
		this.phase = 0
	}
	reset(){
		this.sketch = null
		this.phase = 0
	}
	update(mouse){
		this.sketch = this.sketch ?? new Ring(mouse, 30)
		if(this.phase == 1){
			let r = xy_to_r(this.sketch.center.x - mouse.x, this.sketch.center.y - mouse.y)
			this.sketch.r = r>5 ? r : this.sketch.r
		}
	}
	on_click(figures){
		if(this.phase == 0){
			this.sketch.center = this.parent.pointAsRingAttached(this.sketch.center)
			this.phase = 1
		}
		else{
			figures.push(this.sketch)
			this.sketch = null
			this.phase = 0
		}
	}
	draw(ctx){
		this.sketch.draw(ctx)
	}
}
class DentPlacer{
	constructor(parent) {
		this.parent = parent
		this.sketch_id = null
		this.phase = 0
	}
	get sketch(){
		if(this.parent != null && this.sketch_id != null){
			return this.parent.dents[this.sketch_id]
		}
		return null
	}
	reset(){
		if(this.sketch != null){
			this.parent.dents.pop(this.sketch_id)
		}
		this.sketch_id = null
		this.phase = 0
	}
	update(mouse){
		this.sketch_id = this.sketch_id ?? this.parent.addDent(0, to_rad(20), 40)
		let center = this.parent.center
		let a = xy_to_angle(center.x - mouse.x, center.y - mouse.y)
		if(this.phase==0){
			let delta = this.sketch.end - this.sketch.start
			this.sketch.start = a
			this.sketch.end = a + delta
		}
		else if(this.phase==1){
			this.sketch.end = a
		}
		else if(this.phase==2){
			// let center = this.sketch.center
			// this.sketch.r = xy_to_r(mouse.x - center.x, mouse.y - center.y)
			let dist = xy_to_r(mouse.x - this.parent.center.x, mouse.y - this.parent.center.y)
			let theta = (this.sketch.end - this.sketch.stare)/2
			this.sketch.depth = this.parent.r * Math.cos(theta) - dist
			this.sketch.depth = Math.sqrt(this.parent.r**2 - (this.sketch.length()/2.)**2) - dist
			this.sketch.depth = Math.max(this.sketch.depth, 1)
		}
		// if(this.phase == 1){
		// 	let r = xy_to_r(this.sketch.center.x - mouse.x, this.sketch.center.y - mouse.y)
		// 	this.sketch.r = r>5 ? r : this.sketch.r
		// }
	}
	on_click(figures){
		if(this.phase == 0){
			// this.sketch.center = this.parent.pointAsRingAttached(this.sketch.center)
			this.phase = 1
		}
		else if(this.phase ==1){
			this.phase = 2
		}
		else{
			// figures.push(this.sketch)
			this.sketch_id = null
			this.phase = 0
		}
	}
	draw(ctx){
		// this.sketch.draw(ctx)
	}
}
class DotPlacer{
	constructor(parent, r) {
		this.parent = parent
		this.sketch = null
		this.phase = 0
		this.r = r
	}
	reset(){
		this.sketch = null
		this.phase = 0
	}
	update(mouse){
		
		let point = mouse

		if(this.parent != null){
			point = this.parent.pointAsRingAttached(mouse)
			// point.r = this.r  + 5
			let limit = 2*this.r + 15
			point.r = Math.min(point.r, limit)
			point.r = Math.max(point.r, -limit)
		}
		this.sketch = this.sketch ?? new Dot(mouse, this.r)
		this.sketch.center = point

		// if(this.phase == 1){
		// 	let r = xy_to_r(this.sketch.center.x - mouse.x, this.sketch.center.y - mouse.y)
		// 	this.sketch.r = r>5 ? r : this.sketch.r
		// }
	}
	on_click(figures){
		// if(this.phase == 0){
		// 	this.sketch.center = this.parent.pointAsRingAttached(this.sketch.center)
		// 	this.phase = 1
		// }
		// else{
			figures.push(this.sketch)
			this.sketch = null
		// 	this.phase = 0
		// }
	}
	draw(ctx){
		this.sketch.draw(ctx)
	}
}

var placers = []
placers[Modes.SELECT] = null
placers[Modes.DENT]  = new DentPlacer(null)
placers[Modes.RING]  = new RingPlacer(null)
placers[Modes.DOT]   = new DotPlacer(null, 7)
placers[Modes.LINE]  = null
placers[Modes.VOWEL] = null
var drawMode = Modes.SELECT
