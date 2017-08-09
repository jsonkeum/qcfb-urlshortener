var protocols = ["https://", "http://", "ftp://"];
module.exports = function(string){
  //First check to see if request contains a valid protocol from the array above
  let protocol = false;
  let protUsed = "";
  protocols.forEach(function(prot){
    if(string.match(prot)){
      if(string.match(prot).index === 0){
        protocol = true;
        protUsed = prot;
      }
    }
  });
  //Function ends if there is no valid protocol
  if(!protocol){return protocol};
  //check rest of syntax
  let syntax = true;
  let addy = string.split(protUsed).join("")
  let totalLength = addy.length;
  //Total address including delimiting periods must be less than 253 characters.
  if(totalLength > 253){
    syntax = false;
  }
  let split = addy.split(".");
  split.forEach(function(label){
    //Each label must be between 1 and 63 chars
    if(label.length < 1 || label.length > 63){syntax=false};
    //Label cannot contain anything other than alphanumerics or dashes
    if(label.search(/[^a-zA-Z0-9-]/gi) > -1){syntax=false};
    //Label's last char cannot be a dash
    if(label[label.length-1] == "-"){syntax=false};
    //Top level domain name must be 2 or 3 characters and can only contain alphabet
    if(split.indexOf(label) == split.length - 1 && (label.length < 2 || label.length > 3 || label.search(/[^a-zA-Z]/gi) > -1)){syntax=false};
  });
  return syntax;
}
