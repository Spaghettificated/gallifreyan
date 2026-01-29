function xy_to_polar(x,y){
    return []
}
function polar_to_x(r, angle){
	return r * Math.sin(angle)
}
function polar_to_y(r, angle){
	return r * Math.cos(angle)
}
function polar_to_xy(r, angle){
    return [polar_to_x(r, angle), polar_to_y(r, angle)]
}
function to_canvas_angle(angle){
	// let n = Math.round(angle / (2*Math.PI))
	// let rest = angle - n * 2 * Math.PI
	// return Math.PI / 2 - rest + n * 2 * Math.PI
	return Math.PI / 2 - angle
}
function drawArc(ctx, x, y, r, sAngle, eAngle, counterclockwise=false){
	ctx.beginPath()
	ctx.moveTo(x + polar_to_x(r, eAngle), y + polar_to_y(r, eAngle))
	ctx.arc(x, y, r, to_canvas_angle(eAngle), to_canvas_angle(sAngle), counterclockwise)
	// ctx.arc(x, y, r, to_canvas_angle(eAngle), to_canvas_angle(sAngle), counterclockwise)
	ctx.stroke()
}
function to_rad(degrees){
	return Math.PI * degrees / 180
}

class Point{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}
class PolarPoint{
    constructor(origin, r, angle){
		this.origin = origin
        this.r = r
        this.angle = angle
    }
	get x(){
		return this.origin.x + polar_to_x(this.r, this.angle)
	}
	get y(){
		return this.origin.y + polar_to_y(this.r, this.angle)
	}
}
class Ring{
    constructor(center, r){
		this.center = center
        this.r = r
    }
	pointFromCenter(r, angle){
		return new PolarPoint(this.center, r, angle)
	}
	pointFromEdge(r, angle){
		return new RingPoint(this, r, angle)
	}
	draw(ctx){
		var start = this.pointFromEdge(0, 0)
		// ctx.moveTo(start.x, start.y)
		// ctx.arc(this.center.x, this.center.y, this.r, to_canvas_angle(0), to_canvas_angle(to_rad(135)))
		drawArc(ctx, this.center.x, this.center.y, this.r, to_rad(0), to_rad(360))

	}
}
class RingPoint{
    constructor(ring, r, angle){
		this.ring = ring
        this.r = r
        this.angle = angle
    }
	get x(){
		return this.ring.center.x + polar_to_x(this.ring.r - this.r, this.angle)
	}
	get y(){
		return this.ring.center.y + polar_to_y(this.ring.r - this.r, this.angle)
	}
}

function distance(a, b){
	return Math.sqrt( (b.x - a.x)**2 + (b.y - a.y)**2 )
}


function sides_to_angle(a,b,c){ // z twierdzenia cosinusów c**2 = a**2 + b**2 - 2*a*b*cos(angle)
    let ab2cos = a**2 + b**2 - c**2
    return Math.acos(ab2cos / (2*a*b))
}

class Dent {
    constructor(parent, start, end, depth){
        // this.radius = radius
        this.parent = parent
		this.start = start
		this.end = end
		this.depth = depth
    }
	startPoint(){
		return this.parent.pointFromEdge(0, this.start)
	}
	endPoint(){
		return this.parent.pointFromEdge(0, this.end)
	}
	length(){
		var s = this.startPoint()
		var e = this.endPoint()
		return distance(s,e)
	}
	get r(){
		var l = this.length() / 2
		return ((l**2) / (2*this.depth)) + this.depth/2
	}
	get center(){
		// let midPoint = 
		let distToFlat = Math.sqrt(this.parent.r**2 - (this.length()/2)**2)
		return this.parent.pointFromCenter(distToFlat - this.depth + this.r, (this.start + this.end) / 2)
		// return this.parent.pointFromEdge(this.depth - this.r, (this.start + this.end) / 2)
	}
    insideAngles(){ // kąty początku i końca wcięcia względem samego wcięcia, a nie całego pierścienia
        let half_angle_size = sides_to_angle(this.r, Math.abs(this.r - this.depth), this.length()/2)
        console.log('size', half_angle_size, this.r, this.depth, this.length()/2)
		var mid_angle = (this.start + this.end) / 2
		if(this.r  > this.depth){
            mid_angle = mid_angle + to_rad(180)
        }
        return [mid_angle - half_angle_size, mid_angle + half_angle_size]
    }
	draw(){
		// ctx.beginPath()
		// ctx.moveTo(start.x, start.y)
		var start = this.startPoint()
		var angles = this.insideAngles()
		// ctx.arc(this.center.x, this.center.y, this.r, to_canvas_angle(angles[0]), to_canvas_angle(angles[1]))
		drawArc(ctx, this.center.x, this.center.y, this.r, angles[0], angles[1], this.r  < this.depth)
		console.log('dent', angles)
		// console.log('dent', polar_to_x(start.ring.r - start.r, start.angle))
		// console.log('dent', polar_to_x(1,1))
		
		// ctx.arc(10, 20, 30, 0, 1)
		// ctx.stroke()
	}
}

// class Dent {
//     constructor(parent, polar, radius){
//         // this.radius = radius
//         this.center = polar
//         this.parent = parent
// 		this.ring = new Ring(radius)
//     }
// 	get r(){
// 		return this.ring
// 	}
//     angles(){
//         let half_angle_size = sides_to_angle(this.center.radius, this.radius, this.parent.radius)
//         if(this.radius + this.center.radius > this.parent.radius){
//             half_angle_size = Math.PI - half_angle_size
//         }
//         return [this.center.angle - half_angle_size, this.center.angle + half_angle_size]
//     }
//     parent_angles(){
//         let half_angle_size = sides_to_angle(this.center.radius, this.parent.radius, this.radius)
//         return [this.center.angle - half_angle_size, this.center.angle + half_angle_size]
//     }
// }





class Polar {
    constructor(radius, angle){
        this.radius = radius
        this.angle = angle
    }
    x(){
        return this.radius * Math.cos(this.angle)
    }
    y(){
        return this.radius * Math.sin(this.angle)
    }
    vec(){
        return [this.x(), this.y()]
    }
}



function arcFromPoints(ctx, A, B, radius, options) {
	options = options || {};
	function toXY(p){
		if (Array.isArray(p)) return {x: p[0], y: p[1]};
		if (p && typeof p.x === 'number' && typeof p.y === 'number') return p;
		throw new TypeError('Point must be [x,y] or {x,y}');
	}

	var a = toXY(A), b = toXY(B);
	var dx = b.x - a.x, dy = b.y - a.y;
	var d = Math.hypot(dx, dy);
	if (d === 0) return false;
	if (radius < d/2) return false; // no circle of given radius can pass through both points

	// midpoint between A and B
	var mx = (a.x + b.x) / 2;
	var my = (a.y + b.y) / 2;

	var half = d / 2;
	var h = Math.sqrt(Math.max(0, radius * radius - half * half));

	// unit perpendicular vector to AB
	var ux = -dy / d;
	var uy = dx / d;

	// two possible centers
	var c1 = { x: mx + ux * h, y: my + uy * h };
	var c2 = { x: mx - ux * h, y: my - uy * h };

	function angle(c, p){ return Math.atan2(p.y - c.y, p.x - c.x); }
	function normAngle(a){ while (a < 0) a += Math.PI * 2; while (a >= Math.PI * 2) a -= Math.PI * 2; return a; }
	function sweepCCW(start, end){
		var s = end - start;
		s = (s % (Math.PI*2) + (Math.PI*2)) % (Math.PI*2);
		return s;
	}

	var centers = [c1, c2];
	var best = null;
	var preferClockwise = (typeof options.clockwise === 'boolean') ? options.clockwise : null; // true = clockwise
	var preferLarge = (typeof options.largeArc === 'boolean') ? options.largeArc : null;

	for (var i = 0; i < centers.length; i++){
		var c = centers[i];
		var start = angle(c, a);
		var end = angle(c, b);
		var sCCW = sweepCCW(start, end); // in [0,2PI)
		var sCW = (Math.PI*2 - sCCW) % (Math.PI*2);

		var candidate = {
			center: c,
			start: start,
			end: end,
			sweepCCW: sCCW,
			sweepCW: sCW,
			minorSweep: Math.min(sCCW, sCW),
			majorSweep: Math.max(sCCW, sCW),
			index: i
		};
		if (!best) { best = candidate; continue; }

		// selection rules:
		// - if preferLarge specified, prefer center that gives sweep (in chosen direction) > PI
		// - else prefer smaller (minor) sweep
		var bestPrefScore = 0;
		var candScore = 0;

		// evaluate candidate relative to best
		function scoreFor(obj){
			var score = 0;
			var minor = obj.minorSweep;
			var major = obj.majorSweep;
			var willBeLarge = (preferClockwise === null)
				? (major > Math.PI && major > minor)
				: null;

			if (preferLarge !== null){
				// compute whether this center can produce an arc with largeArc matching preference
				var largePossible = (obj.majorSweep > Math.PI);
				if (largePossible === preferLarge) score += 4;
			}

			// prefer smaller minor sweep by default
			score += (1 / (1 + obj.minorSweep));
			return score;
		}

		if (scoreFor(candidate) > scoreFor(best)) best = candidate;
	}

	if (!best) return false;

	// decide direction and whether to draw large arc
	var c = best.center;
	var start = best.start;
	var end = best.end;
	var sCCW = best.sweepCCW;
	var sCW = best.sweepCW;

	var drawClockwise;
	if (preferClockwise !== null) {
		drawClockwise = preferClockwise;
	} else {
		// choose direction that gives smaller sweep
		drawClockwise = (sCW <= sCCW);
	}

	// If largeArc preference exists, and current direction gives wrong size, try flipping center if possible
	if (typeof preferLarge === 'boolean'){
		var currentSweep = drawClockwise ? sCW : sCCW;
		if ((currentSweep > Math.PI) !== preferLarge){
			// try the other center (if it exists) and see if it matches
			var other = centers[(best.index + 1) % 2];
			var ostart = angle(other, a), oend = angle(other, b);
			var osCCW = sweepCCW(ostart, oend), osCW = (Math.PI*2 - osCCW) % (Math.PI*2);
			var osweep = drawClockwise ? osCW : osCCW;
			if ((osweep > Math.PI) === preferLarge){
				c = other; start = ostart; end = oend; sCCW = osCCW; sCW = osCW;
			}
		}
	}

	var anticlockwise = !drawClockwise;

	if (options.moveToStart !== false) ctx.moveTo(a.x, a.y);
	ctx.arc(c.x, c.y, radius, start, end, anticlockwise);
	return true;
}

// Export for browser and CommonJS
if (typeof window !== 'undefined') {
	window.shapes = window.shapes || {};
	window.shapes.arcFromPoints = arcFromPoints;
}
if (typeof module !== 'undefined' && module.exports) {
	module.exports = module.exports || {};
	module.exports.arcFromPoints = arcFromPoints;
}

// Example usage (not run):
// arcFromPoints(ctx, {x:100,y:100}, {x:200,y:120}, 80, {clockwise:false});

