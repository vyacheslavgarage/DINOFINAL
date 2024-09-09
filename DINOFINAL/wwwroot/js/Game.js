const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Параметры динозавра
let dino = {
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    color: 'green',
    isJumping: false,
    velocityY: 0,
    jumpPower: -15,
    gravity: 0.8
};

// Параметры препятствия
let obstacle = {
    x: canvas.width,
    y: 200,
    width: 32,
    height: 32,
    color: 'red',
    speed: 3.5
};

// Параметры игры
let score = 0;
let gameOver = false;

// Обработчик прыжка
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !dino.isJumping && !gameOver) {
        dino.isJumping = true;
        dino.velocityY = dino.jumpPower; // Начало прыжка
    }
});

// Обработчик кнопки перезапуска
restartButton.addEventListener('click', function () {
    resetGame();
});

// Функция отрисовки динозавра
function drawDino() {
    context.fillStyle = dino.color;
    context.fillRect(dino.x, dino.y, dino.width, dino.height);
}

// Функция отрисовки препятствия
function drawObstacle() {
    context.fillStyle = obstacle.color;
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

// Функция обновления положения объектов
function update() {
    if (gameOver) return;

    // Обновление позиции динозавра
    if (dino.isJumping) {
        dino.y += dino.velocityY;
        dino.velocityY += dino.gravity; // Применение гравитации

        if (dino.y >= 200) { // Проверка приземления
            dino.y = 200;
            dino.isJumping = false;
        }
    }

    // Обновление позиции препятствия
    obstacle.x -= obstacle.speed;

    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width; // Генерация нового препятствия
        score += 1; // Увеличение счёта
    }

    // Проверка столкновения
    if (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.height + dino.y > obstacle.y
    ) {
        gameOver = true;
        restartButton.style.display = 'block'; // Показать кнопку перезапуска
        if (score > 0) {
            saveScore(score);
        } 
        alert("Игра окончена! Ваш счёт: " + score);
    }
}

// Функция для отправки результата на сервер
function saveScore(score) {
    fetch('/Game/SaveResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: score })
    })
        .then(response => {
            if (response.ok) {
                console.log('Результат сохранён');
            } else {
                console.error('Ошибка сохранения результата');
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке запроса:', error);
        });
}

// Функция отрисовки игры
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Очистка экрана

    drawDino(); // Отрисовка динозавра
    drawObstacle(); // Отрисовка препятствия

    // Отображение счёта
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText("Score: " + score, 10, 20);
}

// Функция перезапуска игры
function resetGame() {
    dino = {
        x: 50,
        y: 200,
        width: 32,
        height: 32,
        color: 'green',
        isJumping: false,
        velocityY: 0,
        jumpPower: -15,
        gravity: 0.8
    };

    obstacle = {
        x: canvas.width,
        y: 200,
        width: 32,
        height: 32,
        color: 'red',
        speed: 3.5
    };

    score = 0;
    gameOver = false;
    restartButton.style.display = 'none'; // Скрыть кнопку перезапуска
    gameLoop(); // Перезапуск игрового цикла
}

// Основной игровой цикл
function gameLoop() {
    if (!gameOver) {
        update(); // Обновление логики игры
        draw();   // Отрисовка на холсте
        requestAnimationFrame(gameLoop); // Запуск следующего кадра
    }
}

// Запуск игрового цикла
gameLoop();
