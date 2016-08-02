'use strict';
const api = require('panoptes-client');

// updates an existing subject by replacing `locations` and `metadata` hashes		
function updateSubjectMetadata(subject, index, callback) {		
  console.log('%d Updating page %d', index, subject.metadata.pageNumber);
  const subject_id = subject.id		
  api.type('subjects').get({id: subject.id}).update({
      // Note: we only need to send `locations` and `metadata` to update subject		
      locations: subject.locations,
      metadata: subject.metadata		
    })		
    .save() // note: commenting keeps changes local		
    .then( function(subject) {		
      console.log('Finished updating subject: ', subject_id);		
      callback(null);		
    })		
    .catch( function(error) {
      console.log(subject);
     console.log("Error updating subject data! ", error);		
     callback(error);		
   });		
}

module.exports = updateSubjectMetadata;