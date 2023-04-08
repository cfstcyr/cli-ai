import { Configuration, num, str } from '@cfstcyr/ts-saved-config';

export const config = Configuration('file', 'cfstcyr-cli-ai', {
    'api-key': str(),
    system: str({
        default: 'linux',
    }),
    'chat-history': num({
        default: 4,
    }),
    'max-token': num({
        default: 100,
    }),
});
