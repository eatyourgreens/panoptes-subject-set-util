'use strict';
const api = require('panoptes-client');
const handleLogin = require('./handle-login');

exports.command = 'update-metadata';
exports.describe = 'updates subject set by overwritting metadata (destructive)';
exports.builder = function (yargs) {
  return yargs
    .usage('Usage: $0 update-metadata --project [project_id] --subject-set [subject_set_id] --active [active_status] --shortName [ship_name]')
    .option('project', {
      describe: 'project id',
      alias: 'p',
      type: 'integer',
      demand: true,
    })
    .option('subject-set', {
      describe: 'subject set id',
      alias: 's',
      type: 'integer',
      demand: true
    })
    .option('params', {
      describe: 'parameters in valid JSON format',
      type: 'string',
      demand: true
    })
}

exports.handler = function (argv) {
  let metadata = JSON.parse('{"metadata": ' + argv.params + '}');
  handleLogin(argv.prompt, function() {
    api.type('subject_sets').get({id: argv.subjectSet})
      .update(metadata)
      .save()
      .catch( function(err) { console.log(err); });
  })

}
