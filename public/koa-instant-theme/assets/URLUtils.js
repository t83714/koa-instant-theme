/*
	ver:0.0.0.4
	Jacky
*/
var URLUtils=(function(){
	
	var init=function(){}
	
	var parse_options={
		strictMode: false,
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};
	
	function parse(str)
	{
		var	o = parse_options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;
	
		while (i--) uri[o.key[i]] = m[i] || "";
	
		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});
		
		var query_data={};
		for(var index in uri['queryKey']) query_data[decodeURIComponent(index)]=decodeURIComponent(uri['queryKey'][index]);
		uri['queryKey']=query_data;
		
		return uri;
	}
	
	function remove_component(url,name)
	{
		if(!url) return;
		if(!name) return url;
		if(typeof(name)!='string' && !name.length) return url;
		if(typeof(name)!='string' && name.length<1) return url;
		var info=parse(url);
		if(!info) return;
		var q_str_arr=[];
		var i,j,found;
		for(i in info['queryKey']) {
			if(typeof(name)=='string'){
				if(i!=name) q_str_arr.push(encodeURI(i)+(info['queryKey'][i]?'='+encodeURI(info['queryKey'][i]):''));
			}else{
				found=false;
				for(j=0;j<name.length;j++) if(i==name[j]) found=true;
				if(!found) q_str_arr.push(encodeURI(i)+(info['queryKey'][i]?'='+encodeURI(info['queryKey'][i]):''));
			}
		}
		var q_str=q_str_arr.join('&');
		q_str=q_str? ('?'+q_str) : '';
		return (info['protocol']?(info['protocol']+'://'):'')+info['authority']+info['path']+q_str+(info['anchor']? '#'+info['anchor'] : '');
	}
	
	function url_with_extra(url,params)
	{
		if(!url) return;
		var info=parse(url);
		if(!info) return url;
		if(!params) return url;
		var keys=[];
		var cur_params=info['queryKey'];
		
		for(var index in params) 
		{
			keys.push(index);
			cur_params[index]=params[index];
		}
		if(keys.length<1) return url;
		
		var q_str_arr=[];
		for(var index in cur_params) 
			q_str_arr.push(encodeURI(index)+(cur_params[index]? ('='+ encodeURI(cur_params[index])) : ''));
		
		var q_str=q_str_arr.join('&');
		q_str=q_str? ('?'+q_str) : '';
		return (info['protocol']?(info['protocol']+'://'):'')+info['authority']+info['path']+q_str+(info['anchor']? '#'+info['anchor'] : '');
	}
	
	function set_strict_mode(mode)
	{
		parse_options['strictMode']=mode?true:false;
	}
	
	function get_strict_mode()
	{
		return parse_options['strictMode'];
	}
	
	init['parse']=parse;
	init['remove_component']=remove_component;
	init['url_with_extra']=url_with_extra;
	init['set_strict_mode']=set_strict_mode;
	init['get_strict_mode']=get_strict_mode;
	
	return init;

})();