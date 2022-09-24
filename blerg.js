fs = require('fs');
var xml2json = require('xml2json');
var json2xml = require('json2xml');
var o2x = require('object-to-xml');

const ID_NAME = 'NoteId';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getArrayIds(arr) {
  if (arr.length <= 1) {
    return null;
  }
  if (arr.find(elem => elem[ID_NAME] === undefined)) {
    return null;
  }
  const idList = arr.map((elem) => elem[ID_NAME]);

  if (idList.filter(onlyUnique).length !== idList.length) {
    console.log('we won!!')
  }

  return idList.sort((a, b) => a - b);
}
function check(arr) {
  if (arr.length <= 1) {
    return false;
  }
  if (arr.find(elem => elem[ID_NAME] === undefined)) {
    return false;
  }
  const idList = arr.map((elem) => elem[ID_NAME]);

  if (idList.filter(onlyUnique).length !== idList.length) {
    return true
  }

  return false;
}

function gersusiog(object, prefix) {
  if (typeof object === 'object') {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => {
      if (Array.isArray(value)) {
        if (check(value)) {
          console.log(`${prefix}.${key}`);
        }
        // console.log(JSON.stringify(getArrayIds(value)));
        return [key, { ids: getArrayIds(value), values: gersusiog(value, `${prefix}.${key}`) }];
      }
      return [key, gersusiog(value, `${prefix}.${key}`)];
    }));
  }
  return null;
}

fs.readFile('./init.xml', function (err, data) {
  const jsonString = xml2json.toJson(data);
  const object = JSON.parse(jsonString);
  gersusiog(object, 'root');
});
