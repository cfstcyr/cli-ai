import chalk from 'chalk';
import { autoBox } from './box';
import { config } from './config';
import { Configuration, OpenAIApi } from 'openai';
import { CONFIG_KEYS } from '../constants/config';

export const getOpenai = () => {
    const apiKey = config.get(CONFIG_KEYS.apiKey);

    if (!apiKey) {
        autoBox(chalk.red('You must set the API key.'));
        return;
    }

    const configuration = new Configuration({ apiKey });

    return new OpenAIApi(configuration);
};
