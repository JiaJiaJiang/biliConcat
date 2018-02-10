#!/usr/bin/env node

var fs=require('fs'),
	mkdirp=require('mkdirp').sync,
	os=require('os'),
	path=require('path'),
	child_process=require('child_process'),
	rmdirSync = require('rmdir-sync');
var cwd=process.cwd(),
	log=console.log.bind(console);

var tmpDir=fs.mkdtempSync(path.resolve(os.tmpdir(),'biliConcat'));
process.on('exit',()=>{
	rmdirSync(tmpDir);
});

var vDirs=fs.readdirSync(cwd);
var resultDir=path.resolve(cwd,'result');
mkdirp(resultDir);

let processed=0;

for(let dn of vDirs){
	log();
	if(!dn.match(/^\d+$/)){
		log('忽略',dn);
		continue;
	}
	log('进入:',dn);
	let vd=path.resolve(cwd,dn);
	try{
		var entry=require(path.resolve(vd,'entry.json'));
	}catch(e){
		log('无法加载entry.json，忽略');
		continue;
	}
	if(!('title' in entry)){
		log('没有找到标题');
		continue; 
	}
	let fileName=entry.title.replace(/\\/g,'_').replace(/\//g,'_');
	if('type_tag' in entry){
		fileName+=`_${entry.type_tag}`;
	}
	if('ep' in entry){
		if(entry.ep.index)
			fileName+=`_${entry.ep.index}`;
		if(entry.ep.index_title)
			fileName+=`_${entry.ep.index_title}`;
	}
	if('page_data' in entry){
		if(entry.page_data.part)
			fileName+=`_${entry.page_data.part}`;
	}
	fileName+='.flv';
	let resultPath=path.resolve(resultDir,fileName);
	log('处理中:',fileName);
	if(entry.is_completed===false){
		log('	文件未下载完成，跳过')
		continue;
	}else{
		try{
			fs.accessSync(resultPath);
			log('	文件已存在，跳过');
			continue;
		}catch(e){}
	}
	let segDir=path.resolve(vd,entry.type_tag);
	let segList=[];
	let ind=0;
	while(true){
		try{
			let vPath=path.resolve(segDir,`${ind}.blv`);
			fs.accessSync(vPath);
			vPath=vPath.replace(/\\/g,'/');
			// console.log('		分片',`${ind}.blv`);
			segList.push(`file '${vPath}'`);
			ind++;
		}catch(e){break;}
	}
	let listFile=path.resolve(tmpDir,'seglist');
	fs.writeFileSync(listFile,segList.join('\n'));
	child_process.execFileSync('ffmpeg',['-f','concat','-safe','0','-i',listFile,'-c','copy',resultPath],{
		stdio:['pipe', 'pipe', 'pipe'],
	});
	log('已完成:',fileName);
	processed++;
}

if(processed===0){
	log('未处理任何文件，请在有entry.json文件的目录上一级执行此命令');
}else{
	log('处理完成')
}









		
