# dontshowmethat
Experimental web extension integrating nsfw.js as a background process which hides NSFW images as you browse

Currently works on Chrome (unpacked, dev mode). Looking into including Firefox support, either by using the [webextension polyfill](https://github.com/mozilla/webextension-polyfill/) or using separate build targets. 

I have yet to check if this would be accepted if submitted as an actual extension to the Chrome webstore due to its use of compiled/obfuscated code

Currently "soak" testing, just letting it run in the background. I have previously experienced a rather pronounced memory leak during testing but have been unable to reproduce as of yet. 

Areas that this project _could_ be improved are:
* including configurable thresholds for when to hide images (e.g. "Sexy" is subjective so might be prone to false positives)
* How to hide images beyond applying a blur filter
  * Hard removal of image from DOM
  * Replace images (I'm imagining substituting with cute cat/dog pictures or something benign)
* Ability to un-hide select images 
  * This could a simple "picker/selector" which removes the added blur class from the elements class list
  
