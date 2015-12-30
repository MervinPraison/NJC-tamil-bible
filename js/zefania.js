var persisteduls=new Object()
var ddtreemenu=new Object()

var cmp = 0;

String.prototype.startsWith = function(str){ return (this.match("^"+str)==str)}

String.prototype.endsWith = function(str){ return (this.match(str+"$")==str)}


ddtreemenu.closefolder="../images/closed.gif"
ddtreemenu.openfolder="../images/open.gif"

ddtreemenu.createTree=function(treeid, enablepersist, persistdays)
	{	
	var ultags=document.getElementById(treeid).getElementsByTagName("ul");
	if (typeof persisteduls[treeid]=="undefined")
		persisteduls[treeid]=(enablepersist==true && ddtreemenu.getCookie(treeid)!="")? ddtreemenu.getCookie(treeid).split(",") : ""
	for (var i=0; i<ultags.length; i++)
		ddtreemenu.buildSubTree(treeid, ultags[i], i)
	if (enablepersist==true)
		{ //if enable persist feature
		var durationdays=(typeof persistdays=="undefined")? 1 : parseInt(persistdays)
		ddtreemenu.dotask(window, function()
		{
			ddtreemenu.rememberstate(treeid, durationdays)}, "unload") //save opened UL indexes on body unload
		}
	}

ddtreemenu.buildSubTree=function(treeid, ulelement, index)
{
	ulelement.parentNode.className="submenu"
	if (typeof persisteduls[treeid]=="object")
		{ //if cookie exists (persisteduls[treeid] is an array versus "" string)
			if (ddtreemenu.searcharray(persisteduls[treeid], index))
				{
					ulelement.setAttribute("rel", "open")
					ulelement.style.display="block"
					ulelement.parentNode.style.backgroundImage="url("+ddtreemenu.openfolder+")"	
				}
	else
	ulelement.setAttribute("rel", "closed")
	} //end cookie persist code
	else if (ulelement.getAttribute("rel")==null || ulelement.getAttribute("rel")==false) //if no cookie and UL has NO rel attribute explicted added by user
	ulelement.setAttribute("rel", "closed")
	else if (ulelement.getAttribute("rel")=="open") //else if no cookie and this UL has an explicit rel value of "open"
	ddtreemenu.expandSubTree(treeid, ulelement) //expand this UL plus all parent ULs (so the most inner UL is revealed!)
	ulelement.parentNode.onclick=function(e)
	{
		var submenu=this.getElementsByTagName("ul")[0]
		if (submenu.getAttribute("rel")=="closed")
		{
		submenu.style.display="block"
		submenu.setAttribute("rel", "open")
		ulelement.parentNode.style.backgroundImage="url("+ddtreemenu.openfolder+")"
		}
		else if (submenu.getAttribute("rel")=="open")
		{
		submenu.style.display="none"
		submenu.setAttribute("rel", "closed")
		ulelement.parentNode.style.backgroundImage="url("+ddtreemenu.closefolder+")"
		}
	ddtreemenu.preventpropagate(e)
}
	ulelement.onclick=function(e)
	{
		ddtreemenu.preventpropagate(e)
	}
}

ddtreemenu.expandSubTree=function(treeid, ulelement)
{ //expand a UL element and any of its parent ULs
	var rootnode=document.getElementById(treeid)
	var currentnode=ulelement
	currentnode.style.display="block"
	currentnode.parentNode.style.backgroundImage="url("+ddtreemenu.openfolder+")"
	while (currentnode!=rootnode)
	{
	if (currentnode.tagName=="UL")
		{ //if parent node is a UL, expand it too
		currentnode.style.display="block"
		currentnode.setAttribute("rel", "open") //indicate it's open
		currentnode.parentNode.style.backgroundImage="url("+ddtreemenu.openfolder+")"
		}
	currentnode=currentnode.parentNode
	}
}

ddtreemenu.flatten=function(treeid, action)
{ //expand or contract all UL elements
var ultags=document.getElementById(treeid).getElementsByTagName("ul")
	for (var i=0; i<ultags.length; i++)
	{
	ultags[i].style.display=(action=="expand")? "block" : "none"
	var relvalue=(action=="expand")? "open" : "closed"
	ultags[i].setAttribute("rel", relvalue)
	ultags[i].parentNode.style.backgroundImage=(action=="expand")? "url("+ddtreemenu.openfolder+")" : "url("+ddtreemenu.closefolder+")"
	}
}

ddtreemenu.rememberstate=function(treeid, durationdays)
{ //store index of opened ULs relative to other ULs in Tree into cookie
	var ultags=document.getElementById(treeid).getElementsByTagName("ul")
	var openuls=new Array()
	for (var i=0; i<ultags.length; i++)
	{
	if (ultags[i].getAttribute("rel")=="open")
	openuls[openuls.length]=i //save the index of the opened UL (relative to the entire list of ULs) as an array element
	}
	if (openuls.length==0) //if there are no opened ULs to save/persist
	openuls[0]="none open" //set array value to string to simply indicate all ULs should persist with state being closed
	ddtreemenu.setCookie(treeid, openuls.join(","), durationdays) //populate cookie with value treeid=1,2,3 etc (where 1,2... are the indexes of the opened ULs)
}

////A few utility functions below//////////////////////

ddtreemenu.getCookie=function(Name)
{ //get cookie value
var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
if (document.cookie.match(re)) //if cookie found
return document.cookie.match(re)[0].split("=")[1] //return its value
return ""
}

ddtreemenu.setCookie=function(name, value, days)
{ //set cookei value
var expireDate = new Date()
//set "expstring" to either future or past date, to set or delete cookie, respectively
var expstring=expireDate.setDate(expireDate.getDate()+parseInt(days))
document.cookie = name+"="+value+"; expires="+expireDate.toGMTString()+"; path=/";
}

ddtreemenu.searcharray=function(thearray, value)
{ //searches an array for the entered value. If found, delete value from array
var isfound=false
for (var i=0; i<thearray.length; i++)
	{
	if (thearray[i]==value)
		{
		isfound=true
		thearray.shift() //delete this element from array for efficiency sake
		break
		}
	}
return isfound
}

ddtreemenu.preventpropagate=function(e)
{ //prevent action from bubbling upwards
	if (typeof e!="undefined")
	e.stopPropagation()
	else
	event.cancelBubble=true
}

ddtreemenu.dotask=function(target, functionref, tasktype)
{ //assign a function to execute to an event handler (ie: onunload)
var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
if (target.addEventListener)
target.addEventListener(tasktype, functionref, false)
else if (target.attachEvent)
target.attachEvent(tasktype, functionref)
}

/*  Hide all chapters */
function hidealldiv1()
{
	var divElmts = document.getElementsByTagName("div");
	var i;
	for(i=0; i < divElmts.length ; i++)
	{
	 if(divElmts[i].id.startsWith('menu1_') || divElmts[i].id.endsWith('_L'))
	 {
		if(divElmts[i].style.display == 'block')
		{			
			divElmts[i].style.display = 'none';
		}
	}	
	}
}

function hidealldiv2()
{
	var divElmts = document.getElementsByTagName("div");
	var i;
	for(i=0; i < divElmts.length ; i++)
	{
	  if(divElmts[i].id.startsWith('menu2_') || divElmts[i].id.endsWith('_R'))
	 {
		if(divElmts[i].style.display == 'block')
		{			
			divElmts[i].style.display = 'none';
		}
	}	
	}
}


function hideallchapdiv1(divid)
{
	for(i=1; i <= 66 ; i++)
	{
	var mystr = 'menu1_'+i;
	if(mystr != divid && divid.startsWith('menu1_'))
	{
			document.getElementById(mystr).style.display = 'none';
	}
	else if(mystr == divid)
	{
		document.getElementById(mystr).style.display = 'block';
	}
	}
}


function hideallchapdiv2(divid)
{
	for(i=1; i <= 66 ; i++)
	{
	var mystr = 'menu2_'+i;
	if(mystr != divid && divid.startsWith('menu2_'))
	{
			document.getElementById(mystr).style.display = 'none';
	}
	else if(mystr == divid)
	{
		document.getElementById(mystr).style.display = 'block';
	}
	}
}

/*  Toggle chapters */	
function togglediv1(divid)
{
		hidealldiv1();
		toggledivchap_sub1();
		document.getElementById(divid).style.display = 'block';
}

function togglediv2(divid)
{
		hidealldiv2();
		toggledivchap_sub2();
		document.getElementById(divid).style.display = 'block';
}

function togglediv2_sr(divid)
{
		changecss(".searchresults","width","48%");
		hidealldiv2();
		toggledivchap_sub2();
		document.getElementById(divid).style.display = 'block';
}


function toggledivchap_sub1()
{
		var divid=document.bookform1.book1.selectedIndex+1;
		hideallchapdiv1('menu1_'+divid);
}

function toggledivchap_sub2()
{
		var divid=document.bookform2.book2.selectedIndex+1;
		hideallchapdiv2('menu2_'+divid);
}

function toggledivchap1()
{
		if(document.getElementById('divsearchresults').style.display == 'block')
		{
		changecss(".searchresults","width","98%");
		document.getElementById('divsearchresults').style.display = 'none';
		}

		var divid=document.bookform1.book1.selectedIndex+1;
		hideallchapdiv1('menu1_'+divid);
		togglediv_nr1(document.bookform1.book1.options[document.bookform1.book1.selectedIndex].text+' 1_L');
}

function toggledivchap2()
{
		var divid=document.bookform2.book2.selectedIndex+1;
		hideallchapdiv2('menu2_'+divid);		
		togglediv_nr2(document.bookform2.book2.options[document.bookform2.book2.selectedIndex].text+' 1_R');
}

function toggledivchap()
{
		changecss(".floattop2","display","none");
		toggledivchap1();
}

function togglediv_nr1(divid)
{
		hidealldiv1();
		var divid1=document.bookform1.book1.selectedIndex+1;
		hideallchapdiv1('menu1_'+divid1);	
		document.getElementById(divid).style.display = 'block';
}

function togglediv_nr2(divid)
{
		hidealldiv2();
		var divid2=document.bookform2.book2.selectedIndex+1;
		hideallchapdiv2('menu2_'+divid2);	
		document.getElementById(divid).style.display = 'block';
}

window.location.keyValue = function ( keyName )
	{
	// Check to see if we have already retrieved the key value pairs
	// if we haven't then we need to retrieve them
	if( window.location.variablePairs == null )
		{
		if( window.location.href.indexOf('?') == -1)
			{
			return false;	
			}
		window.location.variablePairs = window.location.href.substr( window.location.href.indexOf('?') + 1).split('&');
		}
	
	// Search for the key that matches the keyName supplied
	for( var x = 0; x < window.location.variablePairs.length; x++ )
		{
		// If we find the key name then we retun the value associated with it
		if( keyName == window.location.variablePairs[x].substr( 0, window.location.variablePairs[x].indexOf('=')))
			{
			return window.location.variablePairs[x].substr( window.location.variablePairs[x].indexOf('=') + 1);
			}
		}
	return false;
	}

function changecss(theClass,element,value) {
	 var cssRules;
	 var added = false;
	 for (var S = 0; S < document.styleSheets.length; S++){

    if (document.styleSheets[S]['rules']) {
	  cssRules = 'rules';
	 } else if (document.styleSheets[S]['cssRules']) {
	  cssRules = 'cssRules';
	 } else {
	  //no rules found... browser unknown
	 }

	  for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
	   if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
	    if(document.styleSheets[S][cssRules][R].style[element]){
	    document.styleSheets[S][cssRules][R].style[element] = value;
	    added=true;
		break;
	    }
	   }
	  }
	  if(!added){
	  if(document.styleSheets[S].insertRule){
			  document.styleSheets[S].insertRule(theClass+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);
			} else if (document.styleSheets[S].addRule) {
				document.styleSheets[S].addRule(theClass,element+': '+value+';');
			}
	  }
	 }
	}

	
	
function increaseSize()
{
changecss(".chapterbody1","font-size","300%")
changecss(".chapterbody2","font-size","300%")
changecss(".searchresults","font-size","300%")

}

function defaultSize()
{
changecss(".chapterbody1","font-size","100%")
changecss(".chapterbody2","font-size","100%")
changecss(".searchresults","font-size","100%")
}

function decreaseSize()
{
changecss(".chapterbody1","font-size","80%")
changecss(".chapterbody2","font-size","80%")
changecss(".searchresults","font-size","80%")
}

function searchalldiv(query)
{
	var results="<p>"
	var divElmts = document.getElementsByTagName("div");
	var i;
	var queryElmts = query.split(" ");
	var proceed = 0;
	var lastloc = 0;
	for(i=0; i < divElmts.length ; i++)
	{
	if(divElmts[i].id != document.getElementById('divsearchresults').id && 
				divElmts[i].id != document.getElementById('divsearch').id && 
				divElmts[i].id != document.getElementById('menudiv').id && 
				divElmts[i].id != document.getElementById('menufont').id && 
				!divElmts[i].id.startsWith('menu1_') &&
				!divElmts[i].id.startsWith('menu2_') && 
				!divElmts[i].id.endsWith('_L'))
		{
	
		var chapHtml=divElmts[i].innerHTML;
		lastloc = 0;
		while(lastloc != -1)
		{
		var loc=chapHtml.toLowerCase().indexOf(queryElmts[0].toLowerCase(),lastloc+queryElmts[0].length-1);
		lastloc = loc;	

		if(loc !=-1)
		{
			var begin=chapHtml.substring(0,loc).toLowerCase().lastIndexOf('<sup>');
			var end=loc+chapHtml.substring(loc).toLowerCase().indexOf('<sup>')-begin;
			var verse = chapHtml.substr(begin,end);

			var verse_tmp=verse.toLowerCase().substring(verse.indexOf('</sup>')+6).replace(',',' ');
			verse_tmp=verse_tmp.replace("'",' ');
			verse_tmp=verse_tmp.replace('"',' ');
			verse_tmp=verse_tmp.replace(';',' ');
			verse_tmp=verse_tmp.replace(':',' ');
			verse_tmp=verse_tmp.replace('-',' ');
			verse_tmp=verse_tmp.replace('!',' ');
			verse_tmp=verse_tmp.replace('?',' ');
			verse_tmp=verse_tmp.replace('.',' ');
			verse_tmp=verse_tmp.replace('[',' ');
			verse_tmp=verse_tmp.replace(']',' ');
			verse_tmp=verse_tmp.replace('  ',' ');
			verse_tmp=verse_tmp.replace('  ',' ');
			verse_tmp=verse_tmp.replace(' ','');

			 proceed = 1;
		
			 for(j=0; j < queryElmts.length ; j++)
			 {
				if(verse_tmp.indexOf(queryElmts[j].toLowerCase())==-1)
				{
					proceed = 0;
				}
			 }
			if(proceed == 0)
			{
				continue;
			}
			
			var idx=verse.toLowerCase().indexOf("ccc\">");
			if(idx==-1)
				idx=verse.toLowerCase().indexOf("ccc>");
			
			var verse_id=verse.substring(idx+5,verse.toLowerCase().indexOf('</font>'));
			verse=verse.substring(verse.toLowerCase().indexOf('</font>')+7);
			
			if(proceed == 1)
			{
				results = results + "<a href='javascript:;' onclick='javascript:togglediv2_sr(\""+divElmts[i].id+"\");'>"+verse +" - "+divElmts[i].id.substring(0,divElmts[i].id.indexOf('_'))+":"+verse_id+"</a><br/><br>";
			}	
		}
		else
		 break;
	   }
	  }
	}
	results = results + "</p>";
document.getElementById('divsearchresults').innerHTML = results;
document.getElementById('divsearchresults').style.display = 'block';
}

function doSearch(query)
{
	if(query == '')
		return;
	else
	{
		hidealldiv1();
		hidealldiv2();	
		searchalldiv(query);
	}
}


function compareInit()
{
	if(cmp == 0)
	{
		cmp=1;
		changecss(".chapterbody1","width","37%");
		changecss(".floattop2","display","block");
		toggledivchap1();
		toggledivchap2();
		document.getElementById('cmpimg').src="../images/compare_on.gif";
	}
	else
	{
		cmp=0;
		changecss(".chapterbody1","width","87%");
		changecss(".floattop2","display","none");
		hidealldiv2();
		toggledivchap1();
		document.getElementById('cmpimg').src="../images/compare_off.gif";
	}
}
