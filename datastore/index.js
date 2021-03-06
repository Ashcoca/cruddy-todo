const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');


var readFileAsync = Promise.promisify(fs.readFile);
var readdirAsync = Promise.promisify(fs.readdir);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        callback(new Error('error creating text'));
      } else {
        //the reason it's {id, text} is b/c that format is dictated by the client
        //keep in mind this is a server side sprint
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // fs.readdir(exports.dataDir, (err, items) => {
  //   //Added this b/c if we get an error we don't want any more work done on this fn
  //   if (err) {
  //     return callback(err)
  //   }
  //   var data = [];
  //   _.each(items, (filename) => {
  //     var fileHead = filename.split('.')[0];
  //     //var fileText 
  //     data.push({ id: fileHead, text: fileHead });
  //   });
    
  //   callback(null, data);
  // });
  
  // readdirAsync
  // readFileAsync
  
  // readdirAsync(exports.dataDir)
  //   .then((fileNames) => {
  //     var ids = fileNames.map((file) => path.basename(file, '.txt'));
  //     var texts = Promise.all(fileNames.map((file) => readFileAsync(file)));
  //     return [ids, texts];
  //   })
  //   .then((thing) => {
  //     var data = [];
  //     for (let i = 0; i < ids.length; i++) {
  //       data.push({ id: ids[i], text: texts[i] });
  //     }
  //     callback(null, data);
  //   })
  //   .catch((err) => (err));


  readdirAsync(exports.dataDir)
    .then((fileNames) => {
      var ids = fileNames.map((file) => path.basename(file, '.txt'));
      
      Promise.all(fileNames.map((file) => readFileAsync(path.join(exports.dataDir, file))))
        .then((texts) => {
          var data = [];
          for (let i = 0; i < ids.length; i++) {
            data.push({ id: ids[i], text: texts[i].toString() });
          }
          callback(null, data);
        })});


  // ['/.../.../xxxxx.txt', '/.../.../yyyyy.txt', ...]
  // |
  // [promise1, promise2, ...]
  
  // Promise.all([promise1, promise2, ...])
  //   .then((items) => {...})
  
  // path.basename('/.../.../xxxxx.txt', '.txt') <- xxxxx
  
  
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
  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      //callback(null, { id, text: fileData.toString() });
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(new Error('error creating text'));
        } else {
          callback(null);
        }
      });
    }
  });

  // read the file specified
  //   if file not found, throw error
  //   if found, write to file specified
  //     if write fails, throw error
  //     if write successful, execute callback with (err, ?????)

};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null);
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
