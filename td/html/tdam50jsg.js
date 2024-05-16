
/*
Copyright (c) 2003-2005 Klaas Bor
All rights reserved.
*/

ns4 = (document.layers) ? 1 : 0;
ie4 = (document.all) ? 1 : 0;
document.onkeydown = KeyDown;
if (ns4)
	document.captureEvents(Event.KEYDOWN);

function KeyDown(e)
{
	var key = 0;
	if (ie4) 
		key = event.keyCode;
	else
    key = e.which;
	if (key)
	{
		parent.frames[0].HandleKey(key);
		parent.frames[1].focus();
	}
}

function GoToMove(g, n)
{
parent.frames[0].GoToMove(g, n);
}
