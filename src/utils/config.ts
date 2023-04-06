import Configstore from 'configstore';

export const config = new Configstore('cfstcyr-cli-ai', {
    system: 'macos',
    'chat-history': 3,
});
