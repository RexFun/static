$chok.view.get = {};
/* **************************************************************************************************************
 * config
 * */
$chok.view.get.config = {};
$chok.view.get.config.curPageNum = 1;//配置初始页码
$chok.view.get.config.curPageSize = 10;//配置每页行数
$chok.view.get.config.setPreFormParams = function(){};//保留上次表单参数
$chok.view.get.config.formParams = function(p){return p;};//配置表单参数
$chok.view.get.config.urlParams = function(){return {};};//配置url表单参数
$chok.view.get.config.tableColumns = [];//配置表格列//配置行菜单
$chok.view.get.config.operateFormatter = function(value, row, index){
    return [
	        "<div class='btn-group btn-group-xs'>",
	        "<button type='button' class='btn btn-default dropdown-toggle tb_ctx_menu_btn' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>",
	        "<span class='caret'></span>",
	        "<span class='sr-only'>Toggle Dropdown</span>",
	        "</button>",
	        "</div>"
		    ].join('');
};
/* *
 * callback
 * */
$chok.view.get.callback = {};
//删除行回调
$chok.view.get.callback.delRows = function(){
};
//翻页回调
$chok.view.get.callback.onPageChange = function(number,size){
	$chok.view.get.config.curPageNum = number; 
	$chok.view.get.config.curPageSize = size
};
//加载成功回调
$chok.view.get.callback.onLoadSuccess = function(){
};
//加载失败回调
$chok.view.get.callback.onLoadError = function(status){
};
//编辑单元格后回调
$chok.view.get.callback.onEditableSave = function(field, row, oldValue, $el){
	var key = field.split(".")[1];
	row.m[key] = row[field];
    $.ajax({
        type: "post",
        url: "upd2.action",
        data: row,
        dataType: 'JSON',
        success: function (data, status) {
            if (status=="success") {
                alert($chok.checkResult(data));
                $("#tb_list").bootstrapTable('refresh'); // 刷新table
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            /*弹出jqXHR对象的信息*/
            alert($chok.checkResult(jqXHR.responseText));
//            alert(jqXHR.status);
//            alert(jqXHR.readyState);
//            alert(jqXHR.statusText);
            /*弹出其他两个参数的信息*/
//            alert(textStatus);
//            alert(errorThrown);
        }
    });
};
//右键菜单点击事件 
$chok.view.get.callback.onContextMenuItem = function(row, $el){
	if ($el.data("item")=="upd"){
		location.href = "upd1.action?id="+row.m.id+"&"+$chok.view.get.fn.getUrlParams();
	} else if ($el.data("item")=="getById"){
		location.href = "getById.action?id="+row.m.id+"&"+$chok.view.get.fn.getUrlParams();
	}
};
/* **************************************************************************************************************
 * init
 * */
$chok.view.get.init = {};
/* 初始化查询窗口 */
$chok.view.get.init.modalFormQuery = function(){
	$chok.view.get.config.setPreFormParams();
	$("#form_query").submit(function(e){
		e.preventDefault();
		$("#form_query_btn").click();
	});
	$("#form_query_btn").click(function(){
		$('#modal_form_query').modal('hide');
        $("#tb_list").bootstrapTable('selectPage', 1);
	});
};
/* 初始化工具栏 */
$chok.view.get.init.toolbar = function(){
	$("#bar_btn_add").click(function(){
		location.href = "add1.action?"+$chok.view.get.fn.getUrlParams();
	});
	$("#bar_btn_del").click(function(){
		if($chok.view.get.fn.getIdSelections().length<1) {
			alert("没选择");
			return;
		}
		if(!confirm("确认删除？")) return;
		$.post("del.action",{id:$chok.view.get.fn.getIdSelections()},function(result){
	        $chok.view.get.callback.delRows(result); // 删除行回调
	        if(!result.success) return;
	        $("#tb_list").bootstrapTable('refresh'); // 刷新table
		});
	});
};
/* 初始化数据表 */
//自定义ajax
function ajaxRequest(params){
    //访问服务器获取所需要的数据
    //比如使用$.ajax获得请求某个url获得数据
    $.ajax({
        type : 'post',
        url : 'getJson.action',
        data : params.data,
        success : function(result){
        	if(result.success==false){
        		alert(result.msg);
        		return;
        	}
            //表格加载数据
            params.success({
                total : result.total,
                rows : result.rows
            });
        }
    });
}
$chok.view.get.init.table = function(pageNum, pageSize){
	if(pageNum != null && pageNum != "") {$chok.view.get.config.curPageNum = parseInt(pageNum);}
	if(pageSize != null && pageSize != "") {$chok.view.get.config.curPageSize = parseInt(pageSize);}
	var thisColumns = $chok.view.get.fn.getColumns();
	$('#tb_list').bootstrapTable({
		height:getGlobalHeight("table"),
		contextMenu:"#tb_ctx_menu",
		contextMenuButton: '.tb_ctx_menu_btn',
		contentType:"application/x-www-form-urlencoded",//用post，必须采用此参数
		ajax : "ajaxRequest",//自定义ajax
		sidePagination:"server",
		toolbar:"#toolbar",
        showRefresh:true,
        showToggle:true,
        showColumns:true,
        showExport:true,
		striped:true,
		pagination:true,
		pageList:"[5,10,20,50,100]",
		pageNumber:$chok.view.get.config.curPageNum,
		pageSize:$chok.view.get.config.curPageSize,
	    queryParams:$chok.view.get.config.formParams,
	    columns:thisColumns,
	    onPageChange:$chok.view.get.callback.onPageChange,
	    onLoadSuccess:$chok.view.get.callback.onLoadSuccess,
	    onLoadError:$chok.view.get.callback.onLoadError,
        onEditableSave:$chok.view.get.callback.onEditableSave,
        onContextMenuItem:$chok.view.get.callback.onContextMenuItem
	});
	//随窗口resize 改变 高度
	$(window).resize(function () {
		$('#tb_list').bootstrapTable('resetView', {height: getGlobalHeight("table")});
	});
};

/* **************************************************************************************************************
 * fn
 * */
$chok.view.get.fn = {};
// 获取已选行的ID集合
$chok.view.get.fn.getIdSelections = function(){
    return $.map($("#tb_list").bootstrapTable('getSelections'), function (row) {
        return row.m.id
    });
};
// 获取表格列
$chok.view.get.fn.getColumns = function(){
	var columns = 
		[
	     {checkbox:true, align:'center', valign:'middle'},
	     {title:'操作', field:'operate', align:'center', valign:'middle', width:'50', events:$chok.view.get.config.operateEvents, formatter:$chok.view.get.config.operateFormatter}
		];
	return $.merge(columns,$chok.view.get.config.tableColumns);
};
// 获取url表单参数字符串
$chok.view.get.fn.getUrlParams = function(){
	var params = $chok.view.get.config.urlParams();
	params = $.extend(params, {menuId	    : $chok.view.menuId,
							   menuPermitId : $chok.view.menuPermitId,
							   menuName	    : $chok.view.menuName,
							   f_page       : $chok.view.get.config.curPageNum,
							   f_pageSize   : $chok.view.get.config.curPageSize});
	var paramsStr = "";
	$.map(params, function(value, key){
		paramsStr += key+"="+value+"&";
	});
	paramsStr = paramsStr.substr(0,paramsStr.length-1);//去除最后一个&号
	return paramsStr;
};