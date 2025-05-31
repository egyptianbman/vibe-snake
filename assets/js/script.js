import * as BABYLON from 'babylonjs';

const canvas = document.getElementById('gameCanvas');
const engine = new BABYLON.Engine(canvas, true);

const scale = 1; // Size of each grid cell
let direction = { x: 1, y: 0, z: 0 }; // Snake starts moving along x-axis

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Ground (visual grid)
    const groundSize = 10;
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
    const gridMaterial = new BABYLON.GridMaterial("grid", scene);
    gridMaterial.gridRatio = scale;
    gridMaterial.majorUnitFrequency = 5;
    gridMaterial.backFaceCulling = false;
    ground.material = gridMaterial;

    // Snake (initial segment)
    const snake = [];
    const snakeMaterial = new BABYLON.StandardMaterial("snakeMaterial", scene);
    snakeMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);

    const snakeHead = BABYLON.MeshBuilder.CreateBox("snakeHead", { size: scale }, scene);
    snakeHead.position = new BABYLON.Vector3(0, scale / 2, 0);
    snakeHead.material = snakeMaterial;
    snake.push(snakeHead);

    // Food
    const food = BABYLON.MeshBuilder.CreateSphere("food", { diameter: scale }, scene);
    food.material = new BABYLON.StandardMaterial("foodMaterial", scene);
    food.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    const randomFoodPosition = () => {
        food.position = new BABYLON.Vector3(
            Math.floor(Math.random() * groundSize - groundSize / 2) * scale,
            scale / 2,
            Math.floor(Math.random() * groundSize - groundSize / 2) * scale
        );
    };
    randomFoodPosition();

    // Game logic
    const advance = () => {
        // Snake movement logic
        const newHead = snake[0].clone("segment");
        newHead.position.addInPlace(new BABYLON.Vector3(direction.x * scale, 0, direction.z * scale));
        snake.unshift(newHead);

        // Check if the snake eats the food
        if (BABYLON.Vector3.Distance(newHead.position, food.position) < scale) {
            randomFoodPosition(); // Move the food
        } else {
            const tail = snake.pop();
            tail.dispose(); // Remove tail to keep the snake size constant
        }
    };

    scene.onBeforeRenderObservable.add(() => {
        if (engine.getDeltaTime() > 100) { // Adjust the game speed
            advance();
        }
    });

    // Input handling
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                if (direction.z === 0) direction = { x: 0, y: 0, z: -1 };
                break;
            case "ArrowDown":
                if (direction.z === 0) direction = { x: 0, y: 0, z: 1 };
                break;
            case "ArrowLeft":
                if (direction.x === 0) direction = { x: -1, y: 0, z: 0 };
                break;
            case "ArrowRight":
                if (direction.x === 0) direction = { x: 1, y: 0, z: 0 };
                break;
        }
    });

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});