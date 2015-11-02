Overview
========

Jii applications are organized according to the [model-view-controller (MVC)](http://wikipedia.org/wiki/Model-view-controller)
architectural pattern. [Models](structure-models) represent data, business logic and rules; [views](structure-views)
are output representation of models; and [controllers](structure-controllers) take input and convert
it to commands for [models](structure-models) and [views](structure-views).

Besides MVC, Yii applications also have the following entities:

* [applications](structure-applications): they are objects that manage application components and coordinate them to fulfill requests.
* [application components](structure-application-components): they are objects registered with applications and
  provide various services for fulfilling requests.
* [компоненты запроса](structure-context-components): это объекты, зарегистрированные в контексте запроса и предоставляющие различные
  возможности для обработки запроса;
* [modules](structure-modules): they are self-contained packages that contain complete MVC by themselves.
  An application can be organized in terms of multiple modules.
* [filters](structure-filters): they represent code that need to be invoked before and after the actual
  handling of each request by controllers.
