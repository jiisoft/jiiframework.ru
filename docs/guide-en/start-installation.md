# Installation

## Requirements
[Node.js](http://nodejs.org/download/) minimal `v0.12` required for Jii. 

## Supported platforms
- node.js
- browsers (ie8+, chrome, ff, safari, mobile browsers, ..)
- mobile (phonegap) (planned)

## Installation from boilerplate
Jii has a few examples, which are also boilerplates for application quick deployment.
Boilerplates will help you grasp the idea and functionality of Jii and present how to create new application.  

Currently the following boilerplates are available:
- [Hello](https://github.com/jiisoft/jii-boilerplate-hello) - Include HTTP server, router, single controller, layout and single view, presenting "Hello World"
- [Basic](https://github.com/jiisoft/jii-boilerplate-basic) - More complex example, additionaly includes Active Record and Assets Manager.
- [Chat](https://github.com/jiisoft/jii-boilerplate-chat) (new!) - Full-stack (Jii on server and browser) application example. Simplest chat using commet server (jii-comet).

For boilerplate installation use method bellow:

```sh
git clone https://github.com/jiisoft/jii-boilerplate-hello
cd jii-boilerplate-hello
npm install
```

If `gulpfile.js` exists in boilerplate, it's necessary to run gulp (or `gulp production`):

```sh
gulp production
```
