---
layout: post
title:  Adding custom columns (including the admin links)
date:   2014-02-07 17:46:39 -0700
tags:
    - wordpress
---

*This is a 2-part post discussing how to set up custom columns for a custom post type in WordPress. Part 1 focuses on adding custom columns, displaying them in the edit posts screen, and adding the admin links to one of those columns. [Part 2]({% post_url 2014-02-11-sorting-and-filtering-on-custom-columns %}) discusses how to enable sorting and filtering on those custom columns.*

For this demo I'll reference a use-case that I had recently. I needed to create a custom post type of quote. Each quote really only needed 4 pieces of information:

1. The quote
2. Who said it
3. Their title
4. Their organization

The quote was simply the content of the post in the regular post editor. The other three items I stored as custom meta values on the post.

Since I had no need for the title column, I removed it. However this created a problem since the title column normally contains a special group of admin links that let you edit or trash the post, etc. So I had to figure out how to add those back in to one of my custom columns, which was the impetus for this post.

WordPress provides a few hooks to help you manage your custom columns. There is a set of action and filter hooks for doing this with regular posts, and another set for custom post types. Since we're dealing with custom columns on a custom post type, the ones we need are these:

* <a href="http://codex.wordpress.org/Plugin_API/Filter_Reference/manage_$post_type_posts_columns" target="_blank">`manage_{$post_type}_posts_columns`</a>
* <a href="http://codex.wordpress.org/Plugin_API/Action_Reference/manage_$post_type_posts_custom_column" target="_blank">`manage_{$post_type}_posts_custom_column`</a>

The first one allows you to define the columns for your post type, and the second one actually displays them on the edit posts screen.

First we add the hooks like so (replace quote  with the name of your custom post type):

```php
if (is_admin()) {
    add_filter('manage_quote_posts_columns', array($this, 'set_columns'));
    add_action('manage_quote_posts_custom_column', array($this, 'render_columns'), 10, 2);
}
```

Then we need to create the callback functions we attached to these hooks. The first one simply defines the columns we want. An array of the default columns is provided to this function. You can add or remove columns from the array, or you can completely replace it with your own as I've done here:

```php
/**
 * Defines the columns shown for my custom post type
 *
 * @param array $columns - the default columns
 */
public function set_columns($columns)
{
    $columns = array(
        'cb'                        => '<input type="checkbox" />',
        'content'                   => 'Quote',
        'quote_author_name'         => 'Name',
        'quote_author_title'        => 'Title',
        'quote_author_organization' => 'Organization',
        'date'                      => 'Date',
    );
    return $columns;
}
```

The second function outputs the values that get displayed in those columns on the edit posts screen. Note that because the action hook that calls this function is about a "custom column", we only have access to custom columns here, not the default ones like "title".

The code that adds the admin links normally seen under the title column is found in the WordPress core files at `wp-admin/includes/class-wp-posts-list-table.php` in the `WP_Posts_List_Table::single_row` function. Most of this code was copied and adapted from that source.

```php
/**
 * Outputs the value shown in each column on the edit posts screen.
 *
 * Adds the admin links that are normally seen underneath the title to a
 * different column since we are not using the title column.
 *
 * Note: You can only access custom columns and the content column, but not
 * the default ones like title and date.
 *
 * This code is mostly copied from the WP core:
 * @see WP_Posts_List_Table::single_row
 *
 * @param string $column
 * @param int $post_id
 */
public function render_columns($column, $post_id)
{
    global $post;

    // get the post meta value for my custom columns
    $value = get_post_meta($post_id, $column, true);
    $empty_placeholder = '&#8212;';

    // set up some vars
    $edit_link = get_edit_post_link($post->ID);
    $title = _draft_or_post_title();
    $post_type_object = get_post_type_object($post->post_type);
    $can_edit_post = current_user_can('edit_post', $post->ID);

    switch ($column) {
        case 'content':
            // content is not a post meta value like our custom columns, so we have to get the content
            $value = wp_trim_words($post->post_content, 20);

            // display the value
            if (empty($value)) {
                echo $empty_placeholder;
            } else {
                if ($can_edit_post && $post->post_status != 'trash') {
                    echo '<a class="row-title" href="' . $edit_link . '" title="' . esc_attr(__('Edit this item')) . '">' . $value . '</a>';
                } else {
                    echo $value;
                }
            }

            // add admin actions
            $actions = array();
            if ($can_edit_post && 'trash' != $post->post_status) {
                $actions['edit'] = '<a href="' . get_edit_post_link($post->ID, true) . '" title="' . esc_attr(__('Edit this item')) . '">' . __('Edit') . '</a>';
            }
            if (current_user_can('delete_post', $post->ID)) {
                if ('trash' == $post->post_status)
                    $actions['untrash'] = "<a title='" . esc_attr(__('Restore this item from the Trash')) . "' href='" . wp_nonce_url(admin_url(sprintf($post_type_object->_edit_link . '&amp;action=untrash', $post->ID)), 'untrash-post_' . $post->ID) . "'>" . __('Restore') . "</a>";
                elseif (EMPTY_TRASH_DAYS)
                    $actions['trash'] = "<a class='submitdelete' title='" . esc_attr(__('Move this item to the Trash')) . "' href='" . get_delete_post_link($post->ID) . "'>" . __('Trash') . "</a>";
                if ('trash' == $post->post_status || !EMPTY_TRASH_DAYS)
                    $actions['delete'] = "<a class='submitdelete' title='" . esc_attr(__('Delete this item permanently')) . "' href='" . get_delete_post_link($post->ID, '', true) . "'>" . __('Delete Permanently') . "</a>";
            }

            // display admin links
            echo WP_List_Table::row_actions($actions);
            break;

        default:
            if (empty($value)) {
                echo $empty_placeholder;
            } else {
                printf('<a href="%s">%s</a>',
                    esc_url(add_query_arg(array('post_type' => $post->post_type, $column => urlencode($value)), 'edit.php')),
                    $value
                );
            }
            break;
    }
}
```

Using these two hooks you should be able to customize the columns and values that are displayed on the edit posts screen for your custom post type. In [Part 2]({% post_url 2014-02-11-sorting-and-filtering-on-custom-columns %}) we'll talk about how to make those columns sortable and filterable.
