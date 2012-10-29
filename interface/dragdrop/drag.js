
var $EI = new Object();
$EI.agent = navigator.userAgent.toLowerCase();
$EI.mac = ($EI.agent.indexOf("mac") != -1);
$EI.XOffsetHack = ($EI.mac) ? 8 : 0; // a discrepancy i need to find a better solution for
$EI.YOffsetHack = ($EI.mac) ? 13 : 0; // "
$EI.ZCeil = 100000; 
$EI.ZFloor = 1001; 
$EI.ZT = new Array();

function initWindows()
  {
    with(document)
      {
	    onmousedown = mouseDown;
	    onmouseup = mouseUp;
	    onmousemove = mouseMove;
      }
	document.body.insertAdjacentHTML("beforeEnd",'<DIV ID="GHOST"></DIV><DIV ID="DRAGSCREEN"><img src="images/dummy.gif" width=100% height=100%></DIV>');
    $W.registerWindows();
	$W.windows['GAR'].updateStatus('a');
		$W.windows['BLAH'].updateBody('bkhjkkljkjkaaaarrrrgggghhhh');
    return;
  }
  
function mouseMove()
  {
    var e = window.event;
    if(!$EI.MOVER)
      {
        $EI.X = e.clientX;
        $EI.Y = e.clientY;
        $EI.SID = e.srcElement.id;
        $EI.SE = e.srcElement;
        $EI.SCLASS = e.srcElement.className;
        $EI.CW = document.body.clientWidth;
        $EI.CH = document.body.clientHeight;   
      }
    else if($EI.MODE)
      {
        var pW = $EI.MOVER.pixelWidth;
        var pH = $EI.MOVER.pixelHeight;
        var pL = $EI.MOVER.pixelLeft;
        var pT = $EI.MOVER.pixelTop;
        if($EI.MODE==1)
          {
	        var nL = e.clientX - $EI.X + $EI.NXOFF + $EI.XOffsetHack;
		    var nT = e.clientY - $EI.Y + $EI.NYOFF + $EI.YOffsetHack;
		    var nR = nL + $EI.MOVER.pixelWidth;
		    var nB = nT + $EI.MOVER.pixelHeight;
    		$EI.MOVER.pixelLeft = (!$EI.LIMITED)?nL:((nR<=$EI.LIMR)&&(nL>=$EI.LIML))?nL:pL;
    		$EI.MOVER.pixelTop = (!$EI.LIMITED)?nT:((nB<=$EI.LIMB)&&(nT>=$EI.LIMT))?nT:pT;
          }
        else if($EI.MODE==2)
          {
            var ofst = (!$EI.SHOWGHOST) ? $W.windows[$EI.ACTIVE].titleHeight+$W.windows[$EI.ACTIVE].titleHeight : 0;
            var nW = Math.max(document.body.scrollLeft + pW + (e.clientX - (pL + pW)),$EI.RSZW);
            var nH = Math.max(document.body.scrollTop + pH + (e.clientY - (pT + pH))-ofst,$EI.RSZH);
            $EI.MOVER.pixelWidth = (!$EI.LIMITED)?nW:((pL+nW)<=$EI.LIMR)?nW:pW;
            $EI.MOVER.pixelHeight = (!$EI.LIMITED)?nH:((pT+nH)<=$EI.LIMB)?nH:pH;
            if(!$EI.SHOWGHOST)
              {
                $W.adjustStatusbar(document.all[$EI.ACTIVE+'STATUS']);
              }
          }
		window.event.cancelBubble = true;
        window.event.returnValue = false;   
      }
    return; 
  }

function mouseDown()
  { 
	switch($EI.SCLASS)
      {		
		case 'MINIMIZE':
          alert('minimize');
		break;

		case 'MAXIMIZE':
          alert('minimize');
		break;
			
		case 'CLOSE':
          alert('close');
		break;
			
		default:
          var Z = bubbleUntil($EI.SE,'DRAGOBJECT');
          if(Z)
            {
              $EI.SHOWGHOST = (Z.NOGHOST==1) ? false : true;
	          $EI.ZINDEXED = (Z.NOZ==1) ? false : true;
	          $EI.LIMITED = (Z.LIMITED==1) ? true : false; 
              $EI.LIML = Z.LIML || 0;
              $EI.LIMT = Z.LIMT || 0;
              // note the R and B limits are understood as relational to clientW/H
              $EI.LIMR = (Z.LIMR) ? $EI.CW-Z.LIMR : $EI.CW;
              $EI.LIMB = (Z.LIMB) ? $EI.CH-Z.LIMB : $EI.CH;
              $EI.RSZW = Z.RSZW || 200;
              $EI.RSZH = Z.RSZH || 100;
              $EI.NXOFF = Z.offsetLeft;
              $EI.NYOFF = Z.offsetTop;
              $EI.ACTIVE = Z.id;
              updateZ();
            }
          var A = bubbleUntil($EI.SE,'DRAGTITLE');
          var B = ($EI.SCLASS=='SCALER');
          $EI.MODE = (A) ? 1 : (B) ? 2 : 0;
          if($EI.MODE)
            {
              showDragMode();
            }
          window.event.cancelBubble = true;
          window.event.returnValue = false;        
		break;
      }
    return; 
  }
  
 function mouseUp()
  {
    if($EI.MODE)
	  {
	    ($EI.MODE == 1) && (dropDRAGOBJECT());
        ($EI.MODE == 2) && (dropDRAGOBJECT());
	  }
    $EI.ACTIVE = $EI.MODE = $EI.MOVER = null;
    $EI.X = window.event.clientX; 
    $EI.Y = window.event.clientY;
    return; 
  }
  
function showDragMode()
  {
    var D = bubbleUntil($EI.SE,'DRAGOBJECT');
    with(GHOST.style)
      {
        width = D.style.pixelWidth;
        height = D.style.pixelHeight + $W.windows[$EI.ACTIVE].titleHeight + $W.windows[$EI.ACTIVE].statusHeight;
        top = D.style.pixelTop;
        left = D.style.pixelLeft;
        visibility = ($EI.SHOWGHOST) ? 'visible' : 'hidden';
      }
	$EI.MOVER = ($EI.SHOWGHOST) ? GHOST.style : $EI.MOVER = document.all[$EI.ACTIVE].style;
    toggleDragScreen(1);
    return;
  }

function dropDRAGOBJECT()
  {
    if($EI.SHOWGHOST)
	  {
        GHOST.style.visibility = 'hidden';
        with(document.all[$EI.ACTIVE].style)
          {
            if($EI.MODE == 1)
              {
                pixelLeft = GHOST.style.pixelLeft;
                pixelTop = GHOST.style.pixelTop;
              }
            if($EI.MODE == 2)
              {
                pixelWidth = GHOST.style.pixelWidth;
                pixelHeight = GHOST.style.pixelHeight-$W.windows[$EI.ACTIVE].titleHeight-$W.windows[$EI.ACTIVE].statusHeight;
                $W.adjustStatusbar(document.all[$EI.ACTIVE+'STATUS']);
              }
          }
	  }
	toggleDragScreen();
    return;  
  }

function updateZ()
  { 
    if($EI.ZINDEXED)
	  {
        var cur = $EI.ZT[$EI.ACTIVE] = document.all[$EI.ACTIVE].style;
        for(z in $EI.ZT)
          {
            $EI.ZT[z].zIndex = (cur == $EI.ZT[z]) ? $EI.ZCeil : Math.max($EI.ZT[z].zIndex-2,$EI.ZFloor);
          }
	  }
    return;
  }

function bubbleUntil(start,finish,attrib)
  { 
    var PP = start;
	var AA = attrib || 'className';
    do
      {
        if(eval("PP." + AA + "==finish")) { return(PP); }
        PP = PP.parentElement;
      } while(PP != null)
    return(false);
  }

function toggleDragScreen(on)
  {
    DRAGSCREEN.style.visibility = (on) ? 'visible' : 'hidden';
    DRAGSCREEN.style.zIndex = $EI.ZT[$EI.ACTIVE].zIndex-1;
    document.onselectstart = (on) ? function() { return false; } : '';
    return;
  }
  
var $W = new Object();
$W.windows = new Array();

$W.windowObject = function(id)
  {
    this.id = id;
	this.ref = eval(id);
	this.bodyRef = null; 
	this.statusRef = null;
    return;
  }
  
$W.windowObject.prototype.setTitleHeight = function(th)
  {
    this.titleHeight = parseInt(th || 10);
	return;
  }
  
$W.windowObject.prototype.setStatusHeight = function(sh)
  {
    this.statusHeight = parseInt(sh || 10);
	return;
  }

$W.windowObject.prototype.updateStatus = function(str)
  {
    if(this.statusRef && this.statusRef.TEXTFIELD)
	  {
	    this.statusRef.TEXTFIELD.innerText = str || '';
	  }
    return;
  }
  
$W.windowObject.prototype.updateBody = function(str)
  {
    if(this.bodyRef)
	  {
	    this.bodyRef.innerHTML = str || '';
	  }
    return;
  }
  
$W.adjustStatusbar = function(ob)
  {
    ob.style.pixelTop = ob.HOLDER.style.pixelHeight + $W.windows[ob.HOLDER.id].titleHeight;
	if(ob.SCALEGRIP)
	  {
	    ob.SCALEGRIP.style.pixelLeft = ob.HOLDER.style.pixelWidth-17;
	  }
    return;
  }


$W.registerWindows = function()
  {
    var DA = document.all;
    for(x=0; x < DA.length; x++)
      {
	    var d = DA[x];
        if(d.className == 'DRAGBODY') 
		  { 
		    var holder = bubbleUntil(d,'DRAGOBJECT');
			this.windows[holder.id] = new this.windowObject(holder.id);
			with(this.windows[holder.id])
			  {
			    bodyRef = d;
			    setTitleHeight(holder.TITLEHEIGHT);
			    setStatusHeight(holder.STATUSHEIGHT);
			  }
			d.id = holder.id + 'BODY';
            d.style.top = this.windows[holder.id].titleHeight;
			continue;
		  }
        if(d.className == 'STATUSBAR') 
		  { 
		    var holder = bubbleUntil(d,'DRAGOBJECT');
            this.windows[holder.id].statusRef = d;
			d.HOLDER = holder;
			d.id = holder.id + 'STATUS';
			var sbar = '<SPAN CLASS="STATUSTEXT"></SPAN>';
			if(holder.RESIZE) { sbar += '<SPAN CLASS="SCALER"></SPAN>'; }
			d.innerHTML = sbar;
			d.TEXTFIELD = d.children[0];
			d.SCALEGRIP = (holder.RESIZE) ? d.children[1] : null;
		    this.adjustStatusbar(d); 
		  }
      }
    return;
  }
