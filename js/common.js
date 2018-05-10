function $(value){
	var v=value.substr(1,value.length);
	if(value.indexOf(".")===0){
		return document.getElementsByClassName(v);
	}else if(value.indexOf("#")===0){
		return document.getElementById(v);
	}else{
		return document.getElementsByTagName(value);
	}
}
