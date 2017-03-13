$chok.form = {};
$chok.form.callback = function(){};
$chok.result = {type:"", msg:""};
$chok.checkResult = function(responseText){
	$chok.result = {type:"", msg:""};
	try{
		var _msg = "", _arr = (responseText + "").split(":");
		if(_arr.length > 1){_msg = _arr[1];}
		else{switch(_arr[0]){
			case "0": _msg = "操作失败！";break;
			case "1": _msg = "操作成功！";break;
			default: _msg = (!isNaN(_arr[0]))?"":_arr[0];
		}}
		$chok.result = {type:_arr[0], msg:_msg};
	}
	catch(e){$chok.result = {type:"", msg:""};}
	return $chok.result.msg;
};
$(function(){
	$('input:text:first').focus(); //把焦点放在第一个文本框
	$('input').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
	    var key = e.which; //e.which是按键的值
	    if (key == 13) {
	    	$("#dataFormSave").click();
	    }
	});
	$("#dataFormSave").click(function () {
		if(!$chok.validator.check()) {
			alert("表单信息不完整！");
			return;
		}
        var options = {
            url: $("#dataForm").attr("action"),
            type: 'post',
            dataType: 'text',
            data: $("#dataForm").serialize(),
            enctype: $("#dataForm").attr("enctype"),
            success: function (data) {
            	alert($chok.checkResult(data));
                $chok.form.callback();
            }
        };
        $("#dataForm").ajaxSubmit(options);
        return false;
    });
	$("#dataForm").submit(function(e){
		e.preventDefault();try{$("#dataFormSave").click();}catch(e){}
	});
	$("#form_del").submit(function(e){
		e.preventDefault();
        var options = {
            url: $("#form_del").attr("action"),
            type: 'post',
            dataType: 'text',
            data: $("#form_del").serialize(),
            success: function (data) {
            	alert($chok.checkResult(data));
                $chok.form.callback();
            }
        };
        $.ajax(options);
        return false;
	});
});
