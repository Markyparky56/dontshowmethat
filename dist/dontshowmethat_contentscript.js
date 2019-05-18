const dontshowmethatStyle = document.createElement("style");
const css = ".dontshowmethatBlur{filter:blur(30px);}";
dontshowmethatStyle.type = 'text/css';
dontshowmethatStyle.appendChild(document.createTextNode(css));
document.head.appendChild(dontshowmethatStyle);

const nsfwjs = chrome.runtime.connect({name: "checkImage"});
let imgMap = {};
nsfwjs.onMessage.addListener(function(message) {
  processPredictions(message.pred, imgMap[message.src]);
});

function processPredictions(pred, img)
{
  //console.log(pred, img.src);
  switch(pred[0].className)
  {
    case "Hentai": 
    case "Porn": 
      img.classList.add("dontshowmethatBlur");
      break;
    case "Sexy":
      if(pred[0].probability > (.5))
        img.classList.add("dontshowmethatBlur");
      break;
    default: // Catch tentative outliers
    {
      switch(pred[1].className)
      {
        case "Hentai": 
        case "Porn":         
          if(pred[1].probability > (1/3)) img.classList.add("dontshowmethatBlur");
          break;
        case "Sexy":
          if(pred[1].probability > (.5))
            img.classList.add("dontshowmethatBlur");
          break;
        default:
          break;
      }
        break;
    }
  }
}

// Check every image on the page
[...document.getElementsByTagName('img')]
.forEach(img => 
{
  if(img.src == "") return;
  imgMap[img.src] = img;
  nsfwjs.postMessage({
    sender: "img",
    img: img.src
  });
});

// Check CSS properties for images linked as background urls
[...document.getElementsByTagName("div")].forEach(element => {
  let style = window.getComputedStyle(element, null);
  let target;
  if(style.background != null)
  {
    target = style.background;    
  }
  else if(style.content != null)
  {
    target = style.content;
  }

  let regex = /"[\s\S]*?"/.exec(target); // Pull url from style
  if(regex)
  {
    let src = regex[0].slice(1, regex[0].length-1);
    if(src == "") return;
    imgMap[src] = element;
    nsfwjs.postMessage({
      sender: "css",
      img: src
    });
  }
});

// Set up mutation observer to catch images loaded after first load
let dontshowmethatObserverConfig = {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ["src"],
  childList: true,
  subtree: true
};

let dontshowmethatObserverCallback = (mutationList, observer) => {
  for(let mutation of mutationList)
  {
    switch(mutation.type)
    {
      case "childList":
      {
        let newImgs = [...mutation.target.getElementsByTagName("IMG")];
        if(newImgs.length > 0)
        {          
          // New image added
          newImgs.forEach(img => {
            if(!img.classList.contains("dontshowmethatBlur")) // Already processed
            {
              imgMap[img.src] = img;
              nsfwjs.postMessage({
                sender: "childList Mutation",
                img: img.src
              });            
            }
          });        
        }
      }
      case "attributes":
      {        
        if(mutation.attributeName == "src")
        {
          let img = mutation.target;
          imgMap[img.src] = img;
          nsfwjs.postMessage({
            sender: "attributes mutation",
            img: img.src
          });
        }
      }
      default:
        break;
    }
  }
};

let dontshowmethatObserver = new MutationObserver(dontshowmethatObserverCallback);
dontshowmethatObserver.observe(document.body, dontshowmethatObserverConfig);
