import chalk from 'chalk';
import { config } from '../utils/config';
import { autoBox } from '../utils/box';

export const set = (key: string, value: string) => {
    config.set(key, value);
    autoBox(chalk.green(`Set value for ${key}`));
};

export const get = (key: string) => {
    const value = config.get(key);
    autoBox(chalk.italic(key) + '\n' + (value ? chalk.bold.green(value) : chalk.bold('undefined')));
};

export const del = (key: string) => {
    config.delete(key);
    autoBox(chalk.green(`Deleted value for ${key}`));
};
