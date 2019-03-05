import React from 'react';
import { findIndex } from 'lodash';
import { getEntities } from './entitities';
import DebugData, { saveMetaData } from '../../../DebugData';

const BodyNode = {
    dynamic: true,
    name: (body) => {
        if (body && body.index !== undefined) {
            return DebugData.metadata.bodies[body.index] || `body_${body.index}`;
        }
        return 'unknown';
    },
    key: (body, idx) => `body_${idx}`,
    allowRenaming: () => true,
    rename: (body, newName) => {
        if (body && body.index !== undefined) {
            DebugData.metadata.bodies[body.index] = newName;
            saveMetaData({
                type: 'models',
                subType: 'bodies',
                subIndex: body.index,
                value: newName
            });
        }
    },
    numChildren: () => 0,
    child: () => null,
    childData: () => null,
    onClick: (data, setRoot, component) => {
        const {setBody} = component.props.rootStateHandler;
        setBody(data.index);
    },
    props: body => [
        {
            id: 'index',
            value: body.index,
            render: value => <span>[{value}]</span>
        }
    ],
    selected: (data, component) => {
        if (!component.props.rootState || !data)
            return false;
        const { body } = component.props.rootState;
        return body === data.index;
    },
    icon: () => 'editor/icons/body.png',
};

const BodiesNode = {
    dynamic: true,
    name: () => 'Bodies',
    numChildren: (ignored1, ignored2, component) => {
        const { entity } = component.props.rootState;
        const ent = getEntities()[entity];
        return ent ? ent.bodies.length : 0;
    },
    child: () => BodyNode,
    childData: (ignored, idx, component) => {
        const { entity } = component.props.rootState;
        const ent = getEntities()[entity];
        return ent && ent.bodies[idx];
    },
    up: (data, collapsed, component) => {
        const {entity, body} = component.props.rootState;
        const {setBody} = component.props.rootStateHandler;
        const ent = getEntities()[entity];
        if (ent) {
            const idx = findIndex(ent.bodies, b => b.index === body);
            if (idx !== -1) {
                const newIndex = Math.max(idx - 1, 0);
                setBody(ent.bodies[newIndex].index);
            }
        }
    },
    down: (data, collapsed, component) => {
        const {entity, body} = component.props.rootState;
        const {setBody} = component.props.rootStateHandler;
        const ent = getEntities()[entity];
        if (ent) {
            const idx = findIndex(ent.bodies, b => b.index === body);
            if (idx !== -1) {
                const newIndex = Math.min(idx + 1, ent.bodies.length - 1);
                setBody(ent.bodies[newIndex].index);
            }
        }
    }
};

export default BodiesNode;
