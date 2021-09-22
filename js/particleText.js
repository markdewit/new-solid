const canvasParticleText = document.getElementById('canvas-container-particleText');

const ctx = canvasParticleText.getContext('2d');
canvasParticleText.width = 1000;
canvasParticleText.height = 1000;
let adjustX = 0;
let adjustY = -20;

let paticleArray = [];

const mouse = {
    x: null,
    y: null,
    radius: 75
};

document.addEventListener('mousemove', (e) => {
    mouse.x = e.x -= 70;
    mouse.y = e.y -= 70;
});


ctx.fillStyle = 'white';
ctx.font = '30px verdana';
ctx.fillText('JKO', 0, 50);
const textcoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x + 100;
        this.y = y; 
        this.size = 3;
        this.basex = this.x;
        this.basey = this.y;
        this.density = (Math.random() * 40) + 5;
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;

        } else {
            if (this.x !== this.basex) {
                let dx = this.x - this.basex;
                this.x -= dx / 10;
            }
            if (this.y !== this.basey) {
                let dy = this.y - this.basey;
                this.y -= dy / 10;
            }
        }

    }

}

function init() {
    paticleArray = [];
    for (let y = 0, y2 = textcoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textcoordinates.width; x < x2; x++) {
            if (textcoordinates.data[(y * 4 * textcoordinates.width) + ( x * 4 ) + 3] > 128) {
                let positionX = x + adjustX;
                let PositionY = y + adjustY;
                paticleArray.push(new Particle(positionX * 15, PositionY * 15));
        
            }
        }
    }
} 
init();


function animate() {
    ctx.clearRect(0, 0, canvasParticleText.width, canvasParticleText.height);
    for (let i = 0; i < paticleArray.length; i++) {
        paticleArray[i].draw();
        paticleArray[i].update();

    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect() {
    let opactiyValue = 1;
    for (let a = 0; a < paticleArray.length; a++) {
        for (let b = 0; b < paticleArray.length; b++) {
            let dx = paticleArray[a].x - paticleArray[b].x;
            let dy = paticleArray[a].y - paticleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
                opactiyValue = 1 - (distance / 50);
                ctx.strokeStyle = 'rgba(255,255,255,' + opactiyValue + ')';
                ctx.strokeStyle = 'white';
                ctx.lieWidth = 2;
                ctx.beginPath();
                ctx.moveTo(paticleArray[a].x, paticleArray[a].y);
                ctx.lineTo(paticleArray[b].x, paticleArray[b].y);
                ctx.stroke();
            }
        }
    }
}