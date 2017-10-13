/*
	Author: Jacky Jiang
	ver 0.3
*/
var SystemManager=(function(){

	function get_cookie_val(offset)
	{
		var endstr = document.cookie.indexOf (";", offset);
		if (endstr == -1)
		endstr = document.cookie.length;
		return unescape(document.cookie.substring(offset, endstr));
	}

	function set_cookie(name, value)
	{
		var expdate = new Date();
		var argv = set_cookie.arguments;
		var argc = set_cookie.arguments.length;
		var expires = (argc > 2) ? argv[2] : null;
		var path = (argc > 3) ? argv[3] : null;
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		if(expires!=null) expdate.setTime(expdate.getTime() + ( expires * 1000 ));
		document.cookie = name + "=" + escape (value) +((expires == null) ? "" : ("; expires="+ expdate.toGMTString()))
		+((path == null) ? "" : ("; path=" + path)) +((domain == null) ? "" : ("; domain=" + domain))
		+((secure == true) ? "; secure" : "");
	}
	function delete_cookie(name)
	{
		var exp = new Date();
		exp.setTime (exp.getTime() - 1);
		var cval = get_cookie (name);
		document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
	}
	function get_cookie(name)
	{
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen)
		{
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
		return get_cookie_val(j);
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) break;
		}
		return null;
	}

	function toggle_demo_mode()
	{
		var is_demo_mode=get_cookie('is_demo_mode');
		is_demo_mode=(is_demo_mode=='1')?'0':'1';
		set_cookie('is_demo_mode',is_demo_mode);
		location=location.href;
	}
	
	var is_ready=false;
	var ready_handler_list=[];
	
	jQuery(function(){
		try{
			is_ready=true;	
			if(ready_handler_list && ready_handler_list.length)
				for(var i=0;i<ready_handler_list.length;i++) exec_ready_handler(ready_handler_list[i]);
		}catch(e){}
	});
	
	function exec_ready_handler(func)
	{
		try{
			if(func && typeof func=='function') func();
		}catch(e){
			try{
				console.log(e.stack);
			}catch(e){}
		}
	}
	
	function add_ready_handler(func)
	{
		if(is_ready) exec_ready_handler(func);
		else ready_handler_list.push(func);
	}
	
	function init(on_ready,is_defer)
	{
		if(is_defer) _.defer(function(){
			add_ready_handler(on_ready);
		});
		else add_ready_handler(on_ready);
	}
	
	init.toggle_demo_mode=toggle_demo_mode;
	init.get_cookie=get_cookie;
	init.set_cookie=set_cookie;
	init.delete_cookie=delete_cookie;
	
	init.parse_number=function(n)
	{
		if(typeof n=='number') return n;
		if(!n) return 0;
		n=parseFloat(n);
		if(isNaN(n)) n=0;
		return n;
	}
	
	init.load_script=function(scripts,afterOrName,name)
	{
		if(!scripts) return;
		if(typeof scripts=='string') {
			scripts=[scripts];
		}
		if(typeof scripts!='object' || !scripts['length']) return;
		for(var i=0;i<scripts['length'];i++){
			jQuery('<script></script>').attr('src',scripts[i]).appendTo('body');
		}
	}
	
	init.ready=function(a,b)
	{
		add_ready_handler(on_ready);
	}
	
	init.all_ready=function(on_ready){
		add_ready_handler(on_ready);
	};
	
	function all_ready(f)
	{
		$script.ready(['core', 'plugins_dependency', 'plugins','bundle'],function(){
			jQuery(function(){
				try{
					if(f) f();
				}catch(e){
					try{
						console.log(e.stack);
					}catch(e){}
				}
			});
		});
	}
	
	function Querystring(qs) { // optionally pass a querystring to parse
		this.params = {};
		
		if (qs == null) qs = location.search.substring(1, location.search.length);
		if (qs.length == 0) return;
	
	// Turn <plus> back to <space>
	// See: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.13.4.1
		qs = qs.replace(/\+/g, ' ');
		var args = qs.split('&'); // parse out name/value pairs separated via &
		
	// split out each name=value pair
		for (var i = 0; i < args.length; i++) {
			var pair = args[i].split('=');
			var name = decodeURIComponent(pair[0]);
			
			var value = (pair.length==2)
				? decodeURIComponent(pair[1])
				: '';
			
			this.params[name] = value;
		}
	}
	
	Querystring.prototype.get = function(key, default_) {
		var value = this.params[key];
		return (value != null) ? value : default_;
	}
	
	Querystring.prototype.contains = function(key) {
		var value = this.params[key];
		return (value != null);
	}
	
	var qs=null;
	
	function get_query_param(name)
	{
		if(qs==null) qs=new Querystring();
		return qs.get(name);
	}
	
	function isset_query_param(name)
	{
		if(qs==null) qs=new Querystring();
		return qs.contains(name);
	}
	
	init.get_query_param=get_query_param;
	init.isset_query_param=isset_query_param;
	
	var settings={};
	
	init.get_setting=function(name)
	{
		return settings[name];
	}
	
	init.set_setting=function(name,value)
	{
		settings[name]=value;	
	}
	
	init.isset_setting=function(name){
		if(typeof settings[name]=='undefined') return false;
		return true
	}
	
	init.is_render_server=false;
	
	try{
		if((''+navigator.userAgent).indexOf('RenderServer')!=-1) init.is_render_server=true;
	}catch(e){}
	
	return init;
	
}());