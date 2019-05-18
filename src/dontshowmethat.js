import * as nsfwjs from 'nsfwjs'

var dontshowmethat = {};

nsfwjs.load("model_quick/").then(function(model) {
  dontshowmethat.model = model;
});

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "checkImage");
  console.log("Connected");
  port.onMessage.addListener(function(message) {
    if(message.src == "") console.log(message);
    const img = new Image();
    let src = message.img;
    let regex = /https?:/.exec(message.img);
    if(!regex)
    {
      //console.log(src, "https://" + src);
      src = "https://" + src;
    }
    img.src = src;
    img.onload = () => {
      dontshowmethat.model.classify(img)
      .then(pred => {
          port.postMessage({src: message.img, pred: pred});
      });
    }
    return true;
  });
});
