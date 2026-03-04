import {to_rad, xy_to_angle, xy_to_r, Ring, Dent, Dot, LineEnd} from "./shapes.js"
import { Consonant } from "./words.js"
export const Modes = {
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
	constructor(word) {
		this.word = word
		this.sketch = null
		this.phase = 0
	}
	reset(){
		this.sketch = null
		this.phase = 0
	}
	update(mouse, cursor){
		this.sketch = this.sketch ?? new Ring(mouse, 30)
		if(this.phase == 0){
			this.word = cursor.word
		}
		if(this.phase == 1){
			let r = xy_to_r(this.sketch.center.x - mouse.x, this.sketch.center.y - mouse.y)
			this.sketch.r = r>5 ? r : this.sketch.r
		}
	}
	on_click(figures){
		let parent = this.word?.shape;
		if (parent==null) {return}
		if(this.phase == 0){
			this.sketch.center = parent.pointAsRingAttached(this.sketch.center)
			this.phase = 1
		}
		else{
			// figures.push(this.sketch)
			this.word.letters.push(new Consonant(this.word, this.sketch))
			this.sketch = null
			this.phase = 0
		}
	}
	draw(ctx){
		if(this.word != null){
			this.sketch.draw(ctx)
		}
	}
}
class DentPlacer{
	constructor(word) {
		this.word = word
		this.sketch_id = null
		this.phase = 0
	}
	get sketch(){
		if(this.word != null && this.sketch_id != null){
			return this.word?.shape?.dents[this.sketch_id]
		}
		return null
	}
	reset(){
		if(this.sketch != null){
			this.word?.shape?.dents.pop(this.sketch_id)
		}
		this.sketch_id = null
		this.phase = 0
	}
	update(mouse, cursor){
		if(cursor.word == null) { 
			this.reset()
			return 
		}
		this.word = cursor.word

		// if(this.parent == null) { return }
		// this.sketch_id = this.sketch_id ?? this.parent.addDent(0, to_rad(20), 40)
		this.sketch_id = this.sketch_id ?? this.word.shape.addDent(0, to_rad(20), 40)
		let center = this.word.shape.center
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
			let parent = this.word?.shape
			// let center = this.sketch.center
			// this.sketch.r = xy_to_r(mouse.x - center.x, mouse.y - center.y)
			let dist = xy_to_r(mouse.x - parent.center.x, mouse.y - parent.center.y)
			let theta = (this.sketch.end - this.sketch.stare)/2
			this.sketch.depth = parent.r * Math.cos(theta) - dist
			this.sketch.depth = Math.sqrt(parent.r**2 - (this.sketch.length()/2.)**2) - dist
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
			this.word.letters.push(new Consonant(this.word, this.sketch))
			// this.word.letters.push()
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
	update(mouse, cursor){
		this.parent = cursor.letter?.shape
		let point = mouse

		if(this.parent != null){
			// point = this.parent.pointAsRingAttached(mouse)
			let ring = this.parent.ring ?? this.parent // for dents too
			point = ring.pointAsRingAttached(mouse)

			let limit = 2*this.r + 5
			point.r = Math.min(point.r, limit)
			point.r = Math.max(point.r, -limit)
		}
		this.sketch = this.sketch ?? new Dot(mouse, this.r)
		this.sketch.center = point

	}
	on_click(figures){
		if (this.parent != null){
			figures.push(this.sketch)
			this.sketch = null
		}
	}
	draw(ctx){
		if(this.parent != null)
		this.sketch.draw(ctx)
	}
}
class LinePlacer{
	constructor(parent) {
		this.parent = parent
		this.start = null
		this.end = null
		this.phase = 0
		this.firstParent=null
	}
	reset(){
		this.firstParent=null
		this.start = null
		this.end = null
		this.phase = 0
	}
	update(mouse, cursor){
		this.parent = cursor.letter ?? cursor.word
		if (this.parent == null) {return}
		let point = this.parent.shape.pointAsRingAttached(mouse)
		point.r = 0
		if (this.phase==0){
			this.start = this.start ?? new LineEnd(point, this.parent.shape)
			this.start.point = point
			this.start.parent = this.parent.shape
		}
		if (this.phase==1){
			this.end = this.end ?? this.start.makeOtherEnd(point, this.parent.shape)
			this.end.point = point
		}

	}
	on_click(figures){
		if (this.parent == null){ return }
		if (this.phase == 0){
			this.firstParent = this.parent
			this.phase = 1 
		}
		else if (this.phase == 1){
			this.firstParent.lines.push(this.start)
			this.parent.lines.push(this.end)
			this.reset()
		}
	}
	draw(ctx){
		if(this.parent != null){
			this.start.draw(ctx)
		}
	}
}

export let placers = []
placers[Modes.SELECT] = null
placers[Modes.DENT]  = new DentPlacer(null)
placers[Modes.RING]  = new RingPlacer(null)
placers[Modes.DOT]   = new DotPlacer(null, 7)
placers[Modes.LINE]  = new LinePlacer(null)
placers[Modes.VOWEL] = null

export var drawMode = Modes.SELECT

export function setDrawMode(mode){
	if(mode != drawMode && drawMode != null){
        let placer = placers[drawMode]
        if(placer != null){
            placer.reset()
        }
	}
	drawMode = mode
}
