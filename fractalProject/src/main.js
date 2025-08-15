import './style.css'
import * as THREE from 'three'
import standardNodeLibrary from "three/src/renderers/webgpu/nodes/StandardNodeLibrary.js";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    - 1, // left
    1, // right
    1, // top
    - 1, // bottom
    - 1, // near,
    1, // far
);

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render(scene, camera);

let mouseDown = false;
let mouseStart = new THREE.Vector2();
let mouseEnd = new THREE.Vector2();
let mouseTotalDelta = new THREE.Vector2();

const standard=
    'void main() {\n' +
    '    gl_Position = vec4(position, 1.0);\n' +
    '}\n'

const mandelbrot =
    'uniform vec3 iResolution;\n' +
    'uniform vec2 mouseDelta;\n' +
    'uniform float zoomMultiplier;\n' +
    'vec2 squareComplex(vec2 z)\n' +
    '{\n' +
    '    vec2 zSquared;\n' +
    '    zSquared.x = (z.x * z.x) - (z.y * z.y);\n' +
    '    zSquared.y = 2.0 * z.x * z.y;\n' +
    '    if(zSquared.y > 0.0)\n' +
    '    {\n' +
    '        zSquared.y = zSquared.y * -1.0;\n' +
    '    }\n' +
    '    return zSquared;\n' +
    '}\n' +
    'vec2 addComplex(vec2 z, vec2 c)\n' +
    '{\n' +
    '    vec2 zAdded;\n' +
    '    zAdded.x = z.x + c.x;\n' +
    '    zAdded.y = z.y + c.y;\n' +
    '    return zAdded;\n' +
    '}\n' +
    'float magnitude(vec2 z)\n' +
    '{\n' +
    '    return sqrt((z.x * z.x) + (z.y * z.y));\n' +
    '}\n' +
    '\n' +
    'void main()\n' +
    '{\n' +
    '    vec2 uv = gl_FragCoord.xy /iResolution.xy;\n' +
    '    vec2 c = 4.0 * uv - 2.0;\n' +
    '    c = c / zoomMultiplier;\n' +
    '    c = c - mouseDelta;\n' +
    '\n' +
    '    vec4 color = vec4(52.0/255.0, 204.0/235.0, 235.0/255.0, 1.0);\n' +
    '\n' +
    '    vec2 z = vec2(0.0, 0.0);\n' +
    '\n' +
    '    for(int i = 0; i< 200; i++)\n' +
    '    {\n' +
    '        z = addComplex( squareComplex(z), c);\n' +
    '        if(magnitude(z) > 2.0)\n' +
    '        {\n' +
    '            color = vec4(float(i)/200.0, float(i)/200.0, 0.0, 1.0);\n' +
    '            break;\n' +
    '        }\n' +
    '    }\n' +
    '    gl_FragColor = color;\n' +
    '}\n' +
    '\n' +
    '\n'

console.log(mandelbrot);

const planeGeometry = new THREE.PlaneGeometry(2, 2);
const customMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iResolution: {value: new THREE.Vector3()},
        mouseDelta: {value: new THREE.Vector2()},
        zoomMultiplier: {value: 1.0}
    },
    fragmentShader: mandelbrot,
    vertexShader: standard,
});
const plane = new THREE.Mesh(planeGeometry, customMaterial);
plane.castShadow = false;
plane.receiveShadow = true;

scene.add(plane);

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('wheel', onWheel);

function animate() {
    requestAnimationFrame(animate);
    customMaterial.uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    renderer.render(scene, camera);
}

function onMouseMove()
{
    if(mouseDown)
    {
        customMaterial.uniforms.mouseDelta.value.x = mouseTotalDelta.x + (event.offsetX / window.innerWidth - mouseStart.x);
        customMaterial.uniforms.mouseDelta.value.y = mouseTotalDelta.y + (1.0 - (event.offsetY / window.innerHeight) - mouseStart.y);

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
    mouseTotalDelta.x = mouseTotalDelta.x - (mouseStart.x - mouseEnd.x);
    mouseTotalDelta.y = mouseTotalDelta.y - (mouseStart.y - mouseEnd.y);
}

function onWheel()
{

    customMaterial.uniforms.zoomMultiplier.value = customMaterial.uniforms.zoomMultiplier.value - (event.deltaY * 0.125 * Math.pow(10, (Math.floor(Math.log10(customMaterial.uniforms.zoomMultiplier.value)))-1));

    console.log(Math.floor(Math.log10(customMaterial.uniforms.zoomMultiplier.value)));
    console.log(customMaterial.uniforms.zoomMultiplier.value)
}

animate();