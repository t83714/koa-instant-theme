/*
	Author: Jacky
	Ver: 0.5 (Pure jQuery UI version)
	RE-written POST data for IE compatibility issue
*/
var PopUpManager;
(function(){
	
	var app_show_message_div=null;
	var app_confirm_message_div=null;
	var app_show_loading_div=null;
	
	try{
		var i=new Image();
		i.src='koa-instant-theme/images/ajax-loader.gif';
	}catch(e){}
	
	function show_message(msg,title,ok_func)
	{
		if(!title) title="Message";
		if(!app_show_message_div){
			app_show_message_div=jQuery('<div style="display:none;padding-top:15px;padding-bottom:15px;"></div>');
			jQuery('body').append(app_show_message_div);
			jQuery(app_show_message_div).dialog({
				modal: true,
				autoOpen: false
			});
		}
		app_show_message_div.html("<div>"+msg+"</div>");
		jQuery(app_show_message_div).dialog('option',{
			'title':title,
			'buttons': {
				'Ok': function() {
					jQuery(this).dialog('close');
					if(ok_func) ok_func();
				}
			}
		});
		jQuery(app_show_message_div).dialog('open');
	}
	
	function show_loading_box(msg,title,cancel_func)
	{
		if(!msg) msg="Saving data...";
		if(!title) title="Saving data, please wait...";
		if(!app_show_loading_div){
			app_show_loading_div=jQuery('<div style="display:none;"></div>').attr('title',title);
			jQuery('body').append(app_show_loading_div);
			var options={
				modal: true,
				autoOpen: false,
				closeOnEscape:false,
				width:490
			};
			jQuery(app_show_loading_div).dialog(options);
		}
		app_show_loading_div.html('<center style="padding-top:30px;"><img src="images/ajax-loader.gif" border="0"/><div><b>'+msg+'</b></div><br/><br/></center>');
		jQuery(app_show_loading_div).dialog('option',{'title': title});
		if(cancel_func){
			jQuery(app_show_loading_div).dialog('option',{
				'buttons': {
					'Cancel': function() {
						jQuery(this).dialog("close");
						cancel_func();
					}
				}
			});
		}
		jQuery(app_show_loading_div).dialog('open');
	}
	
	function close_loading_box()
	{
		jQuery(app_show_loading_div).dialog('close');
	}
	
	function confirm(msg,title,yes_func,no_func)
	{
		if(!title) title="Please confirm:";
		if(!app_confirm_message_div){
			app_confirm_message_div=jQuery('<div style="display:none;padding-top:15px;padding-bottom:15px;"></div>').attr('title',title);
			jQuery('body').append(app_confirm_message_div);
			jQuery(app_confirm_message_div).dialog({
				modal: true,
				autoOpen: false
			});
		}
		app_confirm_message_div.html("<div>"+msg+"</div>");
		jQuery(app_confirm_message_div).dialog('option',{
			'title':title,
			'buttons': {
					'YES': function() {
						jQuery( this ).dialog( "close" );
						if(yes_func) yes_func();
					},
					'NO' : function() {
						jQuery( this ).dialog( "close" );
						if(no_func) no_func();
					}
				}
		});
		jQuery(app_confirm_message_div).dialog('open');
	}
	
	var app_prompt_message_div=null;
	var app_prompt_message_div_tpl='<div style="display:none;padding-top:15px;padding-bottom:15px;">'+
	'<div class="msg_area">&nbsp;</div>'+
	'<div><input type="text" name="user_input" class="form-control" /></div>'+
	'</div>';
	
	function prompt(msg,title,yes_func,no_func,default_value)
	{
		if(!title) title="Please provide required info to continue:";
		if(!app_prompt_message_div){
			app_prompt_message_div=jQuery(app_prompt_message_div_tpl).attr('title',title);
			jQuery('body').append(app_prompt_message_div);
			jQuery(app_prompt_message_div).dialog({
				modal: true,
				autoOpen: false,
				width:460
			});
		}
		if(default_value) app_prompt_message_div.find('input[name="user_input"]').val(default_value);
		else app_prompt_message_div.find('input[name="user_input"]').val('');
		app_prompt_message_div.find('.msg_area').html(msg);
		jQuery(app_prompt_message_div).dialog('option',{
			'title':title,
			'buttons': {
					'OK': function() {
						jQuery(this).dialog("close");
						var v=jQuery.trim(jQuery(this).find('input[name="user_input"]').val());
						if(yes_func) yes_func(v);
					},
					'Cancel' : function() {
						jQuery(this).dialog("close");
						var v=jQuery.trim(jQuery(this).find('input[name="user_input"]').val());
						if(no_func) no_func(v);
					}
				}
		});
		jQuery(app_prompt_message_div).dialog('open');
	}
	
	var windows={};
	
	function open(url,win_name,width,height)
	{
		if(width<0) width=screen.availWidth-10;
		if(height<0) height=screen.availHeight-10;
		if(!width) width=1100;
		if(!height) height=800;
		var setting="resizable=yes,toolbar=no,location=no,menubar=no,scrollbars=yes,width="+width+",height="+height+",left=0,top=0";;
		if(!win_name) win_name='_blank';
		win_name=win_name.replace(/\W/g,'_');
		var key;
		if(win_name=='_blank') key='_blank'+Math.random();
		else key=win_name;
		var win=window.open(url,win_name,setting);
		if(!win || win.closed) {
			show_message('Popup window was blocked by your browser, please change your browser setting and try again!','Cannot open popup window!');
			return;
		}
		win.focus();
		return win;
	}
	
	var auto_post_form=null;
	
	function get_auto_post_form()
	{
		if(!auto_post_form) auto_post_form=jQuery('<form method="POST" style="padding:0px;margin:0px;border-width:0px;border-style:none;"></form>').appendTo('body');
		return auto_post_form;
	}
	
	function post(url,data,win_name,width,height)
	{
		if(!win_name) win_name='_blank';
		win_name=win_name.replace(/\W/g,'_');
		if(!data) data=[];
		var win=open('',win_name,width,height);
		if(!win) return null;
		var f=get_auto_post_form();
		f.attr({
			'action':url,
			'target':win_name
		}).html('');
		if(!_.isEmpty(data)){
			var name,value;
			if(_.isArray(data))
				for(var i=0;i<data.length;i++){
					name=data[i]['name'];
					value=data[i]['value'];
					jQuery('<input type="hidden" />').attr({
						'name':name,
						'value':value
					}).appendTo(f);
				}
			else for(var index in data){
				name=index;
				value=data[index];
				jQuery('<input type="hidden" />').attr({
					'name':name,
					'value':value
				}).appendTo(f);
			}
		}
		f.get(0).submit();
		return win;
	}
	
	jQuery(function(){
		jQuery(document).on('click','a.popup_window_links',function(event){
			event.preventDefault();
			var obj=jQuery(this);
			var url=obj.attr('href');
			if(!event['shiftKey']){
				var win_name=obj.data('name')?obj.attr('name'):('popup_window_'+url);
			}else{
				var win_name=window['name']?window['name']:'new_popup';	
			}
			var width=obj.data('win_width');
			width=width?width:1100;
			var height=obj.data('win_height');
			height=height?height:800;
			PopUpManager.open(url,win_name,width,height);
		});
		jQuery(document).on('click','.popup_window_clickables',function(event){
			event.preventDefault();
			var obj=jQuery(this);
			var url=obj.data('url');
			if(!url) return;
			if(!event['shiftKey']){
				var win_name=obj.data('name')?obj.attr('name'):('popup_window_'+url);
			}else{
				var win_name=window['name']?window['name']:'new_popup';	
			}
			var width=obj.data('win_width');
			width=width?width:1100;
			var height=obj.data('win_height');
			height=height?height:800;
			PopUpManager.open(url,win_name,width,height);
		});
	});
	
	PopUpManager={
		'show_message' : show_message,
		'show_loading_box' : show_loading_box,
		'close_loading_box' : close_loading_box,
		'hide_loading_box' : close_loading_box,
		'confirm' : confirm,
		'prompt' : prompt,
		'open':open,
		'post':post
	};
	
}());