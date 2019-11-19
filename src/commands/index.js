import run from 'commands/run';

export { default as run } from 'commands/run';

// GLOBAL TYPEDEF
/** @callback commandCallback Callback function.
 * @param {String} commandName Name of the command
 * @param {ChildProcess} childProcess
 */

export const commands = {
  run,
};

export default commands;
