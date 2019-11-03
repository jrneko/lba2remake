import { switchStats } from '../../renderer/stats';
import { getButtonState } from './buttonState';

const BUTTONS = {
    TOUCHPAD: 0,
    TRIGGER: 1
};

export default class OculusGo {
    supports(id) {
        return id === 'Gear VR Controller'
            || id === 'Oculus Go Controller';
    }

    handleGamepad(gamepad, idx, {sceneManager, game}) {
        const {controlsState} = game;
        const {TOUCHPAD, TRIGGER} = BUTTONS;
        const scene = sceneManager.getScene();
        const camera = scene && scene.camera;
        const hero = game.getState().hero;
        controlsState.action = 0;
        controlsState.relativeToCam = true;
        controlsState.controllerType = 'oculusgo';

        const touchpad = getButtonState(gamepad, TOUCHPAD);
        const trigger = getButtonState(gamepad, TRIGGER);
        if (touchpad.tapped || trigger.tapped) {
            if (controlsState.skipListener) {
                controlsState.skipListener();
                return;
            }
        }

        if (touchpad.touched) {
            controlsState.controlVector.set(gamepad.axes[0], -gamepad.axes[1]);
        } else {
            controlsState.controlVector.set(0, 0);
        }
        if (touchpad.pressed) {
            controlsState.controlVector.set(0, 0);
        }
        if (trigger.tapped && camera && scene) {
            camera.center(scene);
        }
        if (trigger.longPressed) {
            switchStats();
        }
        if (touchpad.longPressed) {
            hero.behaviour = (hero.behaviour + 1) % 4;
        }
        controlsState.action = touchpad.tapped ? 1 : 0;
        controlsState.ctrlTriggers[0] = trigger.tapped;
    }

    update() {}
}
