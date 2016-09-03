@import 'common.js'

var onRun = function(context) {

	var doc = context.document;
	var selection = context.selection;
	var pages = [doc pages];

	//name of the Symbols page
  var symbolsPageName = "Symbols";

	//initialize the variables
	var offset = 100;

  //if the doc has a symbol page store it in here
  var hasSymbolsPage = false;
  hasSymbolsPage = checkIfHasSymbolsPage(pages, symbolsPageName);

  //reference a selected layer
  var selection = context.selection;

	if(hasSymbolsPage == true){

    if(selection.count() == 0){
  		doc.showMessage("Please select something.");
  	}else{
  		//loop through the selected layers
  		for(var i = 0; i < selection.count(); i++){

        var layer = selection[i];
        var layerClass = layer.class();

        if(layerClass == "MSSymbolInstance"){
          duplicateSymbol(doc, pages, symbolsPageName, layer, offset);
        }
  		}
  	}

	} else {
		//alert user if no symbols page found
		alert("No Symbols Page Found!", "There is no page in this document named: "+symbolsPageName);
	}
}

function duplicateSymbol(doc, pages, symbolsPageName, layer, offset){

  //get the name of the original symbol
  var layerSymbol = layer.symbolMaster().name();

  //loop through the pages array
	for (var i = 0; i < pages.count(); i++){

		//reference each page
		var page = pages[i];

    //get the page name
    var pageName = [page name];

    //checks if the page name is Symbols
    if (pageName == symbolsPageName){

      //reference the artboards of each symbol
      var artboards = [page artboards];
      for (var z = 0; z < artboards.count(); z++){

        //reference each artboard of each page
        var artboard = artboards[z];
        var artboardName = artboard.name();

        //checks the artboards name to see if it's the same as the original symbol name
        if(artboardName == layerSymbol){

          //give the new symbol a temporary name
          var newSymbolNameTemp = layerSymbol + " copy"

          //ask the user to rename it
          var newSymbolName = [doc askForUserInput:"Please name your symbol" initialValue:newSymbolNameTemp];

          if(!newSymbolName){
            throw(nil);
          }else{

            //create the new symbol
            var newSymbol = artboard.duplicate();

            //get the y position of the original symbol in the Symbols page
            var layerY = artboard.frame().y();

            //get the height of the original symbol in the Symbols page
            var layerHeight = artboard.frame().height();

            //reference the new symbols frame
            var newSymbolFrame = newSymbol.frame();

            //change the name of the new symbol
            newSymbol.setName(newSymbolName);

            //set the y value of the new symbol
            newSymbolFrame.setY(layerY + layerHeight + offset);

            //change the instance of the old symbol to the new symbol
            layer.changeInstanceToSymbol(newSymbol);

            //deselect layer and then select it, to refresh the symbol reference in the symbol panel on the right
            doc.currentPage().deselectAllLayers();
            layer.select_byExpandingSelection(true, true);

            //rename the layer with the new symbol name
            layer.setName(newSymbolName);

            alert("Symbol Duplicated!", newSymbolName + " has been created.");
          }
        }
      }
    }
	}
}

function checkIfHasSymbolsPage(pages, symbolsPageName){

  var symbolPageCount = 0;

  for (var i = 0; i < pages.count(); i++){

    //reference each page
    var page = pages[i];

    //get the page name
    var pageName = [page name];

    //checks if the doc has a page with the name symbolsPageName
    if (pageName == symbolsPageName){
      symbolPageCount = symbolPageCount + 1;
    }
  }
  if(symbolPageCount > 0){
    return true;
  }else{
    return false;
  }
}
