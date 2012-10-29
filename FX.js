
function $FX()
  {
    return;
  }
  
$FX.prototype.timer = setInterval('$FX.prototype.loop()',20);
$FX.prototype.fx = new Array();

$FX.prototype.addFX = function(ref,fx,end,speed,term)
  {
    var it = new Object();
	it.ref = document.all[ref].filters.item("DXImageTransform.Microsoft.Alpha");
	it.action = eval('$FX.prototype.'+fx);
	it.end = end;
	it.speed = speed;
	it.active = true;
	it.terminalFunction = term || '';
    this.fx[ref] = it;
	return;
  }
  
$FX.prototype.loop = function()
  {
    for(p in this.fx)
	  {
		if(this.fx[p].active==false)
		  {
		    eval(this.fx[p].terminalFunction);
			delete(this.fx[p]);
		  }
	    else { this.fx[p].action() }
	  }
	return;
  }

$FX.prototype.fadeIn = function()
  {
    this.ref.opacity = Math.min(this.ref.opacity+this.speed,this.end);
	if(this.ref.opacity==this.end)
	  {
	    this.active = false;
	  }
	return;
  }

$FX.prototype.fadeOut = function()
  {
    this.ref.opacity = Math.max(this.ref.opacity-this.speed,this.end);
	if(this.ref.opacity==this.end)
	  {
	    this.active = false;
	  }
	return;
  }