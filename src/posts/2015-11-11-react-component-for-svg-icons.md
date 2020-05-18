---
layout: post
title:  "React component for SVG icons"
date:   2015-11-11 09:33:49 -0600
tags:
    - react
    - svg
---

## A day late and a dollar short

I’ve been using React v0.13 which has some trouble handling SVG elements. Last month I decided to create a component to help with that problem. Here’s the gist on github:

[Gist: SvgIcon.js](https://gist.github.com/brawlins/e84c28badd0e6172d9e5)

However, with the release of v0.14, React now handles SVG elements fine. You just have to be sure to camelcase the attributes (“xlinkHref” instead of “xlink:href”). <a href="https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enhancements" target="_blank">See the release notes</a> for details.

I decided to post this anyway just in case it’s useful to anyone.

## The problem

The problem is that SVG is an XML-based format and React was not set up to digest XML. So when React encountered an element like this in the JSX:

```html
<svg viewBox="0 0 50 50">
    <use xlink:href="#icon-checkmark"></use>
</svg>
```

it would choke on the `xlink:href` attribute and throw an error.

## The solution

The workaround involves using React’s `dangerouslySetInnerHTML` property. If you create an HTML element (say a <span> tag), you can set its inner HTML using this property and then React doesn’t care what you put in there. It trusts that you know what you’re doing.

The implementation looks like this:

```javascript
React.createElement('span', {
    dangerouslySetInnerHTML: {
        __html: 'whatever HTML I want'
    }
});
```

## Usage

I usually insert a single SVG document at the top of the `<body>` element that contains symbol definitions for icons that I can use. Then they can be referenced anywhere in the application with the `<use>` tag as shown above.

Here’s an example. If I pass the component these props:

```javascript
<SvgIcon
    classNames={['icon', 'spin']}
    show={this.state.loading}
    symbolId="icon-loader"
    wrapperTag="span" />
```

it will render this HTML:

```html
<span>
    <svg class="icon spin">
        <use xlink:href="#icon-loader"></use>
    </svg>
</span>
```

Here I’m rendering a spinning loader icon inside of a span tag. This will be rendered when `{this.state.loading}` is true and disappear when it is false.

The component has the following propTypes. The only one that is required is symbolId:

* **classNames**: array of class names
* **show**: boolean (defaults to true), usually a parent component state
* **symbolId**: the ID of the symbol to use in the SVG document
* **wrapperTag**: tag to wrap it in (defaults to span)
