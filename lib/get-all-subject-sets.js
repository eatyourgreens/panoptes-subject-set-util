'use strict';
const api = require('panoptes-client');

function getAllSubjectSets(projectId) {
  const query = { project_id: projectId, page: 1 };
  return api.type('subject_sets').get(query)
    .then(subjectSets => {
      const numPages = subjectSets[0]._meta.subject_sets.page_count;
      const pageFetches = [Promise.resolve(subjectSets)];
      for (let i = 2; i <= numPages; i++) {
        let fetcher = api.type('subject_sets').get(Object.assign({}, query, { page: i }));
        pageFetches.push(fetcher);
      }
      return Promise.resolve(pageFetches);
    })
    .then(pageFetches => {
      return Promise.all(pageFetches);
    })
    .then(subjectSetPages => {
      const subjectSets = [];
      for (let subjectSetPage of subjectSetPages) {
        subjectSets.push.apply(subjectSets, subjectSetPage);
      }
      return Promise.resolve(subjectSets);
    })
}

module.exports = getAllSubjectSets;
