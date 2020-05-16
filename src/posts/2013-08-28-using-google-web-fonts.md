---
layout: post
title:  Using Google web fonts
date:   2013-08-28 21:15:38 -0600
tags:
    - css
---

Today I tried switching a website to web fonts. It was pretty easy to implement using Google Fonts.

## 1. Choose a font

Go to [Google Fonts](http://www.google.com/fonts){:target="_blank"} and find a font family that you like. Check the box next to each style variation you want to include (light, normal, bold, italic, etc.).

## 2. Link to it from your website

Google provides you with a link to the font files you selected. Just copy and paste it into either your HTML:

```html
<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
```

Or your CSS:

```css
@import url(http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic);
```

##  3. Use it in your CSS

Now you can use that font family in your CSS declarations:

```css
body { font-family: 'Source Sans Pro', sans-serif; }
```

That's it!
