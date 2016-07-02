---
layout: post
title:  Proper-casing names when they are stored in all caps
date:   2013-09-30 16:48:23 -0600
tags:
    - php
---

Reformatting names is generally inadvisable, because no matter what you do you'll be wrong. Names don't follow rules consistently (or at all), so it's impossible to programmatically account for every situation. For example, both MacDonald and Macdonald could be correct, depending on the person.

However, sometimes your hand is forced. Like when names are stored (\*gasp\*) in ALL CAPS. Who knows why, but they are, and now you have to deal with it. In my case it was a web service that returned a directory listing. I just couldn't bring myself to display every name in the listing in all caps or all lowercase, so I chose to be right most of the time, knowing that I'd still be wrong some of the time.

Here's my snippet:

```php
<?php
// sample names
$names = array(
    'MACDONALD, MCKAY',
    'O\'REILLEY, O\'NEIL',
    'SMITH-JONES, HANS-JUERGEN',
);

foreach ($names as $name) {
    // capitalize first letter of each word
    $name = implode(' ', array_map('ucwords', explode(' ', strtolower($name))));
    // capitalize letter following: Mac, Mc, O', or -
    $name = preg_replace_callback(
        '#\b(Mac|Mc|O\'|-)([a-z]+)\b#', 
        function($matches) {
            return $matches[1] . ucfirst($matches[2]);
        }, 
        $name
    );
    echo '<pre>' . print_r($name, true) . '</pre>'; 
}
```

This still doesn't address other complexities like "van der Meer" or "de Gaulle", but it's a good start. In order to truly handle exceptions, I think you'd have to swap them out case by case, such as supplying an array of specific names and their replacements, [as described here](http://stackoverflow.com/questions/11529213/given-upper-case-names-transform-to-proper-case-handling-ohara-mcdonald/11532427#11532427){:target="blank"}. But sometimes that's impossible, like when the list of names could change at any time.
