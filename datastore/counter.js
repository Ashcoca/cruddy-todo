const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;


// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

//this fn just reading the current counter
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      //Number here converts the string into a number
      callback(null, Number(fileData));
    }
  });
};

//when we run this fn, we'll be storing a number, but not incrementing
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (cb) => {
  var err = null;
  readCounter((_, number) => {
    number++;
    writeCounter(number, (err2, str) => {
      cb(err2, str);
    });
  });


  //return zeroPaddedNumber(number);


};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
