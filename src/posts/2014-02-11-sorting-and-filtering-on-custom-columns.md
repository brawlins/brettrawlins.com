---
layout: post
title:  Sorting and filtering on custom columns
date:   2014-02-11 18:38:50 -0700
tags:
    - wordpress
---

*This is a 2-part post discussing how to set up custom columns for a custom post type in WordPress. [Part 1]({% post_url 2014-02-07-adding-custom-columns-including-the-admin-links %}) focuses on adding custom columns, displaying them in the edit posts screen, and adding the admin links to one of those columns. Part 2 discusses how to enable sorting and filtering on those custom columns.*

WordPress provides a hook that allows you to define which columns are sortable. There's a generic one and another one for custom post types:

* `manage_edit-post_sortable_columns`
* `manage_edit-{$post_type}_sortable_columns`

Although there appears to be no Codex page to document either of these hooks, both <a href="http://scribu.net/wordpress/custom-sortable-columns.html" target="_blank">scribu</a> and <a href="http://justintadlock.com/archives/2011/06/27/custom-columns-for-custom-post-types" target="_blank">Justin Tadlock</a> have published excellent articles explaining how to use them to make your columns sortable.

The other hook we'll need is `pre_get_posts` which allows us to define custom callbacks to tell WordPress how to sort and filter our columns.

First we add the hooks:

```php
if (is_admin()) {
    add_filter('manage_edit-quote_sortable_columns', array($this, 'register_sortable_columns'));
    add_action('pre_get_posts', array($this, 'sort_custom_columns'));
    add_action('pre_get_posts', array($this, 'filter_custom_columns'));
}
```

The first function simply defines which columns should be sortable. Just add your custom sortable columns to the array and/or remove any columns that you don't want to be sortable:

```php
/**
 * Adds custom columns to the array of sortable columns
 *
 * @param array $columns - the default columns
 */
public function register_sortable_columns($columns)
{
    $columns['quote_author_name'] = 'quote_author_name';
    $columns['quote_author_title'] = 'quote_author_title';
    $columns['quote_author_organization'] = 'quote_author_organization';
    return $columns;
}
```

Now WordPress knows which columns should be sortable. However, it doesn't automatically understand *how* to sort them, so you have to provide a function to handle that process.

In this function you have access to the query object, which you can then alter to perform whatever kind of sorting you want. In this example, the data for the custom columns are stored as post_meta values. First we get the column to be sorted on from the query string, and then we tell the query to sort on that meta key. You can easily adapt this to your particular sorting needs by using the appropriate <a href="http://codex.wordpress.org/Class_Reference/WP_Query#Parameters" target="_blank">WP_Query parameters</a>.

```php
/**
 * Sorts the list on custom columns
 *
 * @param object $query
 */
public function sort_custom_columns($query)
{
    // define custom columns
    $columns = array(
        'quote_author_name',
        'quote_author_title',
        'quote_author_organization',
    );

    // get the column we're sorting on
    $column = $query->get('orderby');

    // edit the query to tell WP how to sort our column
    if (!empty($column) && in_array($column, $columns)) {
        $query->set('meta_key', $column);
        $query->set('orderby', 'meta_value');
    }
}
```

The last function is similar. Again, the strategy is to alter the query object so that the list gets filtered on the value(s) we want. First we determine which columns are present in the query string, and then we add a meta query for each one (although I think it only lets you sort by one column at a time).

```php
/**
 * Filters the list on custom column values
 *
 * @param object $query
 */
public function filter_custom_columns($query)
{
    // define custom columns
    $columns = array(
        'quote_author_name',
        'quote_author_title',
        'quote_author_organization',
    );

    // see if any are present in the query string
    $filters = array_intersect($columns, array_keys($_GET));
    if (empty($filters)) {
        return;
    }

    // initialize meta query
    $meta_query = array();

    // add each one
    foreach ($filters as $column) {
        $meta_query[] = array(
            'key' => $column,
            'value' => $_GET[$column],
        );
    }

    // apply it
    $query->set('meta_query', $meta_query);
}
```
