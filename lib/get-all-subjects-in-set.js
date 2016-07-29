'use strict';
const api = require('panoptes-client');

function getAllSubjectsInSet(subjectSetId) {
  const query = { subject_set_id: subjectSetId, page: 1 };
  return api.type('subjects').get(query)
    .then(subjects => {
      console.log('BATCH: 1'); // --STI
      for(let subject of subjects) {
        console.log('SUBJECT PAGE NUMBER: ', subject.metadata.pageNumber); // --STI
      }
      const numPages = subjects[0]._meta.subjects.page_count;
      const pageFetches = [Promise.resolve(subjects)];
      for (let i = 2; i <= numPages; i++) {
        let fetcher = api.type('subjects').get(Object.assign({}, query, { page: i }));
        pageFetches.push(fetcher);
        console.log('BATCH: %d', i); // --STI
        for (let subject of subjects) {
          console.log('SUBJECT PAGE NUMBER: ', subject.metadata.pageNumber); // --STI
        }
      }
      return Promise.resolve(pageFetches);
    })
    .then(pageFetches => {
      return Promise.all(pageFetches);
    })
    .then(subjectPages => {
      const subjects = [];
      for (let subjectPage of subjectPages) {
        subjects.push.apply(subjects, subjectPage);
      }
      return Promise.resolve(subjects);
    })
}

module.exports = getAllSubjectsInSet;
