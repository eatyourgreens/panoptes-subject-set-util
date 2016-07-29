'use strict';

function generateLinkedList(argv, subjects) {
  console.log('# subjects = ', subjects.length); // --STI
  var cacheSize = argv.cacheSize;

  console.log('Using cache size: ', cacheSize);

  subjects = subjects
    .filter(subject => { // skip subjects missing page number
      var hasPageNumber = (typeof subject.metadata.pageNumber !== 'undefined' && subject.metadata.pageNumber !== null);
      if (!hasPageNumber) {
        console.log('Warning: Skipped subject (' + subject.id + '); missing metadata.pageNumber');
      }
      return hasPageNumber;
    })
    .sort( (subject1, subject2) => { return parseInt(subject1.metadata.pageNumber) - parseInt(subject2.metadata.pageNumber) });

  subjects = subjects.map((subject, i) => {  // once sorted by page number, add next/prev subject ids to each subject

    console.log('SUBJECT PAGE NUMBER: ', subject.metadata.pageNumber);
    subject.metadata.prevSubjectIds = [];
    subject.metadata.nextSubjectIds = [];

    var currentIndex = subjects.indexOf(subject);

    // look ahead
    var i = 1, nextSubject = subjects[currentIndex+i];
    while( i <= cacheSize && typeof nextSubject !== "undefined" && nextSubject !== null ) {
      subject.metadata.nextSubjectIds.push( nextSubject.id );
      i++;
      nextSubject = subjects[currentIndex+i];
    }

    // look back
    var j = 1, prevSubject = subjects[currentIndex-j];
    while( j <= cacheSize && typeof prevSubject !== "undefined" && prevSubject !== null ) {
      subject.metadata.prevSubjectIds.push( prevSubject.id );
      j++;
      prevSubject = subjects[currentIndex-j];
    }

    return subject;
  });

  return subjects;
}

module.exports = generateLinkedList;
