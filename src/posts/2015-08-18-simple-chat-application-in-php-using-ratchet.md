---
layout: post
title:  "Simple chat application in PHP using Ratchet"
date:   2015-08-18 11:22:32 -0700
tags:
    - php
    - ratchet
    - websockets
---

In the previous post I made a [demo chat app using React and Socket.io](/blog/simple-chat-application-using-react-and-socket-io). In this post we'll build that same app again, this time in PHP using Ratchet.

There's a nice PHP library called <a href="http://socketo.me/" target="_blank">Ratchet</a> that simplifies working with web sockets. In this example I use <a href="https://getcomposer.org/" target="_blank">Composer</a> to manage the PHP library dependencies and handle autoloading.

## Project Setup

The project directory structure looks like this:

```shell
├── bin
├── public
├── src
└── vendor
```

* **bin**:  Holds the web socket server file. This will run in the background listening for connections and handling events.
* **public**:  All of our client code goes here. This is the web document root.
* **src**:  Holds our custom server side code
* **vendor**:  For third-party PHP libraries managed by Composer.

## The Server

### bin/server.php

```php
<?php
// import namespaces
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use MyChat\Chat;

// use the autoloader provided by Composer
require dirname(__DIR__) . '/vendor/autoload.php';

// create a websocket server
$server = IoServer::factory(
    new WsServer(
        new Chat()
    )
    , 8080
);

$server->run();
```


Here we load the namespaces for the Ratchet libraries and our own Chat class that will handle the chat messages. Composer creates an autoloader for us that we can use to load the class names, so we require that. Then we create a web socket server, give it our Chat handler class, and tell it to listen on port 8080. Ratchet provides several components that you can choose from. Here we're using the WsServer (WebSocket server) component.

### src/MyChat/Chat.php

```php
<?php
namespace MyChat;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    private $clients;

    public function __construct()
    {
        // initialize clients storage
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // store new connection in clients
        $this->clients->attach($conn);
        printf("New connection: %s\n", $conn->resourceId);
        // send a welcome message to the client that just connected
        $conn->send(json_encode(array('type' => 'message', 'text' => 'Welcome to the test chat app!')));
    }

    public function onClose(ConnectionInterface $conn)
    {
        // remove connection from clients
        $this->clients->detach($conn);
        printf("Connection closed: %s\n", $conn->resourceId);
    }

    public function onError(ConnectionInterface $conn, Exception $error)
    {
        // display error message and close connection
        printf("Error: %s\n", $error->getMessage());
        $conn->close();
    }

    public function onMessage(ConnectionInterface $conn, $message)
    {
        // send message out to all connected clients
        foreach ($this->clients as $client) {
            $client->send($message);
        }
    }

}
```

Note that our Chat class implements the "MessageComponentInterface" provided by the Ratchet WsServer component. That interface exposes 4 events that our server can listen for, so we register a callback function for each one. See the <a href="http://socketo.me/docs/websocket" target="_blank">WsServer documentation</a> for more details.

When we start up our socket server a new instance of our Chat class is created. The constructor simply creates an object to store client connections in.

The `onOpen` event fires when a new client connects to the socket server. This function stores the new connection and sends the client a welcome message. We're also printing out the connection ID to the shell where the server is running.

The `onClose` event fires when a client connection is closed (user closes the browser window). We remove that client from our storage and print out another message to the server shell.

The `onError` event fires when we encounter a connection error. We print out the error message to the terminal and close the connection.

The `onMessage` event is where the magic happens. This event fires when the socket server receives a message from one of the connected clients. We loop through all the connected clients and send that message out to each one. This keeps the clients in sync, so that when one user posts a message it gets broadcast out to all the other connected clients.

## The Client

### public/index.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Ratchet Test</title>
    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="app.js"></script>
</head>
<body>

    <h1>Chat App Using Ratchet</h1>

    <h2>Messages</h2>
    <ul class="message-list"></ul>
    <form class="message-form">
        <input type="text" size="40" placeholder="Type your message here" />
        <button>Post it!</button>
    </form>

</body>
</html>
```

This is pretty straight forward. We have an unordered list that will get populated with the chat messages, and a form for posting new messages.

In the header we're loading two scripts. This example uses jQuery, so you need that. I've loaded it using Bower, but you can link to it however you want. The other script (app.js) is our client-side application code that we'll get to next.

### public/app.js

```javascript
// initialize messages array
var messages = [];

// connect to the socket server
var conn = new WebSocket('ws://localhost:8080');
conn.onopen = function(e) {
    console.log('Connected to server:', conn);
}

conn.onerror = function(e) {
    console.log('Error: Could not connect to server.');
}

conn.onclose = function(e) {
    console.log('Connection closed');
}

// handle new message received from the socket server
conn.onmessage = function(e) {
    // message is data property of event object
    var message = JSON.parse(e.data);
    console.log('message', message);

    // add to message list
    var li = '<li>' + message.text + '</li>';
    $('.message-list').append(li);
}

// attach onSubmit handler to the form
$(function() {
    $('.message-form').on('submit', function(e) {
        // prevent form submission which causes page reload
        e.preventDefault();

        // get the input
        var input = $(this).find('input');

        // get message text from the input
        var message = {
            type: 'message',
            text: input.val()
        };

        // clear the input
        input.val('');

        // send message to server
        conn.send(JSON.stringify(message));
    });
});
```

This code runs in the client browser and allows it to connect to the socket server and send and receive messages. <a href="http://www.w3.org/TR/websockets/#the-websocket-interface" target="_blank">The W3C WebSocket API</a> exposes the same 4 events that we saw in our server code, and we define a callback function to handle each one. **Note that these event names are all lower-case though.**

The `onopen` event fires when our client connects to the socket server. We log a message to the browser's console.

The `onerror` event fires when we have a connection error.

The `onclose` event fires when our client closes its connection to the socket server.

The `onmessage` event fires when the client receives a message from the socket server. Each of these callbacks receives an event object as an argument (I assigned to the variable "e"). The actual payload of the message is contained in the event object's "data" property. Here we grab the message, log it to the console, and then append it to the unordered list using jQuery.

The last piece of code uses jQuery to add an event handler to the message form. When we submit that form, we want the client to send the message we typed to the socket server. Here we grab the value of the text input, create a message object, clear the input, and then send the message to the server. This action will fire an "onMessage" event on the server, which will respond by sending that message out to all the connected clients as we saw in the server code earlier.

## Running the app

[Download the files here]().

To run the app you'll need to install the PHP libraries on your server. Composer will handle that for you. Open a shell terminal on your server, navigate to the project directory and type:

```shell
composer install
```

If you're using the Bower file for the client libraries, type:

```shell
bower install
```

Then start up the web socket server we created which will listen for message events:

```shell
php bin/server.php
```

That will run the socket server code which will start listening for connections and events on port 8080. Then open up two browser windows and point them to wherever you're hosting the project and start chatting!
