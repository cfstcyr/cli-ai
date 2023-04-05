import chalk from 'chalk';
import ncp from 'copy-paste';

export const copy = (value: string) => {
    ncp.copy(value, (e) => {
        if (e) {
            console.log(chalk.red('Cannot copy to clipboard'));
        } else {
            console.log(chalk.green('Copied to clipboard!'));
        }
    });
};
