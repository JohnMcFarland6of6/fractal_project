import './style.css'
import * as THREE from 'three'
import standardNodeLibrary from "three/src/renderers/webgpu/nodes/StandardNodeLibrary.js";
const DIMENSIONS = 250;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    - 1, // left
    1, // right
    1, // top
    - 1, // bottom
    - 1, // near,
    1, // far
);

const canvas = document.querySelector('#fractals');
const renderer = new THREE.WebGLRenderer({canvas});



renderer.setPixelRatio(window.devicePixelRatio);
canvas.width = DIMENSIONS;
canvas.height = DIMENSIONS;
renderer.setSize( canvas.width, canvas.height);
renderer.render(scene, camera);

let mouseDown = false;
let coordLock = false;
let mouseStart = new THREE.Vector2();
let mouseEnd = new THREE.Vector2();
let mouseTotalDelta = new THREE.Vector2();

const MandelbrotButton = document.getElementById("mandelbrotButton");
const JuliaButton = document.getElementById("juliaButton");
const BurningshipButton = document.getElementById("burningShipButton");
const mandelbrotShader = document.getElementById("mandelbrotShader").textContent;
const juliaShader = document.getElementById("juliaShader").textContent;
const burningShipShader = document.getElementById("burningShipShader").textContent;


const standard=
    'void main() {\n' +
    '    gl_Position = vec4(position, 1.0);\n' +
    '}\n'


let uniforms= {
    iResolution: {value: new THREE.Vector3()},
    mouseDelta: {value: new THREE.Vector2()},
    mousePos: {value: new THREE.Vector2()},
    zoomMultiplier: {value: 1.0}};

let planeGeometry = new THREE.PlaneGeometry(2, 2);
const mandelbrotMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: mandelbrotShader,
    vertexShader: standard,
});
const juliaMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: juliaShader,
    vertexShader: standard,
});
const burningShipMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: burningShipShader,
    vertexShader: standard,
});

let plane = new THREE.Mesh(planeGeometry, mandelbrotMaterial);
plane.castShadow = false;
plane.receiveShadow = true;

scene.add(plane);

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('wheel', onWheel);
window.addEventListener('keydown', function (event){
    if (event.code === 'Space')
    {
        if(plane.material == juliaMaterial)
        {
            if(coordLock)
            {
                coordLock = false;
            }
            else
            {
                coordLock = true;
            }
        }

    }
});
function animate() {
    requestAnimationFrame(animate);
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    renderer.render(scene, camera);
}

function onMouseMove()
{
    if(mouseDown)
    {
        uniforms.mouseDelta.value.x = mouseTotalDelta.x + 4.0*(event.offsetX / window.innerWidth - mouseStart.x)/uniforms.zoomMultiplier.value;
        uniforms.mouseDelta.value.y = mouseTotalDelta.y + 4.0*(1.0 - (event.offsetY / window.innerHeight) - mouseStart.y)/uniforms.zoomMultiplier.value;
    }
    else
    {
        if(!coordLock)
        {
            uniforms.mousePos.value.x = 4.0 * (event.offsetX / canvas.clientWidth) - 2.0;
            uniforms.mousePos.value.y = 4.0 * (1.0 - event.offsetY / canvas.clientHeight) - 2.0;
        }

        //console.log('x: ' + uniforms.mousePos.value.x);
        //console.log('y: ' + uniforms.mousePos.value.y);
    }
}

function onMouseDown()
{
    mouseDown = true;
    mouseStart.x = (event.offsetX / window.innerWidth);
    mouseStart.y = 1.0 - (event.offsetY / window.innerHeight);

}

function onMouseUp()
{
    mouseDown = false;
    mouseEnd.x = (event.offsetX / window.innerWidth);
    mouseEnd.y = 1.0 - (event.offsetY / window.innerHeight);
    mouseTotalDelta.x = mouseTotalDelta.x - 4.0*(mouseStart.x - mouseEnd.x)/uniforms.zoomMultiplier.value;
    mouseTotalDelta.y = mouseTotalDelta.y - 4.0*(mouseStart.y - mouseEnd.y)/uniforms.zoomMultiplier.value;
}

function onWheel()
{
    uniforms.zoomMultiplier.value = uniforms.zoomMultiplier.value -
        (event.deltaY * 0.125 * Math.pow(10, (Math.floor(Math.log10(uniforms.zoomMultiplier.value)))-1));
}

MandelbrotButton.addEventListener("click", function (){
    coordLock = false;
    plane.material = mandelbrotMaterial;
    uniforms.mouseDelta.value.set(0.0, 0.0);
    uniforms.zoomMultiplier.value = 1.0;
});

JuliaButton.addEventListener("click", function (){
    coordLock = false;
    plane.material = juliaMaterial;
    uniforms.mouseDelta.value.set(0.0, 0.0);
    uniforms.zoomMultiplier.value = 1.0;
});

BurningshipButton.addEventListener("click", function() {
    coordLock = false;
    plane.material = burningShipMaterial;
    uniforms.mouseDelta.value.set(0.0, 0.0);
    uniforms.zoomMultiplier.value = 1.0;
});


animate();