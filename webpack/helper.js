// Some small helper methods

function arrayToObject(arr, id, value) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[arr[i][id]] = arr[i][value];
  return rv;
}

export { arrayToObject };
