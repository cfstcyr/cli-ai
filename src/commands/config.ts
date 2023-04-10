import chalk from 'chalk';
import { config } from '../utils/config';
import { autoBox } from '../utils/box';
import { KeyofConfig } from '../../../ts-saved-config';

export const set = (key: KeyofConfig<typeof config>, value: string) => {
    config.set(key, value);
    autoBox(chalk.green(`Set value for ${key}`));
};

export const get = (key: KeyofConfig<typeof config>) => {
    const value = config.get(key);
    autoBox(chalk.italic(key) + '\n' + (value ? chalk.bold.green(value) : chalk.bold('undefined')));
};

export const del = (key: KeyofConfig<typeof config>) => {
    config.remove(key);
    autoBox(chalk.green(`Deleted value for ${key}`));
};
