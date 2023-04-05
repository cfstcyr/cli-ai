import { exec as execChild } from 'child_process';

export const exec = (command: string) => {
    const child = execChild(command, {
        cwd: process.cwd(),
        env: process.env,
    });

    child.on('error', function (e) {
        console.log(e);
    });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    child.stdin?.pipe(process.stdin);

    process.on('SIGQUIT', () => {
        child.kill();
    });
};
