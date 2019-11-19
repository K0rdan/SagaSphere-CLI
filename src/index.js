#!/usr/bin/env node
// Lib imports
import program from 'commander';
import { get } from 'lodash';
// Custom imports
import { run } from 'commands/index';
import { cleanResponse, log } from 'utils/index';

const stdoutListener = (stream, cmdName) =>
  stream.stdout.on('data', data => log.info(cmdName, cleanResponse(data)));
const stderrListener = (stream, cmdName) =>
  stream.stderr.on('data', data => log.err(cmdName, cleanResponse(data)));
const withStandardListeners = () => [
  (stream, cmdName) => stdoutListener(stream, cmdName),
  (stream, cmdName) => stderrListener(stream, cmdName),
];

// OPTIONS
program.option('-d, --debug', 'Add debug informations');

// RUN
program
  .command('run')
  .option('-a, --all', 'Run all SAGASPHERE services')
  .option('--graphql|--gql', 'Run GraphQL service')
  .description('RUN command description')
  .action(cmd => {
    const { graphql } = cmd;
    const flags = {
      globals: get(cmd, `parent`, {}),
      graphql,
    };
    return run(withStandardListeners, flags);
  });

program.parse(process.argv);
