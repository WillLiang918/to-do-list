"use strict";

(function(root){
  var TodoStore = root.TodoStore = {};
  var _todos = [];
  var _callbacks = [];

  TodoStore.addChangeHandler = function(callback) {
    _callbacks.push(callback);
  };

  TodoStore.removeChangeHandler = function(callback) {
    var idx = _callbacks.indexOf(callback);
    _callbacks.splice(idx, 1);
  };

  TodoStore.changed = function() {
    _callbacks.forEach(function(callback) {
      callback();
    });
  };

  TodoStore.all = function(){
    return _todos;
  };

  TodoStore.fetch = function(){
    $.ajax({
      url:  "/api/todos",
      type: "GET",
      dataType: "json",
      success: function(data){
        _todos = data;
        TodoStore.changed();
      }
    })
  };

  // TodoStore.create({title: "Test", body: "Please work", done: true})
  TodoStore.create = function(todo){
    $.ajax({
      url:  "/api/todos",
      type: "POST",
      dataType: "json",
      data: {todo: todo},
      success: function(data){
        _todos.push(data);
        TodoStore.changed();
      }
    });
  }

  TodoStore.findIdx = function (todo) {
    for (var i = 0 ; i < _todos.length; i++) {
      if (_todos[i].id === todo.id) {
        return i;
      }
    }
  };

  TodoStore.findById = function (id) {
    for (var i = 0 ; i < _todos.length; i++) {
      if (_todos[i].id === id) {
        return _todos[i];
      }
    }
  };

  TodoStore.destroy = function (id) {
    $.ajax({
      url:  "/api/todos/" + id,
      type: "DELETE",
      dataType: "json",
      success: function(data){
        var todoIdx = TodoStore.findIdx(data);
        if (todoIdx !== -1) {
          _todos.splice(todoIdx, 1);
          TodoStore.changed();
        }
      }
    });
  };

  TodoStore.toggleDone = function (id) {
    var todo = TodoStore.findById(id);
    todo.done = !todo.done;
    $.ajax({
      url:  "/api/todos/" + id,
      type: "PATCH",
      dataType: "json",
      data: {todo: todo},
      success: function(data){

        var todoIdx = TodoStore.findIdx(data);
        _todos[todoIdx].done = !_todos[todoIdx].done;
        TodoStore.changed();
      }
    });
  };


})(this);
