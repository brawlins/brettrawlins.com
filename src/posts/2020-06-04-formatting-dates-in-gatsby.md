---
title:  "Formatting dates in Gatsby"
date:   2020-06-04
tags:
    - gatsby
    - javascript
---

## The problem

My blog post dates are stored in this format: "YYYY-MM-DD", but I wanted to display them in a different format. My first reaction was to run them through a formatting function in the React component. It turns out this was the hard way. The dates were coming back wrong due to timezone issues, and I ended up spending a lot of time trying to figure it out.

## The solution

The easiest way to format a date in Gatsby is in the GraphQL query. Gatsby provides a `formatString` argument to GraphQL date fields that can be used to <a href="https://www.gatsbyjs.org/docs/graphql-reference/#dates" target="_blank">format the date at query time</a>. The resolver function uses <a href="https://momentjs.com/" target="_blank">Moment.js</a> to format dates, so you can pass any valid <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">Moment formatting tokens</a> in your string.

Let's use today's date as an example. This `formatString` formats the date as "June 4, 2020":

```graphql
date(formatString: "LL")
```

## Timezone trouble

My formatting function used methods on the JavaScript `Date` and `Intl.DateTimeFormat` objects to format the date. When you create a `Date` object you introduce a time component as well. If the date string you started from has no time component, then the time defaults to midnight on that date (`00:00`). This is not a problem in and of itself, but what I forgot to account for is that a `Date` object represents a time value *in UTC time*. <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date" target="_blank">As stated in the docs</a>:

>A JavaScript date is fundamentally specified as the number of milliseconds that have elapsed since midnight on January 1, 1970, UTC.

This can be demonstrated by typing this into your console:

```javascript
new Date("2020-06-04")
// Wed Jun 03 2020 18:00:00 GMT-0600 (Mountain Daylight Time)
```

This returns a date object with your local time offset, that represents *a UTC time* of midnight on the date given (`2020-06-04T00:00Z`). In my case, since I'm 6 hours behind UTC time, my dates were coming back as the day before the one I intended.

That makes sense. But that still didn't explain why the date string was coming back wrong from the GraphQL query in the first place. What was Gatsby doing behind the scenes?

## Going down the rabbit hole

Gatsby uses Moment.js under the hood, which assumes *local time* <a href="https://momentjs.com/docs/#/parsing/" target="_blank">per the docs</a>:

>`moment(...)` is local mode. Ambiguous input (without offset) is assumed to be local time. Unambiguous input (with offset) is adjusted to local time.

Again, you can verify this if you create a code sandbox with the following:

```javascript
console.log(moment("2020-06-04").format());
// 2020-06-04T00:00:00-06:00
```

However, when I ran my GraphQL query *without* the `formatString`, the `date` field came back in UTC time like this:

```
2020-06-04T00:00:00.000Z
```

If you create a new `Date` object from that date string, you run into the timezone issues we just talked about.

```javascript
new Date("2020-06-04T00:00:00.000Z")
// Wed Jun 03 2020 18:00:00 GMT-0600 (Mountain Daylight Time)
```

I had to go to the source code and find the resolver function for the date field to figure out what was happening. Apparently, Gatsby converts dates to UTC time using `moment.utc()`. This puts you into <a href="https://momentjs.com/docs/#/parsing/utc/" target="_blank">UTC mode</a>, which assumes UTC time instead of local time.

Contrast these two examples:

```javascript
// Moment
let local = moment("2020-06-04");
let utc = moment.utc("2020-06-04");

// Date string
console.log(local.format());
console.log(utc.format());

// Timestamp
console.log(local.valueOf());
console.log(utc.valueOf());
```

Which return these date strings and timestamps:

```
2020-06-04T00:00:00-06:00
2020-06-04T00:00:00Z
1591250400000
1591228800000
```

As you can see from the timestamps, they now represent two different moments in time. The first is midnight at local time. The second is midnight at UTC time. This is the problem I was hitting against. If you don't format your date field in the query using the `formatString`, you get back a date string that represents midnight UTC time on the date given. Then when you try to create a `Date` object from that date string, you have timezone issues.

## Lessons learned

First of all, read the documentation. If I had known that the `formatString` argument was available to me, I wouldn't have written my own formatting function and gone down this bumpy road. On the other hand, nothing is lost. This little jaunt into the weeds was a good reminder about how dates work and the issues we have to consider when dealing with timezones. Hopefully this will spare somebody else some heartburn :).
