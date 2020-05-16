---
layout: post
title:  CSS background patterns
date:   2013-05-31 09:28:54 -0600
tags:
    - css
---

CSS is getting more and more awesome all the time. The other day I discovered that you can create background patterns using the `repeating-linear-gradient` property. [Lea Verou](http://lea.verou.me){:target="blank"} has a great article that explains [how it works](http://24ways.org/2011/css3-patterns-explained/){:target="blank"}. She's created some amazing patterns in her [CSS3 Patterns Gallery](http://lea.verou.me/css3patterns/){:target="blank"} to demonstrate the power of this tool.

Here's my humble implementation. The marketing department wanted a link to building construction updates that looked like caution tape:

```css
background: repeating-linear-gradient(135deg, #ebd007, #ebd007 30px, #555 30px, #555 60px);
```

<div style="width: 250px; margin: 24px auto;"><a style="background: -webkit-repeating-linear-gradient(135deg, #ebd007, #ebd007 30px, #555 30px, #555 60px); background: repeating-linear-gradient(135deg, #ebd007, #ebd007 30px, #555 30px, #555 60px); border: 1px solid #555; border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px; color: #fff; cursor: pointer; display: block; font-size: 16px; margin: 5px 0px; text-align: center; text-decoration: none; text-shadow: 1px 1px 3px #000;"><span style="background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%); background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%); display: block; padding: 6px 12px;">Building Construction Update</span></a></div>

I know it's not pretty... it's caution tape. But the point is you can create cool patterns without having to use images :).
