import Configstore from 'configstore';
import { CONFIG_KEYS } from '../constants/config';

export const config = new Configstore('cfstcyr-cli-ai', {
    [CONFIG_KEYS.system]: 'macos',
    [CONFIG_KEYS.chatHistory]: 3,
    [CONFIG_KEYS.maxToken]: 100,
});
