const canvas2 = document.getElementById('canvas2');
console.log(canvas2.dataset);
const ctx = canvas2.getContext('2d');
//const bodyContainer = document.getElementsByClassName('container-content1'); 

canvas2.width = 1900;
canvas2.height = 1000;

let particlesArray = []; 
const numberOfParticles = 50;

let titleElement = document.getElementById('title');
let titleMeasurments = titleElement.getBoundingClientRect();
let navbar = document.getElementsByClassName('navbar');

let title = {
    height: titleMeasurments.height,
    width: titleMeasurments.width,
    x: titleMeasurments.left -20,
    y: titleMeasurments.top +10
};


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = randomRGB();
        this.size = Math.random() * 15 +16;
        this.weight = Math.random() * 1 + 1;
        let direction = 0;
        if (Math.random() * 2 > 1) {
             direction= (Math.random()) * 2 + 1;
        } else {
            direction = -(Math.random() * 2) - 1;
        }

        this.directionX = direction;
    }
    update() {
        if (this.y > canvas2.height)
        {
            this.y = 0 - this.size;
            this.weight = Math.random() * 1 + 1;
            this.x = Math.random() * canvas2.width * 1.2;
        } 
        this.weight += 0.05;
        this.y += this.weight;
        this.x += this.directionX;

        // check colission
        if (this.x < title.x + title.width && this.x + this.size > title.x && this.y < title.y + title.height && this.y > title.y + this.size) {
            this.y -= 3;
            this.weight *= -0.5;
        }

    }
    draw() {

        ctx.fillStyle = 'rgba(' + this.color + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}
function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let y = Math.random() * canvas2.height;
        let x = Math.random() * canvas2.width;

        particlesArray.push(new Particle(x, y));

    }
    console.log(particlesArray);
}
init();

function randomRGB() {
    return Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ', 1'; 

}

function animate() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1 )';
    ctx.fillRect(0, 0, canvas2.width, canvas2.height);
    for (let i = 0; i < particlesArray.length; i++) {

        particlesArray[i].update();
        particlesArray[i].draw();
    }
    //ctx.fillRect(title.x, title.y, title.width, title.height);

    requestAnimationFrame(animate);

}
animate();

window.addEventListener('resize', function () {
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    titleMeasurments = titleElement.getBoundingClientRect();
    title = {
        height: titleMeasurments.height,
        width: titleMeasurments.width,
        x: titleMeasurments.left - 30,
        y: titleMeasurments.top - 105
    };
    init();
});