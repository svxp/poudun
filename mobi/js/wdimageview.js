;(function($){
	var wdimgArr=[];
	var wdimgTitle=[];
	var arrIndex='';
	function wdImageView(opts){
		
		this.opts = $.extend({},this.defined,opts);
		this.opts.body = $('body');
		this.opts.winW = $(window).width();
		this.opts.winH = $(window).height();
		this.init(this.opts);//初始化
		//点击元素触发
		this.clickAction(this.opts);
		this.clickClosed();
		this.clickNext();
		this.clickPrev();
	}
	
	//初始化，向页面中插入dom
	wdImageView.prototype.init=function(){
		var opts = this.opts;
		var maskHtml='<div id="wdimagesview-mask"></div>';
		var mainHtml='<div id="wdimagesview-main"><div id="imgbox"><img src="" /></div></div><div id="wdimagesview-closed"></div>'+
						'<div class="wdimagesview-arr" style="left: 0px;" id="wdPrev"></div><div class="wdimagesview-arr" style="right: 0px; background-position: -49px 0px;" id="wdNext"></div>';
		var titleHtml = '<div id="imgtitle"></div>';
		var allHtml = maskHtml + mainHtml;
		opts.body.append(allHtml);
		if(opts.showtitle){
			$('#imgbox').append(titleHtml);
		}
	}
	
	//点击时触发
	wdImageView.prototype.clickAction = function (opts){
		var opts=opts;
		var Obj = this;
		$(document).on('click',opts.dom+'['+opts.group+']',function (ev){
			if(wdimgArr.length>0){
				wdimgArr=[];
				wdimgTitle=[];
			}
			$(opts.dom+'['+opts.group+']').each(function(index,item){
				wdimgArr.push($(this).attr(opts.item))
				wdimgTitle.push($(this).attr(opts.title))
			});
			var _thisIndex = wdimgArr.search($(this).attr(opts.item));
			if(_thisIndex!=-1){
				arrIndex = _thisIndex;
				Obj.loadimg(wdimgArr,wdimgTitle,_thisIndex);
			}
			return false;
			ev.preventDefault();
		})		
	}
	
	//加载图片
	wdImageView.prototype.loadimg=function (imgurl,imgtitle,index){
		var obj = this;
		var opts = this.opts;
		var animateOpst={};
		console.log(this.opts);
		var objImg = new Image();
		objImg.src=imgurl[index];
		var imgW,imgH;
		objImg.onload=function(){
			$('#wdimagesview-mask').show();
			imgW = this.width;
			imgH = this.height;
			$('#wdimagesview-closed').fadeIn();
			$('.wdimagesview-arr').fadeIn();
			obj.showImg(imgW,imgH);			
		}
	}
	
	wdImageView.prototype.showImg = function (imgW,imgH){
		var Obj = this;
		var opts = this.opts;
		$('#imgbox img').hide();
		$('#wdimagesview-main').show();
		$wd=$(window).width();
		$ht=$(window).height();
		imgH=imgH*$wd*0.96/imgW;
		imgW=$wd*0.96;
		if(imgH>$ht){	
			imgW=imgW*$ht*0.86/imgH;
			imgH=$ht*0.86;
		}
		
		$('#wdimagesview-main').animate({
			width:imgW,
			height:imgH,
			marginLeft:-imgW/2,
			marginTop:-imgH/2
		},300,'linear',function (){		
			$('#imgbox img').show().attr('src',wdimgArr[arrIndex]);
			$('#imgtitle').empty().append(wdimgTitle[arrIndex]);
		})
		
	}
	
	//下一张图片
	wdImageView.prototype.clickNext = function (){
		var Obj = this;
		var opst = this.opts;
		$(document).on('click','#wdNext',function(){
			if(!$('#wdimagesview-main').is(':animated')){
				var arrLen = wdimgArr.length;
				if(arrIndex==(arrLen-1)){
					Obj.loadimg(wdimgArr,wdimgTitle,arrIndex);
				}else{
					console.log(arrIndex);
					console.log(wdimgArr);
					console.log(wdimgTitle);
					arrIndex = arrIndex+1;
					if(arrIndex<arrLen){
						console.log('nextdo')
						Obj.loadimg(wdimgArr,wdimgTitle,arrIndex);
					}
				}
			}
		})
	}
	
	//上一张图片
	wdImageView.prototype.clickPrev = function (){
		var Obj = this;
		var opst = this.opts;
		$(document).on('click','#wdPrev',function(){
			if(!$('#wdimagesview-main').is(':animated')){
				if(arrIndex==0){
					Obj.loadimg(wdimgArr,wdimgTitle,arrIndex);
				}else{
					arrIndex = arrIndex-1;
					console.log(arrIndex);
					console.log(wdimgArr);
					console.log(wdimgTitle);
					if(arrIndex>-1){
						console.log('Prevdo')
						Obj.loadimg(wdimgArr,wdimgTitle,arrIndex);
					}
				}
			}
		})
	}
	
	//关闭
	wdImageView.prototype.clickClosed=function (){
		var Obj = this;
		$('#wdimagesview-closed,#wdimagesview-mask').on('click',function (){
			Obj.allClosed();
		});
	}
	
	wdImageView.prototype.allClosed = function (){
		var opts = this.opts;
		var Obj = this;
		var animateOpst={};
		$('#wdimagesview-main').hide();
		$('#wdimagesview-closed').hide();
		$('.wdimagesview-arr').hide();
		$('#wdimagesview-main').css({
			width:400,
			height:300,
			marginLeft:-200,
			marginTop:-150
		})
		$('#wdimagesview-mask').hide();
		$('#imgbox img').hide();
		$('#imgtitle').empty();
	}
	
	//默认参数
	wdImageView.prototype.defined={
		dom:'a',
		group:'rel',
		item:'href',
		title:'reltitle',
		showtitle:false,
		time:'1000',
		path:'',//图片相对路径
		loadimg:function(){}
	}
	
	//生成是JQ组件
	$.extend({
		wdImageView:function(opts){
			return new wdImageView(opts);
		}
	})
	
	//为原生数组添加查找数组方法，如果查找到就返回数组下标
	Array.prototype.search = function (value) {
		var i = this.length;
		while (i--) {
			if (this[i] == value) {
				return i;
			}
		}
		return -1;
	}
	
})(jQuery)

