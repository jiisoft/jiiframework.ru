Ideology
========

## Promise

Every asyncronous operation returns Promise object that compliances to ECMAScript 2015 (ES6). The [when](https://github.com/cujojs/when) package is used for that. Methods start with `load` return Promise (loadData()) whereas methods with `get` (getUser(), get('id')) prefix return data syncronously.

## Yii API 2 Persistance

The major idea is to bring beautiful and rich Yii PHP Framework to JavaScript language. PHP developers can try Node.js easily even without reading full class reference.

## Global Scope

In JavaScript world it is important to avoid global namespace pollution. That is why althought PHP Yii makes a lot of global constants (`YII_*`), classes (`Yii`) and namespaces (`yii.`) Jii does not do that. Browsers have the single global object `Jii` that you can free up by calling `Jii.noConflict()`. On server side you have Jii object as result of calling `require('jii')`.

## npm Packages

Jii is distributed as a set of jii-* packages and does not have its own package manager (hi, Meteor). That means you can use any other packages along with Jii.

Jii is splitted into several packages and you can use only ones you need.

There are main Jii packages:
- [jii](https://www.npmjs.com/package/jii)
- [jii-model](https://www.npmjs.com/package/jii-model)
- [jii-mysql](https://www.npmjs.com/package/jii-mysql)
- [jii-react](https://www.npmjs.com/package/jii-react)

## Classes and namespaces

To implement this we use [Neatness](http://github.com/affka/neatness) project. We have been successfully used in our internal projects.

## Middlewares

In Yii framework components are accessable using `Yii::$app` object. But in Jii we cannot use this approach because not all components can be set globally since some of them (Request, Response, WebUser, Session, …) are assigned to request context. These components will be created in `Jii.base.Context` and be passed as argument to actions &mdash; the same as passing request and response in `Express` framework.

```js
/**
 * @class app.controllers.SiteController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.controllers.SiteController', /** @lends app.controllers.SiteController.prototype */ {
    __extends: 'Jii.base.Controller',

    /**
     *
     * @param {Jii.base.Context} context
     * @param {Jii.request.http.Request} context.request
     * @param {Jii.request.http.Response} context.response
     */
    actionIndex: function(context) {
        context.response.data = this.render('index');
        context.response.send();
    }
});
```
