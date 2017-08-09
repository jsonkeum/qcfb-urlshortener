var origin = "https://qcfb-urlshortener.glitch.me/";
module.exports = function(syntaxErr, notFoundErr, original, shortcut){
  if(syntaxErr){
    return {
      "originalurl": original,
      "error": "URL must contain appropriate protocol and address"
    }
  }
  if(notFoundErr){
    return {
      "error": "shortcut code not found",
      "shortcut":origin+shortcut
    }
  }
  return {
    "originalurl": original,
    "shortcut": origin+shortcut
  }
}
