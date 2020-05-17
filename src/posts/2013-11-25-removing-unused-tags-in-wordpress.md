---
layout: post
title:  Removing unused tags in Wordpress
date:   2013-11-25 12:24:24 -0600
tags:
    - mysql
    - wordpress
---

Sometime you may need to mass delete a bunch of tags that are unused (or maybe only used once). I'm sure there are plugins for this, but then you're trusting someone else's SQL to do deletes on your database. It's just as easy to write your own queries.

One of the quirks of MySQL, as stated in <a href="http://dev.mysql.com/doc/refman/5.1/en/delete.html" target="_blank">the manual</a>, is:

> Currently, you cannot delete from a table and select from the same table in a subquery.

There are a few workarounds. One is to create a temporary table of the ID's you need to delete and then reference that in your delete query. Another is to write two nested select statements, using a buffer table with an alias to grab those same ID's, <a href="http://devwp.eu/deleting-wordpress-records-based-on-nested-selects/" target="_blank">as explained in this great write-up by Mario Peshev</a>.

Because one of the tables you need to delete from has a compound key I ran into trouble using the second method, so I decided to go the temporary table route.

## 1. Create a temporary table

In my example I've selected all tags that are used 1 or 0 times.

```sql
-- create temp table
CREATE TEMPORARY TABLE to_delete
SELECT t.term_id, count(tr.object_id) AS times_used, t.name, t.slug, tt.term_taxonomy_id, tt.taxonomy, tr.object_id
FROM wp_terms t
LEFT JOIN wp_term_taxonomy tt USING (term_id)
LEFT JOIN wp_term_relationships tr USING (term_taxonomy_id)
GROUP BY t.term_id
HAVING tt.taxonomy = "post_tag"
AND times_used <= 1
ORDER BY times_used
```

## 2. Delete the terms

```sql
-- delete unused terms
DELETE FROM wp_terms
WHERE term_id IN (
    SELECT term_id
    FROM to_delete
)
```

## 3. Delete associated records

There are two tables that have associated records. If we don't delete them too, we'll end up with orphaned records that reference non-existent terms.

```sql
-- delete orphaned records
DELETE FROM wp_term_taxonomy
WHERE term_taxonomy_id IN (
    SELECT term_taxonomy_id
    FROM to_delete
)
```

This next one is the table where I ran into trouble because it has a compound key. If you simply delete all records with a matching `object_id`, then you'll end up removing *all* tags on the posts in question, not just the tags used once. You have to match on both `object_id` and `term_taxonomy_id`. Because of the quirk mentioned above, it ended up being easier to use the temporary table as a reference.

```sql
-- delete orphaned records
DELETE FROM tr
USING wp_term_relationships AS tr
INNER JOIN to_delete AS d
WHERE d.term_taxonomy_id = tr.term_taxonomy_id
AND d.object_id = tr.object_id
```

## 4. Drop the temporary table

```sql
DROP TABLE to_delete
```
