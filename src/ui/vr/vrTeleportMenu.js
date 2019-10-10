import * as THREE from 'three';
import {each} from 'lodash';
import IslandAmbience from '../editor/areas/island/browser/ambience';
import LocationsNode from '../editor/areas/gameplay/locator/LocationsNode';
import { loadIslandScenery } from '../../island';
import { createScreen } from './vrScreen';
import { handlePicking, performRaycasting } from './vrHands';
import { drawFrame } from './vrUtils';

let islandWrapper = null;
let activeIsland = null;
let loading = false;
let selectedPlanet = 0;
let sectionsPlanes = null;
let light = null;
const planetButtons = [];
const intersectObjects = [];
const arrows = [
    createArrow(),
    createArrow()
];
const invWorldMat = new THREE.Matrix4();

const planets = LocationsNode.children;

const planetDefaultIsland = [
    'CITABAU',
    'EMERAUDE',
    'OTRINGAL',
    'PLATFORM'
];

export function createTeleportMenu(sceneLight) {
    const teleportMenu = new THREE.Object3D();

    for (let i = 0; i < 4; i += 1) {
        const p = createPlanetItem({
            idx: i,
            text: planets[i].name,
            icon: planets[i].icon,
            x: -(i - 1.5) * 240,
            y: 50,
            // eslint-disable-next-line no-loop-func
            callback: () => {
                selectedPlanet = i;
                each(planetButtons, pb => pb.draw());
                loadIsland(planetDefaultIsland[i]);
            }
        });
        teleportMenu.add(p.mesh);
        planetButtons.push(p);
        intersectObjects.push(p.mesh);
    }

    const backButton = createButton({
        text: 'Back to main menu',
        y: 230,
        callback: ({game}) => {
            game.setUiState({ teleportMenu: false });
        }
    });
    teleportMenu.add(backButton);
    intersectObjects.push(backButton);

    islandWrapper = new THREE.Object3D();
    islandWrapper.scale.set(0.02, 0.02, 0.02);
    islandWrapper.quaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0));
    islandWrapper.position.set(0, -1.4, 1.4);
    islandWrapper.updateMatrixWorld();
    invWorldMat.getInverse(islandWrapper.matrixWorld);

    teleportMenu.add(islandWrapper);

    for (let i = 0; i < 2; i += 1) {
        arrows[i].visible = false;
        teleportMenu.add(arrows[i]);
    }

    light = sceneLight;

    return teleportMenu;
}

async function loadIsland(name) {
    loading = true;
    const ambience = IslandAmbience[name];
    const island = await loadIslandScenery({skipSky: true, sectionPlanes: true}, name, ambience);
    island.name = name;
    if (activeIsland) {
        islandWrapper.remove(activeIsland.threeObject);
    }
    activeIsland = island;
    islandWrapper.add(island.threeObject);
    sectionsPlanes = island.threeObject.getObjectByName('sectionsPlanes');
    light.position.applyAxisAngle(
        new THREE.Vector3(0, 0, 1),
        -(ambience.lightingAlpha * 2 * Math.PI) / 0x1000
    );
    light.position.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (-(ambience.lightingBeta * 2 * Math.PI) / 0x1000) + Math.PI
    );
    loading = false;
}

const clock = new THREE.Clock(false);
clock.start();

export function updateTeleportMenu(game) {
    const time = {
        delta: Math.min(clock.getDelta(), 0.05),
        elapsed: clock.getElapsedTime()
    };
    if (activeIsland === null && !loading) {
        loadIsland('CITABAU');
    }
    if (activeIsland) {
        activeIsland.update(null, null, time);
        arrows[0].visible = false;
        arrows[1].visible = false;
        performRaycasting(sectionsPlanes.children, {game}, handleGroundIntersection);
    }
    handlePicking(intersectObjects, {game});
}

const POS = new THREE.Vector3();

function handleGroundIntersection(idx, intersect, triggered /* , ctx */) {
    const arrow = arrows[idx];
    arrow.visible = true;
    arrow.position.copy(intersect.point);
    POS.copy(intersect.point);
    POS.applyMatrix4(invWorldMat);
    const groundInfo = activeIsland.physics.getGroundInfo(POS);
    arrow.position.y += groundInfo.height * 0.02;
    if (triggered) {
        // do something
    }
}

function createPlanetItem({x, y, text, icon: iconSrc, idx, callback}) {
    const width = 200;
    const height = 220;
    const {ctx, mesh} = createScreen({
        width,
        height,
        x,
        y,
    });

    const icon = new Image(160, 160);
    icon.src = iconSrc;

    function draw() {
        const selected = idx === selectedPlanet;
        drawFrame(ctx, 0, 0, width, height, selected);
        ctx.font = '20px LBA';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = selected ? 'white' : 'grey';
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(text, width / 2, 200);
        ctx.drawImage(icon, 20, 20, 160, 160);
        mesh.material.map.needsUpdate = true;
    }

    icon.onload = () => draw();

    mesh.visible = true;
    mesh.userData = { callback };

    return {mesh, draw};
}

function createButton({x, y, text, callback}) {
    const width = 400;
    const height = 75;
    const {ctx, mesh} = createScreen({
        width,
        height,
        x,
        y,
    });
    drawFrame(ctx, 0, 0, width, height, true);
    ctx.font = '30px LBA';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    mesh.material.map.needsUpdate = true;
    mesh.visible = true;
    mesh.userData = { callback };

    return mesh;
}

function createArrow() {
    const arrow = new THREE.Object3D();
    const material = new THREE.MeshPhongMaterial({color: 0xFF0000});

    const cnGeometry = new THREE.ConeGeometry(5, 20, 32);
    const cone = new THREE.Mesh(cnGeometry, material);
    cone.quaternion.setFromEuler(new THREE.Euler(Math.PI, 0, 0));
    cone.position.set(0, 10, 0);
    arrow.add(cone);

    const clGeometry = new THREE.CylinderGeometry(1, 1, 20, 32);
    const cylinder = new THREE.Mesh(clGeometry, material);
    cylinder.position.set(0, 30, 0);
    arrow.add(cylinder);

    arrow.scale.set(0.01, 0.01, 0.01);

    return arrow;
}
