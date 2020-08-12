config = {
    imgWidth:520,
    dom:{
        img:document.getElementsByClassName("img")[0],
        dotes:document.getElementsByClassName("dotes")[0],
        btn_right:document.getElementsByClassName("right")[0],
        btn_left:document.getElementsByClassName("left")[0],
        container:document.getElementsByClassName("container")[0]
    },
    timer:0,//自动切换的定时器
    currentIndex:0,//现在是第几张图
    animate:{
        timer:null,//切换图片的定时器
        duration:16,//每次移动距离的时间
        total:500//切换图片的总时间
    }
}
imgChild = config.dom.img.children;
imgNumber = imgChild.length;
// 初始化img框的长度
function init(){
    var child1 =imgChild[0].cloneNode(true);
    var child2 = imgChild[imgNumber-1].cloneNode(true);
    config.dom.img.insertBefore(child2,imgChild[0]);
    config.dom.img.append(child1);
    config.dom.img.style.width = (imgNumber+2)*config.imgWidth+"px";
    config.dom.img.style.marginLeft = getMarginLeft(config.currentIndex)+"px";
    for(var i =0;i<imgNumber;i++){
        var span = document.createElement("span");
        config.dom.dotes.appendChild(span);
    }
    setDotes(config.currentIndex)
    config.dom.dotes.style.width = imgNumber*14+"px";
    event();
    config.timer = setInterval(auto, 2000);
} 
init()
// 设置哪个小圆点为红色
function setDotes(index){
    for(var i =0;i<config.dom.dotes.children.length;i++){
        config.dom.dotes.children[i].className="";
    }
    config.dom.dotes.children[index].className = "dotesColor"
}
//获得某个索引值得magrinLeft。
function getMarginLeft(index){
    return -(index+1)*config.imgWidth;
}
//计算当前图片以及希望移动到的图片距离，控制图片的移动
function switchTo(index,dir){
    var newLeft = getMarginLeft(index);
    var targetLeft = parseFloat(config.dom.img.style.marginLeft);
    var times = Math.ceil(config.animate.total/config.animate.duration);
    var currentTimes = 0;//用于判断什么时候移动停止
    var distance = 0;
    setDotes(index)
    if(index==config.currentIndex){
        return false;
    }
    config.currentIndex = index;
    if(dir=="right"){
        if(newLeft<targetLeft){
            distance = newLeft-targetLeft;
        }else{
            distance = -(imgNumber*config.imgWidth - Math.abs(newLeft-targetLeft));
        }
    }
    if(dir=="left"){
        if(newLeft<targetLeft){
            distance = (imgNumber*config.imgWidth - Math.abs(newLeft-targetLeft));
        }else{
            distance = newLeft-targetLeft;
        }
    }
    var everyDis = distance/times;
    // 控制图片的移动
    function beginAnimate(){
            clearInterval(config.animate.timer);
            config.animate.timer= setInterval(function(){
            currentTimes++;
            config.dom.img.style.marginLeft =  parseFloat(config.dom.img.style.marginLeft)+everyDis+"px"
            if(parseFloat(config.dom.img.style.marginLeft)>-config.imgWidth){
                config.dom.img.style.marginLeft = -(imgNumber)*config.imgWidth+parseFloat(config.dom.img.style.marginLeft)+"px"
            }else if(parseFloat(config.dom.img.style.marginLeft)<-(imgNumber)*config.imgWidth){
                config.dom.img.style.marginLeft = (imgNumber)*config.imgWidth+parseFloat(config.dom.img.style.marginLeft)+"px"
            }
            if(times==currentTimes){
                clearInterval(config.animate.timer);
            }
        }, config.animate.duration);
    }
    beginAnimate();
}
//绑定事件。
function event(){
        config.dom.btn_right.onclick = function(){
            var newIndex = config.currentIndex+1;
            if(newIndex>imgNumber-1){
                newIndex=0;
            }
            dir=this.className;
            switchTo(newIndex,dir)
        }
        config.dom.btn_left.onclick = function(){
            var newIndex = config.currentIndex-1;
            if(newIndex<0){
                newIndex=imgNumber-1;
            }
            dir=this.className;
            switchTo(newIndex,dir)
        }
        for(var  i =0;i<config.dom.dotes.children.length;i++){
            (function(i){
                config.dom.dotes.children[i].onclick =function(){
                    if(i<config.currentIndex){
                        switchTo(i,"left");
                    }else{
                        switchTo(i,"right")
                    }
                }
            })(i)
        }
        config.dom.container.onmouseenter = function(){
            clearInterval(config.timer)
        }
        config.dom.container.onmouseleave = function(){
            config.timer = setInterval(auto, 2000);
        }
}
function auto(){
    index=config.currentIndex+1;
    if(index>imgNumber-1){
        index=0;
    }
    switchTo(index,"right");
}