import chalk from 'chalk';
import { autoBox } from './box';
import { config } from './config';
import { Configuration, OpenAIApi } from 'openai';

export const getOpenai = () => {
    const apiKey = config.get('api-key');

    if (!apiKey) {
        autoBox(chalk.red('You must set the API key.'));
        return;
    }

    const configuration = new Configuration({ apiKey });

    return new OpenAIApi(configuration);
};
