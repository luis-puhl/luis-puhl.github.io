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
