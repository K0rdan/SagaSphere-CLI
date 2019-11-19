// Lib imports
import { spawn } from 'child_process';
import { concat, values, flattenDeep, join } from 'lodash';
import stripAnsiStream from 'strip-ansi-stream';
import { DEBUG, SAGASPHERE_ENV } from '@env';
import chalk from 'chalk';
// Custom imports
import { log, constants } from 'utils/index';

const cmdName = 'run';
const { services } = constants;
const dockerComposeCommonOptions = [
  `--project-directory`,
  `${
    SAGASPHERE_ENV === 'DEV'
      ? process
          .cwd()
          .replace(/([A-Z])(:\\)/g, (_, disk) => `/${disk.toLowerCase()}/`)
          .replace(/\\/g, '/')
      : process.cwd()
  }`,
  `--log-level`,
  `ERROR`,
];
const dockerComposeFiles = {
  DEV: concat(dockerComposeCommonOptions),
  PROD: concat(dockerComposeCommonOptions),
};

const logCmd = cmd =>
  log.debug(
    cmdName,
    `Command executed : ${chalk.bgRed(
      chalk.white(join(flattenDeep(values(cmd)), ' ')),
    )}`,
  );

const executeCmd = (cmd, debug) => {
  if (debug) {
    logCmd(cmd);
  }

  return stripAnsiStream().pipe(spawn(cmd.binary, cmd.command));
};

/** @function Run
 * @description Initialize SagaSphere docker project with production environment.
 * @param {commandCallback} commandCallback
 * @param {string} env Environment variable of Docker project.
 * @return {ChildProcess} An instance of the class ChildProcess.
 */

export const run = (withEventListeners, flags) => {
  if (DEBUG === 'true' || flags.globals.debug) {
    log.debug(
      cmdName,
      `Current working directory : '${
        SAGASPHERE_ENV === 'DEV'
          ? process
              .cwd()
              .replace(/([A-Z])(:\\)/g, (_, disk) => `/${disk.toLowerCase()}/`)
          : process.cwd()
      }'.`,
    );
  }

  let childProcess;

  if (flags.graphql) {
    childProcess = executeCmd(
      {
        binary: 'docker-compose',
        command: concat(dockerComposeFiles[SAGASPHERE_ENV], [
          `up`,
          services.graphql,
        ]),
      },
      DEBUG == true || flags.globals.debug,
    );
  } else {
    childProcess = executeCmd(
      {
        binary: 'docker-compose',
        command: concat(dockerComposeFiles[SAGASPHERE_ENV], [`up`, `-d`]),
      },
      DEBUG == true || flags.globals.debug,
    );
  }

  if (typeof withEventListeners === 'function') {
    const eventListeners = withEventListeners(childProcess, cmdName);
    if (Array.isArray(eventListeners) && eventListeners.length > 0) {
      eventListeners.map(
        listener =>
          typeof listener === 'function' && listener(childProcess, cmdName),
      );
    }
  }
  return childProcess;
};

export default run;
