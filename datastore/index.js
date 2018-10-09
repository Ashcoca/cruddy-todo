const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        throw ('error creating text');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, items) => {
    _.each(items, (filename) => {
      var fileHead = filename.split('.')[0];
      data.push({ id: fileHead, text: fileHead });
    });
    
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  
  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: fileData.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
