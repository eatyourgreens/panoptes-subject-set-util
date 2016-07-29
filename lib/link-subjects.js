'use strict';
const api                 = require('panoptes-client');
const handleLogin         = require('./handle-login');
const async               = require('async');
const getAllSubjectsInSet = require('./get-all-subjects-in-set');
const generateLinkedList  = require('./generate-linked-list');

exports.command = 'link-subjects';
exports.describe = 'creates a linked list among subjects in a set';
exports.builder = function (yargs) {
  return yargs
    .usage('Usage: $0 link-subjects --project [project_id] --subject-set [subject_set_id]')
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
    .option('cache-size', {
      describe: 'set cache size for prev/next subjects',
      default: 5,
      type: 'integer'
    })
    .option('dryrun', {
      describe: 'create a linked list without deploying subject changes',
      type: 'boolean'
    })
}

exports.handler = function (argv) {
  handleLogin(argv.prompt, function() {

    getAllSubjectsInSet(argv.subjectSet).then( function(subjects) {
      let updatedSubjects = generateLinkedList(argv, subjects);
      if( updatedSubjects.length == 0 ) {
        console.log('No subjects to update.');
        process.exit();
      }

      if (argv.dryrun) {
        console.log(JSON.stringify(updatedSubjects));
        process.exit();
      }

      prompt.message = 'Confirmation Required';
      prompt.start();
      prompt.get([{
        properties: {
          proceed: {
            description: 'This will modify ' + subjects.length + ' existing subjects. Are you sure? (y/n)'
          }
        }
      }], function(err, res) {
        if (res.proceed.match(/y/i)) {
          async.forEachOfSeries(updatedSubjects, updateSubjectMetadata,
            function(err) {
              console.log('Finished updating subjects.\nTip: Remember to add the subject set to the workflow.');
          });
        } else {
          console.log('Aborted.');
          process.exit();
        }
      })
    });

  })

}

// function getAllSubjectsInSet(subjectSetId) {
//   const query = { subject_set_id: subjectSetId, page: 1 };
//   return api.type('subjects').get(query)
//     .then(subjects => {
//       console.log('BATCH: 1'); // --STI
//       for(let subject of subjects) {
//         console.log('SUBJECT PAGE NUMBER: ', subject.metadata.pageNumber); // --STI
//       }
//       const numPages = subjects[0]._meta.subjects.page_count;
//       const pageFetches = [Promise.resolve(subjects)];
//       for (let i = 2; i <= numPages; i++) {
//         let fetcher = api.type('subjects').get(Object.assign({}, query, { page: i }));
//         pageFetches.push(fetcher);
//         console.log('BATCH: %d', i); // --STI
//         for (let subject of subjects) {
//           console.log('SUBJECT PAGE NUMBER: ', subject.metadata.pageNumber); // --STI
//         }
//       }
//       return Promise.resolve(pageFetches);
//     })
//     .then(pageFetches => {
//       return Promise.all(pageFetches);
//     })
//     .then(subjectPages => {
//       const subjects = [];
//       for (let subjectPage of subjectPages) {
//         subjects.push.apply(subjects, subjectPage);
//       }
//       return Promise.resolve(subjects);
//     })
// }

// function addNextLinksToSubjectSet(subjects) {
//   console.log('# subjects = ', subjects.length); // --STI
//   var cacheSize = argv.cacheSize;
//
//   console.log('Using cache size: ', cacheSize);
//
//   subjects = subjects
//     .filter(subject => { // skip subjects missing page number
//       var hasPageNumber = (typeof subject.metadata.pageNumber !== 'undefined' && subject.metadata.pageNumber !== null);
//       if (!hasPageNumber) {
//         console.log('Warning: Skipped subject (' + subject.id + '); missing metadata.pageNumber');
//       }
//       return hasPageNumber;
//     })
//     .sort( (subject1, subject2) => { return parseInt(subject1.metadata.pageNumber) - parseInt(subject2.metadata.pageNumber) });
//
//   subjects = subjects.map((subject, i) => {  // once sorted by page number, add next/prev subject ids to each subject
//
//     console.log('SUBJECT PAGE NUMBER: ', subject.metadata.pageNumber);
//     subject.metadata.prevSubjectIds = [];
//     subject.metadata.nextSubjectIds = [];
//
//     var currentIndex = subjects.indexOf(subject);
//
//     // look ahead
//     var i = 1, nextSubject = subjects[currentIndex+i];
//     while( i <= cacheSize && typeof nextSubject !== "undefined" && nextSubject !== null ) {
//       subject.metadata.nextSubjectIds.push( nextSubject.id );
//       i++;
//       nextSubject = subjects[currentIndex+i];
//     }
//
//     // look back
//     var j = 1, prevSubject = subjects[currentIndex-j];
//     while( j <= cacheSize && typeof prevSubject !== "undefined" && prevSubject !== null ) {
//       subject.metadata.prevSubjectIds.push( prevSubject.id );
//       j++;
//       prevSubject = subjects[currentIndex-j];
//     }
//
//     return subject;
//   });
//
//   return subjects;
// }
