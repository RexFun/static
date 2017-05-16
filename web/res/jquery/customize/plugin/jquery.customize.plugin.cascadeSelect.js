(function($){
    /* 下拉选择框 */
    $.fn.cascadeSelect = function(cfg){
    	// 默认设置
    	var def = {
    	    data:[],    // 全数据
    	    newdata:[], // 新数据
    	    fk:null,
    	    cascadeid:null,
    		k:"name",
    		v:"id"
        };  
        var opt = $.extend(def,cfg); 
        // 获取当前对象
    	$el = $(this);
    	// 获取级联元素id
    	var _cascadeid = $el.attr("cascadeid");
    	if (typeof(_cascadeid)!="undefined") opt.cascadeid = _cascadeid;
    	// 监听级联元素change事件，reload下拉列表
    	if (opt.cascadeid!=null){
    		$("#"+opt.cascadeid).change(function(){
    			var pk = $(this).val();
    	    	reload($el, opt, pk);
    		});
    	} else {
    		alert("Plugin [cascadeSelect] attr 'cascadeid' not allow null!");
    		return false;
    	}
    	// 监听表单reset事件，reload下拉列表为默认值
    	$("button[type='reset']").on('click', function() {
    		reload($el, opt, null);
    	});
    	// 返回
    	return this;
    };
    
    /**
     * 重新加载
     */ 
    function reload($el, opt, pk){
    	var data = opt.data;
    	opt.newdata = [];
    	if (pk!=null && pk!="") {
	    	for(var i=0; i<data.length; i++){
	    		if(data[i][opt.fk]==pk) opt.newdata.push(data[i]);
	    	}
    	} else {
    		opt.newdata = data;
    	}
    	$el.empty();
    	$el.append("<option value=\"\">请选择</option>");
    	for(var j=0; j<opt.newdata.length; j++){
    		$el.append("<option value=\""+opt.newdata[j][opt.v]+"\">"+opt.newdata[j][opt.k]+"</option>");
    	}
    }
})(jQuery);
