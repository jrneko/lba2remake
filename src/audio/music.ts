import { createSource } from './audioSource';
import { loadResource } from '../resources';

const musicDecodedAudioCache = [];

const createMusicSource = (context: any) => {
    const source = createSource(context);
    const loadPlay = (index: number) => {
        if (!source.volume) {
            return;
        }
        const resId = `MUSIC_SCENE_${index}`;
        if (musicDecodedAudioCache[index]) {
            source.load(musicDecodedAudioCache[index]);
            source.play();
            return;
        }
        loadResource(resId).then((resource) => {
            if (!resource) {
                return;
            }
            const entryBuffer = resource.getBuffer();
            source.decode(entryBuffer.slice(0), (buffer: any) => {
                musicDecodedAudioCache[index] = buffer;
                source.load(buffer);
                source.play();
            });
        });
    };
    return {
        play: (index: number) => {
            loadPlay(index);
        },
        setVolume: (vol: number) => {
            source.setVolume(vol);
        },
        pause: () => {
            source.suspend();
        },
        resume: () => {
            source.resume();
        }
    };
};

export { createMusicSource };
