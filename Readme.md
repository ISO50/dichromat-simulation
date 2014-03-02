# Dichromat simulation
### Abstract

This Firefox extension simulates how webpages look for colorblind persons:
* Protanopia
* Deuteranopia
* Tritanopia

Therefore the extension changes the DOM of your HTML document, the stylesheets and the images. It replaces all original colors with the color that a colorblind person would see.

### Limitations

* In contrast to older versions html background attribute is not supported
* Plugin stuff still not supported
* Lots of ways that bring color to your document not supported
* No SVG support
* Gradients and Alpha is hard to cover correctly
* Processing is slow and blocks the browser

That means if you use anything special that is not supported you could use a fallback method by processing a screenshot of your website. The advantage of using the DOM way is that you have also support for css pseudo classes for example :hover.

### Accuracy

First of all, I am aware that this implementation does not match 1 to 1 with vischeck or other tools. The algorithm is based on this papers:

* Computerized simulation of color appearance for dichromats
* Corresponding-pair procedure: a new approach to simulation of dichromatic color perception
* Digital Video Colourmaps for Checking the Legibility of Displays by Dichromats

I am really interested if you find bugs or wrong assumptions in the implementation of that algorithm please contact me.

### Changelog

* Version 5.0.6 fixes the Extension to work with newer Firefox Versions as the API has changed a lot.

### Build instructions

* npm install
* grunt

### Release instructions

* Change version in package.json
* Change version in install.rdf

### History

This extensions bases on code I've wrote for an project at my university. 
