---
layout: post
title:  "Simple chat application using React and Socket.io"
date:   2015-08-10 11:20:22 -0600
tags:
    - node.js
    - react
    - socket.io
    - websockets
---

## From Angular to React

Life has been busy! It’s been a while since I had time to blog about anything. Hopefully I can find time to come back and record some of my learning with Angular. After about a year of developing with Angular I wanted to get my feet wet with [React](http://facebook.github.io/react/){:target="blank"} and find out what all the buzz is about.

## First Impressions

At first glance React seems easier to understand than Angular, and is certainly lighter weight because it’s a library not a complete framework. I like that React components are self-contained and reusable, but it was a little strange mixing the markup and programming logic when I’ve been so ingrained with "separation of concerns".

One thing that seems a little clunky to me is that in order for components to communicate with each other you have to pass variables around through properties. That could quickly get tedious if you have several levels of nesting, and might be hard to follow the trail of properties back up the chain to where they are actually controlled. It seems like some sort of scope inheritance would be a lot easier. At any rate, it’s been fun to try it out. You learn a lot quickly when you leave the tutorials behind and actually try to build something on your own.

## Demo App

Here’s a little demo chat application that I put together while learning. This uses [Node.js](https://nodejs.org/){:target="blank"} and [Express](http://expressjs.com/){:target="blank"} for the server, [React](http://facebook.github.io/react/){:target="blank"} for the interface, and [Socket.io](http://socket.io/){:target="blank"} to keep clients in sync via websockets. I also used [Bower](http://bower.io/){:target="blank"} to manage local copies of the libraries. If you don’t want to use Bower, you can link to the scripts however you like. I found it to be really helpful for local development though. It’s nice to get some work done on the train during my commute, but I don’t have internet access there, so having a local copy of the resources comes in handy.

### public/index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat App</title>
    <script src="bower_components/react/react.js"></script>
    <script src="bower_components/react/JSXTransformer.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="app.js" type="text/jsx"></script>
</head>
<body>
    <h1>Chat App</h1>
    <div id="messages"></div>
</body>
</html>
```

Nothing too interesting here. Just links to the resources and a flat folder structure for my files.

### public/app.js

```javascript
// get a reference to the websocket
var socket = io();

var MessageList = React.createClass({
    getInitialState: function() {
        return {
            // initialize messages array with welcome message
            messages: [{
                timeStamp: Date.now(), 
                text: "Welcome to the test chat app!"
            }]
        };
    },
    componentDidMount: function() {
        // register event handler for new messages received from server
        socket.on('messageAdded', this.onMessageAdded);
    },
    onMessageAdded: function(message) {
        // update the array (setState re-renders the component)
        this.setState({messages: this.state.messages.concat(message)});
    },
    postIt: function(e) {
        // prevent form submission which reloads the page
        e.preventDefault();

        // get the message
        var input = React.findDOMNode(this.refs.theForm).children[0];
        var message = {
            timeStamp: Date.now(),
            text: input.value
        };

        // add it locally for this client
        this.setState({messages: this.state.messages.concat(message)});
        /**
         * Alternatively you could have the server emit to ALL clients,
         * including the one who sent the message. In that case the message
         * would go from your client to the server and back before it got added
         * to the message list. 
         */

        // clear the input
        input.value = '';

        // emit to server so other clients can be updated
        socket.emit('messageAdded', message);
    },
    render: function() {
        return (
            <div>
                <h2>Messages</h2>
                <ul className="message-list">
                    {/* Create array of li's by looping over the messages array */}
                    {this.state.messages.map(function(message) {
                        return(
                            <li key={message.timeStamp}>{message.text}</li>
                        );
                    })}
                </ul>
                <MessageForm submit={this.postIt} ref="theForm" />
            </div>
        );
    }
});

var MessageForm = React.createClass({
    render: function() {
        return (
            <form onSubmit={this.props.submit}>
                <input type="text" size="40" placeholder="Type your message here" />
                <button>Post it!</button>
            </form>
        );
    }
});

// mount to the messages div
React.render(<MessageList />, document.getElementById('messages'));
```

Here I've defined a MessageList component which displays an unordered list of messages, followed by the MessageForm component which contains a simple form for posting a new message. MessageForm is nested inside of MessageList. At the bottom we render it by mounting the parent component to the messages div in our HTML.

MessageList owns the array of chat messages, so MessageForm cannot modify it directly. Because of this we have to pass control of the submit handler up the chain to the parent which has access to the messages array. Note that this is done by [passing properties](https://facebook.github.io/react/tips/communicate-between-components.html){:target="blank"}. When we call the MessageForm component inside the render function of MessageList, we pass it a custom property ("submit") and assign that property a local function ("postIt") which handles the form submission and adds the new message to the array. In the MessageForm component's render function we access the "submit" property we assigned to it above using <span class="lang:js decode:true  crayon-inline">this.props.submit</span>. That property (which now points to a handler function on the parent component) is then assigned to the component's <span class="lang:default decode:true  crayon-inline ">onSubmit</span>  event so that it gets called when the form is submitted.

This is the point I mentioned above. It seems like this could quickly get very convoluted if you have many levels of nesting. But that's how you pass things up or down the chain in React.

### server.js

```javascript
// define vars
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

// define routes
app.use('/', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// server events
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });
    socket.on('messageAdded', function(message) {
        // io.emit('messageAdded', message); // broadcast to all clients
        socket.broadcast.emit('messageAdded', message); // broadcast to all but the sender
    });
})

http.listen(3000, function () {
    console.log('listening on: 3000');
});
```

The server code creates an http server using Node and some simple routes using Express. Our document root is mapped to <span class="lang:default decode:true  crayon-inline ">/public</span>  and the client libraries are served from <span class="lang:default decode:true  crayon-inline">/bower_components</span> . When Socket.io receives a "connection" event, a new client has connected to the server. We register a callback function for that event, and inside that function we handle other events such as the custom "messageAdded" event that gets emitted from a client when the user adds a message. The server then broadcasts that event out to all the other clients so they stay in sync.

## Try It Out

To get up and running with this code:

* [Download the files here]()
* Open up your project folder in the terminal
* Install the server libraries: <span class="lang:default decode:true  crayon-inline ">npm install</span>
* Install the client libraries: <span class="lang:default decode:true  crayon-inline ">bower install</span>
* Start up your server: <span class="lang:default decode:true  crayon-inline ">node server.js</span>
* Open up [http://localhost:3000/](http://localhost:3000/){:target="blank"} in two browser windows and chat!

## Final Thoughts

One thing about learning new stuff is that new technologies are often so interrelated that it’s difficult to learn one thing in isolation. This is especially true of JavaScript nowadays as the trend seems to be towards small libraries that you can swap in for added functionality vs. large frameworks that do everything. It can be frustrating when you just want to try out some new library, but you quickly find out that you have to be familiar with several other things to even get started. That was my experience with React. I had to spend a little time figuring out Node.js, Express, Bower, etc. too. The upside of that trend is that you have lots of choices and you can build your custom stack however you want.

Next step is to convert one of my existing apps to use React and Socket.io to provide real-time data. I’ll probably need to investigate MongoDB or some other noSQL database to finish it off.
