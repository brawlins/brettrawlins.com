---
layout: post
title:  "Apache redirect vs. rewrite"
date:   2014-02-24 15:58:02 -0600
tags:
    - apache
---

Apache rewrite rules can be very confusing at times. They're very powerful, but not easily understood or mastered. I don't claim to be an expert by any means, but I recently came to some clarity on this issue: 

> What is the difference between Apache redirect and rewrite?


><p class="dialog">Client: “GET /page.php.”</p>
><p class="dialog">Server: “Sorry, /page.php has moved. Ask for /otherpage.php instead”.</p>
><p class="dialog">Client: “Fine. GET /otherpage.php then.”</p>
><p class="dialog">Server: “OK. Here’s the content of /otherpage.php.”</p>

{% highlight apache %}
Redirect 301 /page.php /otherpage.php
{% endhighlight %}

><p class="dialog">Client: “GET /page.php.”</p>
><p class="dialog">Server: “Let me consult the rewrite rules. Ok, it looks like all requests for /page.php should be served from /otherpage.php. Here’s the content of /otherpage.php.”</p>

{% highlight apache %}
RewriteEngine On
RewriteRule /page.php /otherpage.php
{% endhighlight %}

{% highlight apache %}
RewriteRule /page.php /otherpage.php [RL]
{% endhighlight %}

{% highlight apache %}
# Redirect all requests to another site
RedirectMatch 301 .* http://example.com
{% endhighlight %}

{% highlight apache %}
# Redirect requests from one directory to another directory
RedirectMatch ^/directory/(.*) /other-directory/$1
{% endhighlight %}

