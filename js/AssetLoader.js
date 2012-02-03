/**
 * @author ymutlu
 */

var YM = YM || {};

(function(window){
	
	Loader.prototype.loadedImages = [];
	Loader.prototype.onLoad = null;
	Loader.prototype.onComplete = null;
	
	function Loader (){
		var queueTotal;
		var queue;
		var queuePointer = 0;
		var imgList;
		var that;
		var name;
		var image;
		var loadedImages = [];
		that = this;
		var _isComplete = false;
		
		this.getName = function(){
			return name;
		}
		this.isComplete = function() {
			return _isComplete;
		}
		this.getImage = function(n){
			var num = parseInt(n);
			if(num >= 0 && loadedImages.length > num){
				return loadedImages[num];
			}else{
				for(var i = 0 ; i < queue.length && i < loadedImages.length ; i++){
					if(queue[i].name == n || queue[i].src == n || queue[i] == n){
						return loadedImages[i];
					}
				}
			}
		}
		
		this.start = function(){
			that.load();
		}
		
		this.load = function(){
			image = new Image();
			if(queue[queuePointer].src)
				image.src = queue[queuePointer++].src;
			else
				image.src = queue[queuePointer++];
			image.onload = _onLoad;
			image.onProgress = this.onProgress;
		}
		
		var setQueue = function(arr){
			queue = arr;
			queueLeft = queueTotal = arr.length;
		}
		
		var _onLoad = function(e){
			loadedImages.push(image);
			if(that.onLoad)
				that.onLoad(image);
			if(queuePointer == queueTotal){
				_isComplete = true;
				if(that.onComplete)
					that.onComplete();
			}else{
				if(that.load)
					that.load();
			}
		}
		
		var setName = function(n){
			if(n){
				name = n;
			}else{
				name = "ImageLoader_"+Loader.ID++;
			}
		};
		
		this.setLoader = function (arr , name , $onLoad ,$onComplete){
			setName(name);
			setQueue(arr);
			if($onComplete)
				this.onComplete = $onComplete;
			if($onLoad)
				this.onLoad = $onLoad;
		}
		
	}
	
	Loader.ID = 0;
	/**
	 * 
	 * @param arr urls of images usage: ["url1","url2"] or [{src:"url1",name:"name1"},{src:"url2",name:"name2"}]
	 * @param name loader name to be able to get loader with static method Loader.getLoader
	 * @param onLoad this function will be called for each item load, and it ll get image parameter.
	 * @param onComplete this function will be called when all loads are finished.
	 * @return will return a loader object. {"start":start , "getImage":getImage , "name":name, "isComplete":isComplete}
	 * 
	 */
	Loader.load = function(arr , name , onLoad, onComplete){
		var loader = new Loader();
		loaders.push(loader);
		loader.setLoader(arr,name,onLoad,onComplete);
		return {"start":loader.start , "getImage":loader.getImage , "name":loader.getName(), "isComplete":loader.isComplete};
	}
	
	var loaders = [];
	
	/**
	 * 
	 * @param name Loader's name that you specified before or ID.
	 * @return loader that has the specified name or ID.
	 * 
	 */
	
	Loader.getLoader = function (name){
		var loader;
		var num;
		for(var i = 0 ; i < loaders.length; i++){
			if(name == loaders[i].getName() || "ImageLoader_"+name == loaders[i].getName()){ //|| ((num = parseInt(n)) && loaders.length > num)
				return {"start":loaders[i].start , "getImage":loaders[i].getImage , "name":loaders[i].getName(), "isComplete":loaders[i].isComplete};
			}
		}
	}
	
	YM.Loader = Loader;
}(window))
