# luis-puhl.github.io

My resume and personal site (with some web tricks in the sleeve).

Here you can find my generic resume and some web triks to make it less boring.

# Bootstrap

For responsivness and components (progress bar, jumbotron, footer, side menu) the twitter bootstrap went rigth in.

Sometime in the near future bootstrap will be removed in favor of material desing stuff from polymer.

# HTML and CSS i18l

To provide a multilanguage site for every translatable text element you see in the page there are two (or more) source html code.

For each language there is an element with the attribute `lang=` set.

```html
<h2 id="profile">
	<span lang="en">PROFILE</span>
	<span lang="pt-BR">PERFIL</span>
</h2>
```

In the CSS there is a selector that detects the document language and hides all elements that are not in this language.

```css
html:not(:lang(pt-BR)) :lang(pt-BR),
html:not(:lang(en)) :lang(en){
	display: none;
}
```

For active traslantion, one html selector whose value is bind to the document language is also provided.

```html
<select id="language-select" class="hidden-print"
	onchange="document.documentElement.lang=this.value">
	<option value="pt-BR">Português Brasileiro</option>
	<option value="en">English</option>
</select>
```

And at last, I did not find a way to check the browser's prefered language in HTML or CSS, so there is a JS snippet that
gets this setting from the browser and sets the aforementioned `select` in the html.

# CSS for print media

I'm lazy, so instead of making another document just to print and send formaly I've put some CSS to print this document nicely.

The resulting documens are [LuísPuhl-Currículo.pdf](LuísPuhl-Currículo.pdf) for Portuguese and
[LuísPuhl-Resume.pdf](LuísPuhl-Resume.pdf) for the English version.

# Offline Site

I've put some work with **Service Workers** as defined in
[Mozilla Developer Network (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
and following the lead set by Matt Gaunt at the
[Google Developers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) page.

At the time of writing this doc, I'm using a modified race condition where the
latest version is fetched from network and cached and the local copy is served
for speed. It definitely needs improvements, but right now I don't know where
and how exactly (I have no metric or test methodology to make my choice).

# Firebase Counter

On the bottom of the page there is page view counter made with a Firebase
Realtime Database as follows:

In the client we connect and immediately get and set the remote value and also
set the HTML for the counter:

```javascript
var config = {
	apiKey: 'AIzaSyBx2d4GDZlPuW__FouuyPnaQrvS_kjU9gM',
	authDomain: 'traker-ae14a.firebaseapp.com',
	databaseURL: 'https://traker-ae14a.firebaseio.com',
	storageBucket: 'traker-ae14a.appspot.com',
	messagingSenderId: '1034702936745'
};
firebase.initializeApp(config);
var counterRef = firebase.database().ref('counter');
var counter;
counterRef.once('value').then(function(dataSnapshot){
	counter = dataSnapshot.val() + 1;
	counterRef.set(counter);
	document.getElementById('pageviews').innerHTML = counter;
});
```

In the Firebase Realtime Database in the counter rules we allow for
unauthenticated reads and writes, as long as they are incremented by one only:

```json
{
	"rules": {
		".read": "auth != null",
		".write": "auth != null",
		"counter": {
			".read": true,
	 		".write": true,
			".validate": "data.exists() && newData.exists() && newData.val() == data.val() + 1"
		}
	}
}
```

# Google analytics

At last, some analytics for feedback is essential, especially for a resume, so
I can see who is looking for my skills. So far it's been bad, a lot o bounces.

Also, it is not enough, a proper feedback and contact form is needed.
