'use strict';
const api = require('panoptes-client');
const handleLogin = require('./handle-login');
const cliTable = require('cli-table');
const getAllSubjectSets = require('./get-all-subject-sets');

exports.command = 'list';
exports.describe = 'list available subject sets';
exports.builder = function (yargs) {
  return yargs
    .usage('Usage: $0 list')
    .option('project', {
      alias: 'p',
      demand: true,
      describe: 'Project ID',
      type: 'integer'
    })
    .help()
}

exports.handler = function (argv) {
  handleLogin(argv.prompt, function() {
    // logged in
    let table = new cliTable({
      head: ['ID', 'Active', 'Count', 'Short Name', 'Display Name'],
      colWidths: [10, 10, 10, 20, 20]
    });

    getAllSubjectSets(argv.project).then( function(subjectSets) {
      subjectSets.map( function(subjectSet) {
        table.push([
          subjectSet.id                        ? subjectSet.id : 'n/a',
          subjectSet.metadata.active           ? subjectSet.metadata.active : 'n/a',
          subjectSet.set_member_subjects_count ? subjectSet.set_member_subjects_count : 'n/a',
          subjectSet.metadata.shortName        ? subjectSet.metadata.shortName : 'n/a',
          subjectSet.display_name              ? subjectSet.display_name : 'n/a'
        ]);
      });
      console.log(table.toString());
    });

  })

}
