var gridSize = 50
var gameSize = 750
var gameWindow = document.getElementById("game")
var getInput = document.getElementById("getInput")
var restartButt = document.getElementById("restart")
var input = ""
var direction = [0, 0]
var newDirection = [0, 0]
var pos = [0, 0]
var score = 0;
var scoreDiv = document.getElementById("score");
var canChangeInput = true
var validPlace = true

function restart(){
    location.reload()
}

function restartVisible(){
    restartButt.style.visibility = "visible";
    gameWindow.children[0].remove()
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createFruit(){
    while (true){
        pos = [getRandomArbitrary(2, gameSize/gridSize-1)*gridSize, getRandomArbitrary(2, gameSize/gridSize-1)*gridSize]
        validPlace = true
        for (var child = 0; child < gameWindow.childElementCount; child++){
            if (gameWindow.children[child].style.top == (pos[0] + "px") && gameWindow.children[child].style.left == (pos[1] + "px")){
                validPlace = false
                break;
            }
        }
        if (validPlace)
            break;
    }

    createElement(pos, "fruit")
}

function createElement(pos, type){
    var elem = document.createElement("div")

    if (type == "snake")
        elem.classList.add("element")

    if (type == "fruit")
        elem.classList.add("fruit")

    elem.style.top = pos[0] + "px"
    elem.style.left = pos[1] + "px"
    gameWindow.appendChild(elem)

}

function moveElements([x, y]){
    if (gameWindow.childElementCount > 1){
        for (var child = gameWindow.childElementCount-2; child > 0; child--){
            gameWindow.children[child].style.top = gameWindow.children[child-1].style.top
            gameWindow.children[child].style.left = gameWindow.children[child-1].style.left
        }
    }
    gameWindow.children[0].style.top = parseInt(gameWindow.children[0].style.top.split("px")[0]) + (gridSize * y) + "px"
    gameWindow.children[0].style.left = parseInt(gameWindow.children[0].style.left.split("px")[0]) + (gridSize * x) + "px"
    gameWindow.children[0].style.top.split('px')[0]
}

async function tick(){
    while (true){
        if (input != "")
            moveElements(direction)

        switch (input){
            case 'w':
                direction = [0, -1]
                break
            case 'a':
                direction = [-1, 0]
                break
            case 's':
                direction = [0, 1]
                break
            case 'd':
                direction = [1, 0]
                break
        }
        
        if (gameWindow.children[0].style.top == (gameSize + "px") || gameWindow.children[0].style.top == "-50px" || gameWindow.children[0].style.left == "-50px" || gameWindow.children[0].style.left == (gameSize + "px")){
            restartVisible()
            return 0
        }
        
        for (var child = 1; child < gameWindow.childElementCount-1; child++){
            if (gameWindow.children[0].style.top == gameWindow.children[child].style.top && gameWindow.children[0].style.left == gameWindow.children[child].style.left){
                restartVisible()
                return 0
            }
        }

        if (gameWindow.children[0].style.top == gameWindow.children[gameWindow.childElementCount-1].style.top && gameWindow.children[0].style.left == gameWindow.children[gameWindow.childElementCount-1].style.left){
            gameWindow.removeChild(gameWindow.lastElementChild)
            createElement([gameWindow.children[0].style.top.split("px")[0], gameWindow.children[0].style.left.split("px")[0]], "snake")
            createFruit()
            score++;
            scoreDiv.innerHTML = score;
        }

        getInput.focus()
        await sleep(150)
        canChangeInput = true
    }
}

function changeInput(after = false){

    switch (getInput.value){
        case 'w':
            newDirection = [0, -1]
            break
        case 'a':
            newDirection = [-1, 0]
            break
        case 's':
            newDirection = [0, 1]
            break
        case 'd':
            newDirection = [1, 0]
            break

    }

    if (newDirection[0] != 0 && direction[0] + newDirection[0] != 0 || newDirection[1] != 0 &&  direction[1] + newDirection[1] != 0 || newDirection == [0, 0] || gameWindow.childElementCount == 2){
        input = getInput.value
        if (canChangeInput)
            direction = newDirection
        canChangeInput = false
    }

    getInput.value = ""
}

getInput.addEventListener("input", changeInput)
createElement([350, 350], "snake")
createFruit()
tick()