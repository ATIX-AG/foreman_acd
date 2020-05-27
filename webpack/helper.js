// Some small helper methods

function arrayToObject(arr, id, value) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[arr[i][id]] = arr[i][value];
  return rv;
}

function arrayToObjectObj(arr, id) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[arr[i][id]] = arr[i];
  return rv;
}

export {
  arrayToObject,
  arrayToObjectObj
};
