'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png": "fde4891103346758f6e42f3612e57d4e",
"assets/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png": "0f4c848be607e03fff99bd4dad4dc4bd",
"assets/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png": "e81e4d6e1869c2320fd273fe3be58059",
"assets/AssetManifest.json": "b366fa2fbeec03cfedadbce1782e8d2b",
"assets/assets/buzz.mp3": "3fdee5a2aa703dd63eec29591ba4d8e4",
"assets/assets/tik1.mp3": "e34f9818aedd998b6e4ff9c51bcabb40",
"assets/assets/tik2.mp3": "bfc05057be45b6b233383fca71ebcdb8",
"assets/assets/won.mp3": "dbb90fd93db97ebee47cb64e24aabafc",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/images/bg1.jpg": "80d0a0a901757c04f123fae12631f5aa",
"assets/images/fb.png": "95c4a90e3106b1e81128800475e5c71f",
"assets/images/gform.png": "8ab12e80f0561c4f391bd5aae1f928ec",
"assets/images/gmail.png": "34d87b09444194daadb82eb22c50fa55",
"assets/images/insta.png": "fa2e2ca3abf33c42e49fbd48aa590cb6",
"assets/images/neriquest.png": "d47c6556bde72ae957ab74fe3bb58bc7",
"assets/images/paypal.jpg": "02d395a284b31fd1325fbb6f86bd9d93",
"assets/images/twitter.png": "471365c9bae2121fdaed0d01de50598b",
"assets/NOTICES": "842221d3174e9cc81d6a60861c87e598",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "e7006a0a033d834ef9414d48db3be6fc",
"assets/shaders/ink_sparkle.frag": "b170f0888753456c71b23b806b8518d7",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "c55b55281ede5202066cee5f5975e808",
"/": "c55b55281ede5202066cee5f5975e808",
"main.dart.js": "832c53738f325fe6c02e49c0deb9cc24",
"manifest.json": "9f3f7dfd88d54c73790d450f488b06db",
"splash/img/dark-1x.png": "ced1112187564162420b5e5b397ca85e",
"splash/img/dark-2x.png": "9559380351b7d3e530f5b7a05379bc0a",
"splash/img/dark-3x.png": "a69ec0afe43e56561aa03bf26554a60e",
"splash/img/dark-4x.png": "20c13900cc0183aa8500091705fb8822",
"splash/img/light-1x.png": "ced1112187564162420b5e5b397ca85e",
"splash/img/light-2x.png": "9559380351b7d3e530f5b7a05379bc0a",
"splash/img/light-3x.png": "a69ec0afe43e56561aa03bf26554a60e",
"splash/img/light-4x.png": "20c13900cc0183aa8500091705fb8822",
"splash/style.css": "1910f0d4c877852383c8ca240d75b397",
"version.json": "fcbac5f18132392d1ddce9689bd86761"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
