/**
 * Oblicza kąt naprzeciwko boku 'c' w trójkącie o bokach a, b, c
 * Wykorzystuje twierdzenie cosinusów.
 */
function sides_to_angle(a, b, c) {
    let ab2cos = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2);
    return Math.acos(ab2cos / (2 * a * b));
}

class Polar {
    constructor(radius, angle) {
        this.radius = radius;
        this.angle = angle;
    }
    x() { return this.radius * Math.cos(this.angle); }
    y() { return this.radius * Math.sin(this.angle); }
}

class Dent {
    constructor(parent, polar, radius) {
        this.radius = radius;
        this.center = polar;
        this.parent = parent;
    }

    // Kąty łuku dla małego koła (wcięcia)
    angles() {
        let half_angle_size = sides_to_angle(this.center.radius, this.radius, this.parent.radius);
        if (this.radius + this.center.radius > this.parent.radius) {
            half_angle_size = Math.PI - half_angle_size;
        }
        return [this.center.angle - half_angle_size, this.center.angle + half_angle_size];
    }

    // Kąty styku na głównym okręgu
    parent_angles() {
        let half_angle_size = sides_to_angle(this.center.radius, this.parent.radius, this.radius);
        return [this.center.angle - half_angle_size, this.center.angle + half_angle_size];
    }
}

// Inicjalizacja Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const center = [500, 250];

const ring = {
    radius: 150,
    dents: [],
};

// Definicja wcięć/wypustek
ring.dents.push(new Dent(ring, new Polar(190, 1.1), 120));
ring.dents.push(new Dent(ring, new Polar(105, 4.1), 50));

// Sortowanie wcięć według kąta, aby rysowanie było ciągłe
ring.dents.sort((a, b) => a.parent_angles()[0] - b.parent_angles()[0]);

ctx.beginPath();
let arc_begin = 0;

// Jeśli są wcięcia, zacznij rysowanie od końca ostatniego (dla domknięcia pętli)
if (ring.dents.length > 0) {
    arc_begin = ring.dents[ring.dents.length - 1].parent_angles()[1];
}

ring.dents.forEach(dent => {
    const ring_angles = dent.parent_angles();
    const dent_angles = dent.angles();

    // 1. Rysuj łuk głównego pierścienia do miejsca styku
    ctx.arc(center[0], center[1], ring.radius, arc_begin, ring_angles[0]);

    // 2. Rysuj łuk wcięcia (parametr 'true' oznacza kierunek przeciwny - tworzy wklęsłość/wypukłość)
    ctx.arc(
        center[0] + dent.center.x(), 
        center[1] + dent.center.y(), 
        dent.radius, 
        dent_angles[0], 
        dent_angles[1], 
        true
    );

    arc_begin = ring_angles[1];
});

// Domknięcie okręgu do punktu startowego
if (ring.dents.length > 0) {
    ctx.arc(center[0], center[1], ring.radius, arc_begin, ring.dents[0].parent_angles()[0]);
} else {
    ctx.arc(center[0], center[1], ring.radius, 0, 2 * Math.PI);
}

ctx.lineWidth = 2;
ctx.stroke();
