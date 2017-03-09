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
 * This is the proxy stuff
**/
this.addEventListener('fetch', function(event) {
	// console.log('[ServiceWorker] Asked to fetch ', event.request.url);
	event.respondWith(
		caches.match(event.request).then(function(resp) {
			if (resp){
				// console.log('[ServiceWorker] Fetch ', event.request.url, ' from cache');
				return resp;
			}
			// request and response are streams, they can be read only once
			return fetch(event.request.clone()).then(function(response) {
				// if (not a good status) skip the cache
				// good status is: got RESPONSE, it is HTTP OKAY and is SAME ORIGIN
				if(!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}

				var responseToCache = response.clone();
				caches.open(cacheName).then(function(cache) {
					cache.put(event.request, responseToCache);
					// console.log('[ServiceWorker] Fetch ', event.request.url, ' from network to cache');
				});
				return response;
			});
		}).catch(function() {
			return caches.match('/no-resource.txt');
		})
	);
});
