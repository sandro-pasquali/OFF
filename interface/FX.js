
function $Opacity()
  {
    return;
  }
  
$Opacity.prototype.timer = setInterval('$Opacity.prototype.loop()',25);
$Opacity.prototype.fx = new Array();

$Opacity.prototype.addFX = function(ref,fx,end,speed,term)
  {
    var it = new Object();
	it.ref = document.all[ref].filters.item("DXImageTransform.Microsoft.Alpha");
	it.action = eval('$Opacity.prototype.'+fx);
	it.end = end;
	it.speed = speed;
	it.active = true;
	it.terminalFunction = term || '';
    this.fx[ref] = it;
	return;
  }
  
$Opacity.prototype.loop = function()
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

$Opacity.prototype.fadeIn = function()
  {
    this.ref.opacity = Math.min(this.ref.opacity+this.speed,this.end);
	if(this.ref.opacity==this.end)
	  {
	    this.active = false;
	  }
	return;
  }

$Opacity.prototype.fadeOut = function()
  {
    this.ref.opacity = Math.max(this.ref.opacity-this.speed,this.end);
	if(this.ref.opacity==this.end)
	  {
	    this.active = false;
	  }
	return;
  }