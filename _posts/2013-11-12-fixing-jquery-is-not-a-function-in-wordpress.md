---
layout: post
title:  Fixing "$ is not a function" in Wordpress
date:   2013-11-12 20:05:50 -0600
tags:
    - jquery
    - wordpress
---

I couldn't figure out why I was getting this error on a Wordpress site the other day:

>Error: $ is not a function

After searching a bit I found out that Wordpress loads jQuery in a "no conflict" mode by default, which means the `$` shortcut for jQuery is not available. Because other JavaScript libraries also use that shortcut, they disable it to avoid conflicts.

The jQuery global variable is still available. However, if you want to use the `$` shortcut instead, you can pass it to your anonymous function like this:

```javascript
jQuery(document).ready(function($) {
  // Code that uses jQuery's $ can follow here.
});
```

For more information see the documention on [jQuery.noConflict()](http://api.jquery.com/jQuery.noConflict/){:target="blank"}.
