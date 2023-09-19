# brutaldom - Treat your web pages for what they are, not what you'd like them to be

A web page is a bunch of HTML and CSS. It can include JavaScript that responds to events.  The browser includes
many powerful APIs for building just about any user interface you might need.  Thus, you can build whatever you
need without any third party framework. But the browser's API is complex and contains many more features and
behaviors than *your* app is going to need.

The goal of BrutalDOM is to provide tools to make it easier to model *your* app.  For example, you may have a button
that shows a message to the user when clicked.

```html
<main>
  <button>Show Message</button>
  <p style="display:none">Hello there!</p>
</main>
```

You can implement this with the browser directly, like so:

```javascript
const setup = () {
  const button = document.querySelector("main button")
  const message = document.querySelector("main p")
  if (button && message) {
    button.addEventListener("click", () => {
      message.style.display = "block"
    })
  }
  else {
    if (!button) {
      throw `Could not find button`
    }
    if (!message) {
      throw `Could not find message`
    }
  }
}

window.addEventListener("DOMContentLoaded",setup)
```

This is not so bad, however with more complicated needs, this can become quite difficult:

* Your code has to check that the elements its going to decorate are there
* The actual behavior relies on magical strings like "click" and "block". If you mis-type these, no error occurs, your app just doesn't work.

While you could certainly use a big framework, BrutalDOM provides classes to wrap DOM elements and use them as the basis for richer
components and objects that respond to the needs of your app.

For example:

```javascript
window.addEventListener("DOMContentLoaded",() => {
  const body = new Body()
  const button = new Button(body.$selector("main button"))
  const message = new Message(body.$selector("main p"))

  button.onClick( () => message.show() )
})
```

This is the core logic that glues together the app.  `Body` is provided by BrutalDOM, but `Button` and `Message` are defined by you.  Before we see those, note that it's a bit more clear what does what.  When the button is clicked, we show the message.

Here's `Button`

```javascript
import { Component } from "brutaldom"

class Button extends Component {
  whenCreated() {
    EventManager.defineEvents(this, "click")
    this.element.addEventListener("click", (event) => {
      event.preventDefault()
      this.clickEventManager.fireEvent()
    })
  }
}
```

That…looks like regular JavaScript.  It's a bit more code, but all the stuff inside `whenCreated()` is providing a richer event
than what yo uget with `addEventListener`.  It provides the `onClick` method. If you mis-type it, you'll get an error as opposed
to silent failure.

`Message` doesn't need much logic and can use the builtin `Component`:

```javascript
class Message extends Component {
}
```

This provides the `show()` method.

This may seem like more code. For this simple case, it certainly is. But, when you have a complex UI that has a lot of events and
interactions, it can be help to create high-level components that don't stray too much from the base APIs that are part othe
browser.

## General Overview

Any DOM element you want to interact with should have a new class that extends `Component`.  That class is then designed by you
to provide the exact API yoru app needs to interact with it.

Here are the main features:

* **DOM element location without `if` statements.** Every `Component` provides several methods to locate DOM elements. These
methods will fail if the located element is not found (or if a collection of elements results in zero elements).  The `Body`
class allows you to locate elements from the `<body>`.
* **Create Richer, Higher-Level Events.**  `addEventListener` is fine, exception that it takes a string for the name and produces
only an `Event`.  This means lots of translating concepts.  Instead, you can easily define events using methods—not strings—whose
payloas, when fired, produce objects in your domain, or which trigger other events.
* **Templates and Slots without Shadow DOM**.  The `<template>` and `<slot>` elements standard, but Web Components provides a
somewhat clunky API to these. Plus, using Web Components with templates requires adopting the Shadown DOM which you may not want
to do.  Instead, any `Component` can locate a `Template`, then create a `newNode` that fills in any `<slot>` elements with data
you define in code.
* **Simplified Animation**. The browser's animation API is powerful but flexible and clunky.  `Animator` allows a more
streamlined way to animate between two sets of styles.  It can't handle every single animation need, but certainly handles most
of them.

## Developing

To work on brutaldom:

1. Install Docker
2. `dx/build`
3. `dx/start`
4. In another terminal, `dx/exec bin/setup`
5. In another terminal, `dx/exec bin/test`
6. Open up the browser wherever the output of `bin/test` says to, and the tests will run in the browser.
