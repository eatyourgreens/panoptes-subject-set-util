#! /usr/bin/env node
'use strict';

const argv   = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .demand(1)
  .option('env', {
    describe: 'Sets run environment',
    default: 'staging',
    choices: ['staging', 'development', 'production']
  })
  .option('prompt', {
    describe: 'Prompt for username/password. Checks ENV for user/pass by default',
    default: false,
    type: 'boolean'
  })
  .command( require('./list') )
  .command( require('./link-subjects') )
  .command( require('./update-metadata') )
  .global('env')
  .strict()
  .epilogue('Copyright 2016 Zooniverse')
  .wrap(null)
  .argv;

// // UNUSED
// function getSubjectSet() {
//   api.type('subject_sets').get({id: argv.subjectSet})
//     .then( function(subject_set) {
//       // console.log('Retrieved Subject Set ', subject_set);
//       callback(null);
//     })
//     .catch( function(error) {
//      console.log("Error fetching subject set! ", error);
//      callback(error);
//    });
//
// }

// // UNUSED
// function uploadSubject(subject, index, callback) {
//   console.log('Uploading page ', index);
//
//   let newSubject = {
//     locations: subject.locations,
//     metadata: subject.metadata,
//     links: {
//       project: argv.project,
//       subject_sets: [argv.subjectSet],
//     }
//   }
//   api.type('subjects').create(newSubject).save()
//     .then( function(newSubject) {
//       // console.log("ZOONIVERSE_ID", subject.toJSON().id );
//       console.log('Finished uploading.');
//       callback(null);
//     })
//     .catch(function(error) {
//      console.log("Error saving subject data! ", error);
//      callback(error);
//     //  process.exit(1);
//    });
//
// }

// // UNUSED
// function getAllSubjectsInProject(projectId) {
//   // Sign in
//   return auth
//     .signIn(credentials)
//     // Get all subject sets in projecy
//     .then(() => {
//       return api.type('subject_sets').get({ project_id: projectId })
//     })
//     // Get all subjects from subject sets
//     .then((subjectSets) => {
//       return Promise.all(subjectSets.map(subjectSet => getAllSubjectsInSet(subjectSet.id)));
//     })
//     //
//     .then(subjectSetSubjects => {
//       // Flatten subjects grouped by set to one list
//       const subjects = [];
//       subjectSetSubjects.forEach(subjs => {
//         subjects.push.apply(subjects, subjs);
//       });
//       return Promise.resolve(subjects);
//     })
//     .catch(err => console.error('err', err));
// }

// // UNUSED
// // Generate random page numbers for staging subjects (they don't have any currently)
// function addRandomPageNumbersToSubjects() {
//   return getAllSubjectsInProject(OW_STAGING_PROJECT_ID)
//     .then(subjects => {
//       const usedPageNums = [];
//       const savePromises = [];
//       subjects.forEach((subject, i) => {
//         let pageNum = Math.round(Math.random() * 50);
//         while(usedPageNums.indexOf(pageNum) > -1) {
//           let pageNum = Math.round(Math.random() * 50);
//         }
//         subject.metadata.pageNumber = pageNum;
//         savePromises.push(subject.save());
//       });
//
//       Promise.all(savePromises)
//         .then(savedSubjects => {
//           console.log('Success!', savedSubjects);
//         })
//         .catch(err => {
//           console.log('Error!', err);
//         });
//     });
// }
//
// // addRandomPageNumbersToSubjects();
