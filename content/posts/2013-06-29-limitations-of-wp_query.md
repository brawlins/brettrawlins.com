---
title:  Limitations of WP_Query
date:   2013-06-29
tags:
    - php
    - wordpress
---

I ran into one of the limitations of WP*Query recently when I realized it couldn't do a \_fairly simple* query.

## Problem

I wanted to get all the clinical newsletter posts (post_type = "clinical"), PLUS any regular posts that were tagged "clinical". Nothing crazy, right? This requires either an "OR" clause, or a "UNION" of two separate queries. Can WP_Query do that? Of course not.

## Solution

You just have to write your own query. No bigs. I was just surprised that Worpress wasn't smart enough to handle that for me. After all, isn't that why they wrote the WP_Query class?

For what it's worth, here's what I did:

```php
<?php
// Get clinical newsletters plus regular posts tagged "clinical*"
$sql = '
    SELECT *
    FROM wp_posts
    WHERE post_type = "clinical"
    AND post_status = "publish"

    UNION

    SELECT *
    FROM wp_posts
    WHERE post_type = "post"
    AND post_status = "publish"
    AND ID IN
    (
        SELECT object_id
        FROM wp_term_relationships r
        INNER JOIN wp_term_taxonomy x USING (term_taxonomy_id)
        INNER JOIN wp_terms t USING (term_id)
        WHERE t.slug LIKE "clinical%"
    )

    ORDER BY post_date DESC
    LIMIT 5
';
$clinical_news = $wpdb->get_results($sql);

// Loop through each post
foreach ($clinical_news as $post) {
  setup_postdata($post);
  // do something with $post
}
```
