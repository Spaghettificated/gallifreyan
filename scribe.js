import {placers, drawMode, Modes} from "./placers.js"
import {Ring,Dent,Dot,Point} from "./shapes.js"


const c = document.getElementById("scribe");
let color = getComputedStyle(c).color;
let border = getComputedStyle(c).getPropertyValue('border-width').slice(0, -2)
const ctx = c.getContext("2d");
const crect = c.getBoundingClientRect();
console.log("crect: ", crect)
console.log("border: ", border)
ctx.lineWidth = 8
ctx.lineCap = "round"; // butt round square
let center = new Point(crect.width/2 - border, (crect.height)/2 - border);
let ring = new Ring(center, 200);
ring.draw(ctx)


var mouse = new Point(0,0)
var figures = [ring]
c.addEventListener("mousemove", function(e) {
    // mouse.x = e.clientX - crect.left - border;
    // mouse.y = e.clientY - crect.top - border;
    mouse.x = e.clientX - crect.x - border;
    mouse.y = e.clientY - crect.y - border;
});
var click = false
c.addEventListener("click", function(e) {
    click = true
});


placers[Modes.DENT].parent = ring
placers[Modes.RING].parent = ring
placers[Modes.DOT].parent  = ring


let start = Date.now(); // remember start time
let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = color
    ctx.fillStyle = color

    if(placers[drawMode] != null){
        let placer = placers[drawMode]
        placer.update(mouse)
        placer.draw(ctx)
        if(click){
            placer.on_click(figures)
        }
    }

    figures.forEach(f =>{
        f.draw(ctx)
    })
    
    click = false
}, 20);
    