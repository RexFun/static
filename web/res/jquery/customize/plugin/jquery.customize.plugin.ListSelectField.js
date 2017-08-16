(function($){
	/* 定义列表选择框 */
	function ListSelectField($el, cfg) {
		// 返回值
		var result = [];
		var resultIds = [];
		var resultNames = [];
		// 默认设置
		var def = {
    		id: "",
    		title: "列表选择器",
    	    url: "",
//    	    fk: null,
//    	    cascadeid: null,
    	    check: true,
    	    multi: true,
    	    rowType: "map", // object | map
    	    resultKey: "obj",
    	    queryParams: function(p) {return p;},
    	    columns: 
    	    [
			    {title:'ID', field:'m.id', align:'center', valign:'middle', sortable:false},
			    {title:'名称', field:'m.name', align:'center', valign:'middle', sortable:false}
			],
    	    pageList: "[10,20,50,100]",
    	    pageNumber: 1,
    	    pageSize: 10,
    	    callback: {
    	    	onConfirm: function(data) {
    	    	}
    	    }
		};
		// 覆盖设置
		var opt = $.extend(def, cfg);
		
    	// WIN默认设置
    	var win_cfg = {
    		id: opt.id,
    		title: opt.title,
    	    url: opt.url,
//    	    fk: opt.fk,
//    	    cascadeid: opt.cascadeid,
    	    check: opt.check,
    	    multi: opt.multi,
    	    rowType: opt.rowType,
    	    queryParams: opt.queryParams,
    	    columns: opt.columns,
    	    pageList: opt.pageList,
    	    pageNumber: opt.pageNumber,
    	    pageSize: opt.pageSize,
    	    callback: {
    	    	onLoadSuccess: function() {},
        	    onLoadError: function(status) {},
        	    onConfirm: function(data) {
        	    	// 
        	    	result = data;
    				resultIds.length = 0;
    				resultNames.length = 0;
    				$.each(data, function(k, v) {
    					resultIds.push(v.id);
    					resultNames.push(v.name);
    				});
    				// 赋值至对应input hidden中
    				$("#f_"+$el.attr("id")).val(resultIds);
    				$el.val(resultNames);
    				// 调用ListSelectField回调函数
    				opt.callback.onConfirm(data);
        	    }
    	    }
        };
        // 初始化弹窗
        var win = initListSelectModal($el, win_cfg);
        
        // 附加隐藏域以存储表单值
        $el.after("<input type=\"hidden\" id=\"f_"+$el.attr("id")+"\" name=\"f_"+$el.attr("id")+"\" value=\"\" />");
        // 获取焦点时显示
    	$el.focus(function(){
    		win.reload();
    		win.show();
    	});
    	
    	/******************************************** 
    	 * Public Fn
    	 * ******************************************/
		this.getSelections = function(resultKey) {
			var val = [];
			if (resultKey == "obj" || resultKey==null) {
				val = result;
			} else {
				$.each(result, function(k, v) {
					val.push(v[resultKey]);
				});
			}
			return val;
		};
	}
	
    /* 实例化 */
    $.fn.ListSelectField = function(cfg) {
    	return new ListSelectField($(this), cfg);
    };
    
    /******************************************** 
     * Private Fn
     * 画窗口<option></option>
     * ******************************************/
    function initListSelectModal($el, cfg) {
    	return $el.ListSelectModal(cfg);
    }
})(jQuery);
