---
title:  "Import tags from a CSV"
date:   2014-02-25
tags:
    - wordpress
---

Recently I needed to add a large list of tags to a WordPress site. The tags were in a spreadsheet, so I converted it to a CSV file and then wrote a script to import them. Here’s the script:

```php
<?php
// load WordPress
define('WP_USE_THEMES', false);
global $wpdb;
require('wp-load.php');

// get tags
$file = 'tags.csv';
if (!file_exists($file)) {
    die('No file!');
}
$tags = str_getcsv(file_get_contents($file));

// insert them
$count = 0;
foreach ($tags as $i => $tag) {
    if (term_exists($tag, 'post_tag')) {
        printf('<pre>Already have: %s</pre>', $tag);
    } else {
        printf('<pre>%d</pre>', ++$count);
        wp_insert_term($tag, 'post_tag');
    }
}

// show total
printf('<pre>%d of %d inserted</pre>', $count, ++$i);
```

Place this script in the root folder of the your WordPress site, along with the CSV, and then run it from the browser. After you’re done you should delete these files.

This could easily be modified to import terms into any taxonomy. Just replace “post_tag” with the name of the taxonomy.
