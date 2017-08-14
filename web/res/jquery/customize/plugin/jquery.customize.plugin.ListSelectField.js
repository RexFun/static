(function($){
	/* 定义列表选择框 */
	function ListSelectField($el, cfg) {
    	// 默认设置
    	var def = {
    		id : "",
    		title : "列表选择器",
    	    url : "",
    	    fk : null,
    	    cascadeid : null,
    	    check : true,
    	    multi : true,
    	    rowType : "map", // object | map
    	    queryParams : function(p){return p;},
    	    columns : [
					    {title:'ID', field:'m.id', align:'center', valign:'middle', sortable:false},
					    {title:'名称', field:'m.name', align:'center', valign:'middle', sortable:false}
					  ],
    	    pageList : "[10,20,50,100]",
    	    pageNumber : 1,
    	    pageSize : 10,
    	    callback : {
		    	    	onLoadSuccess : function(){},
		        	    onLoadError	: function(status){},
		        	    onConfirm : function(data){
		    				var resultIds = [];
		    				var resultNames = [];
		    				$.each(data, function(k, v) {
		    					resultIds.push(v.id);
		    					resultNames.push(v.name);
		    				});
		    				$("#f_"+$el.attr("id")).val(resultIds);
		    				$el.val(resultNames);
		        	    }
    		}
        };
    	// 覆盖设置
        var opt = $.extend(def, cfg);
        // 附加隐藏域以存储表单值
        $el.after("<input type=\"hidden\" id=\"f_"+$el.attr("id")+"\" name=\"f_"+$el.attr("id")+"\" value=\"\" />");
        // 画Modal
        var win = initListSelectModal($el, opt);
        // 获取焦点时显示
    	$el.focus(function(){
    		win.show();
    	});
    	
    	/******************************************** 
    	 * Public Fn
    	 * ******************************************/
		this.show = function() {
			win.show();
		};
		this.hide = function() {
			win.hide();
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
    function initListSelectModal($el, cfg){
    	return $el.ListSelectModal(cfg);
    }
})(jQuery);
