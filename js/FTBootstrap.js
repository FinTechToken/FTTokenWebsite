/* ToDo: Calculate REM to PX conversions. Figure it out on load and store it. */
window.onload = onLoad();

function onLoad(){
    window.addEventListener("resize", onResize);
    onResize();
}


function onResize(){ //ToDo: Use logic to allow cover percentages to match image
    if(window.innerWidth>=769){
        var x=(window.innerHeight-1)*1;
    }else{
        var x=(window.innerHeight-1)*1;
    }

    var els = document.getElementsByClassName("setheightmin");
    for(var i = 0; i < els.length; i++)
    {
       els[i].style.minHeight=x-23+'px';
    }
    
    var els = document.getElementsByClassName("setheightmax");
    for(var i = 0; i < els.length; i++)
    {
       els[i].style.maxHeight = x - 148 + 'px';
    }

    var els = document.getElementsByClassName("setheight");
    for(var i = 0; i < els.length; i++)
    {
       els[i].style.height=x-23+'px';
    }
    
    var vid = document.getElementById('video');
    if(vid){
        if(window.innerWidth>=992){
            var windowWidth = window.innerWidth/2-1;
        } else {
            var windowWidth = window.innerWidth-1;
        }
        var windowHeight = window.innerHeight-1,
        videoWidth = vid.offsetWidth,
        videoHeight = vid.offsetHeight;
        var videoAspectRatio = videoWidth/videoHeight;
        var windowAspectRatio = windowWidth/windowHeight;

        if(windowAspectRatio > videoAspectRatio){
            document.getElementById('video').style.height=Math.floor(windowWidth/videoAspectRatio)+'px';
            document.getElementById('video').style.width=windowWidth+'px';
            //img.style.left = "0px";
            //img.style.top = (windowHeight - (windowWidth * imgAspectRatio)) / 2 + "px";
        } else {
            document.getElementById('video').style.height=windowHeight+'px';
            document.getElementById('video').style.width=Math.floor(windowHeight*videoAspectRatio)+'px';
            //img.style.left = (windowWidth - (windowHeight / imgAspectRatio)) / 2 + "px";
            //img.style.top = "0px";
        }
    }
}

function toBN(number){
    try {
        return numberToBN.apply(null, arguments);
    } catch(e) {
        throw new Error(e + ' Given value: "'+ number +'"');
    }
};

function numberToHex(value) {
    if (!isFinite(value) && !_.isString(value)) {
        return value;
    }

    var number = toBN(value);
    var result = number.toString(16);

    return number.lt(new BigNumber(0)) ? '-0x' + result.substr(1) : '0x' + result;
};