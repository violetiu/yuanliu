/*! *****************************************************************************
Copyright (c) taoyongwen. All rights reserved.

git 工具
***************************************************************************** */
import * as cp from 'child_process';
import { app } from 'electron';
import * as fs from 'fs';
import * as storage from "../server/storage";
/**
 * git tool
 */
export class GitTools {
	cwd: string;
	/**
	 * 构造函数
	 * @param {String} cwd 工作目录
	 * */
	constructor(cwd: string) {
		console.log(cwd);
		this.cwd = cwd;
	}

	/**
	 * git clone
	 * */
	clone(address: string,callback?: (code:number,message?:string) => void) {
		var params = [
			'clone',
			address,
		];
		if(fs.existsSync(this.cwd)){
			storage.emptyFolder(this.cwd)
			//fs.rmdirSync(this.cwd);
		}
		var ch = cp.spawn("git" ,params,{cwd:app.getPath("home") + "/.prototyping/work"});
		var message="";
		ch.on("error", (err: any) => {
			console.log(err);
			message=err.toString();
		});
		ch.on("exit", (err: any) => {
			console.log(err);
			callback(err,message);
		});
		ch.stdout.on('data', (data) => {
			message=data.toString();
			console.log("data",data.toString());
		});

	

	}
	add(callback?: (code:number,message?:string) => void) {
		var params = [
			'add',
			'.',
		];
		this.spawn(params,callback);
	}
	commit(comment:string,callback?: (code:number,message?:string) => void) {
		var params = [
			'commit',
			'-m',
			comment,
		];
		this.spawn(params,callback);
	}
	push(callback?: (code:number,message?:string) => void) {
		var params = [
			'push',
			'origin',
			'master',
		];
		this.spawn(params,callback);
	}
	pull(callback?: (code:number,message?:string) => void) {
		var params = [
			'pull'
		];
		this.spawn(params,callback);
	}
	spawn( params: string[],callback?: (code:number,message?:string) => void) {
		var message="";
		var ch = cp.spawn("git" ,params,{cwd:this.cwd});
		console.log(params);
		ch.on("error", (err: any) => {
			console.log(err);
		});
		ch.on("exit", (err: any) => {
			console.log(err);
			if(err==0){
				if(callback){
					callback(0,message);
				}
			}else {
				if(callback){
					callback(err,message);
				}
			}
		});
		ch.on("message", (err: any) => {
			console.log(err);
			message=message;
		});
		ch.stdout.on('data', (data) => {
			console.log("data",data.toString());
			message=data.toString();
		});
	


	}
}