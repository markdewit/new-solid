const canvastowerDefence = document.getElementById('canvas-container-TowerDefence');

const ctx = canvastowerDefence.getContext('2d');
canvastowerDefence.width = 900;
canvastowerDefence.height = 600;


//global variables
const cellSize = 100;
const cellgap = 3;
const winningScore = 50;
let chosenhero = 1;

const gameGrid = [];
const defenders = [];
let numberOfResouces = 300;
const enemies = [];
const enemiesPosition = [];
let enemiesInterval = 600;
let frame = 0;
let gameOver = false;
let score = 0;
const projectiles = []; 
const resources = [];

//mouse
const mouse = {
    x: undefined,
    y: undefined,
    width: 0.1,
    height: 0.1
};

let canvasPosition = canvastowerDefence.getBoundingClientRect();
canvastowerDefence.addEventListener('mousemove', function (e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});

canvastowerDefence.addEventListener('mouseleave', function (e) {
    mouse.x = undefined;
    mouse.y = undefined;
});

//game board
const controlsbar = {
    width: canvastowerDefence.width,
    height: cellSize
};

class Cell{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);

        }
    }
}

function CreateGrid() {
    for (let y = cellSize; y < canvastowerDefence.height; y += cellSize) {
        for (let x = 0; x < canvastowerDefence.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}
CreateGrid();
function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();

    }
}

//projecttiles
class Projectile{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
    }
    update() {
        this.x += this.speed;
    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}
    function handleProjectiles() {
        for (var i = 0; i < projectiles.length; i++) {
            projectiles[i].draw();
            projectiles[i].update();

            for (var j = 0; j < enemies.length; j++) {
                if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                    enemies[j].health -= projectiles[i].power;
                    projectiles.splice(j, 1);
                    i--;
                }
        }

            if (projectiles[i] && projectiles[i].x > canvastowerDefence.width - cellSize) {
                projectiles.splice(i, 1);
                i--;
            }
        }
}

//defenders
const heroTypes = [];
const hero1 = new Image();
hero1.src = '../images/hero1.png';
//heroTypes.push(hero1);
const hero2 = new Image();
hero2.src = '../images/hero2.png';
heroTypes.push(hero2);

class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellgap * 2;
        this.height = cellSize - cellgap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
        //this.heroTypes = heroTypes[Math.floor(Math.random() * heroTypes.length)];
        this.imgFrameX = 0;
        this.imgFrameY = 0;
        this.minFrame = 0;
        this.maxFrame = 16;
        this.spritWidth = 194;
        this.spritheight = 194;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = '30px Orbitron';
        ctx.fillStyle = 'gold';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        ctx.drawImage(hero1, this.imgFrameX * this.spritWidth, 0, this.spritWidth, this.spritheight, this.x, this.y, this.width, this.height);
    }
    update() {
        if (frame % 10 === 0) {
            if (this.imgFrameX < this.maxFrame) this.imgFrameX++;
            else this.imgFrameX = this.minFrame;
            if (this.imgFrameX === 15) this.shootNow = true;
        }

        if (this.shooting) {
            this.minFrame = 0;
            this.maxFrame = 16;
        } else {
            this.minFrame = 17;
            this.maxFrame = 23;
        }

        if (this.shooting && this.shootNow) {
            if (this.timer % 100 === 0) {
                projectiles.push(new Projectile(this.x + 50, this.y + 50));
                this.shootNow = false;
            }
        } 
           
    }
}
const card1 = {
    x: 10,
    y: 10,
    width: 70,
    height: 85
};

const card2 = {
    x: 90,
    y: 10,
    width: 70,
    height: 85
};


function chooseDefender() {
    let card1Stroke = "black";
    let card2Stroke = "black";

    if (collision(mouse, card1)) {
        chosenhero = 1;

    }

    if (collision(mouse, card2)) {
        chosenhero = 2;
        card1Stroke = "black";
        card2Stroke = "gold";
    }

    if (chosenhero === 1) {
        card1Stroke = "gold";
        card2Stroke = "black";
    }
    else if (chosenhero === 2) {
        card1Stroke = "black";
        card2Stroke = "gold";
    }
    else {
        card1Stroke = "black";
        card2Stroke = "black";
    }

    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1Stroke;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(hero1, 0, 0, 194, 194, 0, 5, 194 / 2, 194 / 2);
    ctx.strokeStyle = card2Stroke;
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
    ctx.drawImage(hero2, 0, 0, 194, 194, 80, 5, 194 / 2, 194 / 2);
}


function handleDefenders() {
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].draw();
        defenders[i].update();
        if (enemiesPosition.indexOf(defenders[i].y) !== -1) {
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }

        for (var j = 0; j < enemies.length; j++) {
            if (defenders[i] && collision(defenders[i], enemies[j])) {
                enemies[j].movement = 0;
                defenders[i].health -= 0.2;
            }
            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;

            }
        }
    }
}

// Floating Messages
const floatingmassages = [];
class Floatingmassage {
    constructor(stringValue = 'noting set', x = (canvastowerDefence.height / 2), y = (canvastowerDefence.width / 2), size = 30, color = 'red') {
        this.stringValue = stringValue;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.color = color;
        this.opacity = 1;
    }
    update() {
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity >= 0.1) this.opacity -= 0.03;
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Orbitron';
        ctx.fillText(this.stringValue, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}
function floatingmassagehandler() {
    for (var i = 0; i < floatingmassages.length; i++) {
        floatingmassages[i].update();
        floatingmassages[i].draw();
        if (floatingmassages[i] && floatingmassages[i].lifeSpan >= 50) {
            floatingmassages.splice(i, 1);
            i--;
        }
    }

}
//enemies
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = '../images/enemy1.png';
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = '../images/enemy2.png';
enemyTypes.push(enemy2);

class Enemy {
    constructor(verticalPosition) {
        this.x = canvastowerDefence.width;
        this.y = verticalPosition;
        this.width = cellSize - cellgap * 2;
        this.height = cellSize - cellgap * 2;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.enemyTypes = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.imgFrameX = 0;
        this.imgFrameY = 0;
        this.minFrame = 0;
        this.maxFrame = 4;
        this.spritWidth = 256;
        this.spritheight = 256;
    }
    update() {
        this.x -= this.movement;
        if (frame % 10 === 0) {
            if (this.imgFrameX < this.maxFrame) this.imgFrameX++;
            else this.imgFrameX = this.minFrame;
        }

    }
    draw() {
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        ctx.drawImage(this.enemyTypes, this.imgFrameX * this.spritWidth, 0, this.spritWidth, this.spritheight, this.x, this.y, this.width, this.height)
    }
}

function handelEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true; 
        }
        if (enemies[i].health <= 0) {
            let gainedResources = enemies[i].maxHealth / 10;
            floatingmassages.push(new Floatingmassage('+' + enemies[i].maxHealth / 10, enemies[i].x, enemies[i].y, 35, 'gold'));
            floatingmassages.push(new Floatingmassage('+' + enemies[i].maxHealth / 10, 250, 50, 35, 'gold'));
            numberOfResouces += gainedResources;
            score += gainedResources;
            const findThisIndex = enemiesPosition.indexOf(enemies[i].y);
            enemiesPosition.splice(findThisIndex , 1);
            enemies.splice(i, 1);
            i--;
        }

    }
    if (frame % enemiesInterval === 0 && score < winningScore) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellgap; 
        enemies.push(new Enemy(verticalPosition));
        enemiesPosition.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -= 50;
    }
}
//resources
const amounts = [20, 30, 40];
class Resource {
    constructor() {
        this.x = Math.random() * (canvastowerDefence.width - cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    }
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Orbitron';
        ctx.fillText(this.amount, this.x + 15, this.y + 15);
    }
}

function handleRecources() {
    if (frame % 500 === 0 && score < winningScore) {
        resources.push(new Resource());
    }
    for (var i = 0; i < resources.length; i++) {
        resources[i].draw();
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
            numberOfResouces += resources[i].amount;
            floatingmassages.push(new Floatingmassage('+' + resources[i].amount, resources[i].x, resources[i].y, null, 'black'));
            floatingmassages.push(new Floatingmassage('+' + resources[i].amount, 250, 50, null, 'gold'));
            resources.splice(resources[i], 1);
            i--;
        }
    }
}


//utilities
function handleGameStatus() {
    ctx.fillStyle = 'gold';
    ctx.font = '30px Orbitron';
    ctx.fillText('Score: ' + score, 180, 40);
    ctx.fillText('Resources: ' + numberOfResouces, 180, 80);

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '90px Orbitron';
        ctx.fillText('Game over', 135, 330 );
    }
    if (score >= winningScore && enemies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.font = '60px Orbitron';
        ctx.fillText('Level complete', 130, 300);
        ctx.font = '30px Orbitron';
        ctx.fillText('you win with ' + score + ' points', 134, 340);
    }
}

canvastowerDefence.addEventListener('click', function () {
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellgap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellgap;
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < defenders.length; i++) {
        if (defenders[i].x === gridPositionX && defenders.y === gridPositionY) return;
    }
    let defenderCost = 100;
    if (numberOfResouces >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResouces -= defenderCost;
    } else {

        floatingmassages.push(new Floatingmassage('You need more Money', mouse.x,mouse.y,20,'blue'));
    }

});

function animate() {
    ctx.clearRect(0, 0, canvastowerDefence.width, canvastowerDefence.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, controlsbar.width, controlsbar.height);
    handleGameGrid();
    handleDefenders();
    handelEnemies();
    chooseDefender();
    handleRecources();
    floatingmassagehandler();
    handleProjectiles();
    handleGameStatus();

    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function collision(first, second) {

        if (!(first.x > second.x + second.width ||
            first.x + first.width < second.x ||
            first.y > second.y + second.height ||
            first.y + first.height < second.y
        )) {
            return true;
        }

}

window.addEventListener('resize', () => {
    canvasPoastion = canvastowerDefence.getBoundingClientRect();
});