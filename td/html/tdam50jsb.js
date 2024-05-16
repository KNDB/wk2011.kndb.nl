
/*
Copyright (c) 2003-2005 Klaas Bor
All rights reserved.
*/

var Empty = 0;
var WhiteMan = 1;
var BlackMan = 2;
var WhiteKing = 3;
var BlackKing = 4;

var ImageNames;

var SquareToImage8 = new Array(0,1,3,5,7,8,10,12,14,17,19,21,23,24,26,28,30,
33,35,37,39,40,42,44,46,49,51,53,55,56,58,60,62);

var WhiteSquareToImage8 = new Array(0,0,2,4,6,9,11,13,15,16,18,20,22,25,27,29,31,
32,34,36,38,41,43,45,47,48,50,52,54,57,59,61,63);

var SquareToImage10 = new Array(0,1,3,5,7,9,10,12,14,16,18,21,23,25,27,29,30,
32,34,36,38,41,43,45,47,49,50,52,54,56,58,61,63,65,67,69,70,72,74,76,78,81,
83,85,87,89,90,92,94,96,98);

var SquareToAlphaNumeric = new Array(
"00",
"b8", "d8", "f8", "h8", 
"a7", "c7", "e7", "g7",
"b6", "d6", "f6", "h6",
"a5", "c5", "e5", "g5",
"b4", "d4", "f4", "h4",
"a3", "c3", "e3", "g3",
"b2", "d2", "f2", "h2",
"a1", "c1", "e1", "g1");

var RetroMoves = new Array();
var CurrentRetro = 0;
var NumberOfRetros = 0;

var Link = 0;
var PrevMove = 1;
var NextMove = 2;
var PrevVariant = 3;
var NextVariant = 4;
var BeginSquare = 5;
var EndSquare = 6;
var BeginPiece = 7;
var EndPiece = 8;
var NumberOfCaptures = 9;
var FirstCapture = 10;

var PositionAfter = ""; 
var StartPosition = ""; 

var FormElements = 9;

var Game = 0;

var JumpMoves = 5;

var DisableHighlight = false;

var KeyBackward1 = 37;  // Left
var KeyBackward2 = 100; // NumPad4
var KeyBackward3 = 52;  // Netscape
var KeyForward1 = 39;   // Right
var KeyForward2 = 102;  // NumPad6
var KeyForward3 = 54;   // Netscape
var KeyStart1 = 103;    // NumPad7
var KeyStart2 = 55;     // Netscape
var KeyEnd1 = 97;       // NumPad1
var KeyEnd2 = 49;       // Netscape
var KeyFlip1 = 111;     // Divide
var KeyFlip2 = 47;      // Netscape
var KeyAuto1 = 106;     // Multiply
var KeyAuto2 = 42;      // Netscape

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
		HandleKey(key);
	}
}

function HandleKey(key)
{
	if (key == KeyBackward1 || key == KeyBackward2 || key == KeyBackward3)
		GoBackward(Game);
	if (key == KeyForward1 || key == KeyForward2 || key == KeyForward3)
		GoForward(Game);
	if (key == KeyStart1 || key == KeyStart2)
		GoToStart(Game);
	if (key == KeyEnd1 || key == KeyEnd2)
		GoToEnd(Game);		
	if (key == KeyFlip1 || key == KeyFlip2)
		FlipBoard(Game);
	if (key == KeyAuto1 || key == KeyAuto2)
		AutoPlay(Game);
}

function Highlight()
{
	if (DisableHighlight)
		return;
	if (document.all)
	{
		var movenumber = LastHighlight[Game];
		if (movenumber)
		{
      var link = GetLink(movenumber);
      if (!Frames)
      {
    		document.links[link].style.background=document.bgColor;
      }
      else
      {
        parent.frames[1].document.links[link].style.background=parent.frames[1].document.bgColor;
      }
    }
    movenumber = LastMovePlayed[Game];
    if (movenumber)
    {
      var link = GetLink(movenumber);
      if (!Frames)
      {
    		document.links[link].style.background="gray";
      }
      else
      {
       parent.frames[1].document.links[link].style.background="gray";
      }
    }
    LastHighlight[Game] = movenumber;
	}
}

function numToString(number)
{
	number += "";
	return (number);
}

function GetMoveNumber(n)
{
	return (MoveNumberAtRoot[Game] + Math.floor((n - 1 + (!WhiteToMoveAtRoot[Game])) / 2));
}

function GetMoveString()
{
  var lastmove = LastMovePlayed[Game];
	if (!lastmove)
	{
		return (StartPosition);
	}
	else
	{
		var nmoves = GetNumberOfMovesPlayed();
		var movenumber = numToString(GetMoveNumber(nmoves));
		var beginsquare = 0;
		var endsquare = 0;
		if (AlphaNumeric == 0)
		{
			if (StartOnLowSquares)
			{
  			var mirror = (BoardSize * BoardSize)/2 + 1;
		  	beginsquare = numToString(mirror-GetBeginSquare(lastmove));
		  	endsquare = numToString(mirror-GetEndSquare(lastmove));
			}
			else
			{
		  	beginsquare = numToString(GetBeginSquare(lastmove));
		  	endsquare = numToString(GetEndSquare(lastmove));
			}
		}
		else
		{
 		  beginsquare = SquareToAlphaNumeric[GetBeginSquare(lastmove)];
		  endsquare = SquareToAlphaNumeric[GetEndSquare(lastmove)];
		}
 		var ncaptures = GetNumberOfCaptures(lastmove);
		var beginpiece = GetBeginPiece(lastmove);
		var dots = ((beginpiece == WhiteMan || beginpiece == WhiteKing) ? "." : "...");
		var str = movenumber + dots + beginsquare + (ncaptures ? "x" : "-") + endsquare;
		return (str);
	}
}

function InitImages(path)
{
	ImageNames = new Array();

	ImageNames[Empty] = path + "b.gif";
	if (WhiteBegin)
	{
		ImageNames[WhiteMan] = path + "wm.gif";
		ImageNames[BlackMan] = path + "bm.gif";
		ImageNames[WhiteKing] = path + "wk.gif";
		ImageNames[BlackKing] = path + "bk.gif";
	}
	else
	{
		ImageNames[WhiteMan] = path + "bm.gif";
		ImageNames[BlackMan] = path + "wm.gif";
		ImageNames[WhiteKing] = path + "bk.gif";
		ImageNames[BlackKing] = path + "wk.gif";
	}
}

function MoveForwardAnim()
{
	for (var i = 0; i < NumberOfGames; i++)
	{
		if (Autos[i])
    {
      Game = i;
      if (PlayForward())
       	TransferBoard();
      else
        Autos[i] = false;
    }
	}
	window.setTimeout( "MoveForwardAnim()", 1000 );
}

function InitGames()
{
  if (!Frames)
  {
    for (var i = 0; i < NumberOfGames; i++)
    {
      Game = i;
      TransferBoard();
    }
  }
  Game = 0;
	TransferBoard();
  MoveForwardAnim();
}

function TransferMoveString()
{
  if (!Frames)
    document.forms[2*Game+1].elements[0].value = GetMoveString();
  else
    parent.frames[0].document.forms[1].elements[0].value = GetMoveString();
}

function MoveForward(n)
{
  var beginsquare = GetBeginSquare(n);
  var endsquare = GetEndSquare(n);
  var endpiece = GetEndPiece(n);
  CurrentPosition[Game][beginsquare] = Empty;
  CurrentPosition[Game][endsquare] = endpiece;
	var ncaptures = GetNumberOfCaptures(n);
	for (var j = 0; j < ncaptures; j++)
	{
    var capturedsquare = GetCapturedSquare(n, j);
		CurrentPosition[Game][capturedsquare] = Empty;
	}
}

function PlayForward()
{
  var movenumber = LastMovePlayed[Game];
	if (movenumber == 0)
	{
		if (!NumberOfMoves[Game])
			return (false);
		movenumber = FirstMoveNumber[Game];
	}
	else
	{
		movenumber = GetNextMove(movenumber);
	}
 	if (!movenumber)
 		return (false);
	MoveForward(movenumber);
	LastMovePlayed[Game] = movenumber;
  return (true);
}

function MoveBackward(n)
{
  var beginsquare = GetBeginSquare(n);
  var endsquare = GetEndSquare(n);
  var beginpiece = GetBeginPiece(n);
  CurrentPosition[Game][endsquare] = Empty;
  CurrentPosition[Game][beginsquare] = beginpiece;
	var ncaptures = GetNumberOfCaptures(n);
	for (var j = 0; j < ncaptures; j++)
	{
    var capturedsquare = GetCapturedSquare(n, j);
    var capturedpiece = GetCapturedPiece(n, j);
    CurrentPosition[Game][capturedsquare] = capturedpiece;
	}
}

function PlayBackward()
{
  var movenumber = LastMovePlayed[Game];
  if (!movenumber)
		return (false);
	MoveBackward(movenumber);
  var prevmove = GetPrevMove(movenumber);
	if (!prevmove)
  {
	  while (true)
  	{
 	  	prevmove = GetPrevVariant(movenumber);
		  if (!prevmove)
  			break;
	  	movenumber = prevmove;
  	}
    prevmove = GetPrevMove(movenumber);
  }
  LastMovePlayed[Game] = prevmove;
	return (true);
}

function GoToRoot()
{
	var maxpieces = (BoardSize * BoardSize)/2;
	for (var i = 1; i <= maxpieces; i++)
	{
		CurrentPosition[Game][i] = BeginPosition[Game][i];
	}
}

function GetImageBase()
{
	var maxsquares = BoardSize * BoardSize;
  var basename = "baseg" + Game;
  var j = 0;

	for (i = 0; i < document.images.length; i++)
	{
		if (document.images[j].name != "")
		{
			if (document.images[j].name == basename)
      {
				return j;
      }
			else if (document.images[j].name.substring(0,3) == basename.substring(0,3))
      {
				j += maxsquares;
      }
		}
    else
    {
	    j += 1;
    }
	}
	return -1;
}

function TransferBoard()
{
	var maxsquares = BoardSize * BoardSize;
  var maxpieces = (BoardSize * BoardSize)/2;
  var base = Game * maxsquares;
  if (Frames)
	{
    base = 0;
	}
	else
	{
		base = GetImageBase();
	}
	for (var i = 1; i <= maxpieces; i++)
	{
		var j = i;
		if (Flips[Game])
			j = maxpieces + 1 - i;
		var piece = CurrentPosition[Game][i];
    var simg = 0;
		if (BoardSize == 8)
		{
      if (PiecesOnWhiteSquares)
        simg = WhiteSquareToImage8[j];
      else
			  simg = SquareToImage8[j];
		}
		else
		{
			simg = SquareToImage10[j];
		}
    if (!Frames)
		  document.images[base + simg].src = ImageNames[piece];
    else
      parent.frames[0].document.images[base + simg].src = ImageNames[piece];
	}
	TransferMoveString();
	Highlight();
}

function GetLink(n)
{
	return (Moves[Game][MovesIndex[Game][n]+Link]);
}

function GetPrevMove(n)
{
	return (Moves[Game][MovesIndex[Game][n]+PrevMove]);
}

function GetNextMove(n)
{
	return (Moves[Game][MovesIndex[Game][n]+NextMove]);
}

function GetPrevVariant(n)
{
	return (Moves[Game][MovesIndex[Game][n]+PrevVariant]);
}

function GetNextVariant(n)
{
	return (Moves[Game][MovesIndex[Game][n]+NextVariant]);
}

function GetBeginSquare(n)
{
	return (Moves[Game][MovesIndex[Game][n]+BeginSquare]);
}

function GetEndSquare(n)
{
	return (Moves[Game][MovesIndex[Game][n]+EndSquare]);
}

function GetBeginPiece(n)
{
	return (Moves[Game][MovesIndex[Game][n]+BeginPiece]);
}

function GetEndPiece(n)
{
	return (Moves[Game][MovesIndex[Game][n]+EndPiece]);
}

function GetNumberOfCaptures(n)
{
	return (Moves[Game][MovesIndex[Game][n]+NumberOfCaptures]);
}

function GetCapturedSquare(n, i)
{
	return (Moves[Game][MovesIndex[Game][n]+FirstCapture+i*2]);
}

function GetCapturedPiece(n, i)
{
	return (Moves[Game][MovesIndex[Game][n]+FirstCapture+i*2+1]);
}

function DoRetro(n)
{
	RetroMoves[CurrentRetro] = n;
	CurrentRetro++;
	NumberOfRetros++;
	var movenumber = n;
	var prevmove = GetPrevMove(movenumber);
	if (prevmove)
	{
		DoRetro(prevmove);
		return;
	}
	
	while (true)
	{
		prevmove = GetPrevVariant(movenumber);
		if (!prevmove)
			break;
		movenumber = prevmove;
	}
	prevmove = GetPrevMove(movenumber);
	if (prevmove)
	{
		DoRetro(prevmove);
		return;
	}
}

function GetNumberOfMovesPlayed()
{
	var index = 0;
	var movenumber = LastMovePlayed[Game];
	while (movenumber)
	{
		index++;
    var prevmove = GetPrevMove(movenumber);
		if (prevmove)
		{
			movenumber = prevmove;
		}
		else
		{
			while (true)
      {
        var prevmove = GetPrevVariant(movenumber);
        if (!prevmove)
          break;
				movenumber = prevmove;
      }
      movenumber = GetPrevMove(movenumber);
		}
	}
	return (index);
}

function SetGame(game)
{
  if (game == -1)
    return;
  Game = game;
}

function GoToMove(game, n)
{
	SetGame(game);
  Autos[Game] = false;
	CurrentRetro = 0;
	NumberOfRetros = 0;
	DoRetro(n);
	GoToRoot();
	LastMovePlayed[Game] = 0;
	for (var i = NumberOfRetros - 1; i >= 0; i--)
	{
		MoveForward(RetroMoves[i]);
		LastMovePlayed[Game] = RetroMoves[i];
	}
	TransferBoard();
}

function GoToStart(game)
{
	SetGame(game);
  Autos[Game] = false;
	GoToRoot();
	LastMovePlayed[Game] = 0;
	TransferBoard();
}

function GoToEnd(game)
{
	SetGame(game);
  Autos[Game] = false;
	while (true)
	{
    if (!PlayForward())
      break;
	}
	TransferBoard();
}

function GoForward(game)
{
	SetGame(game);
  Autos[Game] = false;
  PlayForward();
 	TransferBoard();
}

function GoFastForward(game)
{
	SetGame(game);
  Autos[Game] = false;
	for (var i = 0; i < JumpMoves; i++)
  {
    if (!PlayForward())
      break;
  }
	TransferBoard();
}

function GoBackward(game)
{
	SetGame(game);
  Autos[Game] = false;
  PlayBackward();
	TransferBoard();
}

function GoFastBackward(game)
{
	SetGame(game);
  Autos[Game] = false;
	for (var i = 0; i < JumpMoves; i++)
	{
    if (!PlayBackward())
      break;
	}
 	TransferBoard();
}

function AutoPlay(game)
{
  SetGame(game);
	Autos[Game] = !Autos[Game];
}

function FlipBoard(game)
{
	SetGame(game);
	Flips[Game] = !Flips[Game];
	TransferBoard();
}

function SelectGame()
{
  LoadGame(parent.frames[0].document.forms[2].elements[0].selectedIndex);
}

function LoadGame(game)
{
  if (Game == game)
    return;
  Autos[Game] = false;
  Game = game;
  Autos[Game] = false;
  Flips[Game] = false;
  LastMovePlayed[Game] = 0;
  LastHighlight[Game] = 0;
  DisableHighlight = true; 
  GoToStart(Game);
  parent.frames[1].location.href = BaseName + "g" + Game + ".htm";
  DisableHighlight = false;
  Highlight();
}
