(function($){
    /* 下拉选择框 */
    $.fn.DropDownSelect = function(cfg){
    	// 默认设置
    	var def = {
    	    url:null,
    	    fk:null,
    	    cascadeid:null,
    		k:"name",
    		v:"id",
    		callback:{
    			afterload:function(){}
    		}
        };  
        var opt = $.extend(def,cfg); 
        // 获取当前对象
    	$el = $(this);
    	// 首次加载
    	reload($el, opt, null);
    	// 获取级联元素id
    	var _cascadeid = $el.attr("cascadeid");
    	if (typeof(_cascadeid)!="undefined") opt.cascadeid = _cascadeid;
    	// 监听级联元素change事件，reload下拉列表
    	if (opt.cascadeid!=null){
    		$("#"+opt.cascadeid).change(function(){
    			var pk = $(this).val();
    	    	reload($el, opt, pk);
    		});
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
    function reload($el, opt, pk) {
    	var param = {};
    	if(opt.fk!=null) param[opt.fk] = pk;
    	
    	$.ajax({
    		url: opt.url,
    		data:param,
    		success: function(result,status,xhr) {
    			console.info(result);
    	    	$el.empty();
    	    	$el.append("<option value=\"\">请选择</option>");
    	    	for(var i=0; i<result.length; i++){
    	    		$el.append("<option value=\""+result[i][opt.v]+"\">"+result[i][opt.k]+"</option>");
    	    	}
    	    	// 调用回调函数
    	    	opt.callback.afterload();
    		},
    		error: function(xhr,status,error) {
    		}
    	});
    }
})(jQuery);
