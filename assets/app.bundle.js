/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "34255464be049070daea"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var _rqrauhvmra__tobi = __webpack_require__(2);

var _rqrauhvmra__tobi2 = _interopRequireDefault(_rqrauhvmra__tobi);

var _producthuntFloatingPrompt = __webpack_require__(3);

var _producthuntFloatingPrompt2 = _interopRequireDefault(_producthuntFloatingPrompt);

var _darkmodeJs = __webpack_require__(4);

var _darkmodeJs2 = _interopRequireDefault(_darkmodeJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// CSS and SASS files
var tobi = new _rqrauhvmra__tobi2.default();

// Remove the two following lines to remove the product hunt floating prompt

(0, _producthuntFloatingPrompt2.default)({ name: 'Mobile App Landing Page', url: 'https://www.producthunt.com/posts/mobile-app-landing-page', bottom: '96px', width: '450px' });

// Remove the following lines to remove the darkmode js

function addDarkmodeWidget() {
  new _darkmodeJs2.default().showWidget();
}
window.addEventListener('load', addDarkmodeWidget);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Tobi
 *
 * @author rqrauhvmra
 * @version 1.7.3
 * @url https://github.com/rqrauhvmra/Tobi
 *
 * MIT License
 */
(function (root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.Tobi = factory()
  }
}(this, function () {
  'use strict'

  var Tobi = function Tobi (userOptions) {
    /**
     * Global variables
     *
     */
    var config = {},
      browserWindow = window,
      transformProperty = null,
      gallery = [],
      figcaptionId = 0,
      elementsLength = 0,
      lightbox = null,
      slider = null,
      sliderElements = [],
      prevButton = null,
      nextButton = null,
      closeButton = null,
      counter = null,
      currentIndex = 0,
      drag = {},
      pointerDown = false,
      lastFocus = null,
      firstFocusableEl = null,
      lastFocusableEl = null,
      offset = null,
      offsetTmp = null,
      resizeTicking = false,
      x = 0

    /**
     * Merge default options with user options
     *
     * @param {Object} userOptions - Optional user options
     * @returns {Object} - Custom options
     */
    var mergeOptions = function mergeOptions (userOptions) {
      // Default options
      var options = {
        selector: '.lightbox',
        captions: true,
        captionsSelector: 'img',
        captionAttribute: 'alt',
        nav: 'auto',
        navText: ['<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><polyline points="14 18 8 12 14 6 14 6"></polyline></svg>', '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><polyline points="10 6 16 12 10 18 10 18"></polyline></svg>'],
        navLabel: ['Previous', 'Next'],
        close: true,
        closeText: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path></svg>',
        closeLabel: 'Close',
        counter: true,
        download: false, // TODO
        downloadText: '', // TODO
        downloadLabel: 'Download', // TODO
        keyboard: true,
        zoom: true,
        zoomText: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4,20 L9.58788778,14.4121122"></path><path d="M14,16 C10.6862915,16 8,13.3137085 8,10 C8,6.6862915 10.6862915,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,13.3137085 17.3137085,16 14,16 Z"></path><path d="M16.6666667 10L11.3333333 10M14 7.33333333L14 12.6666667"></path></svg>',
        docClose: true,
        swipeClose: true,
        scroll: false,
        draggable: true,
        threshold: 100,
        rtl: false, // TODO
        loop: false, // TODO
        autoplayVideo: false
      }

      if (userOptions) {
        Object.keys(userOptions).forEach(function (key) {
          options[key] = userOptions[key]
        })
      }

      return options
    }

    /**
     * Determine if browser supports unprefixed transform property
     *
     * @returns {string} - Transform property supported by client
     */
    var transformSupport = function transformSupport () {
      return typeof document.documentElement.style.transform === 'string' ? 'transform' : 'WebkitTransform'
    }

    /**
     * Types - you can add new type to support something new
     *
     */
    var supportedElements = {
      image: {
        checkSupport: function (element) {
          return !element.hasAttribute('data-type') && element.href.match(/\.(png|jpe?g|tiff|tif|gif|bmp|webp|svg|ico)$/)
        },

        init: function (element, container) {
          var figure = document.createElement('figure'),
            figcaption = document.createElement('figcaption'),
            image = document.createElement('img'),
            thumbnail = element.querySelector('img'),
            loader = document.createElement('div')

          image.style.opacity = '0'

          if (thumbnail) {
            image.alt = thumbnail.alt || ''
          }

          image.setAttribute('src', '')
          image.setAttribute('data-src', element.href)

          // Add image to figure
          figure.appendChild(image)

          // Create figcaption
          if (config.captions) {
            figcaption.style.opacity = '0'

            if (config.captionsSelector === 'self' && element.getAttribute(config.captionAttribute)) {
              figcaption.textContent = element.getAttribute(config.captionAttribute)
            } else if (config.captionsSelector === 'img' && thumbnail && thumbnail.getAttribute(config.captionAttribute)) {
              figcaption.textContent = thumbnail.getAttribute(config.captionAttribute)
            }

            if (figcaption.textContent) {
              figcaption.id = 'tobi-figcaption-' + figcaptionId
              figure.appendChild(figcaption)

              image.setAttribute('aria-labelledby', figcaption.id)

              ++figcaptionId
            }
          }

          // Add figure to container
          container.appendChild(figure)

          //  Create loader
          loader.className = 'tobi-loader'

          // Add loader to container
          container.appendChild(loader)

          // Register type
          container.setAttribute('data-type', 'image')
        },

        onPreload: function (container) {
          // Same as preload
          supportedElements.image.onLoad(container)
        },

        onLoad: function (container) {
          var image = container.querySelector('img')

          if (!image.hasAttribute('data-src')) {
            return
          }

          var figcaption = container.querySelector('figcaption'),
            loader = container.querySelector('.tobi-loader')

          image.onload = function () {
            container.removeChild(loader)
            image.style.opacity = '1'

            if (figcaption) {
              figcaption.style.opacity = '1'
            }
          }

          image.setAttribute('src', image.getAttribute('data-src'))
          image.removeAttribute('data-src')
        },

        onLeave: function (container) {
          // Nothing
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      youtube: {
        checkSupport: function (element) {
          return checkType(element, 'youtube')
        },

        init: function (element, container) {
          // TODO
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          // TODO
        },

        onLeave: function (container) {
          // TODO
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      iframe: {
        checkSupport: function (element) {
          return checkType(element, 'iframe')
        },

        init: function (element, container) {
          var iframe = document.createElement('iframe'),
            href = element.hasAttribute('href') ? element.getAttribute('href') : element.getAttribute('data-target')

          iframe.setAttribute('frameborder', '0')
          iframe.setAttribute('src', '')
          iframe.setAttribute('data-src', href)

          // Add iframe to container
          container.appendChild(iframe)

          // Register type
          container.setAttribute('data-type', 'iframe')
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          var iframe = container.querySelector('iframe')

          iframe.setAttribute('src', iframe.getAttribute('data-src'))
        },

        onLeave: function (container) {
          // Nothing
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      html: {
        checkSupport: function (element) {
          return checkType(element, 'html')
        },

        init: function (element, container) {
          var targetSelector = element.hasAttribute('href') ? element.getAttribute('href') : element.getAttribute('data-target'),
            target = document.querySelector(targetSelector)

          if (!target) {
            throw new Error('Ups, I can\'t find the target ' + targetSelector + '.')
          }

          // Add content to container
          container.appendChild(target)

          // Register type
          container.setAttribute('data-type', 'html')
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (video.hasAttribute('data-time') && video.readyState > 0) {
              // Continue where video was stopped
              video.currentTime = video.getAttribute('data-time')
            }

            if (config.autoplayVideo) {
              // Start playback (and loading if necessary)
              video.play()
            }
          }
        },

        onLeave: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (!video.paused) {
              // Stop if video is playing
              video.pause()
            }

            // Backup currentTime (needed for revisit)
            if (video.readyState > 0) {
              video.setAttribute('data-time', video.currentTime)
            }
          }
        },

        onCleanup: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (video.readyState > 0 && video.readyState < 3 && video.duration !== video.currentTime) {
              // Some data has been loaded but not the whole package.
              // In order to save bandwidth, stop downloading as soon as possible.
              var clone = video.cloneNode(true)

              removeSources(video)
              video.load()

              video.parentNode.removeChild(video)

              container.appendChild(clone)
            }
          }
        }
      }
    }

    /**
     * Init
     *
     */
    var init = function init (userOptions) {
      // Merge user options into defaults
      config = mergeOptions(userOptions)

      // Transform property supported by client
      transformProperty = transformSupport()

      // Get a list of all elements within the document
      var elements = document.querySelectorAll(config.selector)

      if (!elements) {
        throw new Error('Ups, I can\'t find the selector ' + config.selector + '.')
      }

      // Execute a few things once per element
      Array.prototype.forEach.call(elements, function (element) {
        add(element)
      })
    }

    /**
     * Add element
     *
     * @param {HTMLElement} element - Element to add
     * @param {function} callback - Optional callback to call after add
     */
    var add = function add (element, callback) {
      // Check if the lightbox already exists
      if (!lightbox) {
        // Create the lightbox
        createLightbox()
      }

      // Check if element already exists
      if (gallery.indexOf(element) === -1) {
        gallery.push(element)
        elementsLength++

        // Set zoom icon if necessary
        if (config.zoom && element.querySelector('img')) {
          var tobiZoom = document.createElement('div')

          tobiZoom.className = 'tobi-zoom__icon'
          tobiZoom.innerHTML = config.zoomText

          element.classList.add('tobi-zoom')
          element.appendChild(tobiZoom)
        }

        // Bind click event handler
        element.addEventListener('click', function (event) {
          event.preventDefault()

          open(gallery.indexOf(this))
        })

        // Create the slide
        createLightboxSlide(element)

        if (isOpen()) {
          updateLightbox()
        }

        if (callback) {
          callback.call(this)
        }
      } else {
        throw new Error('Ups, element already added to the lightbox.')
      }
    }

    /**
     * Create the lightbox
     *
     */
    var createLightbox = function createLightbox () {
      // Create lightbox container
      lightbox = document.createElement('div')
      lightbox.setAttribute('role', 'dialog')
      lightbox.setAttribute('aria-hidden', 'true')
      lightbox.className = 'tobi'

      // Create slider container
      slider = document.createElement('div')
      slider.className = 'tobi__slider'
      lightbox.appendChild(slider)

      // Create previous button
      prevButton = document.createElement('button')
      prevButton.className = 'tobi__prev'
      prevButton.setAttribute('type', 'button')
      prevButton.setAttribute('aria-label', config.navLabel[0])
      prevButton.innerHTML = config.navText[0]
      lightbox.appendChild(prevButton)

      // Create next button
      nextButton = document.createElement('button')
      nextButton.className = 'tobi__next'
      nextButton.setAttribute('type', 'button')
      nextButton.setAttribute('aria-label', config.navLabel[1])
      nextButton.innerHTML = config.navText[1]
      lightbox.appendChild(nextButton)

      // Create close button
      closeButton = document.createElement('button')
      closeButton.className = 'tobi__close'
      closeButton.setAttribute('type', 'button')
      closeButton.setAttribute('aria-label', config.closeLabel)
      closeButton.innerHTML = config.closeText
      lightbox.appendChild(closeButton)

      // Create counter
      counter = document.createElement('div')
      counter.className = 'tobi__counter'
      lightbox.appendChild(counter)

      // Resize event using requestAnimationFrame
      browserWindow.addEventListener('resize', function () {
        if (!resizeTicking) {
          resizeTicking = true
          browserWindow.requestAnimationFrame(function () {
            updateOffset()
            resizeTicking = false
          })
        }
      })

      document.body.appendChild(lightbox)
    }

    /**
     * Create a lightbox slide
     *
     */
    var createLightboxSlide = function createLightboxSlide (element) {
      // Detect type
      for (var index in supportedElements) {
        if (supportedElements.hasOwnProperty(index)) {
          if (supportedElements[index].checkSupport(element)) {
            // Create slide elements
            var sliderElement = document.createElement('div'),
              sliderElementContent = document.createElement('div')

            sliderElement.className = 'tobi__slider__slide'
            sliderElement.style.position = 'absolute'
            sliderElement.style.left = x * 100 + '%'
            sliderElementContent.className = 'tobi__slider__slide__content'

            if (config.draggable) {
              sliderElementContent.classList.add('draggable')
            }

            // Create type elements
            supportedElements[index].init(element, sliderElementContent)

            // Add slide content container to slider element
            sliderElement.appendChild(sliderElementContent)

            // Add slider element to slider
            slider.appendChild(sliderElement)
            sliderElements.push(sliderElement)

            ++x

            break
          }
        }
      }
    }

    /**
     * Open the lightbox
     *
     * @param {number} index - Index to load
     * @param {function} callback - Optional callback to call after open
     */
    var open = function open (index, callback) {
      if (!isOpen() && !index) {
        index = 0
      }

      if (isOpen()) {
        if (!index) {
          throw new Error('Ups, Tobi is aleady open.')
        }

        if (index === currentIndex) {
          throw new Error('Ups, slide ' + index + ' is already selected.')
        }
      }

      if (index === -1 || index >= elementsLength) {
        throw new Error('Ups, I can\'t find slide ' + index + '.')
      }

      if (!config.scroll) {
        document.documentElement.classList.add('tobi-is-open')
        document.body.classList.add('tobi-is-open')
      }

      // Hide buttons if necessary
      if (!config.nav || elementsLength === 1 || (config.nav === 'auto' && 'ontouchstart' in window)) {
        prevButton.setAttribute('aria-hidden', 'true')
        nextButton.setAttribute('aria-hidden', 'true')
      } else {
        prevButton.setAttribute('aria-hidden', 'false')
        nextButton.setAttribute('aria-hidden', 'false')
      }

      // Hide counter if necessary
      if (!config.counter || elementsLength === 1) {
        counter.setAttribute('aria-hidden', 'true')
      } else {
        counter.setAttribute('aria-hidden', 'false')
      }

      // Hide close if necessary
      if (!config.close) {
        closeButton.disabled = false
        closeButton.setAttribute('aria-hidden', 'true')
      }

      // Save the user’s focus
      lastFocus = document.activeElement

      // Set current index
      currentIndex = index

      // Clear drag
      clearDrag()

      // Bind events
      bindEvents()

      // Load slide
      load(currentIndex)

      // Makes lightbox appear, too
      lightbox.setAttribute('aria-hidden', 'false')

      // Update lightbox
      updateLightbox()

      // Preload late
      preload(currentIndex + 1)
      preload(currentIndex - 1)

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Close the lightbox
     *
     * @param {function} callback - Optional callback to call after close
     */
    var close = function close (callback) {
      if (!isOpen()) {
        throw new Error('Tobi is already closed.')
      }

      if (!config.scroll) {
        document.documentElement.classList.remove('tobi-is-open')
        document.body.classList.remove('tobi-is-open')
      }

      // Unbind events
      unbindEvents()

      // Reenable the user’s focus
      lastFocus.focus()

      // Don't forget to cleanup our current element
      var container = sliderElements[currentIndex].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')
      supportedElements[type].onLeave(container)
      supportedElements[type].onCleanup(container)

      lightbox.setAttribute('aria-hidden', 'true')

      // Reset current index
      currentIndex = 0

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Preload slide
     *
     * @param {number} index - Index to preload
     */
    var preload = function preload (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onPreload(container)
    }

    /**
     * Load slide
     * Will be called when opening the lightbox or moving index
     *
     * @param {number} index - Index to load
     */
    var load = function load (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onLoad(container)
    }

    /**
     * Navigate to the previous slide
     *
     * @param {function} callback - Optional callback function
     */
    var prev = function prev (callback) {
      if (currentIndex > 0) {
        leave(currentIndex)
        load(--currentIndex)
        updateLightbox('left')
        cleanup(currentIndex + 1)
        preload(currentIndex - 1)

        if (callback) {
          callback.call(this)
        }
      }
    }

    /**
     * Navigate to the next slide
     *
     * @param {function} callback - Optional callback function
     */
    var next = function next (callback) {
      if (currentIndex < elementsLength - 1) {
        leave(currentIndex)
        load(++currentIndex)
        updateLightbox('right')
        cleanup(currentIndex - 1)
        preload(currentIndex + 1)

        if (callback) {
          callback.call(this)
        }
      }
    }

    /**
     * Leave slide
     * Will be called before moving index
     *
     * @param {number} index - Index to leave
     */
    var leave = function leave (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onLeave(container)
    }

    /**
     * Cleanup slide
     * Will be called after moving index
     *
     * @param {number} index - Index to cleanup
     */
    var cleanup = function cleanup (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onCleanup(container)
    }

    /**
     * Update the offset
     *
     */
    var updateOffset = function updateOffset () {
      offset = -currentIndex * window.innerWidth

      slider.style[transformProperty] = 'translate3d(' + offset + 'px, 0, 0)'
      offsetTmp = offset
    }

    /**
     * Update the counter
     *
     */
    var updateCounter = function updateCounter () {
      counter.textContent = (currentIndex + 1) + '/' + elementsLength
    }

    /**
     * Set the focus to the next element
     *
     * @param {string} dir - Current slide direction
     */
    var updateFocus = function updateFocus (dir) {
      var focusableEls = null

      if (config.nav) {
        // Display the next and previous buttons
        prevButton.disabled = false
        nextButton.disabled = false

        if (elementsLength === 1) {
          // Hide the next and previous buttons if there is only one slide
          prevButton.disabled = true
          nextButton.disabled = true

          if (config.close) {
            closeButton.focus()
          }
        } else if (currentIndex === 0) {
          // Hide the previous button when the first slide is displayed
          prevButton.disabled = true
        } else if (currentIndex === elementsLength - 1) {
          // Hide the next button when the last slide is displayed
          nextButton.disabled = true
        }

        if (!dir && !nextButton.disabled) {
          nextButton.focus()
        } else if (!dir && nextButton.disabled && !prevButton.disabled) {
          prevButton.focus()
        } else if (!nextButton.disabled && dir === 'right') {
          nextButton.focus()
        } else if (nextButton.disabled && dir === 'right' && !prevButton.disabled) {
          prevButton.focus()
        } else if (!prevButton.disabled && dir === 'left') {
          prevButton.focus()
        } else if (prevButton.disabled && dir === 'left' && !nextButton.disabled) {
          nextButton.focus()
        }
      } else if (config.close) {
        closeButton.focus()
      }

      focusableEls = lightbox.querySelectorAll('button:not(:disabled)')
      firstFocusableEl = focusableEls[0]
      lastFocusableEl = focusableEls.length === 1 ? focusableEls[0] : focusableEls[focusableEls.length - 1]
    }

    /**
     * Clear drag after touchend and mousup event
     *
     */
    var clearDrag = function clearDrag () {
      drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0
      }
    }

    /**
     * Recalculate drag / swipe event
     *
     */
    var updateAfterDrag = function updateAfterDrag () {
      var movementX = drag.endX - drag.startX,
        movementY = drag.endY - drag.startY,
        movementXDistance = Math.abs(movementX),
        movementYDistance = Math.abs(movementY)

      if (movementX > 0 && movementXDistance > config.threshold && currentIndex > 0) {
        prev()
      } else if (movementX < 0 && movementXDistance > config.threshold && currentIndex !== elementsLength - 1) {
        next()
      } else if (movementY < 0 && movementYDistance > config.threshold && config.swipeClose) {
        close()
      } else {
        updateOffset()
      }
    }

    /**
     * Click event handler
     *
     */
    var clickHandler = function clickHandler (event) {
      if (event.target === prevButton) {
        prev()
      } else if (event.target === nextButton) {
        next()
      } else if (event.target === closeButton || event.target.className === 'tobi__slider__slide') {
        close()
      }

      event.stopPropagation()
    }

    /**
     * Keydown event handler
     *
     */
    var keydownHandler = function keydownHandler (event) {
      if (event.keyCode === 9) {
        // `TAB` Key: Navigate to the next/previous focusable element
        if (event.shiftKey) {
          // Step backwards in the tab-order
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus()
            event.preventDefault()
          }
        } else {
          // Step forward in the tab-order
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus()
            event.preventDefault()
          }
        }
      } else if (event.keyCode === 27) {
        // `ESC` Key: Close the lightbox
        event.preventDefault()
        close()
      } else if (event.keyCode === 37) {
        // `PREV` Key: Navigate to the previous slide
        event.preventDefault()
        prev()
      } else if (event.keyCode === 39) {
        // `NEXT` Key: Navigate to the next slide
        event.preventDefault()
        next()
      }
    }

    /**
     * Touchstart event handler
     *
     */
    var touchstartHandler = function touchstartHandler (event) {
      // Prevent dragging / swiping on textareas inputs, selects and videos
      var ignoreElements = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO'].indexOf(event.target.nodeName) !== -1

      if (ignoreElements) {
        return
      }

      event.stopPropagation()

      pointerDown = true

      drag.startX = event.touches[0].pageX
      drag.startY = event.touches[0].pageY
    }

    /**
     * Touchmove event handler
     *
     */
    var touchmoveHandler = function touchmoveHandler (event) {
      event.stopPropagation()

      if (pointerDown) {
        event.preventDefault()

        drag.endX = event.touches[0].pageX
        drag.endY = event.touches[0].pageY

        slider.style[transformProperty] = 'translate3d(' + (offsetTmp - Math.round(drag.startX - drag.endX)) + 'px, 0, 0)'
      }
    }

    /**
     * Touchend event handler
     *
     */
    var touchendHandler = function touchendHandler (event) {
      event.stopPropagation()

      pointerDown = false

      if (drag.endX) {
        updateAfterDrag()
      }

      clearDrag()
    }

    /**
     * Mousedown event handler
     *
     */
    var mousedownHandler = function mousedownHandler (event) {
      // Prevent dragging / swiping on textareas inputs, selects and videos
      var ignoreElements = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO'].indexOf(event.target.nodeName) !== -1

      if (ignoreElements) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      pointerDown = true
      drag.startX = event.pageX
      drag.startY = event.pageY
    }

    /**
     * Mousemove event handler
     *
     */
    var mousemoveHandler = function mousemoveHandler (event) {
      event.preventDefault()

      if (pointerDown) {
        drag.endX = event.pageX
        drag.endY = event.pageY

        slider.style[transformProperty] = 'translate3d(' + (offsetTmp - Math.round(drag.startX - drag.endX)) + 'px, 0, 0)'
      }
    }

    /**
     * Mouseup event handler
     *
     */
    var mouseupHandler = function mouseupHandler (event) {
      event.stopPropagation()

      pointerDown = false

      if (drag.endX) {
        updateAfterDrag()
      }

      clearDrag()
    }

    /**
     * Bind events
     *
     */
    var bindEvents = function bindEvents () {
      if (config.keyboard) {
        document.addEventListener('keydown', keydownHandler)
      }

      // Click events
      if (config.docClose) {
        lightbox.addEventListener('click', clickHandler)
      }

      prevButton.addEventListener('click', clickHandler)
      nextButton.addEventListener('click', clickHandler)
      closeButton.addEventListener('click', clickHandler)

      if (config.draggable) {
        // Touch events
        lightbox.addEventListener('touchstart', touchstartHandler)
        lightbox.addEventListener('touchmove', touchmoveHandler)
        lightbox.addEventListener('touchend', touchendHandler)

        // Mouse events
        lightbox.addEventListener('mousedown', mousedownHandler)
        lightbox.addEventListener('mouseup', mouseupHandler)
        lightbox.addEventListener('mousemove', mousemoveHandler)
      }
    }

    /**
     * Unbind events
     *
     */
    var unbindEvents = function unbindEvents () {
      if (config.keyboard) {
        document.removeEventListener('keydown', keydownHandler)
      }

      // Click events
      if (config.docClose) {
        lightbox.removeEventListener('click', clickHandler)
      }

      prevButton.removeEventListener('click', clickHandler)
      nextButton.removeEventListener('click', clickHandler)
      closeButton.removeEventListener('click', clickHandler)

      if (config.draggable) {
        // Touch events
        lightbox.removeEventListener('touchstart', touchstartHandler)
        lightbox.removeEventListener('touchmove', touchmoveHandler)
        lightbox.removeEventListener('touchend', touchendHandler)

        // Mouse events
        lightbox.removeEventListener('mousedown', mousedownHandler)
        lightbox.removeEventListener('mouseup', mouseupHandler)
        lightbox.removeEventListener('mousemove', mousemoveHandler)
      }
    }

    /**
     * Checks whether element has requested data-type value
     *
     */
    var checkType = function checkType (element, type) {
      return element.getAttribute('data-type') === type
    }

    /**
     * Remove all `src` attributes
     *
     * @param {HTMLElement} element - Element to remove all `src` attributes
     */
    var removeSources = function setVideoSources (element) {
      var sources = element.querySelectorAll('src')

      if (sources) {
        Array.prototype.forEach.call(sources, function (source) {
          source.setAttribute('src', '')
        })
      }
    }

    /**
     * Update lightbox
     *
     * @param {string} dir - Current slide direction
     */
    var updateLightbox = function updateLightbox (dir) {
      updateOffset()
      updateCounter()
      updateFocus(dir)
    }

    /**
     * Reset the lightbox
     *
     * @param {function} callback - Optional callback to call after reset
     */
    var reset = function reset (callback) {
      if (slider) {
        while (slider.firstChild) {
          slider.removeChild(slider.firstChild)
        }
      }

      gallery.length = sliderElements.length = elementsLength = figcaptionId = x = 0

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Check if the lightbox is open
     *
     */
    var isOpen = function isOpen () {
      return lightbox.getAttribute('aria-hidden') === 'false'
    }

    /**
     * Return current index
     *
     */
    var currentSlide = function currentSlide () {
      return currentIndex
    }

    init(userOptions)

    return {
      open: open,
      prev: prev,
      next: next,
      close: close,
      add: add,
      reset: reset,
      isOpen: isOpen,
      currentSlide: currentSlide
    }
  }

  return Tobi
}))


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("producthunt-floating-prompt", [], factory);
	else if(typeof exports === 'object')
		exports["producthunt-floating-prompt"] = factory();
	else
		root["producthunt-floating-prompt"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/floatingPrompt.js":
/*!*******************************!*\
  !*** ./src/floatingPrompt.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = floatingPrompt;

function floatingPrompt(options) {
  /* eslint-disable */
  var name = options.name;
  var url = options.url;
  var text = options.text ? options.text : "Hi, do you like ".concat(name, " ? Don't forget to show your love on Product Hunt \uD83D\uDE80");
  var buttonText = options.buttonText ? options.buttonText : "".concat(name, " on Product Hunt");
  var width = options.width ? options.width : '300px';
  var bottom = options.bottom ? options.bottom : '32px';
  var right = options.right ? options.right : '32px';
  var left = options.left ? options.left : 'unset';
  var colorOne = options.colorOne ? options.colorOne : '#da552f';
  var colorTwo = options.colorTwo ? options.colorTwo : '#ea8e39';
  var saveInCookies = typeof options.saveInCookies === 'boolean' ? options.saveInCookies : true;
  var id = "product-hunt-".concat(name.toLowerCase().replace(/[^a-zA-Z]+/g, "-"));
  var html = "<div class=\"producthunt\" id=\"".concat(id, "\"> <span class=\"producthunt__close\" id=\"").concat(id, "-close\">\xD7</span><p class=\"producthunt__text\">").concat(text, "</p> <a href=\"").concat(url, "\" class=\"ph-button\" target=\"_blank\">").concat(buttonText, "</a></div>");
  var css = "\n  .ph-button {\n    background: linear-gradient(65deg,".concat(colorOne, ",").concat(colorTwo, ");\n    font-family: sans-serif;\n    color: #fff !important;\n    display: block;\n    letter-spacing: 0;\n    font-weight: 700;\n    line-height: 16px;\n    font-size: 14px;\n    text-transform: uppercase;\n    text-decoration: none!important;\n    border: none;\n    border-radius: 2px;\n    cursor: pointer;\n    justify-content: center;\n    padding: 16px 16px;\n    text-align: center;\n    white-space: nowrap;\n    box-shadow: 0 8px 24px rgba(32,43,54,.12);\n    transition: all .3s ease;\n    margin-top: 16px;\n    font-size: 14px;\n  }\n  .ph-button:hover {\n    box-shadow: 0 6px 24px rgba(32,43,54,.4);\n  }\n  .producthunt {\n    position: fixed;\n    background-color: #fff;\n    padding: 24px;\n    box-shadow: 0 4px 16px rgba(16, 31, 59, 0.16);\n    z-index: 10;\n    font-size: 16px;\n    color: #65638f;\n    font-family: sans-serif;\n    opacity: 1;\n    transition: all .3s ease;\n  }\n  .producthunt__close {\n    position: absolute;\n    right: 16px;\n    top: 8px;\n    cursor: pointer;\n  }\n  .producthunt__text {\n    margin: 0;\n  }\n  @media (max-width: 768px) {\n    .producthunt {\n      width: calc(100% - 48px) !important;\n      bottom: 0 !important;\n      right: 0 !important;\n      left: 0 !important;\n      box-shadow: 0 -4px 16px rgba(16, 31, 59, 0.16) !important;\n    }\n  }");

  if (!window.localStorage.getItem(id) || saveInCookies == false) {
    createModal(html);
    setStyle(id, bottom, left, right, width);
    addClosingEvent(id);
    addStyle(css);
  }
  /* eslint-enable */

}

function createModal(html) {
  var prompt = document.createElement('div');
  prompt.innerHTML = html;
  document.body.appendChild(prompt);
}

function setStyle(id, bottom, left, right, width) {
  var producthuntModal = document.getElementById(id);
  producthuntModal.style.bottom = bottom;
  producthuntModal.style.left = left ? left : 'unset';
  producthuntModal.style.right = right ? right : 'unset';
  producthuntModal.style.width = width;
}

function addClosingEvent(id) {
  var producthuntModal = document.getElementById(id);
  var producthuntCloseButton = document.getElementById("".concat(id, "-close"));
  producthuntCloseButton.addEventListener('click', function () {
    producthuntModal.style.opacity = 0;
    setTimeout(function () {
      producthuntModal.parentNode.removeChild(producthuntModal);
      window.localStorage.setItem(id, true);
    }, 300);
  });
}

function addStyle(css) {
  var linkElement = document.createElement('link');
  linkElement.setAttribute('rel', 'stylesheet');
  linkElement.setAttribute('type', 'text/css');
  linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
  document.head.appendChild(linkElement);
}

module.exports = exports["default"];

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _floatingPrompt = _interopRequireDefault(__webpack_require__(/*! ./floatingPrompt.js */ "./src/floatingPrompt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _floatingPrompt.default;
/* eslint-disable */

exports.default = _default;

(function (window) {
  window.FloatingPrompt = _floatingPrompt.default;
})(window);
/* eslint-enable */


module.exports = exports["default"];

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3Byb2R1Y3RodW50LWZsb2F0aW5nLXByb21wdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHQvLi9zcmMvZmxvYXRpbmdQcm9tcHQuanMiLCJ3ZWJwYWNrOi8vcHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImZsb2F0aW5nUHJvbXB0Iiwib3B0aW9ucyIsIm5hbWUiLCJ1cmwiLCJ0ZXh0IiwiYnV0dG9uVGV4dCIsIndpZHRoIiwiYm90dG9tIiwicmlnaHQiLCJsZWZ0IiwiY29sb3JPbmUiLCJjb2xvclR3byIsInNhdmVJbkNvb2tpZXMiLCJpZCIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsImh0bWwiLCJjc3MiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiY3JlYXRlTW9kYWwiLCJzZXRTdHlsZSIsImFkZENsb3NpbmdFdmVudCIsImFkZFN0eWxlIiwicHJvbXB0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiYm9keSIsImFwcGVuZENoaWxkIiwicHJvZHVjdGh1bnRNb2RhbCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJwcm9kdWN0aHVudENsb3NlQnV0dG9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9wYWNpdHkiLCJzZXRUaW1lb3V0IiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwic2V0SXRlbSIsImxpbmtFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiaGVhZCIsIkZsb2F0aW5nUHJvbXB0Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxD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QWdCLENBQUNPLFVBQWpCLENBQTRCQyxXQUE1QixDQUF3Q1IsZ0JBQXhDO0FBQ0FiLFlBQU0sQ0FBQ0MsWUFBUCxDQUFvQnFCLE9BQXBCLENBQTRCM0IsRUFBNUIsRUFBZ0MsSUFBaEM7QUFDRCxLQUhTLEVBR1AsR0FITyxDQUFWO0FBSUQsR0FORDtBQU9EOztBQUVELFNBQVNXLFFBQVQsQ0FBa0JQLEdBQWxCLEVBQXVCO0FBQ3JCLE1BQU13QixXQUFXLEdBQUdmLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixNQUF2QixDQUFwQjtBQUVBYyxhQUFXLENBQUNDLFlBQVosQ0FBeUIsS0FBekIsRUFBZ0MsWUFBaEM7QUFDQUQsYUFBVyxDQUFDQyxZQUFaLENBQXlCLE1BQXpCLEVBQWlDLFVBQWpDO0FBQ0FELGFBQVcsQ0FBQ0MsWUFBWixDQUF5QixNQUF6QixFQUFpQyxpQ0FBaUNDLGtCQUFrQixDQUFDMUIsR0FBRCxDQUFwRjtBQUNBUyxVQUFRLENBQUNrQixJQUFULENBQWNkLFdBQWQsQ0FBMEJXLFdBQTFCO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hIRDs7Ozs7QUFHQTs7OztBQUNBLENBQUMsVUFBU3ZCLE1BQVQsRUFBZ0I7QUFDZEEsUUFBTSxDQUFDMkIsY0FBUDtBQUNELENBRkYsRUFFSTNCLE1BRko7QUFHQyIsImZpbGUiOiJwcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInByb2R1Y3RodW50LWZsb2F0aW5nLXByb21wdFwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJwcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wicHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0XCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmxvYXRpbmdQcm9tcHQob3B0aW9ucykge1xyXG5cclxuICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gIGNvbnN0IG5hbWUgPSBvcHRpb25zLm5hbWU7XHJcbiAgY29uc3QgdXJsID0gb3B0aW9ucy51cmw7XHJcbiAgY29uc3QgdGV4dCA9IG9wdGlvbnMudGV4dCA/IG9wdGlvbnMudGV4dCA6IGBIaSwgZG8geW91IGxpa2UgJHtuYW1lfSA/IERvbid0IGZvcmdldCB0byBzaG93IHlvdXIgbG92ZSBvbiBQcm9kdWN0IEh1bnQg8J+agGA7XHJcbiAgY29uc3QgYnV0dG9uVGV4dCA9IG9wdGlvbnMuYnV0dG9uVGV4dCA/IG9wdGlvbnMuYnV0dG9uVGV4dCA6IGAke25hbWV9IG9uIFByb2R1Y3QgSHVudGA7XHJcbiAgY29uc3Qgd2lkdGggPSBvcHRpb25zLndpZHRoID8gb3B0aW9ucy53aWR0aCA6ICczMDBweCc7XHJcbiAgY29uc3QgYm90dG9tID0gb3B0aW9ucy5ib3R0b20gPyBvcHRpb25zLmJvdHRvbSA6ICczMnB4JztcclxuICBjb25zdCByaWdodCA9IG9wdGlvbnMucmlnaHQgPyBvcHRpb25zLnJpZ2h0IDogJzMycHgnO1xyXG4gIGNvbnN0IGxlZnQgPSBvcHRpb25zLmxlZnQgPyBvcHRpb25zLmxlZnQgOiAndW5zZXQnO1xyXG4gIGNvbnN0IGNvbG9yT25lID0gb3B0aW9ucy5jb2xvck9uZSA/IG9wdGlvbnMuY29sb3JPbmUgOiAnI2RhNTUyZic7XHJcbiAgY29uc3QgY29sb3JUd28gPSBvcHRpb25zLmNvbG9yVHdvID8gb3B0aW9ucy5jb2xvclR3byA6ICcjZWE4ZTM5JztcclxuICBjb25zdCBzYXZlSW5Db29raWVzID0gdHlwZW9mIG9wdGlvbnMuc2F2ZUluQ29va2llcyAgPT09ICdib29sZWFuJyA/IG9wdGlvbnMuc2F2ZUluQ29va2llcyA6IHRydWU7XHJcbiAgY29uc3QgaWQgPSBgcHJvZHVjdC1odW50LSR7bmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16QS1aXSsvZywgXCItXCIpfWA7XHJcbiAgY29uc3QgaHRtbCA9IGA8ZGl2IGNsYXNzPVwicHJvZHVjdGh1bnRcIiBpZD1cIiR7aWR9XCI+IDxzcGFuIGNsYXNzPVwicHJvZHVjdGh1bnRfX2Nsb3NlXCIgaWQ9XCIke2lkfS1jbG9zZVwiPsOXPC9zcGFuPjxwIGNsYXNzPVwicHJvZHVjdGh1bnRfX3RleHRcIj4ke3RleHR9PC9wPiA8YSBocmVmPVwiJHt1cmx9XCIgY2xhc3M9XCJwaC1idXR0b25cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2J1dHRvblRleHR9PC9hPjwvZGl2PmA7XHJcbiAgY29uc3QgY3NzID0gYFxyXG4gIC5waC1idXR0b24ge1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDY1ZGVnLCR7Y29sb3JPbmV9LCR7Y29sb3JUd299KTtcclxuICAgIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xyXG4gICAgY29sb3I6ICNmZmYgIWltcG9ydGFudDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDA7XHJcbiAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lIWltcG9ydGFudDtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgcGFkZGluZzogMTZweCAxNnB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggcmdiYSgzMiw0Myw1NCwuMTIpO1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zcyBlYXNlO1xyXG4gICAgbWFyZ2luLXRvcDogMTZweDtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICB9XHJcbiAgLnBoLWJ1dHRvbjpob3ZlciB7XHJcbiAgICBib3gtc2hhZG93OiAwIDZweCAyNHB4IHJnYmEoMzIsNDMsNTQsLjQpO1xyXG4gIH1cclxuICAucHJvZHVjdGh1bnQge1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICAgIHBhZGRpbmc6IDI0cHg7XHJcbiAgICBib3gtc2hhZG93OiAwIDRweCAxNnB4IHJnYmEoMTYsIDMxLCA1OSwgMC4xNik7XHJcbiAgICB6LWluZGV4OiAxMDtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIGNvbG9yOiAjNjU2MzhmO1xyXG4gICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zcyBlYXNlO1xyXG4gIH1cclxuICAucHJvZHVjdGh1bnRfX2Nsb3NlIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAxNnB4O1xyXG4gICAgdG9wOiA4cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgfVxyXG4gIC5wcm9kdWN0aHVudF9fdGV4dCB7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgfVxyXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xyXG4gICAgLnByb2R1Y3RodW50IHtcclxuICAgICAgd2lkdGg6IGNhbGMoMTAwJSAtIDQ4cHgpICFpbXBvcnRhbnQ7XHJcbiAgICAgIGJvdHRvbTogMCAhaW1wb3J0YW50O1xyXG4gICAgICByaWdodDogMCAhaW1wb3J0YW50O1xyXG4gICAgICBsZWZ0OiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgIGJveC1zaGFkb3c6IDAgLTRweCAxNnB4IHJnYmEoMTYsIDMxLCA1OSwgMC4xNikgIWltcG9ydGFudDtcclxuICAgIH1cclxuICB9YDtcclxuICBcclxuICBcclxuICBpZighd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGlkKSB8fCBzYXZlSW5Db29raWVzID09IGZhbHNlKSB7XHJcbiAgICBjcmVhdGVNb2RhbChodG1sKTtcclxuICAgIHNldFN0eWxlKGlkLCBib3R0b20sIGxlZnQsIHJpZ2h0LCB3aWR0aCk7XHJcbiAgICBhZGRDbG9zaW5nRXZlbnQoaWQpO1xyXG4gICAgYWRkU3R5bGUoY3NzKTtcclxuICB9XHJcbiAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNb2RhbChodG1sKSB7XHJcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gIHByb21wdC5pbm5lckhUTUwgPSBodG1sO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocHJvbXB0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U3R5bGUoaWQsIGJvdHRvbSwgbGVmdCwgcmlnaHQsIHdpZHRoKSB7XHJcbiAgY29uc3QgcHJvZHVjdGh1bnRNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgcHJvZHVjdGh1bnRNb2RhbC5zdHlsZS5ib3R0b20gPSBib3R0b207XHJcbiAgcHJvZHVjdGh1bnRNb2RhbC5zdHlsZS5sZWZ0ID0gbGVmdCA/IGxlZnQgOiAndW5zZXQnO1xyXG4gIHByb2R1Y3RodW50TW9kYWwuc3R5bGUucmlnaHQgPSByaWdodCA/IHJpZ2h0IDogJ3Vuc2V0JztcclxuICBwcm9kdWN0aHVudE1vZGFsLnN0eWxlLndpZHRoID0gd2lkdGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENsb3NpbmdFdmVudChpZCkge1xyXG4gIGNvbnN0IHByb2R1Y3RodW50TW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgY29uc3QgcHJvZHVjdGh1bnRDbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2lkfS1jbG9zZWApO1xyXG5cclxuICBwcm9kdWN0aHVudENsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgcHJvZHVjdGh1bnRNb2RhbC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBwcm9kdWN0aHVudE1vZGFsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocHJvZHVjdGh1bnRNb2RhbCk7XHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShpZCwgdHJ1ZSk7XHJcbiAgICB9LCAzMDApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShjc3MpIHtcclxuICBjb25zdCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcclxuXHJcbiAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xyXG4gIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xyXG4gIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsICdkYXRhOnRleHQvY3NzO2NoYXJzZXQ9VVRGLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChjc3MpKTtcclxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmtFbGVtZW50KTtcclxufVxyXG4iLCJpbXBvcnQgRmxvYXRpbmdQcm9tcHQgZnJvbSAnLi9mbG9hdGluZ1Byb21wdC5qcyc7XG5leHBvcnQgZGVmYXVsdCBGbG9hdGluZ1Byb21wdDtcblxuLyogZXNsaW50LWRpc2FibGUgKi9cbihmdW5jdGlvbih3aW5kb3cpe1xuICAgd2luZG93LkZsb2F0aW5nUHJvbXB0ID0gRmxvYXRpbmdQcm9tcHQ7XG4gfSkod2luZG93KVxuIC8qIGVzbGludC1lbmFibGUgKi9cbiJdLCJzb3VyY2VSb290IjoiIn0=

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("darkmode-js", [], factory);
	else if(typeof exports === 'object')
		exports["darkmode-js"] = factory();
	else
		root["darkmode-js"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/darkmode.js":
/*!*************************!*\
  !*** ./src/darkmode.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.IS_BROWSER = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IS_BROWSER = typeof window !== 'undefined';
exports.IS_BROWSER = IS_BROWSER;

var Darkmode =
/*#__PURE__*/
function () {
  function Darkmode(options) {
    _classCallCheck(this, Darkmode);

    if (!IS_BROWSER) {
      return;
    }

    var defaultOptions = {
      bottom: '32px',
      right: '32px',
      left: 'unset',
      time: '0.3s',
      mixColor: '#fff',
      backgroundColor: '#fff',
      buttonColorDark: '#100f2c',
      buttonColorLight: '#fff',
      label: '',
      saveInCookies: true,
      autoMatchOsTheme: true
    };
    options = Object.assign({}, defaultOptions, options);
    var css = "\n      .darkmode-layer {\n        position: fixed;\n        pointer-events: none;\n        background: ".concat(options.mixColor, ";\n        transition: all ").concat(options.time, " ease;\n        mix-blend-mode: difference;\n      }\n\n      .darkmode-layer--button {\n        width: 2.9rem;\n        height: 2.9rem;\n        border-radius: 50%;\n        right: ").concat(options.right, ";\n        bottom: ").concat(options.bottom, ";\n        left: ").concat(options.left, ";\n      }\n\n      .darkmode-layer--simple {\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        transform: scale(1) !important;\n      }\n\n      .darkmode-layer--expanded {\n        transform: scale(100);\n        border-radius: 0;\n      }\n\n      .darkmode-layer--no-transition {\n        transition: none;\n      }\n\n      .darkmode-toggle {\n        background: ").concat(options.buttonColorDark, ";\n        width: 3rem;\n        height: 3rem;\n        position: fixed;\n        border-radius: 50%;\n        border:none;\n        right: ").concat(options.right, ";\n        bottom: ").concat(options.bottom, ";\n        left: ").concat(options.left, ";\n        cursor: pointer;\n        transition: all 0.5s ease;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n      }\n\n      .darkmode-toggle--white {\n        background: ").concat(options.buttonColorLight, ";\n      }\n\n      .darkmode-toggle--inactive {\n        display: none;\n      }\n\n      .darkmode-background {\n        background: ").concat(options.backgroundColor, ";\n        position: fixed;\n        pointer-events: none;\n        z-index: -10;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n      }\n\n      img, .darkmode-ignore {\n        isolation: isolate;\n        display: inline-block;\n      }\n\n      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n        .darkmode-toggle {display: none !important}\n      }\n\n      @supports (-ms-ime-align:auto), (-ms-accelerator:true) {\n        .darkmode-toggle {display: none !important}\n      }\n    ");
    var layer = document.createElement('div');
    var button = document.createElement('button');
    var background = document.createElement('div');
    button.innerHTML = options.label;
    button.classList.add('darkmode-toggle--inactive');
    layer.classList.add('darkmode-layer');
    background.classList.add('darkmode-background');
    var darkmodeActivated = window.localStorage.getItem('darkmode') === 'true';
    var preferedThemeOs = options.autoMatchOsTheme && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var darkmodeNeverActivatedByAction = window.localStorage.getItem('darkmode') === null;

    if (darkmodeActivated === true && options.saveInCookies || darkmodeNeverActivatedByAction && preferedThemeOs) {
      layer.classList.add('darkmode-layer--expanded', 'darkmode-layer--simple', 'darkmode-layer--no-transition');
      button.classList.add('darkmode-toggle--white');
      document.body.classList.add('darkmode--activated');
    }

    document.body.insertBefore(button, document.body.firstChild);
    document.body.insertBefore(layer, document.body.firstChild);
    document.body.insertBefore(background, document.body.firstChild);
    this.addStyle(css);
    this.button = button;
    this.layer = layer;
    this.saveInCookies = options.saveInCookies;
    this.time = options.time;
  }

  _createClass(Darkmode, [{
    key: "addStyle",
    value: function addStyle(css) {
      var linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.setAttribute('type', 'text/css');
      linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
      document.head.appendChild(linkElement);
    }
  }, {
    key: "showWidget",
    value: function showWidget() {
      var _this = this;

      if (!IS_BROWSER) {
        return;
      }

      var button = this.button;
      var layer = this.layer;
      var time = parseFloat(this.time) * 1000;
      button.classList.add('darkmode-toggle');
      button.classList.remove('darkmode-toggle--inactive');
      button.setAttribute("aria-label", "Activate dark mode");
      button.setAttribute("aria-checked", "false");
      layer.classList.add('darkmode-layer--button');
      button.addEventListener('click', function () {
        var isDarkmode = _this.isActivated();

        if (!isDarkmode) {
          layer.classList.add('darkmode-layer--expanded');
          button.setAttribute('disabled', true);
          setTimeout(function () {
            layer.classList.add('darkmode-layer--no-transition');
            layer.classList.add('darkmode-layer--simple');
            button.removeAttribute('disabled');
          }, time);
        } else {
          layer.classList.remove('darkmode-layer--simple');
          button.setAttribute('disabled', true);
          setTimeout(function () {
            layer.classList.remove('darkmode-layer--no-transition');
            layer.classList.remove('darkmode-layer--expanded');
            button.removeAttribute('disabled');
          }, 1);
        }

        button.classList.toggle('darkmode-toggle--white');
        document.body.classList.toggle('darkmode--activated');
        window.localStorage.setItem('darkmode', !isDarkmode);
      });
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (!IS_BROWSER) {
        return;
      }

      var layer = this.layer;
      var isDarkmode = this.isActivated();
      var button = this.button;
      layer.classList.toggle('darkmode-layer--simple');
      document.body.classList.toggle('darkmode--activated');
      window.localStorage.setItem('darkmode', !isDarkmode);
      button.setAttribute("aria-label", "De-activate dark mode");
      button.setAttribute("aria-checked", "true");
    }
  }, {
    key: "isActivated",
    value: function isActivated() {
      if (!IS_BROWSER) {
        return null;
      }

      return document.body.classList.contains('darkmode--activated');
    }
  }]);

  return Darkmode;
}();

exports.default = Darkmode;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _darkmode = _interopRequireWildcard(__webpack_require__(/*! ./darkmode */ "./src/darkmode.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var _default = _darkmode.default;
/* eslint-disable */

exports.default = _default;

if (_darkmode.IS_BROWSER) {
  (function (window) {
    window.Darkmode = _darkmode.default;
  })(window);
}
/* eslint-enable */


module.exports = exports["default"];

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXJrbW9kZS1qcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vZGFya21vZGUtanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGFya21vZGUtanMvLi9zcmMvZGFya21vZGUuanMiLCJ3ZWJwYWNrOi8vZGFya21vZGUtanMvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiSVNfQlJPV1NFUiIsIndpbmRvdyIsIkRhcmttb2RlIiwib3B0aW9ucyIsImRlZmF1bHRPcHRpb25zIiwiYm90dG9tIiwicmlnaHQiLCJsZWZ0IiwidGltZSIsIm1peENvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiYnV0dG9uQ29sb3JEYXJrIiwiYnV0dG9uQ29sb3JMaWdodCIsImxhYmVsIiwic2F2ZUluQ29va2llcyIsImF1dG9NYXRjaE9zVGhlbWUiLCJPYmplY3QiLCJhc3NpZ24iLCJjc3MiLCJsYXllciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImJ1dHRvbiIsImJhY2tncm91bmQiLCJpbm5lckhUTUwiLCJjbGFzc0xpc3QiLCJhZGQiLCJkYXJrbW9kZUFjdGl2YXRlZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwcmVmZXJlZFRoZW1lT3MiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImRhcmttb2RlTmV2ZXJBY3RpdmF0ZWRCeUFjdGlvbiIsImJvZHkiLCJpbnNlcnRCZWZvcmUiLCJmaXJzdENoaWxkIiwiYWRkU3R5bGUiLCJsaW5rRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImVuY29kZVVSSUNvbXBvbmVudCIsImhlYWQiLCJhcHBlbmRDaGlsZCIsInBhcnNlRmxvYXQiLCJyZW1vdmUiLCJhZGRFdmVudExpc3RlbmVyIiwiaXNEYXJrbW9kZSIsImlzQWN0aXZhdGVkIiwic2V0VGltZW91dCIsInJlbW92ZUF0dHJpYnV0ZSIsInRvZ2dsZSIsInNldEl0ZW0iLCJjb250YWlucyJdLCJtYXBwaW5n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QixxQkFBL0I7QUFDQWpELFlBQU0sQ0FBQzJCLFlBQVAsQ0FBb0J1QixPQUFwQixDQUE0QixVQUE1QixFQUF3QyxDQUFDTCxVQUF6QztBQUNBeEIsWUFBTSxDQUFDaUIsWUFBUCxDQUFvQixZQUFwQixFQUFrQyx1QkFBbEM7QUFDQWpCLFlBQU0sQ0FBQ2lCLFlBQVAsQ0FBb0IsY0FBcEIsRUFBb0MsTUFBcEM7QUFFRDs7O2tDQUVhO0FBQ1osVUFBSSxDQUFDdkMsVUFBTCxFQUFpQjtBQUNmLGVBQU8sSUFBUDtBQUNEOztBQUNELGFBQU9vQixRQUFRLENBQUNjLElBQVQsQ0FBY1QsU0FBZCxDQUF3QjJCLFFBQXhCLENBQWlDLHFCQUFqQyxDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqT0g7Ozs7O0FBR0E7Ozs7QUFDQSwwQkFBZ0I7QUFDZCxHQUFDLFVBQVNuRCxNQUFULEVBQWlCO0FBQ2hCQSxVQUFNLENBQUNDLFFBQVA7QUFDRCxHQUZELEVBRUdELE1BRkg7QUFHRDtBQUNEIiwiZmlsZSI6ImRhcmttb2RlLWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJkYXJrbW9kZS1qc1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJkYXJrbW9kZS1qc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJkYXJrbW9kZS1qc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImV4cG9ydCBjb25zdCBJU19CUk9XU0VSID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhcmttb2RlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGlmICghSVNfQlJPV1NFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgYm90dG9tOiAnMzJweCcsXG4gICAgICByaWdodDogJzMycHgnLFxuICAgICAgbGVmdDogJ3Vuc2V0JyxcbiAgICAgIHRpbWU6ICcwLjNzJyxcbiAgICAgIG1peENvbG9yOiAnI2ZmZicsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICAgIGJ1dHRvbkNvbG9yRGFyazogJyMxMDBmMmMnLFxuICAgICAgYnV0dG9uQ29sb3JMaWdodDogJyNmZmYnLFxuICAgICAgbGFiZWw6ICcnLFxuICAgICAgc2F2ZUluQ29va2llczogdHJ1ZSxcbiAgICAgIGF1dG9NYXRjaE9zVGhlbWU6IHRydWVcbiAgICB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNzcyA9IGBcbiAgICAgIC5kYXJrbW9kZS1sYXllciB7XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICAgIGJhY2tncm91bmQ6ICR7b3B0aW9ucy5taXhDb2xvcn07XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAke29wdGlvbnMudGltZX0gZWFzZTtcbiAgICAgICAgbWl4LWJsZW5kLW1vZGU6IGRpZmZlcmVuY2U7XG4gICAgICB9XG5cbiAgICAgIC5kYXJrbW9kZS1sYXllci0tYnV0dG9uIHtcbiAgICAgICAgd2lkdGg6IDIuOXJlbTtcbiAgICAgICAgaGVpZ2h0OiAyLjlyZW07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgcmlnaHQ6ICR7b3B0aW9ucy5yaWdodH07XG4gICAgICAgIGJvdHRvbTogJHtvcHRpb25zLmJvdHRvbX07XG4gICAgICAgIGxlZnQ6ICR7b3B0aW9ucy5sZWZ0fTtcbiAgICAgIH1cblxuICAgICAgLmRhcmttb2RlLWxheWVyLS1zaW1wbGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgIWltcG9ydGFudDtcbiAgICAgIH1cblxuICAgICAgLmRhcmttb2RlLWxheWVyLS1leHBhbmRlZCB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMTAwKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICAgIH1cblxuICAgICAgLmRhcmttb2RlLWxheWVyLS1uby10cmFuc2l0aW9uIHtcbiAgICAgICAgdHJhbnNpdGlvbjogbm9uZTtcbiAgICAgIH1cblxuICAgICAgLmRhcmttb2RlLXRvZ2dsZSB7XG4gICAgICAgIGJhY2tncm91bmQ6ICR7b3B0aW9ucy5idXR0b25Db2xvckRhcmt9O1xuICAgICAgICB3aWR0aDogM3JlbTtcbiAgICAgICAgaGVpZ2h0OiAzcmVtO1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgYm9yZGVyOm5vbmU7XG4gICAgICAgIHJpZ2h0OiAke29wdGlvbnMucmlnaHR9O1xuICAgICAgICBib3R0b206ICR7b3B0aW9ucy5ib3R0b219O1xuICAgICAgICBsZWZ0OiAke29wdGlvbnMubGVmdH07XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICB9XG5cbiAgICAgIC5kYXJrbW9kZS10b2dnbGUtLXdoaXRlIHtcbiAgICAgICAgYmFja2dyb3VuZDogJHtvcHRpb25zLmJ1dHRvbkNvbG9yTGlnaHR9O1xuICAgICAgfVxuXG4gICAgICAuZGFya21vZGUtdG9nZ2xlLS1pbmFjdGl2ZSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG5cbiAgICAgIC5kYXJrbW9kZS1iYWNrZ3JvdW5kIHtcbiAgICAgICAgYmFja2dyb3VuZDogJHtvcHRpb25zLmJhY2tncm91bmRDb2xvcn07XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICAgIHotaW5kZXg6IC0xMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgdG9wOiAwO1xuICAgICAgICBsZWZ0OiAwO1xuICAgICAgfVxuXG4gICAgICBpbWcsIC5kYXJrbW9kZS1pZ25vcmUge1xuICAgICAgICBpc29sYXRpb246IGlzb2xhdGU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIH1cblxuICAgICAgQG1lZGlhIHNjcmVlbiBhbmQgKC1tcy1oaWdoLWNvbnRyYXN0OiBhY3RpdmUpLCAoLW1zLWhpZ2gtY29udHJhc3Q6IG5vbmUpIHtcbiAgICAgICAgLmRhcmttb2RlLXRvZ2dsZSB7ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50fVxuICAgICAgfVxuXG4gICAgICBAc3VwcG9ydHMgKC1tcy1pbWUtYWxpZ246YXV0byksICgtbXMtYWNjZWxlcmF0b3I6dHJ1ZSkge1xuICAgICAgICAuZGFya21vZGUtdG9nZ2xlIHtkaXNwbGF5OiBub25lICFpbXBvcnRhbnR9XG4gICAgICB9XG4gICAgYDtcblxuICAgIGNvbnN0IGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgYnV0dG9uLmlubmVySFRNTCA9IG9wdGlvbnMubGFiZWw7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLXRvZ2dsZS0taW5hY3RpdmUnKTtcbiAgICBsYXllci5jbGFzc0xpc3QuYWRkKCdkYXJrbW9kZS1sYXllcicpO1xuICAgIGJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtYmFja2dyb3VuZCcpO1xuXG4gICAgY29uc3QgZGFya21vZGVBY3RpdmF0ZWQgPVxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrbW9kZScpID09PSAndHJ1ZSc7XG4gICAgY29uc3QgcHJlZmVyZWRUaGVtZU9zID1cbiAgICAgIG9wdGlvbnMuYXV0b01hdGNoT3NUaGVtZSAmJlxuICAgICAgd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzO1xuICAgIGNvbnN0IGRhcmttb2RlTmV2ZXJBY3RpdmF0ZWRCeUFjdGlvbiA9XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Rhcmttb2RlJykgPT09IG51bGw7XG5cbiAgICBpZiAoXG4gICAgICAoZGFya21vZGVBY3RpdmF0ZWQgPT09IHRydWUgJiYgb3B0aW9ucy5zYXZlSW5Db29raWVzKSB8fFxuICAgICAgKGRhcmttb2RlTmV2ZXJBY3RpdmF0ZWRCeUFjdGlvbiAmJiBwcmVmZXJlZFRoZW1lT3MpXG4gICAgKSB7XG4gICAgICBsYXllci5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAnZGFya21vZGUtbGF5ZXItLWV4cGFuZGVkJyxcbiAgICAgICAgJ2Rhcmttb2RlLWxheWVyLS1zaW1wbGUnLFxuICAgICAgICAnZGFya21vZGUtbGF5ZXItLW5vLXRyYW5zaXRpb24nXG4gICAgICApO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLXRvZ2dsZS0td2hpdGUnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtLWFjdGl2YXRlZCcpO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGJ1dHRvbiwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcbiAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShsYXllciwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcbiAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShiYWNrZ3JvdW5kLCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xuXG4gICAgdGhpcy5hZGRTdHlsZShjc3MpO1xuXG4gICAgdGhpcy5idXR0b24gPSBidXR0b247XG4gICAgdGhpcy5sYXllciA9IGxheWVyO1xuICAgIHRoaXMuc2F2ZUluQ29va2llcyA9IG9wdGlvbnMuc2F2ZUluQ29va2llcztcbiAgICB0aGlzLnRpbWUgPSBvcHRpb25zLnRpbWU7XG4gIH1cblxuICBhZGRTdHlsZShjc3MpIHtcbiAgICBjb25zdCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblxuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAnaHJlZicsXG4gICAgICAnZGF0YTp0ZXh0L2NzcztjaGFyc2V0PVVURi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY3NzKVxuICAgICk7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rRWxlbWVudCk7XG4gIH1cblxuICBzaG93V2lkZ2V0KCkge1xuICAgIGlmICghSVNfQlJPV1NFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmJ1dHRvbjtcbiAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXI7XG4gICAgY29uc3QgdGltZSA9IHBhcnNlRmxvYXQodGhpcy50aW1lKSAqIDEwMDA7XG5cbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtdG9nZ2xlJyk7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rhcmttb2RlLXRvZ2dsZS0taW5hY3RpdmUnKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIkFjdGl2YXRlIGRhcmsgbW9kZVwiKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIFwiZmFsc2VcIik7XG4gICAgbGF5ZXIuY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtbGF5ZXItLWJ1dHRvbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaXNEYXJrbW9kZSA9IHRoaXMuaXNBY3RpdmF0ZWQoKTtcblxuICAgICAgaWYgKCFpc0Rhcmttb2RlKSB7XG4gICAgICAgIGxheWVyLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLWxheWVyLS1leHBhbmRlZCcpO1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsYXllci5jbGFzc0xpc3QuYWRkKCdkYXJrbW9kZS1sYXllci0tbm8tdHJhbnNpdGlvbicpO1xuICAgICAgICAgIGxheWVyLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLWxheWVyLS1zaW1wbGUnKTtcbiAgICAgICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICB9LCB0aW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rhcmttb2RlLWxheWVyLS1zaW1wbGUnKTtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGFya21vZGUtbGF5ZXItLW5vLXRyYW5zaXRpb24nKTtcbiAgICAgICAgICBsYXllci5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrbW9kZS1sYXllci0tZXhwYW5kZWQnKTtcbiAgICAgICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICB9LCAxKTtcbiAgICAgIH1cblxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2Rhcmttb2RlLXRvZ2dsZS0td2hpdGUnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnZGFya21vZGUtLWFjdGl2YXRlZCcpO1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYXJrbW9kZScsICFpc0Rhcmttb2RlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAoIUlTX0JST1dTRVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyO1xuICAgIGNvbnN0IGlzRGFya21vZGUgPSB0aGlzLmlzQWN0aXZhdGVkKCk7XG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5idXR0b247XG5cbiAgICBsYXllci5jbGFzc0xpc3QudG9nZ2xlKCdkYXJrbW9kZS1sYXllci0tc2ltcGxlJyk7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdkYXJrbW9kZS0tYWN0aXZhdGVkJyk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYXJrbW9kZScsICFpc0Rhcmttb2RlKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIkRlLWFjdGl2YXRlIGRhcmsgbW9kZVwiKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIFwidHJ1ZVwiKTtcblxuICB9XG5cbiAgaXNBY3RpdmF0ZWQoKSB7XG4gICAgaWYgKCFJU19CUk9XU0VSKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXJrbW9kZS0tYWN0aXZhdGVkJyk7XG4gIH1cbn1cbiIsImltcG9ydCBEYXJrbW9kZSwgeyBJU19CUk9XU0VSIH0gZnJvbSAnLi9kYXJrbW9kZSc7XHJcbmV4cG9ydCBkZWZhdWx0IERhcmttb2RlO1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuaWYgKElTX0JST1dTRVIpIHtcclxuICAoZnVuY3Rpb24od2luZG93KSB7XHJcbiAgICB3aW5kb3cuRGFya21vZGUgPSBEYXJrbW9kZTtcclxuICB9KSh3aW5kb3cpO1xyXG59XHJcbi8qIGVzbGludC1lbmFibGUgKi9cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzQyNTU0NjRiZTA0OTA3MGRhZWEiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JxcmF1aHZtcmFfX3RvYmkvanMvdG9iaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0L2xpYi9wcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Rhcmttb2RlLWpzL2xpYi9kYXJrbW9kZS1qcy5qcyJdLCJuYW1lcyI6WyJ0b2JpIiwibmFtZSIsInVybCIsImJvdHRvbSIsIndpZHRoIiwiYWRkRGFya21vZGVXaWRnZXQiLCJzaG93V2lkZ2V0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQTtBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtB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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTs7QUFFQSx1Q0FBdUMsNkJBQTZCLFlBQVksRUFBRSxPQUFPLGlCQUFpQixtQkFBbUIsdUJBQXVCLHNEQUFzRCxzSEFBc0gsNEJBQTRCLDBDQUEwQyxFQUFFLE9BQU8sd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsc0JBQXNCLGVBQWUsRUFBRTs7QUFFdGQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7O0FBR0E7O0FBRUEsT0FBTzs7QUFFUCxVQUFVO0FBQ1YsQ0FBQztBQUNELDJDQUEyQyxjQUFjLHVncUIiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0d2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0O1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiMzQyNTU0NjRiZTA0OTA3MGRhZWFcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYXNzZXRzL1wiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM0MjU1NDY0YmUwNDkwNzBkYWVhIiwiLy8gQ1NTIGFuZCBTQVNTIGZpbGVzXG5pbXBvcnQgJy4vaW5kZXguc2Nzcyc7XG5cbmltcG9ydCBUb2JpIGZyb20gJ3JxcmF1aHZtcmFfX3RvYmknXG5jb25zdCB0b2JpID0gbmV3IFRvYmkoKVxuXG4vLyBSZW1vdmUgdGhlIHR3byBmb2xsb3dpbmcgbGluZXMgdG8gcmVtb3ZlIHRoZSBwcm9kdWN0IGh1bnQgZmxvYXRpbmcgcHJvbXB0XG5pbXBvcnQgRmxvYXRpbmdQcm9tcHQgZnJvbSAncHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0J1xuRmxvYXRpbmdQcm9tcHQoeyBuYW1lOiAnTW9iaWxlIEFwcCBMYW5kaW5nIFBhZ2UnLCB1cmw6ICdodHRwczovL3d3dy5wcm9kdWN0aHVudC5jb20vcG9zdHMvbW9iaWxlLWFwcC1sYW5kaW5nLXBhZ2UnLCBib3R0b206ICc5NnB4Jywgd2lkdGg6ICc0NTBweCcgfSlcblxuLy8gUmVtb3ZlIHRoZSBmb2xsb3dpbmcgbGluZXMgdG8gcmVtb3ZlIHRoZSBkYXJrbW9kZSBqc1xuaW1wb3J0IERhcmttb2RlIGZyb20gJ2Rhcmttb2RlLWpzJ1xuZnVuY3Rpb24gYWRkRGFya21vZGVXaWRnZXQoKSB7XG4gIG5ldyBEYXJrbW9kZSgpLnNob3dXaWRnZXQoKVxufVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBhZGREYXJrbW9kZVdpZGdldClcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvaW5kZXguanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vX3NyYy9pbmRleC5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxyXG4gKiBUb2JpXHJcbiAqXHJcbiAqIEBhdXRob3IgcnFyYXVodm1yYVxyXG4gKiBAdmVyc2lvbiAxLjcuM1xyXG4gKiBAdXJsIGh0dHBzOi8vZ2l0aHViLmNvbS9ycXJhdWh2bXJhL1RvYmlcclxuICpcclxuICogTUlUIExpY2Vuc2VcclxuICovXHJcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgIGRlZmluZShmYWN0b3J5KVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxyXG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXHJcbiAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxyXG4gICAgcm9vdC5Ub2JpID0gZmFjdG9yeSgpXHJcbiAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCdcclxuXHJcbiAgdmFyIFRvYmkgPSBmdW5jdGlvbiBUb2JpICh1c2VyT3B0aW9ucykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBHbG9iYWwgdmFyaWFibGVzXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgY29uZmlnID0ge30sXHJcbiAgICAgIGJyb3dzZXJXaW5kb3cgPSB3aW5kb3csXHJcbiAgICAgIHRyYW5zZm9ybVByb3BlcnR5ID0gbnVsbCxcclxuICAgICAgZ2FsbGVyeSA9IFtdLFxyXG4gICAgICBmaWdjYXB0aW9uSWQgPSAwLFxyXG4gICAgICBlbGVtZW50c0xlbmd0aCA9IDAsXHJcbiAgICAgIGxpZ2h0Ym94ID0gbnVsbCxcclxuICAgICAgc2xpZGVyID0gbnVsbCxcclxuICAgICAgc2xpZGVyRWxlbWVudHMgPSBbXSxcclxuICAgICAgcHJldkJ1dHRvbiA9IG51bGwsXHJcbiAgICAgIG5leHRCdXR0b24gPSBudWxsLFxyXG4gICAgICBjbG9zZUJ1dHRvbiA9IG51bGwsXHJcbiAgICAgIGNvdW50ZXIgPSBudWxsLFxyXG4gICAgICBjdXJyZW50SW5kZXggPSAwLFxyXG4gICAgICBkcmFnID0ge30sXHJcbiAgICAgIHBvaW50ZXJEb3duID0gZmFsc2UsXHJcbiAgICAgIGxhc3RGb2N1cyA9IG51bGwsXHJcbiAgICAgIGZpcnN0Rm9jdXNhYmxlRWwgPSBudWxsLFxyXG4gICAgICBsYXN0Rm9jdXNhYmxlRWwgPSBudWxsLFxyXG4gICAgICBvZmZzZXQgPSBudWxsLFxyXG4gICAgICBvZmZzZXRUbXAgPSBudWxsLFxyXG4gICAgICByZXNpemVUaWNraW5nID0gZmFsc2UsXHJcbiAgICAgIHggPSAwXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB1c2VyIG9wdGlvbnNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXNlck9wdGlvbnMgLSBPcHRpb25hbCB1c2VyIG9wdGlvbnNcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IC0gQ3VzdG9tIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgdmFyIG1lcmdlT3B0aW9ucyA9IGZ1bmN0aW9uIG1lcmdlT3B0aW9ucyAodXNlck9wdGlvbnMpIHtcclxuICAgICAgLy8gRGVmYXVsdCBvcHRpb25zXHJcbiAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIHNlbGVjdG9yOiAnLmxpZ2h0Ym94JyxcclxuICAgICAgICBjYXB0aW9uczogdHJ1ZSxcclxuICAgICAgICBjYXB0aW9uc1NlbGVjdG9yOiAnaW1nJyxcclxuICAgICAgICBjYXB0aW9uQXR0cmlidXRlOiAnYWx0JyxcclxuICAgICAgICBuYXY6ICdhdXRvJyxcclxuICAgICAgICBuYXZUZXh0OiBbJzxzdmcgcm9sZT1cImltZ1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Ym94PVwiMCAwIDI0IDI0XCI+PHBvbHlsaW5lIHBvaW50cz1cIjE0IDE4IDggMTIgMTQgNiAxNCA2XCI+PC9wb2x5bGluZT48L3N2Zz4nLCAnPHN2ZyByb2xlPVwiaW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdib3g9XCIwIDAgMjQgMjRcIj48cG9seWxpbmUgcG9pbnRzPVwiMTAgNiAxNiAxMiAxMCAxOCAxMCAxOFwiPjwvcG9seWxpbmU+PC9zdmc+J10sXHJcbiAgICAgICAgbmF2TGFiZWw6IFsnUHJldmlvdXMnLCAnTmV4dCddLFxyXG4gICAgICAgIGNsb3NlOiB0cnVlLFxyXG4gICAgICAgIGNsb3NlVGV4dDogJzxzdmcgcm9sZT1cImltZ1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Ym94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk02LjM0MzE0NTc1IDYuMzQzMTQ1NzVMMTcuNjU2ODU0MiAxNy42NTY4NTQyTTYuMzQzMTQ1NzUgMTcuNjU2ODU0MkwxNy42NTY4NTQyIDYuMzQzMTQ1NzVcIj48L3BhdGg+PC9zdmc+JyxcclxuICAgICAgICBjbG9zZUxhYmVsOiAnQ2xvc2UnLFxyXG4gICAgICAgIGNvdW50ZXI6IHRydWUsXHJcbiAgICAgICAgZG93bmxvYWQ6IGZhbHNlLCAvLyBUT0RPXHJcbiAgICAgICAgZG93bmxvYWRUZXh0OiAnJywgLy8gVE9ET1xyXG4gICAgICAgIGRvd25sb2FkTGFiZWw6ICdEb3dubG9hZCcsIC8vIFRPRE9cclxuICAgICAgICBrZXlib2FyZDogdHJ1ZSxcclxuICAgICAgICB6b29tOiB0cnVlLFxyXG4gICAgICAgIHpvb21UZXh0OiAnPHN2ZyByb2xlPVwiaW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTQsMjAgTDkuNTg3ODg3NzgsMTQuNDEyMTEyMlwiPjwvcGF0aD48cGF0aCBkPVwiTTE0LDE2IEMxMC42ODYyOTE1LDE2IDgsMTMuMzEzNzA4NSA4LDEwIEM4LDYuNjg2MjkxNSAxMC42ODYyOTE1LDQgMTQsNCBDMTcuMzEzNzA4NSw0IDIwLDYuNjg2MjkxNSAyMCwxMCBDMjAsMTMuMzEzNzA4NSAxNy4zMTM3MDg1LDE2IDE0LDE2IFpcIj48L3BhdGg+PHBhdGggZD1cIk0xNi42NjY2NjY3IDEwTDExLjMzMzMzMzMgMTBNMTQgNy4zMzMzMzMzM0wxNCAxMi42NjY2NjY3XCI+PC9wYXRoPjwvc3ZnPicsXHJcbiAgICAgICAgZG9jQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgc3dpcGVDbG9zZTogdHJ1ZSxcclxuICAgICAgICBzY3JvbGw6IGZhbHNlLFxyXG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwMCxcclxuICAgICAgICBydGw6IGZhbHNlLCAvLyBUT0RPXHJcbiAgICAgICAgbG9vcDogZmFsc2UsIC8vIFRPRE9cclxuICAgICAgICBhdXRvcGxheVZpZGVvOiBmYWxzZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodXNlck9wdGlvbnMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyh1c2VyT3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICBvcHRpb25zW2tleV0gPSB1c2VyT3B0aW9uc1trZXldXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG9wdGlvbnNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBicm93c2VyIHN1cHBvcnRzIHVucHJlZml4ZWQgdHJhbnNmb3JtIHByb3BlcnR5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUcmFuc2Zvcm0gcHJvcGVydHkgc3VwcG9ydGVkIGJ5IGNsaWVudFxyXG4gICAgICovXHJcbiAgICB2YXIgdHJhbnNmb3JtU3VwcG9ydCA9IGZ1bmN0aW9uIHRyYW5zZm9ybVN1cHBvcnQgKCkge1xyXG4gICAgICByZXR1cm4gdHlwZW9mIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPT09ICdzdHJpbmcnID8gJ3RyYW5zZm9ybScgOiAnV2Via2l0VHJhbnNmb3JtJ1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHlwZXMgLSB5b3UgY2FuIGFkZCBuZXcgdHlwZSB0byBzdXBwb3J0IHNvbWV0aGluZyBuZXdcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBzdXBwb3J0ZWRFbGVtZW50cyA9IHtcclxuICAgICAgaW1hZ2U6IHtcclxuICAgICAgICBjaGVja1N1cHBvcnQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gIWVsZW1lbnQuaGFzQXR0cmlidXRlKCdkYXRhLXR5cGUnKSAmJiBlbGVtZW50LmhyZWYubWF0Y2goL1xcLihwbmd8anBlP2d8dGlmZnx0aWZ8Z2lmfGJtcHx3ZWJwfHN2Z3xpY28pJC8pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIGZpZ3VyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZ3VyZScpLFxyXG4gICAgICAgICAgICBmaWdjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmlnY2FwdGlvbicpLFxyXG4gICAgICAgICAgICBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLFxyXG4gICAgICAgICAgICB0aHVtYm5haWwgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLFxyXG4gICAgICAgICAgICBsb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cclxuICAgICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuXHJcbiAgICAgICAgICBpZiAodGh1bWJuYWlsKSB7XHJcbiAgICAgICAgICAgIGltYWdlLmFsdCA9IHRodW1ibmFpbC5hbHQgfHwgJydcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKVxyXG4gICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIGVsZW1lbnQuaHJlZilcclxuXHJcbiAgICAgICAgICAvLyBBZGQgaW1hZ2UgdG8gZmlndXJlXHJcbiAgICAgICAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoaW1hZ2UpXHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIGZpZ2NhcHRpb25cclxuICAgICAgICAgIGlmIChjb25maWcuY2FwdGlvbnMpIHtcclxuICAgICAgICAgICAgZmlnY2FwdGlvbi5zdHlsZS5vcGFjaXR5ID0gJzAnXHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmNhcHRpb25zU2VsZWN0b3IgPT09ICdzZWxmJyAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZShjb25maWcuY2FwdGlvbkF0dHJpYnV0ZSkpIHtcclxuICAgICAgICAgICAgICBmaWdjYXB0aW9uLnRleHRDb250ZW50ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoY29uZmlnLmNhcHRpb25BdHRyaWJ1dGUpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNhcHRpb25zU2VsZWN0b3IgPT09ICdpbWcnICYmIHRodW1ibmFpbCAmJiB0aHVtYm5haWwuZ2V0QXR0cmlidXRlKGNvbmZpZy5jYXB0aW9uQXR0cmlidXRlKSkge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24udGV4dENvbnRlbnQgPSB0aHVtYm5haWwuZ2V0QXR0cmlidXRlKGNvbmZpZy5jYXB0aW9uQXR0cmlidXRlKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlnY2FwdGlvbi50ZXh0Q29udGVudCkge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24uaWQgPSAndG9iaS1maWdjYXB0aW9uLScgKyBmaWdjYXB0aW9uSWRcclxuICAgICAgICAgICAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoZmlnY2FwdGlvbilcclxuXHJcbiAgICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCBmaWdjYXB0aW9uLmlkKVxyXG5cclxuICAgICAgICAgICAgICArK2ZpZ2NhcHRpb25JZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQWRkIGZpZ3VyZSB0byBjb250YWluZXJcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmaWd1cmUpXHJcblxyXG4gICAgICAgICAgLy8gIENyZWF0ZSBsb2FkZXJcclxuICAgICAgICAgIGxvYWRlci5jbGFzc05hbWUgPSAndG9iaS1sb2FkZXInXHJcblxyXG4gICAgICAgICAgLy8gQWRkIGxvYWRlciB0byBjb250YWluZXJcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXHJcblxyXG4gICAgICAgICAgLy8gUmVnaXN0ZXIgdHlwZVxyXG4gICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgJ2ltYWdlJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvblByZWxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIFNhbWUgYXMgcHJlbG9hZFxyXG4gICAgICAgICAgc3VwcG9ydGVkRWxlbWVudHMuaW1hZ2Uub25Mb2FkKGNvbnRhaW5lcilcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciBpbWFnZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKVxyXG5cclxuICAgICAgICAgIGlmICghaW1hZ2UuaGFzQXR0cmlidXRlKCdkYXRhLXNyYycpKSB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHZhciBmaWdjYXB0aW9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ZpZ2NhcHRpb24nKSxcclxuICAgICAgICAgICAgbG9hZGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50b2JpLWxvYWRlcicpXHJcblxyXG4gICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQobG9hZGVyKVxyXG4gICAgICAgICAgICBpbWFnZS5zdHlsZS5vcGFjaXR5ID0gJzEnXHJcblxyXG4gICAgICAgICAgICBpZiAoZmlnY2FwdGlvbikge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24uc3R5bGUub3BhY2l0eSA9ICcxJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpXHJcbiAgICAgICAgICBpbWFnZS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBOb3RoaW5nXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25DbGVhbnVwOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBOb3RoaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgeW91dHViZToge1xyXG4gICAgICAgIGNoZWNrU3VwcG9ydDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgIHJldHVybiBjaGVja1R5cGUoZWxlbWVudCwgJ3lvdXR1YmUnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvblByZWxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25DbGVhbnVwOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAvLyBOb3RoaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaWZyYW1lOiB7XHJcbiAgICAgICAgY2hlY2tTdXBwb3J0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNoZWNrVHlwZShlbGVtZW50LCAnaWZyYW1lJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyksXHJcbiAgICAgICAgICAgIGhyZWYgPSBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpID8gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXHJcblxyXG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpXHJcbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCAnJylcclxuICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgaHJlZilcclxuXHJcbiAgICAgICAgICAvLyBBZGQgaWZyYW1lIHRvIGNvbnRhaW5lclxyXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGlmcmFtZSlcclxuXHJcbiAgICAgICAgICAvLyBSZWdpc3RlciB0eXBlXHJcbiAgICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnLCAnaWZyYW1lJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvblByZWxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciBpZnJhbWUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignaWZyYW1lJylcclxuXHJcbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCBpZnJhbWUuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkNsZWFudXA6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBodG1sOiB7XHJcbiAgICAgICAgY2hlY2tTdXBwb3J0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNoZWNrVHlwZShlbGVtZW50LCAnaHRtbCcpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIHRhcmdldFNlbGVjdG9yID0gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSA/IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykgOiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSxcclxuICAgICAgICAgICAgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRTZWxlY3RvcilcclxuXHJcbiAgICAgICAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwcywgSSBjYW5cXCd0IGZpbmQgdGhlIHRhcmdldCAnICsgdGFyZ2V0U2VsZWN0b3IgKyAnLicpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQWRkIGNvbnRlbnQgdG8gY29udGFpbmVyXHJcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGFyZ2V0KVxyXG5cclxuICAgICAgICAgIC8vIFJlZ2lzdGVyIHR5cGVcclxuICAgICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScsICdodG1sJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvblByZWxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkxvYWQ6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciB2aWRlbyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcblxyXG4gICAgICAgICAgaWYgKHZpZGVvKSB7XHJcbiAgICAgICAgICAgIGlmICh2aWRlby5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGltZScpICYmIHZpZGVvLnJlYWR5U3RhdGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgLy8gQ29udGludWUgd2hlcmUgdmlkZW8gd2FzIHN0b3BwZWRcclxuICAgICAgICAgICAgICB2aWRlby5jdXJyZW50VGltZSA9IHZpZGVvLmdldEF0dHJpYnV0ZSgnZGF0YS10aW1lJylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmZpZy5hdXRvcGxheVZpZGVvKSB7XHJcbiAgICAgICAgICAgICAgLy8gU3RhcnQgcGxheWJhY2sgKGFuZCBsb2FkaW5nIGlmIG5lY2Vzc2FyeSlcclxuICAgICAgICAgICAgICB2aWRlby5wbGF5KClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciB2aWRlbyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCd2aWRlbycpXHJcblxyXG4gICAgICAgICAgaWYgKHZpZGVvKSB7XHJcbiAgICAgICAgICAgIGlmICghdmlkZW8ucGF1c2VkKSB7XHJcbiAgICAgICAgICAgICAgLy8gU3RvcCBpZiB2aWRlbyBpcyBwbGF5aW5nXHJcbiAgICAgICAgICAgICAgdmlkZW8ucGF1c2UoKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBCYWNrdXAgY3VycmVudFRpbWUgKG5lZWRlZCBmb3IgcmV2aXNpdClcclxuICAgICAgICAgICAgaWYgKHZpZGVvLnJlYWR5U3RhdGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKCdkYXRhLXRpbWUnLCB2aWRlby5jdXJyZW50VGltZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uQ2xlYW51cDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIHZpZGVvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuXHJcbiAgICAgICAgICBpZiAodmlkZW8pIHtcclxuICAgICAgICAgICAgaWYgKHZpZGVvLnJlYWR5U3RhdGUgPiAwICYmIHZpZGVvLnJlYWR5U3RhdGUgPCAzICYmIHZpZGVvLmR1cmF0aW9uICE9PSB2aWRlby5jdXJyZW50VGltZSkge1xyXG4gICAgICAgICAgICAgIC8vIFNvbWUgZGF0YSBoYXMgYmVlbiBsb2FkZWQgYnV0IG5vdCB0aGUgd2hvbGUgcGFja2FnZS5cclxuICAgICAgICAgICAgICAvLyBJbiBvcmRlciB0byBzYXZlIGJhbmR3aWR0aCwgc3RvcCBkb3dubG9hZGluZyBhcyBzb29uIGFzIHBvc3NpYmxlLlxyXG4gICAgICAgICAgICAgIHZhciBjbG9uZSA9IHZpZGVvLmNsb25lTm9kZSh0cnVlKVxyXG5cclxuICAgICAgICAgICAgICByZW1vdmVTb3VyY2VzKHZpZGVvKVxyXG4gICAgICAgICAgICAgIHZpZGVvLmxvYWQoKVxyXG5cclxuICAgICAgICAgICAgICB2aWRlby5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZGVvKVxyXG5cclxuICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2xvbmUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gaW5pdCAodXNlck9wdGlvbnMpIHtcclxuICAgICAgLy8gTWVyZ2UgdXNlciBvcHRpb25zIGludG8gZGVmYXVsdHNcclxuICAgICAgY29uZmlnID0gbWVyZ2VPcHRpb25zKHVzZXJPcHRpb25zKVxyXG5cclxuICAgICAgLy8gVHJhbnNmb3JtIHByb3BlcnR5IHN1cHBvcnRlZCBieSBjbGllbnRcclxuICAgICAgdHJhbnNmb3JtUHJvcGVydHkgPSB0cmFuc2Zvcm1TdXBwb3J0KClcclxuXHJcbiAgICAgIC8vIEdldCBhIGxpc3Qgb2YgYWxsIGVsZW1lbnRzIHdpdGhpbiB0aGUgZG9jdW1lbnRcclxuICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjb25maWcuc2VsZWN0b3IpXHJcblxyXG4gICAgICBpZiAoIWVsZW1lbnRzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcHMsIEkgY2FuXFwndCBmaW5kIHRoZSBzZWxlY3RvciAnICsgY29uZmlnLnNlbGVjdG9yICsgJy4nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBFeGVjdXRlIGEgZmV3IHRoaW5ncyBvbmNlIHBlciBlbGVtZW50XHJcbiAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWxlbWVudHMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgYWRkKGVsZW1lbnQpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZWxlbWVudFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFkZFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIGFmdGVyIGFkZFxyXG4gICAgICovXHJcbiAgICB2YXIgYWRkID0gZnVuY3Rpb24gYWRkIChlbGVtZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAvLyBDaGVjayBpZiB0aGUgbGlnaHRib3ggYWxyZWFkeSBleGlzdHNcclxuICAgICAgaWYgKCFsaWdodGJveCkge1xyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbGlnaHRib3hcclxuICAgICAgICBjcmVhdGVMaWdodGJveCgpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgaWYgKGdhbGxlcnkuaW5kZXhPZihlbGVtZW50KSA9PT0gLTEpIHtcclxuICAgICAgICBnYWxsZXJ5LnB1c2goZWxlbWVudClcclxuICAgICAgICBlbGVtZW50c0xlbmd0aCsrXHJcblxyXG4gICAgICAgIC8vIFNldCB6b29tIGljb24gaWYgbmVjZXNzYXJ5XHJcbiAgICAgICAgaWYgKGNvbmZpZy56b29tICYmIGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW1nJykpIHtcclxuICAgICAgICAgIHZhciB0b2JpWm9vbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblxyXG4gICAgICAgICAgdG9iaVpvb20uY2xhc3NOYW1lID0gJ3RvYmktem9vbV9faWNvbidcclxuICAgICAgICAgIHRvYmlab29tLmlubmVySFRNTCA9IGNvbmZpZy56b29tVGV4dFxyXG5cclxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndG9iaS16b29tJylcclxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodG9iaVpvb20pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCaW5kIGNsaWNrIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgICAgICAgb3BlbihnYWxsZXJ5LmluZGV4T2YodGhpcykpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBzbGlkZVxyXG4gICAgICAgIGNyZWF0ZUxpZ2h0Ym94U2xpZGUoZWxlbWVudClcclxuXHJcbiAgICAgICAgaWYgKGlzT3BlbigpKSB7XHJcbiAgICAgICAgICB1cGRhdGVMaWdodGJveCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcHMsIGVsZW1lbnQgYWxyZWFkeSBhZGRlZCB0byB0aGUgbGlnaHRib3guJylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSBsaWdodGJveFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGNyZWF0ZUxpZ2h0Ym94ID0gZnVuY3Rpb24gY3JlYXRlTGlnaHRib3ggKCkge1xyXG4gICAgICAvLyBDcmVhdGUgbGlnaHRib3ggY29udGFpbmVyXHJcbiAgICAgIGxpZ2h0Ym94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpXHJcbiAgICAgIGxpZ2h0Ym94LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpXHJcbiAgICAgIGxpZ2h0Ym94LmNsYXNzTmFtZSA9ICd0b2JpJ1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIHNsaWRlciBjb250YWluZXJcclxuICAgICAgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgc2xpZGVyLmNsYXNzTmFtZSA9ICd0b2JpX19zbGlkZXInXHJcbiAgICAgIGxpZ2h0Ym94LmFwcGVuZENoaWxkKHNsaWRlcilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBwcmV2aW91cyBidXR0b25cclxuICAgICAgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXHJcbiAgICAgIHByZXZCdXR0b24uY2xhc3NOYW1lID0gJ3RvYmlfX3ByZXYnXHJcbiAgICAgIHByZXZCdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpXHJcbiAgICAgIHByZXZCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgY29uZmlnLm5hdkxhYmVsWzBdKVxyXG4gICAgICBwcmV2QnV0dG9uLmlubmVySFRNTCA9IGNvbmZpZy5uYXZUZXh0WzBdXHJcbiAgICAgIGxpZ2h0Ym94LmFwcGVuZENoaWxkKHByZXZCdXR0b24pXHJcblxyXG4gICAgICAvLyBDcmVhdGUgbmV4dCBidXR0b25cclxuICAgICAgbmV4dEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXHJcbiAgICAgIG5leHRCdXR0b24uY2xhc3NOYW1lID0gJ3RvYmlfX25leHQnXHJcbiAgICAgIG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpXHJcbiAgICAgIG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgY29uZmlnLm5hdkxhYmVsWzFdKVxyXG4gICAgICBuZXh0QnV0dG9uLmlubmVySFRNTCA9IGNvbmZpZy5uYXZUZXh0WzFdXHJcbiAgICAgIGxpZ2h0Ym94LmFwcGVuZENoaWxkKG5leHRCdXR0b24pXHJcblxyXG4gICAgICAvLyBDcmVhdGUgY2xvc2UgYnV0dG9uXHJcbiAgICAgIGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcclxuICAgICAgY2xvc2VCdXR0b24uY2xhc3NOYW1lID0gJ3RvYmlfX2Nsb3NlJ1xyXG4gICAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcclxuICAgICAgY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgY29uZmlnLmNsb3NlTGFiZWwpXHJcbiAgICAgIGNsb3NlQnV0dG9uLmlubmVySFRNTCA9IGNvbmZpZy5jbG9zZVRleHRcclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pXHJcblxyXG4gICAgICAvLyBDcmVhdGUgY291bnRlclxyXG4gICAgICBjb3VudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgY291bnRlci5jbGFzc05hbWUgPSAndG9iaV9fY291bnRlcidcclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQoY291bnRlcilcclxuXHJcbiAgICAgIC8vIFJlc2l6ZSBldmVudCB1c2luZyByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgYnJvd3NlcldpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFyZXNpemVUaWNraW5nKSB7XHJcbiAgICAgICAgICByZXNpemVUaWNraW5nID0gdHJ1ZVxyXG4gICAgICAgICAgYnJvd3NlcldpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB1cGRhdGVPZmZzZXQoKVxyXG4gICAgICAgICAgICByZXNpemVUaWNraW5nID0gZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaWdodGJveClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGxpZ2h0Ym94IHNsaWRlXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgY3JlYXRlTGlnaHRib3hTbGlkZSA9IGZ1bmN0aW9uIGNyZWF0ZUxpZ2h0Ym94U2xpZGUgKGVsZW1lbnQpIHtcclxuICAgICAgLy8gRGV0ZWN0IHR5cGVcclxuICAgICAgZm9yICh2YXIgaW5kZXggaW4gc3VwcG9ydGVkRWxlbWVudHMpIHtcclxuICAgICAgICBpZiAoc3VwcG9ydGVkRWxlbWVudHMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XHJcbiAgICAgICAgICBpZiAoc3VwcG9ydGVkRWxlbWVudHNbaW5kZXhdLmNoZWNrU3VwcG9ydChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgc2xpZGUgZWxlbWVudHNcclxuICAgICAgICAgICAgdmFyIHNsaWRlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgICAgICBzbGlkZXJFbGVtZW50Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblxyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LmNsYXNzTmFtZSA9ICd0b2JpX19zbGlkZXJfX3NsaWRlJ1xyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSB4ICogMTAwICsgJyUnXHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnRDb250ZW50LmNsYXNzTmFtZSA9ICd0b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50J1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmZpZy5kcmFnZ2FibGUpIHtcclxuICAgICAgICAgICAgICBzbGlkZXJFbGVtZW50Q29udGVudC5jbGFzc0xpc3QuYWRkKCdkcmFnZ2FibGUnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdHlwZSBlbGVtZW50c1xyXG4gICAgICAgICAgICBzdXBwb3J0ZWRFbGVtZW50c1tpbmRleF0uaW5pdChlbGVtZW50LCBzbGlkZXJFbGVtZW50Q29udGVudClcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBzbGlkZSBjb250ZW50IGNvbnRhaW5lciB0byBzbGlkZXIgZWxlbWVudFxyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50LmFwcGVuZENoaWxkKHNsaWRlckVsZW1lbnRDb250ZW50KVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHNsaWRlciBlbGVtZW50IHRvIHNsaWRlclxyXG4gICAgICAgICAgICBzbGlkZXIuYXBwZW5kQ2hpbGQoc2xpZGVyRWxlbWVudClcclxuICAgICAgICAgICAgc2xpZGVyRWxlbWVudHMucHVzaChzbGlkZXJFbGVtZW50KVxyXG5cclxuICAgICAgICAgICAgKyt4XHJcblxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3BlbiB0aGUgbGlnaHRib3hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCB0byBsb2FkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgYWZ0ZXIgb3BlblxyXG4gICAgICovXHJcbiAgICB2YXIgb3BlbiA9IGZ1bmN0aW9uIG9wZW4gKGluZGV4LCBjYWxsYmFjaykge1xyXG4gICAgICBpZiAoIWlzT3BlbigpICYmICFpbmRleCkge1xyXG4gICAgICAgIGluZGV4ID0gMFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNPcGVuKCkpIHtcclxuICAgICAgICBpZiAoIWluZGV4KSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwcywgVG9iaSBpcyBhbGVhZHkgb3Blbi4nKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBzbGlkZSAnICsgaW5kZXggKyAnIGlzIGFscmVhZHkgc2VsZWN0ZWQuJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEgfHwgaW5kZXggPj0gZWxlbWVudHNMZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwcywgSSBjYW5cXCd0IGZpbmQgc2xpZGUgJyArIGluZGV4ICsgJy4nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWNvbmZpZy5zY3JvbGwpIHtcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndG9iaS1pcy1vcGVuJylcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RvYmktaXMtb3BlbicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhpZGUgYnV0dG9ucyBpZiBuZWNlc3NhcnlcclxuICAgICAgaWYgKCFjb25maWcubmF2IHx8IGVsZW1lbnRzTGVuZ3RoID09PSAxIHx8IChjb25maWcubmF2ID09PSAnYXV0bycgJiYgJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSkge1xyXG4gICAgICAgIHByZXZCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgICBuZXh0QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJylcclxuICAgICAgICBuZXh0QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBIaWRlIGNvdW50ZXIgaWYgbmVjZXNzYXJ5XHJcbiAgICAgIGlmICghY29uZmlnLmNvdW50ZXIgfHwgZWxlbWVudHNMZW5ndGggPT09IDEpIHtcclxuICAgICAgICBjb3VudGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY291bnRlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSGlkZSBjbG9zZSBpZiBuZWNlc3NhcnlcclxuICAgICAgaWYgKCFjb25maWcuY2xvc2UpIHtcclxuICAgICAgICBjbG9zZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlXHJcbiAgICAgICAgY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU2F2ZSB0aGUgdXNlcuKAmXMgZm9jdXNcclxuICAgICAgbGFzdEZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxyXG5cclxuICAgICAgLy8gU2V0IGN1cnJlbnQgaW5kZXhcclxuICAgICAgY3VycmVudEluZGV4ID0gaW5kZXhcclxuXHJcbiAgICAgIC8vIENsZWFyIGRyYWdcclxuICAgICAgY2xlYXJEcmFnKClcclxuXHJcbiAgICAgIC8vIEJpbmQgZXZlbnRzXHJcbiAgICAgIGJpbmRFdmVudHMoKVxyXG5cclxuICAgICAgLy8gTG9hZCBzbGlkZVxyXG4gICAgICBsb2FkKGN1cnJlbnRJbmRleClcclxuXHJcbiAgICAgIC8vIE1ha2VzIGxpZ2h0Ym94IGFwcGVhciwgdG9vXHJcbiAgICAgIGxpZ2h0Ym94LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKVxyXG5cclxuICAgICAgLy8gVXBkYXRlIGxpZ2h0Ym94XHJcbiAgICAgIHVwZGF0ZUxpZ2h0Ym94KClcclxuXHJcbiAgICAgIC8vIFByZWxvYWQgbGF0ZVxyXG4gICAgICBwcmVsb2FkKGN1cnJlbnRJbmRleCArIDEpXHJcbiAgICAgIHByZWxvYWQoY3VycmVudEluZGV4IC0gMSlcclxuXHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvc2UgdGhlIGxpZ2h0Ym94XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB0byBjYWxsIGFmdGVyIGNsb3NlXHJcbiAgICAgKi9cclxuICAgIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlIChjYWxsYmFjaykge1xyXG4gICAgICBpZiAoIWlzT3BlbigpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUb2JpIGlzIGFscmVhZHkgY2xvc2VkLicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY29uZmlnLnNjcm9sbCkge1xyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd0b2JpLWlzLW9wZW4nKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndG9iaS1pcy1vcGVuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVW5iaW5kIGV2ZW50c1xyXG4gICAgICB1bmJpbmRFdmVudHMoKVxyXG5cclxuICAgICAgLy8gUmVlbmFibGUgdGhlIHVzZXLigJlzIGZvY3VzXHJcbiAgICAgIGxhc3RGb2N1cy5mb2N1cygpXHJcblxyXG4gICAgICAvLyBEb24ndCBmb3JnZXQgdG8gY2xlYW51cCBvdXIgY3VycmVudCBlbGVtZW50XHJcbiAgICAgIHZhciBjb250YWluZXIgPSBzbGlkZXJFbGVtZW50c1tjdXJyZW50SW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJy50b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50JylcclxuICAgICAgdmFyIHR5cGUgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKVxyXG4gICAgICBzdXBwb3J0ZWRFbGVtZW50c1t0eXBlXS5vbkxlYXZlKGNvbnRhaW5lcilcclxuICAgICAgc3VwcG9ydGVkRWxlbWVudHNbdHlwZV0ub25DbGVhbnVwKGNvbnRhaW5lcilcclxuXHJcbiAgICAgIGxpZ2h0Ym94LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpXHJcblxyXG4gICAgICAvLyBSZXNldCBjdXJyZW50IGluZGV4XHJcbiAgICAgIGN1cnJlbnRJbmRleCA9IDBcclxuXHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJlbG9hZCBzbGlkZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IHRvIHByZWxvYWRcclxuICAgICAqL1xyXG4gICAgdmFyIHByZWxvYWQgPSBmdW5jdGlvbiBwcmVsb2FkIChpbmRleCkge1xyXG4gICAgICBpZiAoc2xpZGVyRWxlbWVudHNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNvbnRhaW5lciA9IHNsaWRlckVsZW1lbnRzW2luZGV4XS5xdWVyeVNlbGVjdG9yKCcudG9iaV9fc2xpZGVyX19zbGlkZV9fY29udGVudCcpXHJcbiAgICAgIHZhciB0eXBlID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJylcclxuXHJcbiAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW3R5cGVdLm9uUHJlbG9hZChjb250YWluZXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkIHNsaWRlXHJcbiAgICAgKiBXaWxsIGJlIGNhbGxlZCB3aGVuIG9wZW5pbmcgdGhlIGxpZ2h0Ym94IG9yIG1vdmluZyBpbmRleFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IHRvIGxvYWRcclxuICAgICAqL1xyXG4gICAgdmFyIGxvYWQgPSBmdW5jdGlvbiBsb2FkIChpbmRleCkge1xyXG4gICAgICBpZiAoc2xpZGVyRWxlbWVudHNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNvbnRhaW5lciA9IHNsaWRlckVsZW1lbnRzW2luZGV4XS5xdWVyeVNlbGVjdG9yKCcudG9iaV9fc2xpZGVyX19zbGlkZV9fY29udGVudCcpXHJcbiAgICAgIHZhciB0eXBlID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJylcclxuXHJcbiAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW3R5cGVdLm9uTG9hZChjb250YWluZXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOYXZpZ2F0ZSB0byB0aGUgcHJldmlvdXMgc2xpZGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgKi9cclxuICAgIHZhciBwcmV2ID0gZnVuY3Rpb24gcHJldiAoY2FsbGJhY2spIHtcclxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcclxuICAgICAgICBsZWF2ZShjdXJyZW50SW5kZXgpXHJcbiAgICAgICAgbG9hZCgtLWN1cnJlbnRJbmRleClcclxuICAgICAgICB1cGRhdGVMaWdodGJveCgnbGVmdCcpXHJcbiAgICAgICAgY2xlYW51cChjdXJyZW50SW5kZXggKyAxKVxyXG4gICAgICAgIHByZWxvYWQoY3VycmVudEluZGV4IC0gMSlcclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOYXZpZ2F0ZSB0byB0aGUgbmV4dCBzbGlkZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgdmFyIG5leHQgPSBmdW5jdGlvbiBuZXh0IChjYWxsYmFjaykge1xyXG4gICAgICBpZiAoY3VycmVudEluZGV4IDwgZWxlbWVudHNMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgbGVhdmUoY3VycmVudEluZGV4KVxyXG4gICAgICAgIGxvYWQoKytjdXJyZW50SW5kZXgpXHJcbiAgICAgICAgdXBkYXRlTGlnaHRib3goJ3JpZ2h0JylcclxuICAgICAgICBjbGVhbnVwKGN1cnJlbnRJbmRleCAtIDEpXHJcbiAgICAgICAgcHJlbG9hZChjdXJyZW50SW5kZXggKyAxKVxyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExlYXZlIHNsaWRlXHJcbiAgICAgKiBXaWxsIGJlIGNhbGxlZCBiZWZvcmUgbW92aW5nIGluZGV4XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggdG8gbGVhdmVcclxuICAgICAqL1xyXG4gICAgdmFyIGxlYXZlID0gZnVuY3Rpb24gbGVhdmUgKGluZGV4KSB7XHJcbiAgICAgIGlmIChzbGlkZXJFbGVtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY29udGFpbmVyID0gc2xpZGVyRWxlbWVudHNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJy50b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50JylcclxuICAgICAgdmFyIHR5cGUgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKVxyXG5cclxuICAgICAgc3VwcG9ydGVkRWxlbWVudHNbdHlwZV0ub25MZWF2ZShjb250YWluZXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhbnVwIHNsaWRlXHJcbiAgICAgKiBXaWxsIGJlIGNhbGxlZCBhZnRlciBtb3ZpbmcgaW5kZXhcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCB0byBjbGVhbnVwXHJcbiAgICAgKi9cclxuICAgIHZhciBjbGVhbnVwID0gZnVuY3Rpb24gY2xlYW51cCAoaW5kZXgpIHtcclxuICAgICAgaWYgKHNsaWRlckVsZW1lbnRzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjb250YWluZXIgPSBzbGlkZXJFbGVtZW50c1tpbmRleF0ucXVlcnlTZWxlY3RvcignLnRvYmlfX3NsaWRlcl9fc2xpZGVfX2NvbnRlbnQnKVxyXG4gICAgICB2YXIgdHlwZSA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpXHJcblxyXG4gICAgICBzdXBwb3J0ZWRFbGVtZW50c1t0eXBlXS5vbkNsZWFudXAoY29udGFpbmVyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHRoZSBvZmZzZXRcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiB1cGRhdGVPZmZzZXQgKCkge1xyXG4gICAgICBvZmZzZXQgPSAtY3VycmVudEluZGV4ICogd2luZG93LmlubmVyV2lkdGhcclxuXHJcbiAgICAgIHNsaWRlci5zdHlsZVt0cmFuc2Zvcm1Qcm9wZXJ0eV0gPSAndHJhbnNsYXRlM2QoJyArIG9mZnNldCArICdweCwgMCwgMCknXHJcbiAgICAgIG9mZnNldFRtcCA9IG9mZnNldFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIHRoZSBjb3VudGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgdXBkYXRlQ291bnRlciA9IGZ1bmN0aW9uIHVwZGF0ZUNvdW50ZXIgKCkge1xyXG4gICAgICBjb3VudGVyLnRleHRDb250ZW50ID0gKGN1cnJlbnRJbmRleCArIDEpICsgJy8nICsgZWxlbWVudHNMZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgZm9jdXMgdG8gdGhlIG5leHQgZWxlbWVudFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgLSBDdXJyZW50IHNsaWRlIGRpcmVjdGlvblxyXG4gICAgICovXHJcbiAgICB2YXIgdXBkYXRlRm9jdXMgPSBmdW5jdGlvbiB1cGRhdGVGb2N1cyAoZGlyKSB7XHJcbiAgICAgIHZhciBmb2N1c2FibGVFbHMgPSBudWxsXHJcblxyXG4gICAgICBpZiAoY29uZmlnLm5hdikge1xyXG4gICAgICAgIC8vIERpc3BsYXkgdGhlIG5leHQgYW5kIHByZXZpb3VzIGJ1dHRvbnNcclxuICAgICAgICBwcmV2QnV0dG9uLmRpc2FibGVkID0gZmFsc2VcclxuICAgICAgICBuZXh0QnV0dG9uLmRpc2FibGVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnRzTGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAvLyBIaWRlIHRoZSBuZXh0IGFuZCBwcmV2aW91cyBidXR0b25zIGlmIHRoZXJlIGlzIG9ubHkgb25lIHNsaWRlXHJcbiAgICAgICAgICBwcmV2QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgICAgICAgbmV4dEJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcclxuXHJcbiAgICAgICAgICBpZiAoY29uZmlnLmNsb3NlKSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uLmZvY3VzKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgLy8gSGlkZSB0aGUgcHJldmlvdXMgYnV0dG9uIHdoZW4gdGhlIGZpcnN0IHNsaWRlIGlzIGRpc3BsYXllZFxyXG4gICAgICAgICAgcHJldkJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcclxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJbmRleCA9PT0gZWxlbWVudHNMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAvLyBIaWRlIHRoZSBuZXh0IGJ1dHRvbiB3aGVuIHRoZSBsYXN0IHNsaWRlIGlzIGRpc3BsYXllZFxyXG4gICAgICAgICAgbmV4dEJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGlyICYmICFuZXh0QnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmZvY3VzKClcclxuICAgICAgICB9IGVsc2UgaWYgKCFkaXIgJiYgbmV4dEJ1dHRvbi5kaXNhYmxlZCAmJiAhcHJldkJ1dHRvbi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgcHJldkJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmICghbmV4dEJ1dHRvbi5kaXNhYmxlZCAmJiBkaXIgPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgIG5leHRCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAobmV4dEJ1dHRvbi5kaXNhYmxlZCAmJiBkaXIgPT09ICdyaWdodCcgJiYgIXByZXZCdXR0b24uZGlzYWJsZWQpIHtcclxuICAgICAgICAgIHByZXZCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIXByZXZCdXR0b24uZGlzYWJsZWQgJiYgZGlyID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgIHByZXZCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAocHJldkJ1dHRvbi5kaXNhYmxlZCAmJiBkaXIgPT09ICdsZWZ0JyAmJiAhbmV4dEJ1dHRvbi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgbmV4dEJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNvbmZpZy5jbG9zZSkge1xyXG4gICAgICAgIGNsb3NlQnV0dG9uLmZvY3VzKClcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9jdXNhYmxlRWxzID0gbGlnaHRib3gucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uOm5vdCg6ZGlzYWJsZWQpJylcclxuICAgICAgZmlyc3RGb2N1c2FibGVFbCA9IGZvY3VzYWJsZUVsc1swXVxyXG4gICAgICBsYXN0Rm9jdXNhYmxlRWwgPSBmb2N1c2FibGVFbHMubGVuZ3RoID09PSAxID8gZm9jdXNhYmxlRWxzWzBdIDogZm9jdXNhYmxlRWxzW2ZvY3VzYWJsZUVscy5sZW5ndGggLSAxXVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgZHJhZyBhZnRlciB0b3VjaGVuZCBhbmQgbW91c3VwIGV2ZW50XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgY2xlYXJEcmFnID0gZnVuY3Rpb24gY2xlYXJEcmFnICgpIHtcclxuICAgICAgZHJhZyA9IHtcclxuICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgZW5kWDogMCxcclxuICAgICAgICBzdGFydFk6IDAsXHJcbiAgICAgICAgZW5kWTogMFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWNhbGN1bGF0ZSBkcmFnIC8gc3dpcGUgZXZlbnRcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVBZnRlckRyYWcgPSBmdW5jdGlvbiB1cGRhdGVBZnRlckRyYWcgKCkge1xyXG4gICAgICB2YXIgbW92ZW1lbnRYID0gZHJhZy5lbmRYIC0gZHJhZy5zdGFydFgsXHJcbiAgICAgICAgbW92ZW1lbnRZID0gZHJhZy5lbmRZIC0gZHJhZy5zdGFydFksXHJcbiAgICAgICAgbW92ZW1lbnRYRGlzdGFuY2UgPSBNYXRoLmFicyhtb3ZlbWVudFgpLFxyXG4gICAgICAgIG1vdmVtZW50WURpc3RhbmNlID0gTWF0aC5hYnMobW92ZW1lbnRZKVxyXG5cclxuICAgICAgaWYgKG1vdmVtZW50WCA+IDAgJiYgbW92ZW1lbnRYRGlzdGFuY2UgPiBjb25maWcudGhyZXNob2xkICYmIGN1cnJlbnRJbmRleCA+IDApIHtcclxuICAgICAgICBwcmV2KClcclxuICAgICAgfSBlbHNlIGlmIChtb3ZlbWVudFggPCAwICYmIG1vdmVtZW50WERpc3RhbmNlID4gY29uZmlnLnRocmVzaG9sZCAmJiBjdXJyZW50SW5kZXggIT09IGVsZW1lbnRzTGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIG5leHQoKVxyXG4gICAgICB9IGVsc2UgaWYgKG1vdmVtZW50WSA8IDAgJiYgbW92ZW1lbnRZRGlzdGFuY2UgPiBjb25maWcudGhyZXNob2xkICYmIGNvbmZpZy5zd2lwZUNsb3NlKSB7XHJcbiAgICAgICAgY2xvc2UoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVwZGF0ZU9mZnNldCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsaWNrIGV2ZW50IGhhbmRsZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiBjbGlja0hhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHByZXZCdXR0b24pIHtcclxuICAgICAgICBwcmV2KClcclxuICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IG5leHRCdXR0b24pIHtcclxuICAgICAgICBuZXh0KClcclxuICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGNsb3NlQnV0dG9uIHx8IGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICd0b2JpX19zbGlkZXJfX3NsaWRlJykge1xyXG4gICAgICAgIGNsb3NlKClcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEtleWRvd24gZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGtleWRvd25IYW5kbGVyID0gZnVuY3Rpb24ga2V5ZG93bkhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSA5KSB7XHJcbiAgICAgICAgLy8gYFRBQmAgS2V5OiBOYXZpZ2F0ZSB0byB0aGUgbmV4dC9wcmV2aW91cyBmb2N1c2FibGUgZWxlbWVudFxyXG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgLy8gU3RlcCBiYWNrd2FyZHMgaW4gdGhlIHRhYi1vcmRlclxyXG4gICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0Rm9jdXNhYmxlRWwpIHtcclxuICAgICAgICAgICAgbGFzdEZvY3VzYWJsZUVsLmZvY3VzKClcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBTdGVwIGZvcndhcmQgaW4gdGhlIHRhYi1vcmRlclxyXG4gICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RGb2N1c2FibGVFbCkge1xyXG4gICAgICAgICAgICBmaXJzdEZvY3VzYWJsZUVsLmZvY3VzKClcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAyNykge1xyXG4gICAgICAgIC8vIGBFU0NgIEtleTogQ2xvc2UgdGhlIGxpZ2h0Ym94XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNsb3NlKClcclxuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAzNykge1xyXG4gICAgICAgIC8vIGBQUkVWYCBLZXk6IE5hdmlnYXRlIHRvIHRoZSBwcmV2aW91cyBzbGlkZVxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBwcmV2KClcclxuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xyXG4gICAgICAgIC8vIGBORVhUYCBLZXk6IE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIG5leHQoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUb3VjaHN0YXJ0IGV2ZW50IGhhbmRsZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB0b3VjaHN0YXJ0SGFuZGxlciA9IGZ1bmN0aW9uIHRvdWNoc3RhcnRIYW5kbGVyIChldmVudCkge1xyXG4gICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIC8gc3dpcGluZyBvbiB0ZXh0YXJlYXMgaW5wdXRzLCBzZWxlY3RzIGFuZCB2aWRlb3NcclxuICAgICAgdmFyIGlnbm9yZUVsZW1lbnRzID0gWydURVhUQVJFQScsICdPUFRJT04nLCAnSU5QVVQnLCAnU0VMRUNUJywgJ1ZJREVPJ10uaW5kZXhPZihldmVudC50YXJnZXQubm9kZU5hbWUpICE9PSAtMVxyXG5cclxuICAgICAgaWYgKGlnbm9yZUVsZW1lbnRzKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBwb2ludGVyRG93biA9IHRydWVcclxuXHJcbiAgICAgIGRyYWcuc3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWFxyXG4gICAgICBkcmFnLnN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRvdWNobW92ZSBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgdG91Y2htb3ZlSGFuZGxlciA9IGZ1bmN0aW9uIHRvdWNobW92ZUhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBpZiAocG9pbnRlckRvd24pIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgICAgIGRyYWcuZW5kWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVhcclxuICAgICAgICBkcmFnLmVuZFkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZXHJcblxyXG4gICAgICAgIHNsaWRlci5zdHlsZVt0cmFuc2Zvcm1Qcm9wZXJ0eV0gPSAndHJhbnNsYXRlM2QoJyArIChvZmZzZXRUbXAgLSBNYXRoLnJvdW5kKGRyYWcuc3RhcnRYIC0gZHJhZy5lbmRYKSkgKyAncHgsIDAsIDApJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUb3VjaGVuZCBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgdG91Y2hlbmRIYW5kbGVyID0gZnVuY3Rpb24gdG91Y2hlbmRIYW5kbGVyIChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgcG9pbnRlckRvd24gPSBmYWxzZVxyXG5cclxuICAgICAgaWYgKGRyYWcuZW5kWCkge1xyXG4gICAgICAgIHVwZGF0ZUFmdGVyRHJhZygpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNsZWFyRHJhZygpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3VzZWRvd24gZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIG1vdXNlZG93bkhhbmRsZXIgPSBmdW5jdGlvbiBtb3VzZWRvd25IYW5kbGVyIChldmVudCkge1xyXG4gICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIC8gc3dpcGluZyBvbiB0ZXh0YXJlYXMgaW5wdXRzLCBzZWxlY3RzIGFuZCB2aWRlb3NcclxuICAgICAgdmFyIGlnbm9yZUVsZW1lbnRzID0gWydURVhUQVJFQScsICdPUFRJT04nLCAnSU5QVVQnLCAnU0VMRUNUJywgJ1ZJREVPJ10uaW5kZXhPZihldmVudC50YXJnZXQubm9kZU5hbWUpICE9PSAtMVxyXG5cclxuICAgICAgaWYgKGlnbm9yZUVsZW1lbnRzKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgIHBvaW50ZXJEb3duID0gdHJ1ZVxyXG4gICAgICBkcmFnLnN0YXJ0WCA9IGV2ZW50LnBhZ2VYXHJcbiAgICAgIGRyYWcuc3RhcnRZID0gZXZlbnQucGFnZVlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdXNlbW92ZSBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgbW91c2Vtb3ZlSGFuZGxlciA9IGZ1bmN0aW9uIG1vdXNlbW92ZUhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgIGlmIChwb2ludGVyRG93bikge1xyXG4gICAgICAgIGRyYWcuZW5kWCA9IGV2ZW50LnBhZ2VYXHJcbiAgICAgICAgZHJhZy5lbmRZID0gZXZlbnQucGFnZVlcclxuXHJcbiAgICAgICAgc2xpZGVyLnN0eWxlW3RyYW5zZm9ybVByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgKG9mZnNldFRtcCAtIE1hdGgucm91bmQoZHJhZy5zdGFydFggLSBkcmFnLmVuZFgpKSArICdweCwgMCwgMCknXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdXNldXAgZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIG1vdXNldXBIYW5kbGVyID0gZnVuY3Rpb24gbW91c2V1cEhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBwb2ludGVyRG93biA9IGZhbHNlXHJcblxyXG4gICAgICBpZiAoZHJhZy5lbmRYKSB7XHJcbiAgICAgICAgdXBkYXRlQWZ0ZXJEcmFnKClcclxuICAgICAgfVxyXG5cclxuICAgICAgY2xlYXJEcmFnKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmQgZXZlbnRzXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgYmluZEV2ZW50cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHMgKCkge1xyXG4gICAgICBpZiAoY29uZmlnLmtleWJvYXJkKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd25IYW5kbGVyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDbGljayBldmVudHNcclxuICAgICAgaWYgKGNvbmZpZy5kb2NDbG9zZSkge1xyXG4gICAgICAgIGxpZ2h0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcilcclxuXHJcbiAgICAgIGlmIChjb25maWcuZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgLy8gVG91Y2ggZXZlbnRzXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoc3RhcnRIYW5kbGVyKVxyXG4gICAgICAgIGxpZ2h0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNobW92ZUhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZEhhbmRsZXIpXHJcblxyXG4gICAgICAgIC8vIE1vdXNlIGV2ZW50c1xyXG4gICAgICAgIGxpZ2h0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlZG93bkhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXBIYW5kbGVyKVxyXG4gICAgICAgIGxpZ2h0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZUhhbmRsZXIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuYmluZCBldmVudHNcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB1bmJpbmRFdmVudHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHMgKCkge1xyXG4gICAgICBpZiAoY29uZmlnLmtleWJvYXJkKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd25IYW5kbGVyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDbGljayBldmVudHNcclxuICAgICAgaWYgKGNvbmZpZy5kb2NDbG9zZSkge1xyXG4gICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBwcmV2QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgICBuZXh0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgICBjbG9zZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcilcclxuXHJcbiAgICAgIGlmIChjb25maWcuZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgLy8gVG91Y2ggZXZlbnRzXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoc3RhcnRIYW5kbGVyKVxyXG4gICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNobW92ZUhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaGVuZEhhbmRsZXIpXHJcblxyXG4gICAgICAgIC8vIE1vdXNlIGV2ZW50c1xyXG4gICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlZG93bkhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXBIYW5kbGVyKVxyXG4gICAgICAgIGxpZ2h0Ym94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZUhhbmRsZXIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyB3aGV0aGVyIGVsZW1lbnQgaGFzIHJlcXVlc3RlZCBkYXRhLXR5cGUgdmFsdWVcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjaGVja1R5cGUgPSBmdW5jdGlvbiBjaGVja1R5cGUgKGVsZW1lbnQsIHR5cGUpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSA9PT0gdHlwZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFsbCBgc3JjYCBhdHRyaWJ1dGVzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gcmVtb3ZlIGFsbCBgc3JjYCBhdHRyaWJ1dGVzXHJcbiAgICAgKi9cclxuICAgIHZhciByZW1vdmVTb3VyY2VzID0gZnVuY3Rpb24gc2V0VmlkZW9Tb3VyY2VzIChlbGVtZW50KSB7XHJcbiAgICAgIHZhciBzb3VyY2VzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzcmMnKVxyXG5cclxuICAgICAgaWYgKHNvdXJjZXMpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHNvdXJjZXMsIGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgICAgIHNvdXJjZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSBsaWdodGJveFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaXIgLSBDdXJyZW50IHNsaWRlIGRpcmVjdGlvblxyXG4gICAgICovXHJcbiAgICB2YXIgdXBkYXRlTGlnaHRib3ggPSBmdW5jdGlvbiB1cGRhdGVMaWdodGJveCAoZGlyKSB7XHJcbiAgICAgIHVwZGF0ZU9mZnNldCgpXHJcbiAgICAgIHVwZGF0ZUNvdW50ZXIoKVxyXG4gICAgICB1cGRhdGVGb2N1cyhkaXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCB0aGUgbGlnaHRib3hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgYWZ0ZXIgcmVzZXRcclxuICAgICAqL1xyXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gcmVzZXQgKGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmIChzbGlkZXIpIHtcclxuICAgICAgICB3aGlsZSAoc2xpZGVyLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgIHNsaWRlci5yZW1vdmVDaGlsZChzbGlkZXIuZmlyc3RDaGlsZClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdhbGxlcnkubGVuZ3RoID0gc2xpZGVyRWxlbWVudHMubGVuZ3RoID0gZWxlbWVudHNMZW5ndGggPSBmaWdjYXB0aW9uSWQgPSB4ID0gMFxyXG5cclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgbGlnaHRib3ggaXMgb3BlblxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGlzT3BlbiA9IGZ1bmN0aW9uIGlzT3BlbiAoKSB7XHJcbiAgICAgIHJldHVybiBsaWdodGJveC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICdmYWxzZSdcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBjdXJyZW50IGluZGV4XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgY3VycmVudFNsaWRlID0gZnVuY3Rpb24gY3VycmVudFNsaWRlICgpIHtcclxuICAgICAgcmV0dXJuIGN1cnJlbnRJbmRleFxyXG4gICAgfVxyXG5cclxuICAgIGluaXQodXNlck9wdGlvbnMpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb3Blbjogb3BlbixcclxuICAgICAgcHJldjogcHJldixcclxuICAgICAgbmV4dDogbmV4dCxcclxuICAgICAgY2xvc2U6IGNsb3NlLFxyXG4gICAgICBhZGQ6IGFkZCxcclxuICAgICAgcmVzZXQ6IHJlc2V0LFxyXG4gICAgICBpc09wZW46IGlzT3BlbixcclxuICAgICAgY3VycmVudFNsaWRlOiBjdXJyZW50U2xpZGVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBUb2JpXHJcbn0pKVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ycXJhdWh2bXJhX190b2JpL2pzL3RvYmkuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJwcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHRcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInByb2R1Y3RodW50LWZsb2F0aW5nLXByb21wdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGk6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bDogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuLyoqKioqKi8gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuLyoqKioqKi8gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4vKioqKioqLyBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLyoqKioqKi8gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4vKioqKioqLyBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbi8qKioqKiovIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4vKioqKioqLyBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gbnM7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovICh7XG5cbi8qKiovIFwiLi9zcmMvZmxvYXRpbmdQcm9tcHQuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvZmxvYXRpbmdQcm9tcHQuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZsb2F0aW5nUHJvbXB0O1xuXG5mdW5jdGlvbiBmbG9hdGluZ1Byb21wdChvcHRpb25zKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlICovXG4gIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lO1xuICB2YXIgdXJsID0gb3B0aW9ucy51cmw7XG4gIHZhciB0ZXh0ID0gb3B0aW9ucy50ZXh0ID8gb3B0aW9ucy50ZXh0IDogXCJIaSwgZG8geW91IGxpa2UgXCIuY29uY2F0KG5hbWUsIFwiID8gRG9uJ3QgZm9yZ2V0IHRvIHNob3cgeW91ciBsb3ZlIG9uIFByb2R1Y3QgSHVudCBcXHVEODNEXFx1REU4MFwiKTtcbiAgdmFyIGJ1dHRvblRleHQgPSBvcHRpb25zLmJ1dHRvblRleHQgPyBvcHRpb25zLmJ1dHRvblRleHQgOiBcIlwiLmNvbmNhdChuYW1lLCBcIiBvbiBQcm9kdWN0IEh1bnRcIik7XG4gIHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGggPyBvcHRpb25zLndpZHRoIDogJzMwMHB4JztcbiAgdmFyIGJvdHRvbSA9IG9wdGlvbnMuYm90dG9tID8gb3B0aW9ucy5ib3R0b20gOiAnMzJweCc7XG4gIHZhciByaWdodCA9IG9wdGlvbnMucmlnaHQgPyBvcHRpb25zLnJpZ2h0IDogJzMycHgnO1xuICB2YXIgbGVmdCA9IG9wdGlvbnMubGVmdCA/IG9wdGlvbnMubGVmdCA6ICd1bnNldCc7XG4gIHZhciBjb2xvck9uZSA9IG9wdGlvbnMuY29sb3JPbmUgPyBvcHRpb25zLmNvbG9yT25lIDogJyNkYTU1MmYnO1xuICB2YXIgY29sb3JUd28gPSBvcHRpb25zLmNvbG9yVHdvID8gb3B0aW9ucy5jb2xvclR3byA6ICcjZWE4ZTM5JztcbiAgdmFyIHNhdmVJbkNvb2tpZXMgPSB0eXBlb2Ygb3B0aW9ucy5zYXZlSW5Db29raWVzID09PSAnYm9vbGVhbicgPyBvcHRpb25zLnNhdmVJbkNvb2tpZXMgOiB0cnVlO1xuICB2YXIgaWQgPSBcInByb2R1Y3QtaHVudC1cIi5jb25jYXQobmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16QS1aXSsvZywgXCItXCIpKTtcbiAgdmFyIGh0bWwgPSBcIjxkaXYgY2xhc3M9XFxcInByb2R1Y3RodW50XFxcIiBpZD1cXFwiXCIuY29uY2F0KGlkLCBcIlxcXCI+IDxzcGFuIGNsYXNzPVxcXCJwcm9kdWN0aHVudF9fY2xvc2VcXFwiIGlkPVxcXCJcIikuY29uY2F0KGlkLCBcIi1jbG9zZVxcXCI+XFx4RDc8L3NwYW4+PHAgY2xhc3M9XFxcInByb2R1Y3RodW50X190ZXh0XFxcIj5cIikuY29uY2F0KHRleHQsIFwiPC9wPiA8YSBocmVmPVxcXCJcIikuY29uY2F0KHVybCwgXCJcXFwiIGNsYXNzPVxcXCJwaC1idXR0b25cXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5cIikuY29uY2F0KGJ1dHRvblRleHQsIFwiPC9hPjwvZGl2PlwiKTtcbiAgdmFyIGNzcyA9IFwiXFxuICAucGgtYnV0dG9uIHtcXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDY1ZGVnLFwiLmNvbmNhdChjb2xvck9uZSwgXCIsXCIpLmNvbmNhdChjb2xvclR3bywgXCIpO1xcbiAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gICAgY29sb3I6ICNmZmYgIWltcG9ydGFudDtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICAgIGxldHRlci1zcGFjaW5nOiAwO1xcbiAgICBmb250LXdlaWdodDogNzAwO1xcbiAgICBsaW5lLWhlaWdodDogMTZweDtcXG4gICAgZm9udC1zaXplOiAxNHB4O1xcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmUhaW1wb3J0YW50O1xcbiAgICBib3JkZXI6IG5vbmU7XFxuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgcGFkZGluZzogMTZweCAxNnB4O1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICAgIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggcmdiYSgzMiw0Myw1NCwuMTIpO1xcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzIGVhc2U7XFxuICAgIG1hcmdpbi10b3A6IDE2cHg7XFxuICAgIGZvbnQtc2l6ZTogMTRweDtcXG4gIH1cXG4gIC5waC1idXR0b246aG92ZXIge1xcbiAgICBib3gtc2hhZG93OiAwIDZweCAyNHB4IHJnYmEoMzIsNDMsNTQsLjQpO1xcbiAgfVxcbiAgLnByb2R1Y3RodW50IHtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgICBwYWRkaW5nOiAyNHB4O1xcbiAgICBib3gtc2hhZG93OiAwIDRweCAxNnB4IHJnYmEoMTYsIDMxLCA1OSwgMC4xNik7XFxuICAgIHotaW5kZXg6IDEwO1xcbiAgICBmb250LXNpemU6IDE2cHg7XFxuICAgIGNvbG9yOiAjNjU2MzhmO1xcbiAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNpdGlvbjogYWxsIC4zcyBlYXNlO1xcbiAgfVxcbiAgLnByb2R1Y3RodW50X19jbG9zZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgcmlnaHQ6IDE2cHg7XFxuICAgIHRvcDogOHB4O1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICB9XFxuICAucHJvZHVjdGh1bnRfX3RleHQge1xcbiAgICBtYXJnaW46IDA7XFxuICB9XFxuICBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG4gICAgLnByb2R1Y3RodW50IHtcXG4gICAgICB3aWR0aDogY2FsYygxMDAlIC0gNDhweCkgIWltcG9ydGFudDtcXG4gICAgICBib3R0b206IDAgIWltcG9ydGFudDtcXG4gICAgICByaWdodDogMCAhaW1wb3J0YW50O1xcbiAgICAgIGxlZnQ6IDAgIWltcG9ydGFudDtcXG4gICAgICBib3gtc2hhZG93OiAwIC00cHggMTZweCByZ2JhKDE2LCAzMSwgNTksIDAuMTYpICFpbXBvcnRhbnQ7XFxuICAgIH1cXG4gIH1cIik7XG5cbiAgaWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oaWQpIHx8IHNhdmVJbkNvb2tpZXMgPT0gZmFsc2UpIHtcbiAgICBjcmVhdGVNb2RhbChodG1sKTtcbiAgICBzZXRTdHlsZShpZCwgYm90dG9tLCBsZWZ0LCByaWdodCwgd2lkdGgpO1xuICAgIGFkZENsb3NpbmdFdmVudChpZCk7XG4gICAgYWRkU3R5bGUoY3NzKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlICovXG5cbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9kYWwoaHRtbCkge1xuICB2YXIgcHJvbXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHByb21wdC5pbm5lckhUTUwgPSBodG1sO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHByb21wdCk7XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKGlkLCBib3R0b20sIGxlZnQsIHJpZ2h0LCB3aWR0aCkge1xuICB2YXIgcHJvZHVjdGh1bnRNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgcHJvZHVjdGh1bnRNb2RhbC5zdHlsZS5ib3R0b20gPSBib3R0b207XG4gIHByb2R1Y3RodW50TW9kYWwuc3R5bGUubGVmdCA9IGxlZnQgPyBsZWZ0IDogJ3Vuc2V0JztcbiAgcHJvZHVjdGh1bnRNb2RhbC5zdHlsZS5yaWdodCA9IHJpZ2h0ID8gcmlnaHQgOiAndW5zZXQnO1xuICBwcm9kdWN0aHVudE1vZGFsLnN0eWxlLndpZHRoID0gd2lkdGg7XG59XG5cbmZ1bmN0aW9uIGFkZENsb3NpbmdFdmVudChpZCkge1xuICB2YXIgcHJvZHVjdGh1bnRNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgdmFyIHByb2R1Y3RodW50Q2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlwiLmNvbmNhdChpZCwgXCItY2xvc2VcIikpO1xuICBwcm9kdWN0aHVudENsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHByb2R1Y3RodW50TW9kYWwuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9kdWN0aHVudE1vZGFsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocHJvZHVjdGh1bnRNb2RhbCk7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oaWQsIHRydWUpO1xuICAgIH0sIDMwMCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZShjc3MpIHtcbiAgdmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnZGF0YTp0ZXh0L2NzcztjaGFyc2V0PVVURi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY3NzKSk7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGlua0VsZW1lbnQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3NyYy9pbmRleC5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2Zsb2F0aW5nUHJvbXB0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2Zsb2F0aW5nUHJvbXB0LmpzICovIFwiLi9zcmMvZmxvYXRpbmdQcm9tcHQuanNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgX2RlZmF1bHQgPSBfZmxvYXRpbmdQcm9tcHQuZGVmYXVsdDtcbi8qIGVzbGludC1kaXNhYmxlICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0O1xuXG4oZnVuY3Rpb24gKHdpbmRvdykge1xuICB3aW5kb3cuRmxvYXRpbmdQcm9tcHQgPSBfZmxvYXRpbmdQcm9tcHQuZGVmYXVsdDtcbn0pKHdpbmRvdyk7XG4vKiBlc2xpbnQtZW5hYmxlICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcblxuLyoqKi8gfSlcblxuLyoqKioqKi8gfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OXdjbTlrZFdOMGFIVnVkQzFtYkc5aGRHbHVaeTF3Y205dGNIUXZkMlZpY0dGamF5OTFibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUlpd2lkMlZpY0dGamF6b3ZMM0J5YjJSMVkzUm9kVzUwTFdac2IyRjBhVzVuTFhCeWIyMXdkQzkzWldKd1lXTnJMMkp2YjNSemRISmhjQ0lzSW5kbFluQmhZMnM2THk5d2NtOWtkV04wYUhWdWRDMW1iRzloZEdsdVp5MXdjbTl0Y0hRdkxpOXpjbU12Wm14dllYUnBibWRRY205dGNIUXVhbk1pTENKM1pXSndZV05yT2k4dmNISnZaSFZqZEdoMWJuUXRabXh2WVhScGJtY3RjSEp2YlhCMEx5NHZjM0pqTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYkltWnNiMkYwYVc1blVISnZiWEIwSWl3aWIzQjBhVzl1Y3lJc0ltNWhiV1VpTENKMWNtd2lMQ0owWlhoMElpd2lZblYwZEc5dVZHVjRkQ0lzSW5kcFpIUm9JaXdpWW05MGRHOXRJaXdpY21sbmFIUWlMQ0pzWldaMElpd2lZMjlzYjNKUGJtVWlMQ0pqYjJ4dmNsUjNieUlzSW5OaGRtVkpia052YjJ0cFpYTWlMQ0pwWkNJc0luUnZURzkzWlhKRFlYTmxJaXdpY21Wd2JHRmpaU0lzSW1oMGJXd2lMQ0pqYzNNaUxDSjNhVzVrYjNjaUxDSnNiMk5oYkZOMGIzSmhaMlVpTENKblpYUkpkR1Z0SWl3aVkzSmxZWFJsVFc5a1lXd2lMQ0p6WlhSVGRIbHNaU0lzSW1Ga1pFTnNiM05wYm1kRmRtVnVkQ0lzSW1Ga1pGTjBlV3hsSWl3aWNISnZiWEIwSWl3aVpHOWpkVzFsYm5RaUxDSmpjbVZoZEdWRmJHVnRaVzUwSWl3aWFXNXVaWEpJVkUxTUlpd2lZbTlrZVNJc0ltRndjR1Z1WkVOb2FXeGtJaXdpY0hKdlpIVmpkR2gxYm5STmIyUmhiQ0lzSW1kbGRFVnNaVzFsYm5SQ2VVbGtJaXdpYzNSNWJHVWlMQ0p3Y205a2RXTjBhSFZ1ZEVOc2IzTmxRblYwZEc5dUlpd2lZV1JrUlhabGJuUk1hWE4wWlc1bGNpSXNJbTl3WVdOcGRIa2lMQ0p6WlhSVWFXMWxiM1YwSWl3aWNHRnlaVzUwVG05a1pTSXNJbkpsYlc5MlpVTm9hV3hrSWl3aWMyVjBTWFJsYlNJc0lteHBibXRGYkdWdFpXNTBJaXdpYzJWMFFYUjBjbWxpZFhSbElpd2laVzVqYjJSbFZWSkpRMjl0Y0c5dVpXNTBJaXdpYUdWaFpDSXNJa1pzYjJGMGFXNW5VSEp2YlhCMElsMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeERRVUZETzBGQlEwUXNUenRCUTFaQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3pzN1FVRkhRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzYTBSQlFUQkRMR2REUVVGblF6dEJRVU14UlR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEdkRlFVRjNSQ3hyUWtGQmEwSTdRVUZETVVVN1FVRkRRU3g1UkVGQmFVUXNZMEZCWXp0QlFVTXZSRHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNhVVJCUVhsRExHbERRVUZwUXp0QlFVTXhSU3gzU0VGQlowZ3NiVUpCUVcxQ0xFVkJRVVU3UVVGRGNrazdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeHRRMEZCTWtJc01FSkJRVEJDTEVWQlFVVTdRVUZEZGtRc2VVTkJRV2xETEdWQlFXVTdRVUZEYUVRN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNPRVJCUVhORUxDdEVRVUVyUkRzN1FVRkZja2c3UVVGRFFUczdPMEZCUjBFN1FVRkRRVHM3T3pzN096czdPenM3T3pzN096czdPenM3UVVOc1JtVXNVMEZCVTBFc1kwRkJWQ3hEUVVGM1FrTXNUMEZCZUVJc1JVRkJhVU03UVVGRk9VTTdRVUZEUVN4TlFVRk5ReXhKUVVGSkxFZEJRVWRFTEU5QlFVOHNRMEZCUTBNc1NVRkJja0k3UVVGRFFTeE5RVUZOUXl4SFFVRkhMRWRCUVVkR0xFOUJRVThzUTBGQlEwVXNSMEZCY0VJN1FVRkRRU3hOUVVGTlF5eEpRVUZKTEVkQlFVZElMRTlCUVU4c1EwRkJRMGNzU1VGQlVpeEhRVUZsU0N4UFFVRlBMRU5CUVVOSExFbEJRWFpDTERaQ1FVRnBSRVlzU1VGQmFrUXNiVVZCUVdJN1FVRkRRU3hOUVVGTlJ5eFZRVUZWTEVkQlFVZEtMRTlCUVU4c1EwRkJRMGtzVlVGQlVpeEhRVUZ4UWtvc1QwRkJUeXhEUVVGRFNTeFZRVUUzUWl4aFFVRTJRMGdzU1VGQk4wTXNjVUpCUVc1Q08wRkJRMEVzVFVGQlRVa3NTMEZCU3l4SFFVRkhUQ3hQUVVGUExFTkJRVU5MTEV0QlFWSXNSMEZCWjBKTUxFOUJRVThzUTBGQlEwc3NTMEZCZUVJc1IwRkJaME1zVDBGQk9VTTdRVUZEUVN4TlFVRk5ReXhOUVVGTkxFZEJRVWRPTEU5QlFVOHNRMEZCUTAwc1RVRkJVaXhIUVVGcFFrNHNUMEZCVHl4RFFVRkRUU3hOUVVGNlFpeEhRVUZyUXl4TlFVRnFSRHRCUVVOQkxFMUJRVTFETEV0QlFVc3NSMEZCUjFBc1QwRkJUeXhEUVVGRFR5eExRVUZTTEVkQlFXZENVQ3hQUVVGUExFTkJRVU5QTEV0QlFYaENMRWRCUVdkRExFMUJRVGxETzBGQlEwRXNUVUZCVFVNc1NVRkJTU3hIUVVGSFVpeFBRVUZQTEVOQlFVTlJMRWxCUVZJc1IwRkJaVklzVDBGQlR5eERRVUZEVVN4SlFVRjJRaXhIUVVFNFFpeFBRVUV6UXp0QlFVTkJMRTFCUVUxRExGRkJRVkVzUjBGQlIxUXNUMEZCVHl4RFFVRkRVeXhSUVVGU0xFZEJRVzFDVkN4UFFVRlBMRU5CUVVOVExGRkJRVE5DTEVkQlFYTkRMRk5CUVhaRU8wRkJRMEVzVFVGQlRVTXNVVUZCVVN4SFFVRkhWaXhQUVVGUExFTkJRVU5WTEZGQlFWSXNSMEZCYlVKV0xFOUJRVThzUTBGQlExVXNVVUZCTTBJc1IwRkJjME1zVTBGQmRrUTdRVUZEUVN4TlFVRk5ReXhoUVVGaExFZEJRVWNzVDBGQlQxZ3NUMEZCVHl4RFFVRkRWeXhoUVVGbUxFdEJRV3RETEZOQlFXeERMRWRCUVRoRFdDeFBRVUZQTEVOQlFVTlhMR0ZCUVhSRUxFZEJRWE5GTEVsQlFUVkdPMEZCUTBFc1RVRkJUVU1zUlVGQlJTd3dRa0ZCYlVKWUxFbEJRVWtzUTBGQlExa3NWMEZCVEN4SFFVRnRRa01zVDBGQmJrSXNRMEZCTWtJc1lVRkJNMElzUlVGQk1FTXNSMEZCTVVNc1EwRkJia0lzUTBGQlVqdEJRVU5CTEUxQlFVMURMRWxCUVVrc05rTkJRVzFEU0N4RlFVRnVReXg1UkVGQlowWkJMRVZCUVdoR0xHZEZRVUZyU1ZRc1NVRkJiRWtzTkVKQlFYVktSQ3hIUVVGMlNpeHpSRUZCYVUxRkxGVkJRV3BOTEdWQlFWWTdRVUZEUVN4TlFVRk5XU3hIUVVGSExIRkZRVVUyUWxBc1VVRkdOMElzWTBGRmVVTkRMRkZCUm5wRExEQjVRMEZCVkRzN1FVRXlSRUVzVFVGQlJ5eERRVUZEVHl4TlFVRk5MRU5CUVVORExGbEJRVkFzUTBGQmIwSkRMRTlCUVhCQ0xFTkJRVFJDVUN4RlFVRTFRaXhEUVVGRUxFbEJRVzlEUkN4aFFVRmhMRWxCUVVrc1MwRkJlRVFzUlVGQkswUTdRVUZETjBSVExHVkJRVmNzUTBGQlEwd3NTVUZCUkN4RFFVRllPMEZCUTBGTkxGbEJRVkVzUTBGQlExUXNSVUZCUkN4RlFVRkxUaXhOUVVGTUxFVkJRV0ZGTEVsQlFXSXNSVUZCYlVKRUxFdEJRVzVDTEVWQlFUQkNSaXhMUVVFeFFpeERRVUZTTzBGQlEwRnBRaXh0UWtGQlpTeERRVUZEVml4RlFVRkVMRU5CUVdZN1FVRkRRVmNzV1VGQlVTeERRVUZEVUN4SFFVRkVMRU5CUVZJN1FVRkRSRHRCUVVORU96dEJRVU5FT3p0QlFVVkVMRk5CUVZOSkxGZEJRVlFzUTBGQmNVSk1MRWxCUVhKQ0xFVkJRVEpDTzBGQlEzcENMRTFCUVUxVExFMUJRVTBzUjBGQlIwTXNVVUZCVVN4RFFVRkRReXhoUVVGVUxFTkJRWFZDTEV0QlFYWkNMRU5CUVdZN1FVRkZRVVlzVVVGQlRTeERRVUZEUnl4VFFVRlFMRWRCUVcxQ1dpeEpRVUZ1UWp0QlFVTkJWU3hWUVVGUkxFTkJRVU5ITEVsQlFWUXNRMEZCWTBNc1YwRkJaQ3hEUVVFd1Frd3NUVUZCTVVJN1FVRkRSRHM3UVVGRlJDeFRRVUZUU0N4UlFVRlVMRU5CUVd0Q1ZDeEZRVUZzUWl4RlFVRnpRazRzVFVGQmRFSXNSVUZCT0VKRkxFbEJRVGxDTEVWQlFXOURSQ3hMUVVGd1F5eEZRVUV5UTBZc1MwRkJNME1zUlVGQmEwUTdRVUZEYUVRc1RVRkJUWGxDTEdkQ1FVRm5RaXhIUVVGSFRDeFJRVUZSTEVOQlFVTk5MR05CUVZRc1EwRkJkMEp1UWl4RlFVRjRRaXhEUVVGNlFqdEJRVVZCYTBJc2EwSkJRV2RDTEVOQlFVTkZMRXRCUVdwQ0xFTkJRWFZDTVVJc1RVRkJka0lzUjBGQlowTkJMRTFCUVdoRE8wRkJRMEYzUWl4clFrRkJaMElzUTBGQlEwVXNTMEZCYWtJc1EwRkJkVUo0UWl4SlFVRjJRaXhIUVVFNFFrRXNTVUZCU1N4SFFVRkhRU3hKUVVGSUxFZEJRVlVzVDBGQk5VTTdRVUZEUVhOQ0xHdENRVUZuUWl4RFFVRkRSU3hMUVVGcVFpeERRVUYxUW5wQ0xFdEJRWFpDTEVkQlFTdENRU3hMUVVGTExFZEJRVWRCTEV0QlFVZ3NSMEZCVnl4UFFVRXZRenRCUVVOQmRVSXNhMEpCUVdkQ0xFTkJRVU5GTEV0QlFXcENMRU5CUVhWQ00wSXNTMEZCZGtJc1IwRkJLMEpCTEV0QlFTOUNPMEZCUTBRN08wRkJSVVFzVTBGQlUybENMR1ZCUVZRc1EwRkJlVUpXTEVWQlFYcENMRVZCUVRaQ08wRkJRek5DTEUxQlFVMXJRaXhuUWtGQlowSXNSMEZCUjB3c1VVRkJVU3hEUVVGRFRTeGpRVUZVTEVOQlFYZENia0lzUlVGQmVFSXNRMEZCZWtJN1FVRkRRU3hOUVVGTmNVSXNjMEpCUVhOQ0xFZEJRVWRTTEZGQlFWRXNRMEZCUTAwc1kwRkJWQ3hYUVVFeVFtNUNMRVZCUVROQ0xGbEJRUzlDTzBGQlJVRnhRaXgzUWtGQmMwSXNRMEZCUTBNc1owSkJRWFpDTEVOQlFYZERMRTlCUVhoRExFVkJRV2xFTEZsQlFVMDdRVUZEY2tSS0xHOUNRVUZuUWl4RFFVRkRSU3hMUVVGcVFpeERRVUYxUWtjc1QwRkJka0lzUjBGQmFVTXNRMEZCYWtNN1FVRkRRVU1zWTBGQlZTeERRVUZETEZsQlFVMDdRVUZEWms0c2MwSkJRV2RDTEVOQlFVTlBMRlZCUVdwQ0xFTkJRVFJDUXl4WFFVRTFRaXhEUVVGM1ExSXNaMEpCUVhoRE8wRkJRMEZpTEZsQlFVMHNRMEZCUTBNc1dVRkJVQ3hEUVVGdlFuRkNMRTlCUVhCQ0xFTkJRVFJDTTBJc1JVRkJOVUlzUlVGQlowTXNTVUZCYUVNN1FVRkRSQ3hMUVVoVExFVkJSMUFzUjBGSVR5eERRVUZXTzBGQlNVUXNSMEZPUkR0QlFVOUVPenRCUVVWRUxGTkJRVk5YTEZGQlFWUXNRMEZCYTBKUUxFZEJRV3hDTEVWQlFYVkNPMEZCUTNKQ0xFMUJRVTEzUWl4WFFVRlhMRWRCUVVkbUxGRkJRVkVzUTBGQlEwTXNZVUZCVkN4RFFVRjFRaXhOUVVGMlFpeERRVUZ3UWp0QlFVVkJZeXhoUVVGWExFTkJRVU5ETEZsQlFWb3NRMEZCZVVJc1MwRkJla0lzUlVGQlowTXNXVUZCYUVNN1FVRkRRVVFzWVVGQlZ5eERRVUZEUXl4WlFVRmFMRU5CUVhsQ0xFMUJRWHBDTEVWQlFXbERMRlZCUVdwRE8wRkJRMEZFTEdGQlFWY3NRMEZCUTBNc1dVRkJXaXhEUVVGNVFpeE5RVUY2UWl4RlFVRnBReXhwUTBGQmFVTkRMR3RDUVVGclFpeERRVUZETVVJc1IwRkJSQ3hEUVVGd1JqdEJRVU5CVXl4VlFVRlJMRU5CUVVOclFpeEpRVUZVTEVOQlFXTmtMRmRCUVdRc1EwRkJNRUpYTEZkQlFURkNPMEZCUTBRN096czdPenM3T3pzN096czdPenM3T3pzN096dEJRM2hJUkRzN096czdRVUZIUVRzN096dEJRVU5CTEVOQlFVTXNWVUZCVTNaQ0xFMUJRVlFzUlVGQlowSTdRVUZEWkVFc1VVRkJUU3hEUVVGRE1rSXNZMEZCVUR0QlFVTkVMRU5CUmtZc1JVRkZTVE5DTEUxQlJrbzdRVUZIUXlJc0ltWnBiR1VpT2lKd2NtOWtkV04wYUhWdWRDMW1iRzloZEdsdVp5MXdjbTl0Y0hRdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlvWm5WdVkzUnBiMjRnZDJWaWNHRmphMVZ1YVhabGNuTmhiRTF2WkhWc1pVUmxabWx1YVhScGIyNG9jbTl2ZEN3Z1ptRmpkRzl5ZVNrZ2UxeHVYSFJwWmloMGVYQmxiMllnWlhod2IzSjBjeUE5UFQwZ0oyOWlhbVZqZENjZ0ppWWdkSGx3Wlc5bUlHMXZaSFZzWlNBOVBUMGdKMjlpYW1WamRDY3BYRzVjZEZ4MGJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbVlXTjBiM0o1S0NrN1hHNWNkR1ZzYzJVZ2FXWW9kSGx3Wlc5bUlHUmxabWx1WlNBOVBUMGdKMloxYm1OMGFXOXVKeUFtSmlCa1pXWnBibVV1WVcxa0tWeHVYSFJjZEdSbFptbHVaU2hjSW5CeWIyUjFZM1JvZFc1MExXWnNiMkYwYVc1bkxYQnliMjF3ZEZ3aUxDQmJYU3dnWm1GamRHOXllU2s3WEc1Y2RHVnNjMlVnYVdZb2RIbHdaVzltSUdWNGNHOXlkSE1nUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEdWNGNHOXlkSE5iWENKd2NtOWtkV04wYUhWdWRDMW1iRzloZEdsdVp5MXdjbTl0Y0hSY0lsMGdQU0JtWVdOMGIzSjVLQ2s3WEc1Y2RHVnNjMlZjYmx4MFhIUnliMjkwVzF3aWNISnZaSFZqZEdoMWJuUXRabXh2WVhScGJtY3RjSEp2YlhCMFhDSmRJRDBnWm1GamRHOXllU2dwTzF4dWZTa29kSGx3Wlc5bUlITmxiR1lnSVQwOUlDZDFibVJsWm1sdVpXUW5JRDhnYzJWc1ppQTZJSFJvYVhNc0lHWjFibU4wYVc5dUtDa2dlMXh1Y21WMGRYSnVJQ0lzSWlCY2RDOHZJRlJvWlNCdGIyUjFiR1VnWTJGamFHVmNiaUJjZEhaaGNpQnBibk4wWVd4c1pXUk5iMlIxYkdWeklEMGdlMzA3WEc1Y2JpQmNkQzh2SUZSb1pTQnlaWEYxYVhKbElHWjFibU4wYVc5dVhHNGdYSFJtZFc1amRHbHZiaUJmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmS0cxdlpIVnNaVWxrS1NCN1hHNWNiaUJjZEZ4MEx5OGdRMmhsWTJzZ2FXWWdiVzlrZFd4bElHbHpJR2x1SUdOaFkyaGxYRzRnWEhSY2RHbG1LR2x1YzNSaGJHeGxaRTF2WkhWc1pYTmJiVzlrZFd4bFNXUmRLU0I3WEc0Z1hIUmNkRngwY21WMGRYSnVJR2x1YzNSaGJHeGxaRTF2WkhWc1pYTmJiVzlrZFd4bFNXUmRMbVY0Y0c5eWRITTdYRzRnWEhSY2RIMWNiaUJjZEZ4MEx5OGdRM0psWVhSbElHRWdibVYzSUcxdlpIVnNaU0FvWVc1a0lIQjFkQ0JwZENCcGJuUnZJSFJvWlNCallXTm9aU2xjYmlCY2RGeDBkbUZ5SUcxdlpIVnNaU0E5SUdsdWMzUmhiR3hsWkUxdlpIVnNaWE5iYlc5a2RXeGxTV1JkSUQwZ2UxeHVJRngwWEhSY2RHazZJRzF2WkhWc1pVbGtMRnh1SUZ4MFhIUmNkR3c2SUdaaGJITmxMRnh1SUZ4MFhIUmNkR1Y0Y0c5eWRITTZJSHQ5WEc0Z1hIUmNkSDA3WEc1Y2JpQmNkRngwTHk4Z1JYaGxZM1YwWlNCMGFHVWdiVzlrZFd4bElHWjFibU4wYVc5dVhHNGdYSFJjZEcxdlpIVnNaWE5iYlc5a2RXeGxTV1JkTG1OaGJHd29iVzlrZFd4bExtVjRjRzl5ZEhNc0lHMXZaSFZzWlN3Z2JXOWtkV3hsTG1WNGNHOXlkSE1zSUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4cE8xeHVYRzRnWEhSY2RDOHZJRVpzWVdjZ2RHaGxJRzF2WkhWc1pTQmhjeUJzYjJGa1pXUmNiaUJjZEZ4MGJXOWtkV3hsTG13Z1BTQjBjblZsTzF4dVhHNGdYSFJjZEM4dklGSmxkSFZ5YmlCMGFHVWdaWGh3YjNKMGN5QnZaaUIwYUdVZ2JXOWtkV3hsWEc0Z1hIUmNkSEpsZEhWeWJpQnRiMlIxYkdVdVpYaHdiM0owY3p0Y2JpQmNkSDFjYmx4dVhHNGdYSFF2THlCbGVIQnZjMlVnZEdobElHMXZaSFZzWlhNZ2IySnFaV04wSUNoZlgzZGxZbkJoWTJ0ZmJXOWtkV3hsYzE5ZktWeHVJRngwWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dElEMGdiVzlrZFd4bGN6dGNibHh1SUZ4MEx5OGdaWGh3YjNObElIUm9aU0J0YjJSMWJHVWdZMkZqYUdWY2JpQmNkRjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1WXlBOUlHbHVjM1JoYkd4bFpFMXZaSFZzWlhNN1hHNWNiaUJjZEM4dklHUmxabWx1WlNCblpYUjBaWElnWm5WdVkzUnBiMjRnWm05eUlHaGhjbTF2Ym5rZ1pYaHdiM0owYzF4dUlGeDBYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTVrSUQwZ1puVnVZM1JwYjI0b1pYaHdiM0owY3l3Z2JtRnRaU3dnWjJWMGRHVnlLU0I3WEc0Z1hIUmNkR2xtS0NGZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOG9aWGh3YjNKMGN5d2dibUZ0WlNrcElIdGNiaUJjZEZ4MFhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnYm1GdFpTd2dleUJsYm5WdFpYSmhZbXhsT2lCMGNuVmxMQ0JuWlhRNklHZGxkSFJsY2lCOUtUdGNiaUJjZEZ4MGZWeHVJRngwZlR0Y2JseHVJRngwTHk4Z1pHVm1hVzVsSUY5ZlpYTk5iMlIxYkdVZ2IyNGdaWGh3YjNKMGMxeHVJRngwWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1eUlEMGdablZ1WTNScGIyNG9aWGh3YjNKMGN5a2dlMXh1SUZ4MFhIUnBaaWgwZVhCbGIyWWdVM2x0WW05c0lDRTlQU0FuZFc1a1pXWnBibVZrSnlBbUppQlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY3BJSHRjYmlCY2RGeDBYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z1UzbHRZbTlzTG5SdlUzUnlhVzVuVkdGbkxDQjdJSFpoYkhWbE9pQW5UVzlrZFd4bEp5QjlLVHRjYmlCY2RGeDBmVnh1SUZ4MFhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnSjE5ZlpYTk5iMlIxYkdVbkxDQjdJSFpoYkhWbE9pQjBjblZsSUgwcE8xeHVJRngwZlR0Y2JseHVJRngwTHk4Z1kzSmxZWFJsSUdFZ1ptRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBYRzRnWEhRdkx5QnRiMlJsSUNZZ01Ub2dkbUZzZFdVZ2FYTWdZU0J0YjJSMWJHVWdhV1FzSUhKbGNYVnBjbVVnYVhSY2JpQmNkQzh2SUcxdlpHVWdKaUF5T2lCdFpYSm5aU0JoYkd3Z2NISnZjR1Z5ZEdsbGN5QnZaaUIyWVd4MVpTQnBiblJ2SUhSb1pTQnVjMXh1SUZ4MEx5OGdiVzlrWlNBbUlEUTZJSEpsZEhWeWJpQjJZV3gxWlNCM2FHVnVJR0ZzY21WaFpIa2dibk1nYjJKcVpXTjBYRzRnWEhRdkx5QnRiMlJsSUNZZ09Id3hPaUJpWldoaGRtVWdiR2xyWlNCeVpYRjFhWEpsWEc0Z1hIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMblFnUFNCbWRXNWpkR2x2YmloMllXeDFaU3dnYlc5a1pTa2dlMXh1SUZ4MFhIUnBaaWh0YjJSbElDWWdNU2tnZG1Gc2RXVWdQU0JmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmS0haaGJIVmxLVHRjYmlCY2RGeDBhV1lvYlc5a1pTQW1JRGdwSUhKbGRIVnliaUIyWVd4MVpUdGNiaUJjZEZ4MGFXWW9LRzF2WkdVZ0ppQTBLU0FtSmlCMGVYQmxiMllnZG1Gc2RXVWdQVDA5SUNkdlltcGxZM1FuSUNZbUlIWmhiSFZsSUNZbUlIWmhiSFZsTGw5ZlpYTk5iMlIxYkdVcElISmxkSFZ5YmlCMllXeDFaVHRjYmlCY2RGeDBkbUZ5SUc1eklEMGdUMkpxWldOMExtTnlaV0YwWlNodWRXeHNLVHRjYmlCY2RGeDBYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV5S0c1ektUdGNiaUJjZEZ4MFQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLRzV6TENBblpHVm1ZWFZzZENjc0lIc2daVzUxYldWeVlXSnNaVG9nZEhKMVpTd2dkbUZzZFdVNklIWmhiSFZsSUgwcE8xeHVJRngwWEhScFppaHRiMlJsSUNZZ01pQW1KaUIwZVhCbGIyWWdkbUZzZFdVZ0lUMGdKM04wY21sdVp5Y3BJR1p2Y2loMllYSWdhMlY1SUdsdUlIWmhiSFZsS1NCZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtUW9ibk1zSUd0bGVTd2dablZ1WTNScGIyNG9hMlY1S1NCN0lISmxkSFZ5YmlCMllXeDFaVnRyWlhsZE95QjlMbUpwYm1Rb2JuVnNiQ3dnYTJWNUtTazdYRzRnWEhSY2RISmxkSFZ5YmlCdWN6dGNiaUJjZEgwN1hHNWNiaUJjZEM4dklHZGxkRVJsWm1GMWJIUkZlSEJ2Y25RZ1puVnVZM1JwYjI0Z1ptOXlJR052YlhCaGRHbGlhV3hwZEhrZ2QybDBhQ0J1YjI0dGFHRnliVzl1ZVNCdGIyUjFiR1Z6WEc0Z1hIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbTRnUFNCbWRXNWpkR2x2YmlodGIyUjFiR1VwSUh0Y2JpQmNkRngwZG1GeUlHZGxkSFJsY2lBOUlHMXZaSFZzWlNBbUppQnRiMlIxYkdVdVgxOWxjMDF2WkhWc1pTQS9YRzRnWEhSY2RGeDBablZ1WTNScGIyNGdaMlYwUkdWbVlYVnNkQ2dwSUhzZ2NtVjBkWEp1SUcxdlpIVnNaVnNuWkdWbVlYVnNkQ2RkT3lCOUlEcGNiaUJjZEZ4MFhIUm1kVzVqZEdsdmJpQm5aWFJOYjJSMWJHVkZlSEJ2Y25SektDa2dleUJ5WlhSMWNtNGdiVzlrZFd4bE95QjlPMXh1SUZ4MFhIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbVFvWjJWMGRHVnlMQ0FuWVNjc0lHZGxkSFJsY2lrN1hHNGdYSFJjZEhKbGRIVnliaUJuWlhSMFpYSTdYRzRnWEhSOU8xeHVYRzRnWEhRdkx5QlBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHeGNiaUJjZEY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5QTlJR1oxYm1OMGFXOXVLRzlpYW1WamRDd2djSEp2Y0dWeWRIa3BJSHNnY21WMGRYSnVJRTlpYW1WamRDNXdjbTkwYjNSNWNHVXVhR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2h2WW1wbFkzUXNJSEJ5YjNCbGNuUjVLVHNnZlR0Y2JseHVJRngwTHk4Z1gxOTNaV0p3WVdOclgzQjFZbXhwWTE5d1lYUm9YMTljYmlCY2RGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVjQ0E5SUZ3aVhDSTdYRzVjYmx4dUlGeDBMeThnVEc5aFpDQmxiblJ5ZVNCdGIyUjFiR1VnWVc1a0lISmxkSFZ5YmlCbGVIQnZjblJ6WEc0Z1hIUnlaWFIxY200Z1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5aGZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbk1nUFNCY0lpNHZjM0pqTDJsdVpHVjRMbXB6WENJcE8xeHVJaXdpWlhod2IzSjBJR1JsWm1GMWJIUWdablZ1WTNScGIyNGdabXh2WVhScGJtZFFjbTl0Y0hRb2IzQjBhVzl1Y3lrZ2UxeHlYRzVjY2x4dUlDQXZLaUJsYzJ4cGJuUXRaR2x6WVdKc1pTQXFMMXh5WEc0Z0lHTnZibk4wSUc1aGJXVWdQU0J2Y0hScGIyNXpMbTVoYldVN1hISmNiaUFnWTI5dWMzUWdkWEpzSUQwZ2IzQjBhVzl1Y3k1MWNtdzdYSEpjYmlBZ1kyOXVjM1FnZEdWNGRDQTlJRzl3ZEdsdmJuTXVkR1Y0ZENBL0lHOXdkR2x2Ym5NdWRHVjRkQ0E2SUdCSWFTd2daRzhnZVc5MUlHeHBhMlVnSkh0dVlXMWxmU0EvSUVSdmJpZDBJR1p2Y21kbGRDQjBieUJ6YUc5M0lIbHZkWElnYkc5MlpTQnZiaUJRY205a2RXTjBJRWgxYm5RZzhKK2FnR0E3WEhKY2JpQWdZMjl1YzNRZ1luVjBkRzl1VkdWNGRDQTlJRzl3ZEdsdmJuTXVZblYwZEc5dVZHVjRkQ0EvSUc5d2RHbHZibk11WW5WMGRHOXVWR1Y0ZENBNklHQWtlMjVoYldWOUlHOXVJRkJ5YjJSMVkzUWdTSFZ1ZEdBN1hISmNiaUFnWTI5dWMzUWdkMmxrZEdnZ1BTQnZjSFJwYjI1ekxuZHBaSFJvSUQ4Z2IzQjBhVzl1Y3k1M2FXUjBhQ0E2SUNjek1EQndlQ2M3WEhKY2JpQWdZMjl1YzNRZ1ltOTBkRzl0SUQwZ2IzQjBhVzl1Y3k1aWIzUjBiMjBnUHlCdmNIUnBiMjV6TG1KdmRIUnZiU0E2SUNjek1uQjRKenRjY2x4dUlDQmpiMjV6ZENCeWFXZG9kQ0E5SUc5d2RHbHZibk11Y21sbmFIUWdQeUJ2Y0hScGIyNXpMbkpwWjJoMElEb2dKek15Y0hnbk8xeHlYRzRnSUdOdmJuTjBJR3hsWm5RZ1BTQnZjSFJwYjI1ekxteGxablFnUHlCdmNIUnBiMjV6TG14bFpuUWdPaUFuZFc1elpYUW5PMXh5WEc0Z0lHTnZibk4wSUdOdmJHOXlUMjVsSUQwZ2IzQjBhVzl1Y3k1amIyeHZjazl1WlNBL0lHOXdkR2x2Ym5NdVkyOXNiM0pQYm1VZ09pQW5JMlJoTlRVeVppYzdYSEpjYmlBZ1kyOXVjM1FnWTI5c2IzSlVkMjhnUFNCdmNIUnBiMjV6TG1OdmJHOXlWSGR2SUQ4Z2IzQjBhVzl1Y3k1amIyeHZjbFIzYnlBNklDY2paV0U0WlRNNUp6dGNjbHh1SUNCamIyNXpkQ0J6WVhabFNXNURiMjlyYVdWeklEMGdkSGx3Wlc5bUlHOXdkR2x2Ym5NdWMyRjJaVWx1UTI5dmEybGxjeUFnUFQwOUlDZGliMjlzWldGdUp5QS9JRzl3ZEdsdmJuTXVjMkYyWlVsdVEyOXZhMmxsY3lBNklIUnlkV1U3WEhKY2JpQWdZMjl1YzNRZ2FXUWdQU0JnY0hKdlpIVmpkQzFvZFc1MExTUjdibUZ0WlM1MGIweHZkMlZ5UTJGelpTZ3BMbkpsY0d4aFkyVW9MMXRlWVMxNlFTMWFYU3N2Wnl3Z1hDSXRYQ0lwZldBN1hISmNiaUFnWTI5dWMzUWdhSFJ0YkNBOUlHQThaR2wySUdOc1lYTnpQVndpY0hKdlpIVmpkR2gxYm5SY0lpQnBaRDFjSWlSN2FXUjlYQ0krSUR4emNHRnVJR05zWVhOelBWd2ljSEp2WkhWamRHaDFiblJmWDJOc2IzTmxYQ0lnYVdROVhDSWtlMmxrZlMxamJHOXpaVndpUHNPWFBDOXpjR0Z1UGp4d0lHTnNZWE56UFZ3aWNISnZaSFZqZEdoMWJuUmZYM1JsZUhSY0lqNGtlM1JsZUhSOVBDOXdQaUE4WVNCb2NtVm1QVndpSkh0MWNteDlYQ0lnWTJ4aGMzTTlYQ0p3YUMxaWRYUjBiMjVjSWlCMFlYSm5aWFE5WENKZllteGhibXRjSWo0a2UySjFkSFJ2YmxSbGVIUjlQQzloUGp3dlpHbDJQbUE3WEhKY2JpQWdZMjl1YzNRZ1kzTnpJRDBnWUZ4eVhHNGdJQzV3YUMxaWRYUjBiMjRnZTF4eVhHNGdJQ0FnWW1GamEyZHliM1Z1WkRvZ2JHbHVaV0Z5TFdkeVlXUnBaVzUwS0RZMVpHVm5MQ1I3WTI5c2IzSlBibVY5TENSN1kyOXNiM0pVZDI5OUtUdGNjbHh1SUNBZ0lHWnZiblF0Wm1GdGFXeDVPaUJ6WVc1ekxYTmxjbWxtTzF4eVhHNGdJQ0FnWTI5c2IzSTZJQ05tWm1ZZ0lXbHRjRzl5ZEdGdWREdGNjbHh1SUNBZ0lHUnBjM0JzWVhrNklHSnNiMk5yTzF4eVhHNGdJQ0FnYkdWMGRHVnlMWE53WVdOcGJtYzZJREE3WEhKY2JpQWdJQ0JtYjI1MExYZGxhV2RvZERvZ056QXdPMXh5WEc0Z0lDQWdiR2x1WlMxb1pXbG5hSFE2SURFMmNIZzdYSEpjYmlBZ0lDQm1iMjUwTFhOcGVtVTZJREUwY0hnN1hISmNiaUFnSUNCMFpYaDBMWFJ5WVc1elptOXliVG9nZFhCd1pYSmpZWE5sTzF4eVhHNGdJQ0FnZEdWNGRDMWtaV052Y21GMGFXOXVPaUJ1YjI1bElXbHRjRzl5ZEdGdWREdGNjbHh1SUNBZ0lHSnZjbVJsY2pvZ2JtOXVaVHRjY2x4dUlDQWdJR0p2Y21SbGNpMXlZV1JwZFhNNklESndlRHRjY2x4dUlDQWdJR04xY25OdmNqb2djRzlwYm5SbGNqdGNjbHh1SUNBZ0lHcDFjM1JwWm5rdFkyOXVkR1Z1ZERvZ1kyVnVkR1Z5TzF4eVhHNGdJQ0FnY0dGa1pHbHVaem9nTVRad2VDQXhObkI0TzF4eVhHNGdJQ0FnZEdWNGRDMWhiR2xuYmpvZ1kyVnVkR1Z5TzF4eVhHNGdJQ0FnZDJocGRHVXRjM0JoWTJVNklHNXZkM0poY0R0Y2NseHVJQ0FnSUdKdmVDMXphR0ZrYjNjNklEQWdPSEI0SURJMGNIZ2djbWRpWVNnek1pdzBNeXcxTkN3dU1USXBPMXh5WEc0Z0lDQWdkSEpoYm5OcGRHbHZiam9nWVd4c0lDNHpjeUJsWVhObE8xeHlYRzRnSUNBZ2JXRnlaMmx1TFhSdmNEb2dNVFp3ZUR0Y2NseHVJQ0FnSUdadmJuUXRjMmw2WlRvZ01UUndlRHRjY2x4dUlDQjlYSEpjYmlBZ0xuQm9MV0oxZEhSdmJqcG9iM1psY2lCN1hISmNiaUFnSUNCaWIzZ3RjMmhoWkc5M09pQXdJRFp3ZUNBeU5IQjRJSEpuWW1Fb016SXNORE1zTlRRc0xqUXBPMXh5WEc0Z0lIMWNjbHh1SUNBdWNISnZaSFZqZEdoMWJuUWdlMXh5WEc0Z0lDQWdjRzl6YVhScGIyNDZJR1pwZUdWa08xeHlYRzRnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0kyWm1aanRjY2x4dUlDQWdJSEJoWkdScGJtYzZJREkwY0hnN1hISmNiaUFnSUNCaWIzZ3RjMmhoWkc5M09pQXdJRFJ3ZUNBeE5uQjRJSEpuWW1Fb01UWXNJRE14TENBMU9Td2dNQzR4TmlrN1hISmNiaUFnSUNCNkxXbHVaR1Y0T2lBeE1EdGNjbHh1SUNBZ0lHWnZiblF0YzJsNlpUb2dNVFp3ZUR0Y2NseHVJQ0FnSUdOdmJHOXlPaUFqTmpVMk16aG1PMXh5WEc0Z0lDQWdabTl1ZEMxbVlXMXBiSGs2SUhOaGJuTXRjMlZ5YVdZN1hISmNiaUFnSUNCdmNHRmphWFI1T2lBeE8xeHlYRzRnSUNBZ2RISmhibk5wZEdsdmJqb2dZV3hzSUM0emN5QmxZWE5sTzF4eVhHNGdJSDFjY2x4dUlDQXVjSEp2WkhWamRHaDFiblJmWDJOc2IzTmxJSHRjY2x4dUlDQWdJSEJ2YzJsMGFXOXVPaUJoWW5OdmJIVjBaVHRjY2x4dUlDQWdJSEpwWjJoME9pQXhObkI0TzF4eVhHNGdJQ0FnZEc5d09pQTRjSGc3WEhKY2JpQWdJQ0JqZFhKemIzSTZJSEJ2YVc1MFpYSTdYSEpjYmlBZ2ZWeHlYRzRnSUM1d2NtOWtkV04wYUhWdWRGOWZkR1Y0ZENCN1hISmNiaUFnSUNCdFlYSm5hVzQ2SURBN1hISmNiaUFnZlZ4eVhHNGdJRUJ0WldScFlTQW9iV0Y0TFhkcFpIUm9PaUEzTmpod2VDa2dlMXh5WEc0Z0lDQWdMbkJ5YjJSMVkzUm9kVzUwSUh0Y2NseHVJQ0FnSUNBZ2QybGtkR2c2SUdOaGJHTW9NVEF3SlNBdElEUTRjSGdwSUNGcGJYQnZjblJoYm5RN1hISmNiaUFnSUNBZ0lHSnZkSFJ2YlRvZ01DQWhhVzF3YjNKMFlXNTBPMXh5WEc0Z0lDQWdJQ0J5YVdkb2REb2dNQ0FoYVcxd2IzSjBZVzUwTzF4eVhHNGdJQ0FnSUNCc1pXWjBPaUF3SUNGcGJYQnZjblJoYm5RN1hISmNiaUFnSUNBZ0lHSnZlQzF6YUdGa2IzYzZJREFnTFRSd2VDQXhObkI0SUhKblltRW9NVFlzSURNeExDQTFPU3dnTUM0eE5pa2dJV2x0Y0c5eWRHRnVkRHRjY2x4dUlDQWdJSDFjY2x4dUlDQjlZRHRjY2x4dUlDQmNjbHh1SUNCY2NseHVJQ0JwWmlnaGQybHVaRzkzTG14dlkyRnNVM1J2Y21GblpTNW5aWFJKZEdWdEtHbGtLU0I4ZkNCellYWmxTVzVEYjI5cmFXVnpJRDA5SUdaaGJITmxLU0I3WEhKY2JpQWdJQ0JqY21WaGRHVk5iMlJoYkNob2RHMXNLVHRjY2x4dUlDQWdJSE5sZEZOMGVXeGxLR2xrTENCaWIzUjBiMjBzSUd4bFpuUXNJSEpwWjJoMExDQjNhV1IwYUNrN1hISmNiaUFnSUNCaFpHUkRiRzl6YVc1blJYWmxiblFvYVdRcE8xeHlYRzRnSUNBZ1lXUmtVM1I1YkdVb1kzTnpLVHRjY2x4dUlDQjlYSEpjYmlBZ0x5b2daWE5zYVc1MExXVnVZV0pzWlNBcUwxeHlYRzU5WEhKY2JseHlYRzVtZFc1amRHbHZiaUJqY21WaGRHVk5iMlJoYkNob2RHMXNLU0I3WEhKY2JpQWdZMjl1YzNRZ2NISnZiWEIwSUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5azdYSEpjYmx4eVhHNGdJSEJ5YjIxd2RDNXBibTVsY2toVVRVd2dQU0JvZEcxc08xeHlYRzRnSUdSdlkzVnRaVzUwTG1KdlpIa3VZWEJ3Wlc1a1EyaHBiR1FvY0hKdmJYQjBLVHRjY2x4dWZWeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z2MyVjBVM1I1YkdVb2FXUXNJR0p2ZEhSdmJTd2diR1ZtZEN3Z2NtbG5hSFFzSUhkcFpIUm9LU0I3WEhKY2JpQWdZMjl1YzNRZ2NISnZaSFZqZEdoMWJuUk5iMlJoYkNBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dsa0tUdGNjbHh1WEhKY2JpQWdjSEp2WkhWamRHaDFiblJOYjJSaGJDNXpkSGxzWlM1aWIzUjBiMjBnUFNCaWIzUjBiMjA3WEhKY2JpQWdjSEp2WkhWamRHaDFiblJOYjJSaGJDNXpkSGxzWlM1c1pXWjBJRDBnYkdWbWRDQS9JR3hsWm5RZ09pQW5kVzV6WlhRbk8xeHlYRzRnSUhCeWIyUjFZM1JvZFc1MFRXOWtZV3d1YzNSNWJHVXVjbWxuYUhRZ1BTQnlhV2RvZENBL0lISnBaMmgwSURvZ0ozVnVjMlYwSnp0Y2NseHVJQ0J3Y205a2RXTjBhSFZ1ZEUxdlpHRnNMbk4wZVd4bExuZHBaSFJvSUQwZ2QybGtkR2c3WEhKY2JuMWNjbHh1WEhKY2JtWjFibU4wYVc5dUlHRmtaRU5zYjNOcGJtZEZkbVZ1ZENocFpDa2dlMXh5WEc0Z0lHTnZibk4wSUhCeWIyUjFZM1JvZFc1MFRXOWtZV3dnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2hwWkNrN1hISmNiaUFnWTI5dWMzUWdjSEp2WkhWamRHaDFiblJEYkc5elpVSjFkSFJ2YmlBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dBa2UybGtmUzFqYkc5elpXQXBPMXh5WEc1Y2NseHVJQ0J3Y205a2RXTjBhSFZ1ZEVOc2IzTmxRblYwZEc5dUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z0tDa2dQVDRnZTF4eVhHNGdJQ0FnY0hKdlpIVmpkR2gxYm5STmIyUmhiQzV6ZEhsc1pTNXZjR0ZqYVhSNUlEMGdNRHRjY2x4dUlDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0J3Y205a2RXTjBhSFZ1ZEUxdlpHRnNMbkJoY21WdWRFNXZaR1V1Y21WdGIzWmxRMmhwYkdRb2NISnZaSFZqZEdoMWJuUk5iMlJoYkNrN1hISmNiaUFnSUNBZ0lIZHBibVJ2ZHk1c2IyTmhiRk4wYjNKaFoyVXVjMlYwU1hSbGJTaHBaQ3dnZEhKMVpTazdYSEpjYmlBZ0lDQjlMQ0F6TURBcE8xeHlYRzRnSUgwcE8xeHlYRzU5WEhKY2JseHlYRzVtZFc1amRHbHZiaUJoWkdSVGRIbHNaU2hqYzNNcElIdGNjbHh1SUNCamIyNXpkQ0JzYVc1clJXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJ4cGJtc25LVHRjY2x4dVhISmNiaUFnYkdsdWEwVnNaVzFsYm5RdWMyVjBRWFIwY21saWRYUmxLQ2R5Wld3bkxDQW5jM1I1YkdWemFHVmxkQ2NwTzF4eVhHNGdJR3hwYm10RmJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTZ25kSGx3WlNjc0lDZDBaWGgwTDJOemN5Y3BPMXh5WEc0Z0lHeHBibXRGYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNnbmFISmxaaWNzSUNka1lYUmhPblJsZUhRdlkzTnpPMk5vWVhKelpYUTlWVlJHTFRnc0p5QXJJR1Z1WTI5a1pWVlNTVU52YlhCdmJtVnVkQ2hqYzNNcEtUdGNjbHh1SUNCa2IyTjFiV1Z1ZEM1b1pXRmtMbUZ3Y0dWdVpFTm9hV3hrS0d4cGJtdEZiR1Z0Wlc1MEtUdGNjbHh1ZlZ4eVhHNGlMQ0pwYlhCdmNuUWdSbXh2WVhScGJtZFFjbTl0Y0hRZ1puSnZiU0FuTGk5bWJHOWhkR2x1WjFCeWIyMXdkQzVxY3ljN1hHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCR2JHOWhkR2x1WjFCeWIyMXdkRHRjYmx4dUx5b2daWE5zYVc1MExXUnBjMkZpYkdVZ0tpOWNiaWhtZFc1amRHbHZiaWgzYVc1a2IzY3BlMXh1SUNBZ2QybHVaRzkzTGtac2IyRjBhVzVuVUhKdmJYQjBJRDBnUm14dllYUnBibWRRY205dGNIUTdYRzRnZlNrb2QybHVaRzkzS1Z4dUlDOHFJR1Z6YkdsdWRDMWxibUZpYkdVZ0tpOWNiaUpkTENKemIzVnlZMlZTYjI5MElqb2lJbjA9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvZHVjdGh1bnQtZmxvYXRpbmctcHJvbXB0L2xpYi9wcm9kdWN0aHVudC1mbG9hdGluZy1wcm9tcHQuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJkYXJrbW9kZS1qc1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJkYXJrbW9kZS1qc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJkYXJrbW9kZS1qc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGk6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bDogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuLyoqKioqKi8gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuLyoqKioqKi8gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4vKioqKioqLyBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLyoqKioqKi8gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4vKioqKioqLyBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbi8qKioqKiovIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4vKioqKioqLyBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gbnM7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovICh7XG5cbi8qKiovIFwiLi9zcmMvZGFya21vZGUuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvZGFya21vZGUuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgbm8gc3RhdGljIGV4cG9ydHMgZm91bmQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuSVNfQlJPV1NFUiA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgSVNfQlJPV1NFUiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xuZXhwb3J0cy5JU19CUk9XU0VSID0gSVNfQlJPV1NFUjtcblxudmFyIERhcmttb2RlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRGFya21vZGUob3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEYXJrbW9kZSk7XG5cbiAgICBpZiAoIUlTX0JST1dTRVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBib3R0b206ICczMnB4JyxcbiAgICAgIHJpZ2h0OiAnMzJweCcsXG4gICAgICBsZWZ0OiAndW5zZXQnLFxuICAgICAgdGltZTogJzAuM3MnLFxuICAgICAgbWl4Q29sb3I6ICcjZmZmJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgICAgYnV0dG9uQ29sb3JEYXJrOiAnIzEwMGYyYycsXG4gICAgICBidXR0b25Db2xvckxpZ2h0OiAnI2ZmZicsXG4gICAgICBsYWJlbDogJycsXG4gICAgICBzYXZlSW5Db29raWVzOiB0cnVlLFxuICAgICAgYXV0b01hdGNoT3NUaGVtZTogdHJ1ZVxuICAgIH07XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB2YXIgY3NzID0gXCJcXG4gICAgICAuZGFya21vZGUtbGF5ZXIge1xcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgICAgICBiYWNrZ3JvdW5kOiBcIi5jb25jYXQob3B0aW9ucy5taXhDb2xvciwgXCI7XFxuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgXCIpLmNvbmNhdChvcHRpb25zLnRpbWUsIFwiIGVhc2U7XFxuICAgICAgICBtaXgtYmxlbmQtbW9kZTogZGlmZmVyZW5jZTtcXG4gICAgICB9XFxuXFxuICAgICAgLmRhcmttb2RlLWxheWVyLS1idXR0b24ge1xcbiAgICAgICAgd2lkdGg6IDIuOXJlbTtcXG4gICAgICAgIGhlaWdodDogMi45cmVtO1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICAgICAgcmlnaHQ6IFwiKS5jb25jYXQob3B0aW9ucy5yaWdodCwgXCI7XFxuICAgICAgICBib3R0b206IFwiKS5jb25jYXQob3B0aW9ucy5ib3R0b20sIFwiO1xcbiAgICAgICAgbGVmdDogXCIpLmNvbmNhdChvcHRpb25zLmxlZnQsIFwiO1xcbiAgICAgIH1cXG5cXG4gICAgICAuZGFya21vZGUtbGF5ZXItLXNpbXBsZSB7XFxuICAgICAgICB3aWR0aDogMTAwJTtcXG4gICAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICAgIHRvcDogMDtcXG4gICAgICAgIGxlZnQ6IDA7XFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpICFpbXBvcnRhbnQ7XFxuICAgICAgfVxcblxcbiAgICAgIC5kYXJrbW9kZS1sYXllci0tZXhwYW5kZWQge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxMDApO1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgICB9XFxuXFxuICAgICAgLmRhcmttb2RlLWxheWVyLS1uby10cmFuc2l0aW9uIHtcXG4gICAgICAgIHRyYW5zaXRpb246IG5vbmU7XFxuICAgICAgfVxcblxcbiAgICAgIC5kYXJrbW9kZS10b2dnbGUge1xcbiAgICAgICAgYmFja2dyb3VuZDogXCIpLmNvbmNhdChvcHRpb25zLmJ1dHRvbkNvbG9yRGFyaywgXCI7XFxuICAgICAgICB3aWR0aDogM3JlbTtcXG4gICAgICAgIGhlaWdodDogM3JlbTtcXG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gICAgICAgIGJvcmRlcjpub25lO1xcbiAgICAgICAgcmlnaHQ6IFwiKS5jb25jYXQob3B0aW9ucy5yaWdodCwgXCI7XFxuICAgICAgICBib3R0b206IFwiKS5jb25jYXQob3B0aW9ucy5ib3R0b20sIFwiO1xcbiAgICAgICAgbGVmdDogXCIpLmNvbmNhdChvcHRpb25zLmxlZnQsIFwiO1xcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZTtcXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgICAgfVxcblxcbiAgICAgIC5kYXJrbW9kZS10b2dnbGUtLXdoaXRlIHtcXG4gICAgICAgIGJhY2tncm91bmQ6IFwiKS5jb25jYXQob3B0aW9ucy5idXR0b25Db2xvckxpZ2h0LCBcIjtcXG4gICAgICB9XFxuXFxuICAgICAgLmRhcmttb2RlLXRvZ2dsZS0taW5hY3RpdmUge1xcbiAgICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgICB9XFxuXFxuICAgICAgLmRhcmttb2RlLWJhY2tncm91bmQge1xcbiAgICAgICAgYmFja2dyb3VuZDogXCIpLmNvbmNhdChvcHRpb25zLmJhY2tncm91bmRDb2xvciwgXCI7XFxuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gICAgICAgIHotaW5kZXg6IC0xMDtcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICAgICAgdG9wOiAwO1xcbiAgICAgICAgbGVmdDogMDtcXG4gICAgICB9XFxuXFxuICAgICAgaW1nLCAuZGFya21vZGUtaWdub3JlIHtcXG4gICAgICAgIGlzb2xhdGlvbjogaXNvbGF0ZTtcXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgICB9XFxuXFxuICAgICAgQG1lZGlhIHNjcmVlbiBhbmQgKC1tcy1oaWdoLWNvbnRyYXN0OiBhY3RpdmUpLCAoLW1zLWhpZ2gtY29udHJhc3Q6IG5vbmUpIHtcXG4gICAgICAgIC5kYXJrbW9kZS10b2dnbGUge2Rpc3BsYXk6IG5vbmUgIWltcG9ydGFudH1cXG4gICAgICB9XFxuXFxuICAgICAgQHN1cHBvcnRzICgtbXMtaW1lLWFsaWduOmF1dG8pLCAoLW1zLWFjY2VsZXJhdG9yOnRydWUpIHtcXG4gICAgICAgIC5kYXJrbW9kZS10b2dnbGUge2Rpc3BsYXk6IG5vbmUgIWltcG9ydGFudH1cXG4gICAgICB9XFxuICAgIFwiKTtcbiAgICB2YXIgbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdmFyIGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gb3B0aW9ucy5sYWJlbDtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtdG9nZ2xlLS1pbmFjdGl2ZScpO1xuICAgIGxheWVyLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLWxheWVyJyk7XG4gICAgYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrbW9kZS1iYWNrZ3JvdW5kJyk7XG4gICAgdmFyIGRhcmttb2RlQWN0aXZhdGVkID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrbW9kZScpID09PSAndHJ1ZSc7XG4gICAgdmFyIHByZWZlcmVkVGhlbWVPcyA9IG9wdGlvbnMuYXV0b01hdGNoT3NUaGVtZSAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXM7XG4gICAgdmFyIGRhcmttb2RlTmV2ZXJBY3RpdmF0ZWRCeUFjdGlvbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZGFya21vZGUnKSA9PT0gbnVsbDtcblxuICAgIGlmIChkYXJrbW9kZUFjdGl2YXRlZCA9PT0gdHJ1ZSAmJiBvcHRpb25zLnNhdmVJbkNvb2tpZXMgfHwgZGFya21vZGVOZXZlckFjdGl2YXRlZEJ5QWN0aW9uICYmIHByZWZlcmVkVGhlbWVPcykge1xuICAgICAgbGF5ZXIuY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtbGF5ZXItLWV4cGFuZGVkJywgJ2Rhcmttb2RlLWxheWVyLS1zaW1wbGUnLCAnZGFya21vZGUtbGF5ZXItLW5vLXRyYW5zaXRpb24nKTtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkYXJrbW9kZS10b2dnbGUtLXdoaXRlJyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLS1hY3RpdmF0ZWQnKTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShidXR0b24sIGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XG4gICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUobGF5ZXIsIGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XG4gICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoYmFja2dyb3VuZCwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcbiAgICB0aGlzLmFkZFN0eWxlKGNzcyk7XG4gICAgdGhpcy5idXR0b24gPSBidXR0b247XG4gICAgdGhpcy5sYXllciA9IGxheWVyO1xuICAgIHRoaXMuc2F2ZUluQ29va2llcyA9IG9wdGlvbnMuc2F2ZUluQ29va2llcztcbiAgICB0aGlzLnRpbWUgPSBvcHRpb25zLnRpbWU7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRGFya21vZGUsIFt7XG4gICAga2V5OiBcImFkZFN0eWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFN0eWxlKGNzcykge1xuICAgICAgdmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnZGF0YTp0ZXh0L2NzcztjaGFyc2V0PVVURi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY3NzKSk7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmtFbGVtZW50KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2hvd1dpZGdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93V2lkZ2V0KCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKCFJU19CUk9XU0VSKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGJ1dHRvbiA9IHRoaXMuYnV0dG9uO1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcjtcbiAgICAgIHZhciB0aW1lID0gcGFyc2VGbG9hdCh0aGlzLnRpbWUpICogMTAwMDtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkYXJrbW9kZS10b2dnbGUnKTtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrbW9kZS10b2dnbGUtLWluYWN0aXZlJyk7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIkFjdGl2YXRlIGRhcmsgbW9kZVwiKTtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWNoZWNrZWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgIGxheWVyLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLWxheWVyLS1idXR0b24nKTtcbiAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzRGFya21vZGUgPSBfdGhpcy5pc0FjdGl2YXRlZCgpO1xuXG4gICAgICAgIGlmICghaXNEYXJrbW9kZSkge1xuICAgICAgICAgIGxheWVyLmNsYXNzTGlzdC5hZGQoJ2Rhcmttb2RlLWxheWVyLS1leHBhbmRlZCcpO1xuICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsYXllci5jbGFzc0xpc3QuYWRkKCdkYXJrbW9kZS1sYXllci0tbm8tdHJhbnNpdGlvbicpO1xuICAgICAgICAgICAgbGF5ZXIuY2xhc3NMaXN0LmFkZCgnZGFya21vZGUtbGF5ZXItLXNpbXBsZScpO1xuICAgICAgICAgICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9LCB0aW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYXllci5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrbW9kZS1sYXllci0tc2ltcGxlJyk7XG4gICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rhcmttb2RlLWxheWVyLS1uby10cmFuc2l0aW9uJyk7XG4gICAgICAgICAgICBsYXllci5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrbW9kZS1sYXllci0tZXhwYW5kZWQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnZGFya21vZGUtdG9nZ2xlLS13aGl0ZScpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2Rhcmttb2RlLS1hY3RpdmF0ZWQnKTtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkYXJrbW9kZScsICFpc0Rhcmttb2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b2dnbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgICAgaWYgKCFJU19CUk9XU0VSKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcjtcbiAgICAgIHZhciBpc0Rhcmttb2RlID0gdGhpcy5pc0FjdGl2YXRlZCgpO1xuICAgICAgdmFyIGJ1dHRvbiA9IHRoaXMuYnV0dG9uO1xuICAgICAgbGF5ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnZGFya21vZGUtbGF5ZXItLXNpbXBsZScpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdkYXJrbW9kZS0tYWN0aXZhdGVkJyk7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Rhcmttb2RlJywgIWlzRGFya21vZGUpO1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJEZS1hY3RpdmF0ZSBkYXJrIG1vZGVcIik7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNBY3RpdmF0ZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNBY3RpdmF0ZWQoKSB7XG4gICAgICBpZiAoIUlTX0JST1dTRVIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZGFya21vZGUtLWFjdGl2YXRlZCcpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEYXJrbW9kZTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRGFya21vZGU7XG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL2luZGV4LmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIG5vIHN0YXRpYyBleHBvcnRzIGZvdW5kICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBfZGFya21vZGUgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2Rhcmttb2RlICovIFwiLi9zcmMvZGFya21vZGUuanNcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbnZhciBfZGVmYXVsdCA9IF9kYXJrbW9kZS5kZWZhdWx0O1xuLyogZXNsaW50LWRpc2FibGUgKi9cblxuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG5cbmlmIChfZGFya21vZGUuSVNfQlJPV1NFUikge1xuICAoZnVuY3Rpb24gKHdpbmRvdykge1xuICAgIHdpbmRvdy5EYXJrbW9kZSA9IF9kYXJrbW9kZS5kZWZhdWx0O1xuICB9KSh3aW5kb3cpO1xufVxuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG5cbi8qKiovIH0pXG5cbi8qKioqKiovIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbmRsWW5CaFkyczZMeTlrWVhKcmJXOWtaUzFxY3k5M1pXSndZV05yTDNWdWFYWmxjbk5oYkUxdlpIVnNaVVJsWm1sdWFYUnBiMjRpTENKM1pXSndZV05yT2k4dlpHRnlhMjF2WkdVdGFuTXZkMlZpY0dGamF5OWliMjkwYzNSeVlYQWlMQ0ozWldKd1lXTnJPaTh2WkdGeWEyMXZaR1V0YW5NdkxpOXpjbU12WkdGeWEyMXZaR1V1YW5NaUxDSjNaV0p3WVdOck9pOHZaR0Z5YTIxdlpHVXRhbk12TGk5emNtTXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHNpU1ZOZlFsSlBWMU5GVWlJc0luZHBibVJ2ZHlJc0lrUmhjbXR0YjJSbElpd2liM0IwYVc5dWN5SXNJbVJsWm1GMWJIUlBjSFJwYjI1eklpd2lZbTkwZEc5dElpd2ljbWxuYUhRaUxDSnNaV1owSWl3aWRHbHRaU0lzSW0xcGVFTnZiRzl5SWl3aVltRmphMmR5YjNWdVpFTnZiRzl5SWl3aVluVjBkRzl1UTI5c2IzSkVZWEpySWl3aVluVjBkRzl1UTI5c2IzSk1hV2RvZENJc0lteGhZbVZzSWl3aWMyRjJaVWx1UTI5dmEybGxjeUlzSW1GMWRHOU5ZWFJqYUU5elZHaGxiV1VpTENKUFltcGxZM1FpTENKaGMzTnBaMjRpTENKamMzTWlMQ0pzWVhsbGNpSXNJbVJ2WTNWdFpXNTBJaXdpWTNKbFlYUmxSV3hsYldWdWRDSXNJbUoxZEhSdmJpSXNJbUpoWTJ0bmNtOTFibVFpTENKcGJtNWxja2hVVFV3aUxDSmpiR0Z6YzB4cGMzUWlMQ0poWkdRaUxDSmtZWEpyYlc5a1pVRmpkR2wyWVhSbFpDSXNJbXh2WTJGc1UzUnZjbUZuWlNJc0ltZGxkRWwwWlcwaUxDSndjbVZtWlhKbFpGUm9aVzFsVDNNaUxDSnRZWFJqYUUxbFpHbGhJaXdpYldGMFkyaGxjeUlzSW1SaGNtdHRiMlJsVG1WMlpYSkJZM1JwZG1GMFpXUkNlVUZqZEdsdmJpSXNJbUp2WkhraUxDSnBibk5sY25SQ1pXWnZjbVVpTENKbWFYSnpkRU5vYVd4a0lpd2lZV1JrVTNSNWJHVWlMQ0pzYVc1clJXeGxiV1Z1ZENJc0luTmxkRUYwZEhKcFluVjBaU0lzSW1WdVkyOWtaVlZTU1VOdmJYQnZibVZ1ZENJc0ltaGxZV1FpTENKaGNIQmxibVJEYUdsc1pDSXNJbkJoY25ObFJteHZZWFFpTENKeVpXMXZkbVVpTENKaFpHUkZkbVZ1ZEV4cGMzUmxibVZ5SWl3aWFYTkVZWEpyYlc5a1pTSXNJbWx6UVdOMGFYWmhkR1ZrSWl3aWMyVjBWR2x0Wlc5MWRDSXNJbkpsYlc5MlpVRjBkSEpwWW5WMFpTSXNJblJ2WjJkc1pTSXNJbk5sZEVsMFpXMGlMQ0pqYjI1MFlXbHVjeUpkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUTBGQlF6dEJRVU5FTEU4N1FVTldRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdPMEZCUjBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxHdEVRVUV3UXl4blEwRkJaME03UVVGRE1VVTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeG5SVUZCZDBRc2EwSkJRV3RDTzBGQlF6RkZPMEZCUTBFc2VVUkJRV2xFTEdOQlFXTTdRVUZETDBRN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEdsRVFVRjVReXhwUTBGQmFVTTdRVUZETVVVc2QwaEJRV2RJTEcxQ1FVRnRRaXhGUVVGRk8wRkJRM0pKTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzYlVOQlFUSkNMREJDUVVFd1FpeEZRVUZGTzBGQlEzWkVMSGxEUVVGcFF5eGxRVUZsTzBGQlEyaEVPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTERoRVFVRnpSQ3dyUkVGQkswUTdPMEZCUlhKSU8wRkJRMEU3T3p0QlFVZEJPMEZCUTBFN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3TzBGRGJFWlBMRWxCUVUxQkxGVkJRVlVzUjBGQlJ5eFBRVUZQUXl4TlFVRlFMRXRCUVd0Q0xGZEJRWEpET3pzN1NVRkZZME1zVVRzN08wRkJRMjVDTEc5Q1FVRlpReXhQUVVGYUxFVkJRWEZDTzBGQlFVRTdPMEZCUTI1Q0xGRkJRVWtzUTBGQlEwZ3NWVUZCVEN4RlFVRnBRanRCUVVObU8wRkJRMFE3TzBGQlJVUXNVVUZCVFVrc1kwRkJZeXhIUVVGSE8wRkJRM0pDUXl4WlFVRk5MRVZCUVVVc1RVRkVZVHRCUVVWeVFrTXNWMEZCU3l4RlFVRkZMRTFCUm1NN1FVRkhja0pETEZWQlFVa3NSVUZCUlN4UFFVaGxPMEZCU1hKQ1F5eFZRVUZKTEVWQlFVVXNUVUZLWlR0QlFVdHlRa01zWTBGQlVTeEZRVUZGTEUxQlRGYzdRVUZOY2tKRExIRkNRVUZsTEVWQlFVVXNUVUZPU1R0QlFVOXlRa01zY1VKQlFXVXNSVUZCUlN4VFFWQkpPMEZCVVhKQ1F5eHpRa0ZCWjBJc1JVRkJSU3hOUVZKSE8wRkJVM0pDUXl4WFFVRkxMRVZCUVVVc1JVRlVZenRCUVZWeVFrTXNiVUpCUVdFc1JVRkJSU3hKUVZaTk8wRkJWM0pDUXl4elFrRkJaMElzUlVGQlJUdEJRVmhITEV0QlFYWkNPMEZCWTBGYUxGZEJRVThzUjBGQlIyRXNUVUZCVFN4RFFVRkRReXhOUVVGUUxFTkJRV01zUlVGQlpDeEZRVUZyUW1Jc1kwRkJiRUlzUlVGQmEwTkVMRTlCUVd4RExFTkJRVlk3UVVGRlFTeFJRVUZOWlN4SFFVRkhMSEZJUVVsVFppeFBRVUZQTEVOQlFVTk5MRkZCU21wQ0xIZERRVXRoVGl4UFFVRlBMRU5CUVVOTExFbEJUSEpDTEcxTlFXRkpUQ3hQUVVGUExFTkJRVU5ITEV0Qllsb3NaME5CWTB0SUxFOUJRVThzUTBGQlEwVXNUVUZrWWl3NFFrRmxSMFlzVDBGQlR5eERRVUZEU1N4SlFXWllMSEZoUVc5RFUwb3NUMEZCVHl4RFFVRkRVU3hsUVhCRGFrSXNlVXBCTUVOSlVpeFBRVUZQTEVOQlFVTkhMRXRCTVVOYUxHZERRVEpEUzBnc1QwRkJUeXhEUVVGRFJTeE5RVE5EWWl3NFFrRTBRMGRHTEU5QlFVOHNRMEZCUTBrc1NVRTFRMWdzYzA5QmNVUlRTaXhQUVVGUExFTkJRVU5UTEdkQ1FYSkVha0lzYjBwQk5rUlRWQ3hQUVVGUExFTkJRVU5QTEdWQk4wUnFRaXc0YVVKQlFWUTdRVUZ4UmtFc1VVRkJUVk1zUzBGQlN5eEhRVUZIUXl4UlFVRlJMRU5CUVVORExHRkJRVlFzUTBGQmRVSXNTMEZCZGtJc1EwRkJaRHRCUVVOQkxGRkJRVTFETEUxQlFVMHNSMEZCUjBZc1VVRkJVU3hEUVVGRFF5eGhRVUZVTEVOQlFYVkNMRkZCUVhaQ0xFTkJRV1k3UVVGRFFTeFJRVUZOUlN4VlFVRlZMRWRCUVVkSUxGRkJRVkVzUTBGQlEwTXNZVUZCVkN4RFFVRjFRaXhMUVVGMlFpeERRVUZ1UWp0QlFVVkJReXhWUVVGTkxFTkJRVU5GTEZOQlFWQXNSMEZCYlVKeVFpeFBRVUZQTEVOQlFVTlZMRXRCUVROQ08wRkJRMEZUTEZWQlFVMHNRMEZCUTBjc1UwRkJVQ3hEUVVGcFFrTXNSMEZCYWtJc1EwRkJjVUlzTWtKQlFYSkNPMEZCUTBGUUxGTkJRVXNzUTBGQlEwMHNVMEZCVGl4RFFVRm5Ra01zUjBGQmFFSXNRMEZCYjBJc1owSkJRWEJDTzBGQlEwRklMR05CUVZVc1EwRkJRMFVzVTBGQldDeERRVUZ4UWtNc1IwRkJja0lzUTBGQmVVSXNjVUpCUVhwQ08wRkJSVUVzVVVGQlRVTXNhVUpCUVdsQ0xFZEJRM0pDTVVJc1RVRkJUU3hEUVVGRE1rSXNXVUZCVUN4RFFVRnZRa01zVDBGQmNFSXNRMEZCTkVJc1ZVRkJOVUlzVFVGQk5FTXNUVUZFT1VNN1FVRkZRU3hSUVVGTlF5eGxRVUZsTEVkQlEyNUNNMElzVDBGQlR5eERRVUZEV1N4blFrRkJVaXhKUVVOQlpDeE5RVUZOTEVOQlFVTTRRaXhWUVVGUUxFTkJRV3RDTERoQ1FVRnNRaXhGUVVGclJFTXNUMEZHY0VRN1FVRkhRU3hSUVVGTlF5dzRRa0ZCT0VJc1IwRkRiRU5vUXl4TlFVRk5MRU5CUVVNeVFpeFpRVUZRTEVOQlFXOUNReXhQUVVGd1FpeERRVUUwUWl4VlFVRTFRaXhOUVVFMFF5eEpRVVE1UXpzN1FVRkhRU3hSUVVOSFJpeHBRa0ZCYVVJc1MwRkJTeXhKUVVGMFFpeEpRVUU0UW5oQ0xFOUJRVThzUTBGQlExY3NZVUZCZGtNc1NVRkRRMjFDTERoQ1FVRTRRaXhKUVVGSlNDeGxRVVp5UXl4RlFVZEZPMEZCUTBGWUxGZEJRVXNzUTBGQlEwMHNVMEZCVGl4RFFVRm5Ra01zUjBGQmFFSXNRMEZEUlN3d1FrRkVSaXhGUVVWRkxIZENRVVpHTEVWQlIwVXNLMEpCU0VZN1FVRkxRVW9zV1VGQlRTeERRVUZEUnl4VFFVRlFMRU5CUVdsQ1F5eEhRVUZxUWl4RFFVRnhRaXgzUWtGQmNrSTdRVUZEUVU0c1kwRkJVU3hEUVVGRFl5eEpRVUZVTEVOQlFXTlVMRk5CUVdRc1EwRkJkMEpETEVkQlFYaENMRU5CUVRSQ0xIRkNRVUUxUWp0QlFVTkVPenRCUVVWRVRpeFpRVUZSTEVOQlFVTmpMRWxCUVZRc1EwRkJZME1zV1VGQlpDeERRVUV5UW1Jc1RVRkJNMElzUlVGQmJVTkdMRkZCUVZFc1EwRkJRMk1zU1VGQlZDeERRVUZqUlN4VlFVRnFSRHRCUVVOQmFFSXNXVUZCVVN4RFFVRkRZeXhKUVVGVUxFTkJRV05ETEZsQlFXUXNRMEZCTWtKb1FpeExRVUV6UWl4RlFVRnJRME1zVVVGQlVTeERRVUZEWXl4SlFVRlVMRU5CUVdORkxGVkJRV2hFTzBGQlEwRm9RaXhaUVVGUkxFTkJRVU5qTEVsQlFWUXNRMEZCWTBNc1dVRkJaQ3hEUVVFeVFsb3NWVUZCTTBJc1JVRkJkVU5JTEZGQlFWRXNRMEZCUTJNc1NVRkJWQ3hEUVVGalJTeFZRVUZ5UkR0QlFVVkJMRk5CUVV0RExGRkJRVXdzUTBGQlkyNUNMRWRCUVdRN1FVRkZRU3hUUVVGTFNTeE5RVUZNTEVkQlFXTkJMRTFCUVdRN1FVRkRRU3hUUVVGTFNDeExRVUZNTEVkQlFXRkJMRXRCUVdJN1FVRkRRU3hUUVVGTFRDeGhRVUZNTEVkQlFYRkNXQ3hQUVVGUExFTkJRVU5YTEdGQlFUZENPMEZCUTBFc1UwRkJTMDRzU1VGQlRDeEhRVUZaVEN4UFFVRlBMRU5CUVVOTExFbEJRWEJDTzBGQlEwUTdPenM3TmtKQlJWRlZMRWNzUlVGQlN6dEJRVU5hTEZWQlFVMXZRaXhYUVVGWExFZEJRVWRzUWl4UlFVRlJMRU5CUVVORExHRkJRVlFzUTBGQmRVSXNUVUZCZGtJc1EwRkJjRUk3UVVGRlFXbENMR2xDUVVGWExFTkJRVU5ETEZsQlFWb3NRMEZCZVVJc1MwRkJla0lzUlVGQlowTXNXVUZCYUVNN1FVRkRRVVFzYVVKQlFWY3NRMEZCUTBNc1dVRkJXaXhEUVVGNVFpeE5RVUY2UWl4RlFVRnBReXhWUVVGcVF6dEJRVU5CUkN4cFFrRkJWeXhEUVVGRFF5eFpRVUZhTEVOQlEwVXNUVUZFUml4RlFVVkZMR2xEUVVGcFEwTXNhMEpCUVd0Q0xFTkJRVU4wUWl4SFFVRkVMRU5CUm5KRU8wRkJTVUZGTEdOQlFWRXNRMEZCUTNGQ0xFbEJRVlFzUTBGQlkwTXNWMEZCWkN4RFFVRXdRa29zVjBGQk1VSTdRVUZEUkRzN08ybERRVVZaTzBGQlFVRTdPMEZCUTFnc1ZVRkJTU3hEUVVGRGRFTXNWVUZCVEN4RlFVRnBRanRCUVVObU8wRkJRMFE3TzBGQlEwUXNWVUZCVFhOQ0xFMUJRVTBzUjBGQlJ5eExRVUZMUVN4TlFVRndRanRCUVVOQkxGVkJRVTFJTEV0QlFVc3NSMEZCUnl4TFFVRkxRU3hMUVVGdVFqdEJRVU5CTEZWQlFVMVlMRWxCUVVrc1IwRkJSMjFETEZWQlFWVXNRMEZCUXl4TFFVRkxia01zU1VGQlRpeERRVUZXTEVkQlFYZENMRWxCUVhKRE8wRkJSVUZqTEZsQlFVMHNRMEZCUTBjc1UwRkJVQ3hEUVVGcFFrTXNSMEZCYWtJc1EwRkJjVUlzYVVKQlFYSkNPMEZCUTBGS0xGbEJRVTBzUTBGQlEwY3NVMEZCVUN4RFFVRnBRbTFDTEUxQlFXcENMRU5CUVhkQ0xESkNRVUY0UWp0QlFVTkJkRUlzV1VGQlRTeERRVUZEYVVJc1dVRkJVQ3hEUVVGdlFpeFpRVUZ3UWl4RlFVRnJReXh2UWtGQmJFTTdRVUZEUVdwQ0xGbEJRVTBzUTBGQlEybENMRmxCUVZBc1EwRkJiMElzWTBGQmNFSXNSVUZCYjBNc1QwRkJjRU03UVVGRFFYQkNMRmRCUVVzc1EwRkJRMDBzVTBGQlRpeERRVUZuUWtNc1IwRkJhRUlzUTBGQmIwSXNkMEpCUVhCQ08wRkJSVUZLTEZsQlFVMHNRMEZCUTNWQ0xHZENRVUZRTEVOQlFYZENMRTlCUVhoQ0xFVkJRV2xETEZsQlFVMDdRVUZEY2tNc1dVRkJUVU1zVlVGQlZTeEhRVUZITEV0QlFVa3NRMEZCUTBNc1YwRkJUQ3hGUVVGdVFqczdRVUZGUVN4WlFVRkpMRU5CUVVORUxGVkJRVXdzUlVGQmFVSTdRVUZEWmpOQ0xHVkJRVXNzUTBGQlEwMHNVMEZCVGl4RFFVRm5Ra01zUjBGQmFFSXNRMEZCYjBJc01FSkJRWEJDTzBGQlEwRktMR2RDUVVGTkxFTkJRVU5wUWl4WlFVRlFMRU5CUVc5Q0xGVkJRWEJDTEVWQlFXZERMRWxCUVdoRE8wRkJRMEZUTEc5Q1FVRlZMRU5CUVVNc1dVRkJUVHRCUVVObU4wSXNhVUpCUVVzc1EwRkJRMDBzVTBGQlRpeERRVUZuUWtNc1IwRkJhRUlzUTBGQmIwSXNLMEpCUVhCQ08wRkJRMEZRTEdsQ1FVRkxMRU5CUVVOTkxGTkJRVTRzUTBGQlowSkRMRWRCUVdoQ0xFTkJRVzlDTEhkQ1FVRndRanRCUVVOQlNpeHJRa0ZCVFN4RFFVRkRNa0lzWlVGQlVDeERRVUYxUWl4VlFVRjJRanRCUVVORUxGZEJTbE1zUlVGSlVIcERMRWxCU2s4c1EwRkJWanRCUVV0RUxGTkJVa1FzVFVGUlR6dEJRVU5NVnl4bFFVRkxMRU5CUVVOTkxGTkJRVTRzUTBGQlowSnRRaXhOUVVGb1FpeERRVUYxUWl4M1FrRkJka0k3UVVGRFFYUkNMR2RDUVVGTkxFTkJRVU5wUWl4WlFVRlFMRU5CUVc5Q0xGVkJRWEJDTEVWQlFXZERMRWxCUVdoRE8wRkJRMEZUTEc5Q1FVRlZMRU5CUVVNc1dVRkJUVHRCUVVObU4wSXNhVUpCUVVzc1EwRkJRMDBzVTBGQlRpeERRVUZuUW0xQ0xFMUJRV2hDTEVOQlFYVkNMQ3RDUVVGMlFqdEJRVU5CZWtJc2FVSkJRVXNzUTBGQlEwMHNVMEZCVGl4RFFVRm5RbTFDTEUxQlFXaENMRU5CUVhWQ0xEQkNRVUYyUWp0QlFVTkJkRUlzYTBKQlFVMHNRMEZCUXpKQ0xHVkJRVkFzUTBGQmRVSXNWVUZCZGtJN1FVRkRSQ3hYUVVwVExFVkJTVkFzUTBGS1R5eERRVUZXTzBGQlMwUTdPMEZCUlVRelFpeGpRVUZOTEVOQlFVTkhMRk5CUVZBc1EwRkJhVUo1UWl4TlFVRnFRaXhEUVVGM1FpeDNRa0ZCZUVJN1FVRkRRVGxDTEdkQ1FVRlJMRU5CUVVOakxFbEJRVlFzUTBGQlkxUXNVMEZCWkN4RFFVRjNRbmxDTEUxQlFYaENMRU5CUVN0Q0xIRkNRVUV2UWp0QlFVTkJha1FzWTBGQlRTeERRVUZETWtJc1dVRkJVQ3hEUVVGdlFuVkNMRTlCUVhCQ0xFTkJRVFJDTEZWQlFUVkNMRVZCUVhkRExFTkJRVU5NTEZWQlFYcERPMEZCUTBRc1QwRjRRa1E3UVVGNVFrUTdPenMyUWtGRlVUdEJRVU5RTEZWQlFVa3NRMEZCUXpsRExGVkJRVXdzUlVGQmFVSTdRVUZEWmp0QlFVTkVPenRCUVVORUxGVkJRVTF0UWl4TFFVRkxMRWRCUVVjc1MwRkJTMEVzUzBGQmJrSTdRVUZEUVN4VlFVRk5Na0lzVlVGQlZTeEhRVUZITEV0QlFVdERMRmRCUVV3c1JVRkJia0k3UVVGRFFTeFZRVUZOZWtJc1RVRkJUU3hIUVVGSExFdEJRVXRCTEUxQlFYQkNPMEZCUlVGSUxGZEJRVXNzUTBGQlEwMHNVMEZCVGl4RFFVRm5RbmxDTEUxQlFXaENMRU5CUVhWQ0xIZENRVUYyUWp0QlFVTkJPVUlzWTBGQlVTeERRVUZEWXl4SlFVRlVMRU5CUVdOVUxGTkJRV1FzUTBGQmQwSjVRaXhOUVVGNFFpeERRVUVyUWl4eFFrRkJMMEk3UVVGRFFXcEVMRmxCUVUwc1EwRkJRekpDTEZsQlFWQXNRMEZCYjBKMVFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVFMVFpeEZRVUYzUXl4RFFVRkRUQ3hWUVVGNlF6dEJRVU5CZUVJc1dVRkJUU3hEUVVGRGFVSXNXVUZCVUN4RFFVRnZRaXhaUVVGd1FpeEZRVUZyUXl4MVFrRkJiRU03UVVGRFFXcENMRmxCUVUwc1EwRkJRMmxDTEZsQlFWQXNRMEZCYjBJc1kwRkJjRUlzUlVGQmIwTXNUVUZCY0VNN1FVRkZSRHM3TzJ0RFFVVmhPMEZCUTFvc1ZVRkJTU3hEUVVGRGRrTXNWVUZCVEN4RlFVRnBRanRCUVVObUxHVkJRVThzU1VGQlVEdEJRVU5FT3p0QlFVTkVMR0ZCUVU5dlFpeFJRVUZSTEVOQlFVTmpMRWxCUVZRc1EwRkJZMVFzVTBGQlpDeERRVUYzUWpKQ0xGRkJRWGhDTEVOQlFXbERMSEZDUVVGcVF5eERRVUZRTzBGQlEwUTdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN1FVTnFUMGc3T3pzN08wRkJSMEU3T3pzN1FVRkRRU3d3UWtGQlowSTdRVUZEWkN4SFFVRkRMRlZCUVZOdVJDeE5RVUZVTEVWQlFXbENPMEZCUTJoQ1FTeFZRVUZOTEVOQlFVTkRMRkZCUVZBN1FVRkRSQ3hIUVVaRUxFVkJSVWRFTEUxQlJrZzdRVUZIUkR0QlFVTkVJaXdpWm1sc1pTSTZJbVJoY210dGIyUmxMV3B6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLR1oxYm1OMGFXOXVJSGRsWW5CaFkydFZibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUtISnZiM1FzSUdaaFkzUnZjbmtwSUh0Y2JseDBhV1lvZEhsd1pXOW1JR1Y0Y0c5eWRITWdQVDA5SUNkdlltcGxZM1FuSUNZbUlIUjVjR1Z2WmlCdGIyUjFiR1VnUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEcxdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm1GamRHOXllU2dwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCa1pXWnBibVVnUFQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnWkdWbWFXNWxMbUZ0WkNsY2JseDBYSFJrWldacGJtVW9YQ0prWVhKcmJXOWtaUzFxYzF3aUxDQmJYU3dnWm1GamRHOXllU2s3WEc1Y2RHVnNjMlVnYVdZb2RIbHdaVzltSUdWNGNHOXlkSE1nUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEdWNGNHOXlkSE5iWENKa1lYSnJiVzlrWlMxcWMxd2lYU0E5SUdaaFkzUnZjbmtvS1R0Y2JseDBaV3h6WlZ4dVhIUmNkSEp2YjNSYlhDSmtZWEpyYlc5a1pTMXFjMXdpWFNBOUlHWmhZM1J2Y25rb0tUdGNibjBwS0hSNWNHVnZaaUJ6Wld4bUlDRTlQU0FuZFc1a1pXWnBibVZrSnlBL0lITmxiR1lnT2lCMGFHbHpMQ0JtZFc1amRHbHZiaWdwSUh0Y2JuSmxkSFZ5YmlBaUxDSWdYSFF2THlCVWFHVWdiVzlrZFd4bElHTmhZMmhsWEc0Z1hIUjJZWElnYVc1emRHRnNiR1ZrVFc5a2RXeGxjeUE5SUh0OU8xeHVYRzRnWEhRdkx5QlVhR1VnY21WeGRXbHlaU0JtZFc1amRHbHZibHh1SUZ4MFpuVnVZM1JwYjI0Z1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5aHRiMlIxYkdWSlpDa2dlMXh1WEc0Z1hIUmNkQzh2SUVOb1pXTnJJR2xtSUcxdlpIVnNaU0JwY3lCcGJpQmpZV05vWlZ4dUlGeDBYSFJwWmlocGJuTjBZV3hzWldSTmIyUjFiR1Z6VzIxdlpIVnNaVWxrWFNrZ2UxeHVJRngwWEhSY2RISmxkSFZ5YmlCcGJuTjBZV3hzWldSTmIyUjFiR1Z6VzIxdlpIVnNaVWxrWFM1bGVIQnZjblJ6TzF4dUlGeDBYSFI5WEc0Z1hIUmNkQzh2SUVOeVpXRjBaU0JoSUc1bGR5QnRiMlIxYkdVZ0tHRnVaQ0J3ZFhRZ2FYUWdhVzUwYnlCMGFHVWdZMkZqYUdVcFhHNGdYSFJjZEhaaGNpQnRiMlIxYkdVZ1BTQnBibk4wWVd4c1pXUk5iMlIxYkdWelcyMXZaSFZzWlVsa1hTQTlJSHRjYmlCY2RGeDBYSFJwT2lCdGIyUjFiR1ZKWkN4Y2JpQmNkRngwWEhSc09pQm1ZV3h6WlN4Y2JpQmNkRngwWEhSbGVIQnZjblJ6T2lCN2ZWeHVJRngwWEhSOU8xeHVYRzRnWEhSY2RDOHZJRVY0WldOMWRHVWdkR2hsSUcxdlpIVnNaU0JtZFc1amRHbHZibHh1SUZ4MFhIUnRiMlIxYkdWelcyMXZaSFZzWlVsa1hTNWpZV3hzS0cxdlpIVnNaUzVsZUhCdmNuUnpMQ0J0YjJSMWJHVXNJRzF2WkhWc1pTNWxlSEJ2Y25SekxDQmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZLVHRjYmx4dUlGeDBYSFF2THlCR2JHRm5JSFJvWlNCdGIyUjFiR1VnWVhNZ2JHOWhaR1ZrWEc0Z1hIUmNkRzF2WkhWc1pTNXNJRDBnZEhKMVpUdGNibHh1SUZ4MFhIUXZMeUJTWlhSMWNtNGdkR2hsSUdWNGNHOXlkSE1nYjJZZ2RHaGxJRzF2WkhWc1pWeHVJRngwWEhSeVpYUjFjbTRnYlc5a2RXeGxMbVY0Y0c5eWRITTdYRzRnWEhSOVhHNWNibHh1SUZ4MEx5OGdaWGh3YjNObElIUm9aU0J0YjJSMWJHVnpJRzlpYW1WamRDQW9YMTkzWldKd1lXTnJYMjF2WkhWc1pYTmZYeWxjYmlCY2RGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHViU0E5SUcxdlpIVnNaWE03WEc1Y2JpQmNkQzh2SUdWNGNHOXpaU0IwYUdVZ2JXOWtkV3hsSUdOaFkyaGxYRzRnWEhSZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtTWdQU0JwYm5OMFlXeHNaV1JOYjJSMWJHVnpPMXh1WEc0Z1hIUXZMeUJrWldacGJtVWdaMlYwZEdWeUlHWjFibU4wYVc5dUlHWnZjaUJvWVhKdGIyNTVJR1Y0Y0c5eWRITmNiaUJjZEY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dVpDQTlJR1oxYm1OMGFXOXVLR1Y0Y0c5eWRITXNJRzVoYldVc0lHZGxkSFJsY2lrZ2UxeHVJRngwWEhScFppZ2hYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV2S0dWNGNHOXlkSE1zSUc1aGJXVXBLU0I3WEc0Z1hIUmNkRngwVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtHVjRjRzl5ZEhNc0lHNWhiV1VzSUhzZ1pXNTFiV1Z5WVdKc1pUb2dkSEoxWlN3Z1oyVjBPaUJuWlhSMFpYSWdmU2s3WEc0Z1hIUmNkSDFjYmlCY2RIMDdYRzVjYmlCY2RDOHZJR1JsWm1sdVpTQmZYMlZ6VFc5a2RXeGxJRzl1SUdWNGNHOXlkSE5jYmlCY2RGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVjaUE5SUdaMWJtTjBhVzl1S0dWNGNHOXlkSE1wSUh0Y2JpQmNkRngwYVdZb2RIbHdaVzltSUZONWJXSnZiQ0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnVTNsdFltOXNMblJ2VTNSeWFXNW5WR0ZuS1NCN1hHNGdYSFJjZEZ4MFQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLR1Y0Y0c5eWRITXNJRk41YldKdmJDNTBiMU4wY21sdVoxUmhaeXdnZXlCMllXeDFaVG9nSjAxdlpIVnNaU2NnZlNrN1hHNGdYSFJjZEgxY2JpQmNkRngwVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtHVjRjRzl5ZEhNc0lDZGZYMlZ6VFc5a2RXeGxKeXdnZXlCMllXeDFaVG9nZEhKMVpTQjlLVHRjYmlCY2RIMDdYRzVjYmlCY2RDOHZJR055WldGMFpTQmhJR1poYTJVZ2JtRnRaWE53WVdObElHOWlhbVZqZEZ4dUlGeDBMeThnYlc5a1pTQW1JREU2SUhaaGJIVmxJR2x6SUdFZ2JXOWtkV3hsSUdsa0xDQnlaWEYxYVhKbElHbDBYRzRnWEhRdkx5QnRiMlJsSUNZZ01qb2diV1Z5WjJVZ1lXeHNJSEJ5YjNCbGNuUnBaWE1nYjJZZ2RtRnNkV1VnYVc1MGJ5QjBhR1VnYm5OY2JpQmNkQzh2SUcxdlpHVWdKaUEwT2lCeVpYUjFjbTRnZG1Gc2RXVWdkMmhsYmlCaGJISmxZV1I1SUc1eklHOWlhbVZqZEZ4dUlGeDBMeThnYlc5a1pTQW1JRGg4TVRvZ1ltVm9ZWFpsSUd4cGEyVWdjbVZ4ZFdseVpWeHVJRngwWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1MElEMGdablZ1WTNScGIyNG9kbUZzZFdVc0lHMXZaR1VwSUh0Y2JpQmNkRngwYVdZb2JXOWtaU0FtSURFcElIWmhiSFZsSUQwZ1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5aDJZV3gxWlNrN1hHNGdYSFJjZEdsbUtHMXZaR1VnSmlBNEtTQnlaWFIxY200Z2RtRnNkV1U3WEc0Z1hIUmNkR2xtS0NodGIyUmxJQ1lnTkNrZ0ppWWdkSGx3Wlc5bUlIWmhiSFZsSUQwOVBTQW5iMkpxWldOMEp5QW1KaUIyWVd4MVpTQW1KaUIyWVd4MVpTNWZYMlZ6VFc5a2RXeGxLU0J5WlhSMWNtNGdkbUZzZFdVN1hHNGdYSFJjZEhaaGNpQnVjeUE5SUU5aWFtVmpkQzVqY21WaGRHVW9iblZzYkNrN1hHNGdYSFJjZEY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWNpaHVjeWs3WEc0Z1hIUmNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNodWN5d2dKMlJsWm1GMWJIUW5MQ0I3SUdWdWRXMWxjbUZpYkdVNklIUnlkV1VzSUhaaGJIVmxPaUIyWVd4MVpTQjlLVHRjYmlCY2RGeDBhV1lvYlc5a1pTQW1JRElnSmlZZ2RIbHdaVzltSUhaaGJIVmxJQ0U5SUNkemRISnBibWNuS1NCbWIzSW9kbUZ5SUd0bGVTQnBiaUIyWVd4MVpTa2dYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTVrS0c1ekxDQnJaWGtzSUdaMWJtTjBhVzl1S0d0bGVTa2dleUJ5WlhSMWNtNGdkbUZzZFdWYmEyVjVYVHNnZlM1aWFXNWtLRzUxYkd3c0lHdGxlU2twTzF4dUlGeDBYSFJ5WlhSMWNtNGdibk03WEc0Z1hIUjlPMXh1WEc0Z1hIUXZMeUJuWlhSRVpXWmhkV3gwUlhod2IzSjBJR1oxYm1OMGFXOXVJR1p2Y2lCamIyMXdZWFJwWW1sc2FYUjVJSGRwZEdnZ2JtOXVMV2hoY20xdmJua2diVzlrZFd4bGMxeHVJRngwWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dUlEMGdablZ1WTNScGIyNG9iVzlrZFd4bEtTQjdYRzRnWEhSY2RIWmhjaUJuWlhSMFpYSWdQU0J0YjJSMWJHVWdKaVlnYlc5a2RXeGxMbDlmWlhOTmIyUjFiR1VnUDF4dUlGeDBYSFJjZEdaMWJtTjBhVzl1SUdkbGRFUmxabUYxYkhRb0tTQjdJSEpsZEhWeWJpQnRiMlIxYkdWYkoyUmxabUYxYkhRblhUc2dmU0E2WEc0Z1hIUmNkRngwWm5WdVkzUnBiMjRnWjJWMFRXOWtkV3hsUlhod2IzSjBjeWdwSUhzZ2NtVjBkWEp1SUcxdlpIVnNaVHNnZlR0Y2JpQmNkRngwWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1a0tHZGxkSFJsY2l3Z0oyRW5MQ0JuWlhSMFpYSXBPMXh1SUZ4MFhIUnlaWFIxY200Z1oyVjBkR1Z5TzF4dUlGeDBmVHRjYmx4dUlGeDBMeThnVDJKcVpXTjBMbkJ5YjNSdmRIbHdaUzVvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzWEc0Z1hIUmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbThnUFNCbWRXNWpkR2x2YmlodlltcGxZM1FzSUhCeWIzQmxjblI1S1NCN0lISmxkSFZ5YmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFaV04wTENCd2NtOXdaWEowZVNrN0lIMDdYRzVjYmlCY2RDOHZJRjlmZDJWaWNHRmphMTl3ZFdKc2FXTmZjR0YwYUY5ZlhHNGdYSFJmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG5BZ1BTQmNJbHdpTzF4dVhHNWNiaUJjZEM4dklFeHZZV1FnWlc1MGNua2diVzlrZFd4bElHRnVaQ0J5WlhSMWNtNGdaWGh3YjNKMGMxeHVJRngwY21WMGRYSnVJRjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMThvWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1eklEMGdYQ0l1TDNOeVl5OXBibVJsZUM1cWMxd2lLVHRjYmlJc0ltVjRjRzl5ZENCamIyNXpkQ0JKVTE5Q1VrOVhVMFZTSUQwZ2RIbHdaVzltSUhkcGJtUnZkeUFoUFQwZ0ozVnVaR1ZtYVc1bFpDYzdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR05zWVhOeklFUmhjbXR0YjJSbElIdGNiaUFnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUdsbUlDZ2hTVk5mUWxKUFYxTkZVaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTnZibk4wSUdSbFptRjFiSFJQY0hScGIyNXpJRDBnZTF4dUlDQWdJQ0FnWW05MGRHOXRPaUFuTXpKd2VDY3NYRzRnSUNBZ0lDQnlhV2RvZERvZ0p6TXljSGduTEZ4dUlDQWdJQ0FnYkdWbWREb2dKM1Z1YzJWMEp5eGNiaUFnSUNBZ0lIUnBiV1U2SUNjd0xqTnpKeXhjYmlBZ0lDQWdJRzFwZUVOdmJHOXlPaUFuSTJabVppY3NYRzRnSUNBZ0lDQmlZV05yWjNKdmRXNWtRMjlzYjNJNklDY2pabVptSnl4Y2JpQWdJQ0FnSUdKMWRIUnZia052Ykc5eVJHRnlhem9nSnlNeE1EQm1NbU1uTEZ4dUlDQWdJQ0FnWW5WMGRHOXVRMjlzYjNKTWFXZG9kRG9nSnlObVptWW5MRnh1SUNBZ0lDQWdiR0ZpWld3NklDY25MRnh1SUNBZ0lDQWdjMkYyWlVsdVEyOXZhMmxsY3pvZ2RISjFaU3hjYmlBZ0lDQWdJR0YxZEc5TllYUmphRTl6VkdobGJXVTZJSFJ5ZFdWY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnYjNCMGFXOXVjeUE5SUU5aWFtVmpkQzVoYzNOcFoyNG9lMzBzSUdSbFptRjFiSFJQY0hScGIyNXpMQ0J2Y0hScGIyNXpLVHRjYmx4dUlDQWdJR052Ym5OMElHTnpjeUE5SUdCY2JpQWdJQ0FnSUM1a1lYSnJiVzlrWlMxc1lYbGxjaUI3WEc0Z0lDQWdJQ0FnSUhCdmMybDBhVzl1T2lCbWFYaGxaRHRjYmlBZ0lDQWdJQ0FnY0c5cGJuUmxjaTFsZG1WdWRITTZJRzV2Ym1VN1hHNGdJQ0FnSUNBZ0lHSmhZMnRuY205MWJtUTZJQ1I3YjNCMGFXOXVjeTV0YVhoRGIyeHZjbjA3WEc0Z0lDQWdJQ0FnSUhSeVlXNXphWFJwYjI0NklHRnNiQ0FrZTI5d2RHbHZibk11ZEdsdFpYMGdaV0Z6WlR0Y2JpQWdJQ0FnSUNBZ2JXbDRMV0pzWlc1a0xXMXZaR1U2SUdScFptWmxjbVZ1WTJVN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDNWtZWEpyYlc5a1pTMXNZWGxsY2kwdFluVjBkRzl1SUh0Y2JpQWdJQ0FnSUNBZ2QybGtkR2c2SURJdU9YSmxiVHRjYmlBZ0lDQWdJQ0FnYUdWcFoyaDBPaUF5TGpseVpXMDdYRzRnSUNBZ0lDQWdJR0p2Y21SbGNpMXlZV1JwZFhNNklEVXdKVHRjYmlBZ0lDQWdJQ0FnY21sbmFIUTZJQ1I3YjNCMGFXOXVjeTV5YVdkb2RIMDdYRzRnSUNBZ0lDQWdJR0p2ZEhSdmJUb2dKSHR2Y0hScGIyNXpMbUp2ZEhSdmJYMDdYRzRnSUNBZ0lDQWdJR3hsWm5RNklDUjdiM0IwYVc5dWN5NXNaV1owZlR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0xtUmhjbXR0YjJSbExXeGhlV1Z5TFMxemFXMXdiR1VnZTF4dUlDQWdJQ0FnSUNCM2FXUjBhRG9nTVRBd0pUdGNiaUFnSUNBZ0lDQWdhR1ZwWjJoME9pQXhNREFsTzF4dUlDQWdJQ0FnSUNCMGIzQTZJREE3WEc0Z0lDQWdJQ0FnSUd4bFpuUTZJREE3WEc0Z0lDQWdJQ0FnSUhSeVlXNXpabTl5YlRvZ2MyTmhiR1VvTVNrZ0lXbHRjRzl5ZEdGdWREdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMbVJoY210dGIyUmxMV3hoZVdWeUxTMWxlSEJoYm1SbFpDQjdYRzRnSUNBZ0lDQWdJSFJ5WVc1elptOXliVG9nYzJOaGJHVW9NVEF3S1R0Y2JpQWdJQ0FnSUNBZ1ltOXlaR1Z5TFhKaFpHbDFjem9nTUR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0xtUmhjbXR0YjJSbExXeGhlV1Z5TFMxdWJ5MTBjbUZ1YzJsMGFXOXVJSHRjYmlBZ0lDQWdJQ0FnZEhKaGJuTnBkR2x2YmpvZ2JtOXVaVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTG1SaGNtdHRiMlJsTFhSdloyZHNaU0I3WEc0Z0lDQWdJQ0FnSUdKaFkydG5jbTkxYm1RNklDUjdiM0IwYVc5dWN5NWlkWFIwYjI1RGIyeHZja1JoY210OU8xeHVJQ0FnSUNBZ0lDQjNhV1IwYURvZ00zSmxiVHRjYmlBZ0lDQWdJQ0FnYUdWcFoyaDBPaUF6Y21WdE8xeHVJQ0FnSUNBZ0lDQndiM05wZEdsdmJqb2dabWw0WldRN1hHNGdJQ0FnSUNBZ0lHSnZjbVJsY2kxeVlXUnBkWE02SURVd0pUdGNiaUFnSUNBZ0lDQWdZbTl5WkdWeU9tNXZibVU3WEc0Z0lDQWdJQ0FnSUhKcFoyaDBPaUFrZTI5d2RHbHZibk11Y21sbmFIUjlPMXh1SUNBZ0lDQWdJQ0JpYjNSMGIyMDZJQ1I3YjNCMGFXOXVjeTVpYjNSMGIyMTlPMXh1SUNBZ0lDQWdJQ0JzWldaME9pQWtlMjl3ZEdsdmJuTXViR1ZtZEgwN1hHNGdJQ0FnSUNBZ0lHTjFjbk52Y2pvZ2NHOXBiblJsY2p0Y2JpQWdJQ0FnSUNBZ2RISmhibk5wZEdsdmJqb2dZV3hzSURBdU5YTWdaV0Z6WlR0Y2JpQWdJQ0FnSUNBZ1pHbHpjR3hoZVRvZ1pteGxlRHRjYmlBZ0lDQWdJQ0FnYW5WemRHbG1lUzFqYjI1MFpXNTBPaUJqWlc1MFpYSTdYRzRnSUNBZ0lDQWdJR0ZzYVdkdUxXbDBaVzF6T2lCalpXNTBaWEk3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM1a1lYSnJiVzlrWlMxMGIyZG5iR1V0TFhkb2FYUmxJSHRjYmlBZ0lDQWdJQ0FnWW1GamEyZHliM1Z1WkRvZ0pIdHZjSFJwYjI1ekxtSjFkSFJ2YmtOdmJHOXlUR2xuYUhSOU8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXVaR0Z5YTIxdlpHVXRkRzluWjJ4bExTMXBibUZqZEdsMlpTQjdYRzRnSUNBZ0lDQWdJR1JwYzNCc1lYazZJRzV2Ym1VN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDNWtZWEpyYlc5a1pTMWlZV05yWjNKdmRXNWtJSHRjYmlBZ0lDQWdJQ0FnWW1GamEyZHliM1Z1WkRvZ0pIdHZjSFJwYjI1ekxtSmhZMnRuY205MWJtUkRiMnh2Y24wN1hHNGdJQ0FnSUNBZ0lIQnZjMmwwYVc5dU9pQm1hWGhsWkR0Y2JpQWdJQ0FnSUNBZ2NHOXBiblJsY2kxbGRtVnVkSE02SUc1dmJtVTdYRzRnSUNBZ0lDQWdJSG90YVc1a1pYZzZJQzB4TUR0Y2JpQWdJQ0FnSUNBZ2QybGtkR2c2SURFd01DVTdYRzRnSUNBZ0lDQWdJR2hsYVdkb2REb2dNVEF3SlR0Y2JpQWdJQ0FnSUNBZ2RHOXdPaUF3TzF4dUlDQWdJQ0FnSUNCc1pXWjBPaUF3TzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcGJXY3NJQzVrWVhKcmJXOWtaUzFwWjI1dmNtVWdlMXh1SUNBZ0lDQWdJQ0JwYzI5c1lYUnBiMjQ2SUdsemIyeGhkR1U3WEc0Z0lDQWdJQ0FnSUdScGMzQnNZWGs2SUdsdWJHbHVaUzFpYkc5amF6dGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdRRzFsWkdsaElITmpjbVZsYmlCaGJtUWdLQzF0Y3kxb2FXZG9MV052Ym5SeVlYTjBPaUJoWTNScGRtVXBMQ0FvTFcxekxXaHBaMmd0WTI5dWRISmhjM1E2SUc1dmJtVXBJSHRjYmlBZ0lDQWdJQ0FnTG1SaGNtdHRiMlJsTFhSdloyZHNaU0I3WkdsemNHeGhlVG9nYm05dVpTQWhhVzF3YjNKMFlXNTBmVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JBYzNWd2NHOXlkSE1nS0MxdGN5MXBiV1V0WVd4cFoyNDZZWFYwYnlrc0lDZ3RiWE10WVdOalpXeGxjbUYwYjNJNmRISjFaU2tnZTF4dUlDQWdJQ0FnSUNBdVpHRnlhMjF2WkdVdGRHOW5aMnhsSUh0a2FYTndiR0Y1T2lCdWIyNWxJQ0ZwYlhCdmNuUmhiblI5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdZRHRjYmx4dUlDQWdJR052Ym5OMElHeGhlV1Z5SUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5azdYRzRnSUNBZ1kyOXVjM1FnWW5WMGRHOXVJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25ZblYwZEc5dUp5azdYRzRnSUNBZ1kyOXVjM1FnWW1GamEyZHliM1Z1WkNBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BPMXh1WEc0Z0lDQWdZblYwZEc5dUxtbHVibVZ5U0ZSTlRDQTlJRzl3ZEdsdmJuTXViR0ZpWld3N1hHNGdJQ0FnWW5WMGRHOXVMbU5zWVhOelRHbHpkQzVoWkdRb0oyUmhjbXR0YjJSbExYUnZaMmRzWlMwdGFXNWhZM1JwZG1VbktUdGNiaUFnSUNCc1lYbGxjaTVqYkdGemMweHBjM1F1WVdSa0tDZGtZWEpyYlc5a1pTMXNZWGxsY2ljcE8xeHVJQ0FnSUdKaFkydG5jbTkxYm1RdVkyeGhjM05NYVhOMExtRmtaQ2duWkdGeWEyMXZaR1V0WW1GamEyZHliM1Z1WkNjcE8xeHVYRzRnSUNBZ1kyOXVjM1FnWkdGeWEyMXZaR1ZCWTNScGRtRjBaV1FnUFZ4dUlDQWdJQ0FnZDJsdVpHOTNMbXh2WTJGc1UzUnZjbUZuWlM1blpYUkpkR1Z0S0Nka1lYSnJiVzlrWlNjcElEMDlQU0FuZEhKMVpTYzdYRzRnSUNBZ1kyOXVjM1FnY0hKbFptVnlaV1JVYUdWdFpVOXpJRDFjYmlBZ0lDQWdJRzl3ZEdsdmJuTXVZWFYwYjAxaGRHTm9UM05VYUdWdFpTQW1KbHh1SUNBZ0lDQWdkMmx1Wkc5M0xtMWhkR05vVFdWa2FXRW9KeWh3Y21WbVpYSnpMV052Ykc5eUxYTmphR1Z0WlRvZ1pHRnlheWtuS1M1dFlYUmphR1Z6TzF4dUlDQWdJR052Ym5OMElHUmhjbXR0YjJSbFRtVjJaWEpCWTNScGRtRjBaV1JDZVVGamRHbHZiaUE5WEc0Z0lDQWdJQ0IzYVc1a2IzY3ViRzlqWVd4VGRHOXlZV2RsTG1kbGRFbDBaVzBvSjJSaGNtdHRiMlJsSnlrZ1BUMDlJRzUxYkd3N1hHNWNiaUFnSUNCcFppQW9YRzRnSUNBZ0lDQW9aR0Z5YTIxdlpHVkJZM1JwZG1GMFpXUWdQVDA5SUhSeWRXVWdKaVlnYjNCMGFXOXVjeTV6WVhabFNXNURiMjlyYVdWektTQjhmRnh1SUNBZ0lDQWdLR1JoY210dGIyUmxUbVYyWlhKQlkzUnBkbUYwWldSQ2VVRmpkR2x2YmlBbUppQndjbVZtWlhKbFpGUm9aVzFsVDNNcFhHNGdJQ0FnS1NCN1hHNGdJQ0FnSUNCc1lYbGxjaTVqYkdGemMweHBjM1F1WVdSa0tGeHVJQ0FnSUNBZ0lDQW5aR0Z5YTIxdlpHVXRiR0Y1WlhJdExXVjRjR0Z1WkdWa0p5eGNiaUFnSUNBZ0lDQWdKMlJoY210dGIyUmxMV3hoZVdWeUxTMXphVzF3YkdVbkxGeHVJQ0FnSUNBZ0lDQW5aR0Z5YTIxdlpHVXRiR0Y1WlhJdExXNXZMWFJ5WVc1emFYUnBiMjRuWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJQ0FnWW5WMGRHOXVMbU5zWVhOelRHbHpkQzVoWkdRb0oyUmhjbXR0YjJSbExYUnZaMmRzWlMwdGQyaHBkR1VuS1R0Y2JpQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VZMnhoYzNOTWFYTjBMbUZrWkNnblpHRnlhMjF2WkdVdExXRmpkR2wyWVhSbFpDY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1YVc1elpYSjBRbVZtYjNKbEtHSjFkSFJ2Yml3Z1pHOWpkVzFsYm5RdVltOWtlUzVtYVhKemRFTm9hV3hrS1R0Y2JpQWdJQ0JrYjJOMWJXVnVkQzVpYjJSNUxtbHVjMlZ5ZEVKbFptOXlaU2hzWVhsbGNpd2daRzlqZFcxbGJuUXVZbTlrZVM1bWFYSnpkRU5vYVd4a0tUdGNiaUFnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbWx1YzJWeWRFSmxabTl5WlNoaVlXTnJaM0p2ZFc1a0xDQmtiMk4xYldWdWRDNWliMlI1TG1acGNuTjBRMmhwYkdRcE8xeHVYRzRnSUNBZ2RHaHBjeTVoWkdSVGRIbHNaU2hqYzNNcE8xeHVYRzRnSUNBZ2RHaHBjeTVpZFhSMGIyNGdQU0JpZFhSMGIyNDdYRzRnSUNBZ2RHaHBjeTVzWVhsbGNpQTlJR3hoZVdWeU8xeHVJQ0FnSUhSb2FYTXVjMkYyWlVsdVEyOXZhMmxsY3lBOUlHOXdkR2x2Ym5NdWMyRjJaVWx1UTI5dmEybGxjenRjYmlBZ0lDQjBhR2x6TG5ScGJXVWdQU0J2Y0hScGIyNXpMblJwYldVN1hHNGdJSDFjYmx4dUlDQmhaR1JUZEhsc1pTaGpjM01wSUh0Y2JpQWdJQ0JqYjI1emRDQnNhVzVyUld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMnhwYm1zbktUdGNibHh1SUNBZ0lHeHBibXRGYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNnbmNtVnNKeXdnSjNOMGVXeGxjMmhsWlhRbktUdGNiaUFnSUNCc2FXNXJSV3hsYldWdWRDNXpaWFJCZEhSeWFXSjFkR1VvSjNSNWNHVW5MQ0FuZEdWNGRDOWpjM01uS1R0Y2JpQWdJQ0JzYVc1clJXeGxiV1Z1ZEM1elpYUkJkSFJ5YVdKMWRHVW9YRzRnSUNBZ0lDQW5hSEpsWmljc1hHNGdJQ0FnSUNBblpHRjBZVHAwWlhoMEwyTnpjenRqYUdGeWMyVjBQVlZVUmkwNExDY2dLeUJsYm1OdlpHVlZVa2xEYjIxd2IyNWxiblFvWTNOektWeHVJQ0FnSUNrN1hHNGdJQ0FnWkc5amRXMWxiblF1YUdWaFpDNWhjSEJsYm1SRGFHbHNaQ2hzYVc1clJXeGxiV1Z1ZENrN1hHNGdJSDFjYmx4dUlDQnphRzkzVjJsa1oyVjBLQ2tnZTF4dUlDQWdJR2xtSUNnaFNWTmZRbEpQVjFORlVpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUgxY2JpQWdJQ0JqYjI1emRDQmlkWFIwYjI0Z1BTQjBhR2x6TG1KMWRIUnZianRjYmlBZ0lDQmpiMjV6ZENCc1lYbGxjaUE5SUhSb2FYTXViR0Y1WlhJN1hHNGdJQ0FnWTI5dWMzUWdkR2x0WlNBOUlIQmhjbk5sUm14dllYUW9kR2hwY3k1MGFXMWxLU0FxSURFd01EQTdYRzVjYmlBZ0lDQmlkWFIwYjI0dVkyeGhjM05NYVhOMExtRmtaQ2duWkdGeWEyMXZaR1V0ZEc5bloyeGxKeWs3WEc0Z0lDQWdZblYwZEc5dUxtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyUmhjbXR0YjJSbExYUnZaMmRzWlMwdGFXNWhZM1JwZG1VbktUdGNiaUFnSUNCaWRYUjBiMjR1YzJWMFFYUjBjbWxpZFhSbEtGd2lZWEpwWVMxc1lXSmxiRndpTENCY0lrRmpkR2wyWVhSbElHUmhjbXNnYlc5a1pWd2lLVHRjYmlBZ0lDQmlkWFIwYjI0dWMyVjBRWFIwY21saWRYUmxLRndpWVhKcFlTMWphR1ZqYTJWa1hDSXNJRndpWm1Gc2MyVmNJaWs3WEc0Z0lDQWdiR0Y1WlhJdVkyeGhjM05NYVhOMExtRmtaQ2duWkdGeWEyMXZaR1V0YkdGNVpYSXRMV0oxZEhSdmJpY3BPMXh1WEc0Z0lDQWdZblYwZEc5dUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z0tDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdhWE5FWVhKcmJXOWtaU0E5SUhSb2FYTXVhWE5CWTNScGRtRjBaV1FvS1R0Y2JseHVJQ0FnSUNBZ2FXWWdLQ0ZwYzBSaGNtdHRiMlJsS1NCN1hHNGdJQ0FnSUNBZ0lHeGhlV1Z5TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMlJoY210dGIyUmxMV3hoZVdWeUxTMWxlSEJoYm1SbFpDY3BPMXh1SUNBZ0lDQWdJQ0JpZFhSMGIyNHVjMlYwUVhSMGNtbGlkWFJsS0Nka2FYTmhZbXhsWkNjc0lIUnlkV1VwTzF4dUlDQWdJQ0FnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQnNZWGxsY2k1amJHRnpjMHhwYzNRdVlXUmtLQ2RrWVhKcmJXOWtaUzFzWVhsbGNpMHRibTh0ZEhKaGJuTnBkR2x2YmljcE8xeHVJQ0FnSUNBZ0lDQWdJR3hoZVdWeUxtTnNZWE56VEdsemRDNWhaR1FvSjJSaGNtdHRiMlJsTFd4aGVXVnlMUzF6YVcxd2JHVW5LVHRjYmlBZ0lDQWdJQ0FnSUNCaWRYUjBiMjR1Y21WdGIzWmxRWFIwY21saWRYUmxLQ2RrYVhOaFlteGxaQ2NwTzF4dUlDQWdJQ0FnSUNCOUxDQjBhVzFsS1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUd4aGVXVnlMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMlJoY210dGIyUmxMV3hoZVdWeUxTMXphVzF3YkdVbktUdGNiaUFnSUNBZ0lDQWdZblYwZEc5dUxuTmxkRUYwZEhKcFluVjBaU2duWkdsellXSnNaV1FuTENCMGNuVmxLVHRjYmlBZ0lDQWdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2JHRjVaWEl1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWkdGeWEyMXZaR1V0YkdGNVpYSXRMVzV2TFhSeVlXNXphWFJwYjI0bktUdGNiaUFnSUNBZ0lDQWdJQ0JzWVhsbGNpNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGtZWEpyYlc5a1pTMXNZWGxsY2kwdFpYaHdZVzVrWldRbktUdGNiaUFnSUNBZ0lDQWdJQ0JpZFhSMGIyNHVjbVZ0YjNabFFYUjBjbWxpZFhSbEtDZGthWE5oWW14bFpDY3BPMXh1SUNBZ0lDQWdJQ0I5TENBeEtUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZblYwZEc5dUxtTnNZWE56VEdsemRDNTBiMmRuYkdVb0oyUmhjbXR0YjJSbExYUnZaMmRzWlMwdGQyaHBkR1VuS1R0Y2JpQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VZMnhoYzNOTWFYTjBMblJ2WjJkc1pTZ25aR0Z5YTIxdlpHVXRMV0ZqZEdsMllYUmxaQ2NwTzF4dUlDQWdJQ0FnZDJsdVpHOTNMbXh2WTJGc1UzUnZjbUZuWlM1elpYUkpkR1Z0S0Nka1lYSnJiVzlrWlNjc0lDRnBjMFJoY210dGIyUmxLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUhSdloyZHNaU2dwSUh0Y2JpQWdJQ0JwWmlBb0lVbFRYMEpTVDFkVFJWSXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNCOVhHNGdJQ0FnWTI5dWMzUWdiR0Y1WlhJZ1BTQjBhR2x6TG14aGVXVnlPMXh1SUNBZ0lHTnZibk4wSUdselJHRnlhMjF2WkdVZ1BTQjBhR2x6TG1selFXTjBhWFpoZEdWa0tDazdYRzRnSUNBZ1kyOXVjM1FnWW5WMGRHOXVJRDBnZEdocGN5NWlkWFIwYjI0N1hHNWNiaUFnSUNCc1lYbGxjaTVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RrWVhKcmJXOWtaUzFzWVhsbGNpMHRjMmx0Y0d4bEp5azdYRzRnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RrWVhKcmJXOWtaUzB0WVdOMGFYWmhkR1ZrSnlrN1hHNGdJQ0FnZDJsdVpHOTNMbXh2WTJGc1UzUnZjbUZuWlM1elpYUkpkR1Z0S0Nka1lYSnJiVzlrWlNjc0lDRnBjMFJoY210dGIyUmxLVHRjYmlBZ0lDQmlkWFIwYjI0dWMyVjBRWFIwY21saWRYUmxLRndpWVhKcFlTMXNZV0psYkZ3aUxDQmNJa1JsTFdGamRHbDJZWFJsSUdSaGNtc2diVzlrWlZ3aUtUdGNiaUFnSUNCaWRYUjBiMjR1YzJWMFFYUjBjbWxpZFhSbEtGd2lZWEpwWVMxamFHVmphMlZrWENJc0lGd2lkSEoxWlZ3aUtUdGNibHh1SUNCOVhHNWNiaUFnYVhOQlkzUnBkbUYwWldRb0tTQjdYRzRnSUNBZ2FXWWdLQ0ZKVTE5Q1VrOVhVMFZTS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm5Wc2JEdGNiaUFnSUNCOVhHNGdJQ0FnY21WMGRYSnVJR1J2WTNWdFpXNTBMbUp2WkhrdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGtZWEpyYlc5a1pTMHRZV04wYVhaaGRHVmtKeWs3WEc0Z0lIMWNibjFjYmlJc0ltbHRjRzl5ZENCRVlYSnJiVzlrWlN3Z2V5QkpVMTlDVWs5WFUwVlNJSDBnWm5KdmJTQW5MaTlrWVhKcmJXOWtaU2M3WEhKY2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVSaGNtdHRiMlJsTzF4eVhHNWNjbHh1THlvZ1pYTnNhVzUwTFdScGMyRmliR1VnS2k5Y2NseHVhV1lnS0VsVFgwSlNUMWRUUlZJcElIdGNjbHh1SUNBb1puVnVZM1JwYjI0b2QybHVaRzkzS1NCN1hISmNiaUFnSUNCM2FXNWtiM2N1UkdGeWEyMXZaR1VnUFNCRVlYSnJiVzlrWlR0Y2NseHVJQ0I5S1NoM2FXNWtiM2NwTzF4eVhHNTlYSEpjYmk4cUlHVnpiR2x1ZEMxbGJtRmliR1VnS2k5Y2NseHVJbDBzSW5OdmRYSmpaVkp2YjNRaU9pSWlmUT09XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZGFya21vZGUtanMvbGliL2Rhcmttb2RlLWpzLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=