const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const popup = document.getElementById('popup');
const attackButton = document.getElementById('attack');
const gachaBox = document.getElementById('gachaBox');

const PoolButton = document.getElementById('pool'); // Pool Button Indicated by "?"
const Pooldetail = document.getElementById('poolDetail'); // Pool Details that shows when clicking the pool button
const Display = document.getElementById('display'); // Gacha Display Box
const Roll = document.getElementById('roll'); // Roll Button


canvas.width = 1024;
canvas.height = 576;

enemyCount = 9;
enemyKilled = 0;
currentEnemy = 0;

Atoms = 0;

Mole = 0;

const pool = ['h2o', 'cold h2o', 'long alchohol', 'salt', 'ethanol', 'Blocker'];



class Player {
    constructor(x, y, width, height, stats){
        this.position = {
            x: x,
            y: y,
        };

        this.width =  width;
        this.height = height;
        this.stats = stats;
        
    }

    draw(color){
        c.fillStyle = color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.fillStyle = 'black';
        c.font = '20px Arial';
        c.textAlign = 'center';
        c.fillText( 
            `${this.stats.health} | ${this.stats.attack}`,
            this.position.x + this.width / 2,
            this.position.y - 10
        );
        c.fillStyle = 'black';
        c.font = '20px Arial';
        c.textAlign = 'center';
        c.fillText(`${currentEnemy = enemyCount} Enemies Left`, canvas.width / 2, 50);

        c.fillStyle = 'black';
        c.font = '20px Arial';
        c.textAlign = 'right';
        c.fillText(`Atoms: ${Atoms}`, canvas.width - 30, 50);

    }

    isClicked(mouseX, mouseY){
        return (
            mouseX >= this.position.x &&
            mouseX <= this.position.x + this.width &&
            mouseY >= this.position.y &&
            mouseY <= this.position.y + this.height
        );
    }
}

class Stats{
    constructor(health, attack){
        this.health = health;
        this.attack = attack;
    }

    display(){
        return `
            <p><strong>Health:</strong> ${this.health}</p>
            <p><strong>Attack:</strong> ${this.attack}</p>
        `;
    }
}

// -------------PLAYER-----------------------
// Creating stats for the player
const playerStats = new Stats(10, 1);

// Creating a new player instance
const player = new Player(100, 100, 100, 100, playerStats);

// -------------Enemies-----------------------
// Creating stats for the enemy
const enemyStats = new Stats(1,1);

// Creating a new enemy instance
const enemy = new Player(canvas.width - 100, canvas.height - 100, 50, 50, enemyStats);

//------------------------------------------------
c.fillStyle = 'white'

c.fillRect(0, 0, canvas.width, canvas.height)
//------------------------------------------------




// Functions------------------------------------
function drawScene(){
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw('blue');
    enemy.draw('grey');
}

function updateEnemy(){
    enemy.draw('grey');
}

function gacha() {
    const output = pool[Math.floor(Math.random() * pool.length)];
    console.log(output);
}

function GachaPull(){
    const gachacost = 1;
    if (Moles >= gachacost){
        gacha();
        Moles -= 1;
    }
    else{
        alert('Not enough Moles!');
    }
}



drawScene();
//-------------------------------------------------------






// Event Listeners-------------------------------
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(player.isClicked(x, y)){
        popup.innerHTML = `<h3>Player Stats</h3>${player.stats.display()}`;
        popup.style.display = 'block';
    }
    else if(enemy.isClicked(x, y)){
        popup.innerHTML = `<h3>Enemy Stats</h3>${enemy.stats.display()}`;
        popup.style.display = 'block'; 
    }
    else{
        popup.style.display = 'none';
    }    

});


PoolButton.addEventListener('click', (event) => {
    event.stopPropagation();
    Pooldetail.style.display = Pooldetail.style.display === "none" ? "block" : "none";
});

document.addEventListener('click', (event) => {
    if (event.target.id != 'pool' && !PoolButton.contains(event.target) && !Pooldetail.contains(event.target)) {
        Pooldetail.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    if (event.target.id == 'Roll'){
        GachaPull();
    }
});

attackButton.addEventListener('click', () => {

    
    enemy.stats.health -= player.stats.attack;
    player.stats.health -= enemy.stats.attack;

    

    if(player.stats.health <= 0) {
        player.stats.health = 0;
        alert('You have been defeated! Game Over.');
    }

    if(enemy.stats.health <= 0) {
        enemy.stats.health = 1;
        enemyCount -= 1;
        enemyKilled += 1;
        Atoms = enemyKilled;

    }
    console.log(`${enemyCount} Enemies Left`);
    if(enemyCount == 0){
        enemyCount = 0;
        enemy.stats.health = 0;
        alert('All enemies defeated! You win!');
        gachaBox.style.display = 'block';
    }
    
    

    
    drawScene();
    updateEnemy();
});




