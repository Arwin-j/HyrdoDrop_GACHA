const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const popup = document.getElementById('popup');
const attackButton = document.getElementById('attack');
const gachaBox = document.getElementById('gachaBox');

const PoolButton = document.getElementById('pool'); // Pool Button Indicated by "?"
const Pooldetail = document.getElementById('poolDetail'); // Pool Details that shows when clicking the pool button
const Display = document.getElementById('display'); // Gacha Display Box
const Roll = document.getElementById('roll'); // Roll Button
const Converter = document.getElementById('convert');// Converter
const Converter_Display = document.getElementById('display_C'); // Converter Display
const ConvertBtn = document.getElementById('confirmConvert');//Convert Button


//Number counter
let count = 0 / 3;
const counterDisplay = document.getElementById('counter');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');

//Sprite Drop
const sprite = new Image();
sprite.src = 'res/Drop.png';

const frameWidth = 96;
const frameHeight = 96;
const numFrames = 7;
let currentFrame = 0;


canvas.width = 1024;
canvas.height = 576;

enemyCount = 9;
registeredEnemy = 9;
enemyKilled = 0;
currentEnemy = 0;

Atoms = 0;

Mole = count;

const pool = ['H2O', 'COLD H2O', 'LONG ALCOHOL', 'SALT', 'ETHANOL', 'BLOCKER'];
let output = ""


class Player {
    constructor(x, y, width, height, stats, sprite = null, frameWidth = 0, frameHeight = 0, numFrames = 1){
        this.position = {
            x: x,
            y: y,
        };

        this.width =  width;
        this.height = height;
        this.stats = stats;


        this.sprite = sprite;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.numFrames = numFrames;
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        this.frameDuration = 100;
        
    }

    update(time){
        if(!this.sprite) return;

        if(time - this.lastFrameTime > this.frameDuration){
            this.currentFrame = (this.currentFrame + 1) % this.numFrames;
            this.lastFrameTime = time;
        }

    }

    draw(color){

        if (this.sprite && this.sprite.complete){
            const columns = 3;  
            const sx = (this.currentFrame % columns) * this.frameWidth;
            const sy = Math.floor(this.currentFrame / columns) * this.frameHeight;

            c.drawImage(
                this.sprite,
                sx, sy, this.frameWidth, this.frameHeight,
                this.position.x, this.position.y, this.width, this.height
            );
        } else {
            c.fillStyle = color;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        

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
        c.textAlign = 'left';
        c.fillText(`Moles: ${Mole}`, canvas.width - 300, 50);

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
const player = new Player(100, 100, 100, 100, playerStats, sprite, frameWidth, frameHeight, numFrames);

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
    console.log("Gacha Initiated");
    output = pool[Math.floor(Math.random() * pool.length)];
    console.log(output);
}

function GachaPull(){
    const gachacost = 1;
    if (Mole >= gachacost){
        gacha();
        Mole -= 1;
    }
    else{
        alert('Not enough Mole!');
    }
}
function displayResult(){
    Display.innerText = output
}

function animate(time){
    c.fillStyle = 'white';
    c.fillRect(0,0,canvas.width, canvas.height);

    player.update(time);
    player.draw('blue');
    enemy.draw('grey');

    requestAnimationFrame(animate);
}

sprite.onload = () => {
    requestAnimationFrame(animate);
}

function updateCounterDisplay(){
    counterDisplay.textContent = count;
}

function updateConvertButton() {
    ConvertBtn.disabled = count < 3;
}



updateCounterDisplay();

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
    if (event.target.id != 'Converter' && !Converter.contains(event.target) && !Converter.contains(event.target)){
        Converter_Display.style.display = 'none';
    }
});


Converter.addEventListener('click', (event) => {
    Converter_Display.style.display = 'block';
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

incrementBtn.addEventListener('click', () => {
    
    if(Atoms <= 0){
        console.log(`No of Atoms ${Atoms}`);
        alert("Atoms not enough!");
    }
    else{
        count++;
        Atoms -= 3;
        updateConvertButton();
    }
    updateCounterDisplay();
});

decrementBtn.addEventListener('click', () => {
    if(count > 0 && Atoms < registeredEnemy){

        count--;
        Atoms += 3;
    }
    updateConvertButton();
    updateCounterDisplay();
});

ConvertBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('Convert button clicked');
    Converter_Display.style.display = 'none';
    Mole = count;
});

Roll.addEventListener('click', () => {
    GachaPull();
    displayResult();
});
