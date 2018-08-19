/* ToDo: Calculate REM to PX conversions. Figure it out on load and store it. */
window.onload = onLoad();

function onLoad(){
    window.addEventListener("resize", onResize);
    onResize();
}


function onResize(){ //ToDo: Use logic to allow cover percentages to match image
    let els = document.getElementsByClassName("modal-body");
    let x=(window.innerHeight-1)*1-100;
    for(let i = 0; i < els.length; i++)
    {
        let el = els[i];
        el.style.height=x*.75+'px';
    }

    if(window.innerWidth>=769){
        x=(window.innerHeight-1)*1;
    }else{
        x=(window.innerHeight-1)*1;
    }


    els = document.getElementsByClassName("setheighttab");
    for(var i = 0; i < els.length; i++)
    {
        if(window.innerWidth <= 575)
            els[i].style.height=x-178+'px';
        if(window.innerWidth > 575 && window.innerWidth <= 699)
            els[i].style.height=x-190+'px';            
        if(window.innerWidth > 699 && window.innerWidth <= 767)
            els[i].style.height=x-205+'px';
        if(window.innerWidth > 767 && window.innerWidth <= 899)
            els[i].style.height=x-215+'px';            
        if(window.innerWidth > 899 && window.innerWidth <= 991)
            els[i].style.height=x-218+'px';
        if(window.innerWidth > 991 && window.innerWidth <= 10000)
            els[i].style.height=x-228+'px';            
    }

    els = document.getElementsByClassName("setheighttab1");
    for(var i = 0; i < els.length; i++)
    {
        if(window.innerWidth <= 575)
            els[i].style.height=x-178-8+'px';
        if(window.innerWidth > 575 && window.innerWidth <= 699)
            els[i].style.height=x-190-8+'px';            
        if(window.innerWidth > 699 && window.innerWidth <= 767)
            els[i].style.height=x-205-16+'px';
        if(window.innerWidth > 767 && window.innerWidth <= 899)
            els[i].style.height=x-205-22+'px';
        if(window.innerWidth > 899 && window.innerWidth <= 991)
            els[i].style.height=x-205-35+'px';            
        if(window.innerWidth > 991 && window.innerWidth <= 10000)
            els[i].style.height=x-230-16+'px';            
    }

    els = document.getElementsByClassName("setheightmin");
    for(var i = 0; i < els.length; i++)
    {
       els[i].style.minHeight=x-23+'px';
    }
    
    els = document.getElementsByClassName("setheightmax");
    for(var i = 0; i < els.length; i++)
    {
       els[i].style.maxHeight = x - 148 + 'px';
    }

    els = document.getElementsByClassName("setheight");
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