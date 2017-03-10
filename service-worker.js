/* eslint-env worker, serviceworker */
'use strict';

var appVersion = 6;
var cacheName = 'luis-puhl-resume-v' + appVersion;
var cacheWhitelist = [
	cacheName
];
var filesToCache = [
	'/',
	'/index.html',
	'/scripts/main.js',
	'/scripts/service-worker-registration.js',
	'/styles/main.css',
	'/images/touch/icon-128x128.png',
	'/images/touch/icon-144x144.png',
	'/images/touch/icon-152x152.png',
	'/images/touch/icon-192x192.png',
	'/images/touch/icon-256x256.png',
	'no-resource.txt',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
	'https://code.jquery.com/jquery-3.1.1.min.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
];
var cacheFilesBlackList = [
	/google-analytics/gi,
	'https://www.gstatic.com/firebasejs/3.7.0/firebase.js',
	'https://cdn.firebase.com/js/client/2.4.2/firebase.js'
];


/**
 * Here we put a new cache
 */
this.addEventListener('install', function(event) {
	// console.log('[ServiceWorker] Install');
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			// console.log('[ServiceWorker] Caching app on ' + cacheName);
			return cache.addAll(filesToCache);
		})
	);
	self.skipWaiting();
});

/**
 * When there is an update, this event is run after the install.
 * So in the install we put a new cache, and here we delete the old
*/
this.addEventListener('activate', function(event) {
	// console.log('[ServiceWorker] Activate');
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (cacheWhitelist.indexOf(key) === -1) {
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});


/**
 * This is the way the client (controled page) talks with the service worker
**/
self.addEventListener('message', function(event) {
	// console.log('[swtoolbox] message');
	// console.log(event);
});


/**
 * Promise.race is no good to us because it rejects if
 * a promise rejects before fulfilling. Let's make a proper
 * race function:
 */
function promiseAny(promises) {
	return new Promise((resolve, reject) => {
		// make sure promises are all promises
		promises = promises.map(p => Promise.resolve(p));
		// resolve this promise as soon as one resolves
		promises.forEach(p => p.then(resolve));
		// reject if all promises reject
		promises.reduce((a, b) => a.catch(() => b))
			.catch(() => reject(Error("All failed")));
	});
};

function isBlacklisted(urlBlaklist, url) {
	var tests = urlBlaklist.reduce((acc, val)=>{
		if (typeof val == 'string' && val === url){ return ++acc; }
		if (typeof val.test == 'function' && val.test(url)){ return ++acc; }
		return acc;
	}, 0);
	return (tests > 0);
}

/**
 * This is the proxy stuff
**/
self.addEventListener('fetch', function(event) {
	var url = event.request.url + "";
	console.log('[ServiceWorker] Asked to fetch ', url);
	var black = isBlacklisted(cacheFilesBlackList, url);
	console.log('isBlacklisted test -> ', black);
	// if (file is blacklisted) respond with network, do not cache
	if ( black ){
		console.log('URL is blacklisted, going NET for ', url);
		event.respondWith(fetch(event.request));
		return;
	}
	event.respondWith(
		promiseAny([
			caches.match(event.request).then(function (cacheResponse) {
				console.log('got CACHE response for ',  event.request.url);
				return cacheResponse;
			}),
			fetch(event.request).then(function (networkResp) {
				console.log('got NET response for ',  event.request.url);
				// if (not a good status) skip the cache
				// good status is: got RESPONSE, it is HTTP OKAY and is SAME ORIGIN
				if(!networkResp || networkResp.status !== 200 || networkResp.type !== 'basic') {
					return networkResp;
				}
				var responseToCache = networkResp.clone();
				caches.open(cacheName).then(function(cache) {
					cache.put(event.request, responseToCache);
				});
				return networkResp;
			})
		]).catch(function() {
			return caches.match('/no-resource.txt');
		})
	);
});
