function GETVariable(variable){
	var SearchString = window.location.search.substring(1);
	var VariableArray = SearchString.split('&');
	for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == variable){
            return KeyValuePair[1];
        }
    }
}

// console.log(GETVariable("lat"));
// console.log(GETVariable("lng"));
