import {placers, drawMode, Modes} from "./placers.js"
import {Ring,Dent,Dot,Point} from "./shapes.js"
const c = document.getElementById("scribe");
const ctx = c.getContext("2d");
const crect = c.getBoundingClientRect();
ctx.lineWidth = 8
ctx.lineCap = "round"; // butt round square
let center = new Point(250, 250);
let ring = new Ring(center, 200);
ring.draw(ctx)


var mouse = new Point(0,0)
var figures = [ring]
c.addEventListener("mousemove", function(e) {
    mouse.x = e.clientX - crect.left;
    mouse.y = e.clientY - crect.top;
});
var click = false
c.addEventListener("click", function(e) {
    click = true
});


placers[Modes.DENT].parent = ring
placers[Modes.RING].parent = ring
placers[Modes.DOT].parent = ring

let start = Date.now(); // remember start time
let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "black"
    ctx.fillStyle = "black"

    if(placers[drawMode] != null){
        let placer = placers[drawMode]
        placer.update(mouse)
        placer.draw(ctx)
        if(click){
            placer.on_click(figures)
        }
    }

    // if(drawMode == Modes.SELECT){
    //     ring.r = 200 + 15 * Math.sin(timePassed/300)
    //     ctx.strokeStyle = "blue"
    // }

    figures.forEach(f =>{
        f.draw(ctx)
    })


    // ctx.fillStyle = "red"
    // pointer.draw(ctx)
    
    click = false
}, 20);
    