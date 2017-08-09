module.exports = function generator(code){
  var newCode = code.toString();
  let zeros="";
  for(var i=0; i<(4 - newCode.length); i++){
    zeros += "0";
  }
  newCode = zeros + newCode;
  return newCode;
}
