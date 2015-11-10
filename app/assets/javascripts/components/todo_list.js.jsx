var TodoList = React.createClass({

  getInitialState: function () {
    return { todos: TodoStore.all() };
  },

  componentDidMount: function () {
    TodoStore.addChangeHandler(this.todosChanged);
    TodoStore.fetch();
  },

  componentWillUnmount: function () {
    TodoStore.removeChangeHandler(this.todosChanged);
  },

  todosChanged: function () {
    this.setState({todos: TodoStore.all() });
  },

  render: function () {

    return (
      <div>
        <TodoForm />
        {
          this.state.todos.map(function (todo) {
            return <TodoListItem key={todo.id} todo={todo} />
          })
        }
      </div>
    );
  },


});

var TodoListItem = React.createClass({

  handleDestroy: function (e) {
    var id = parseInt(e.currentTarget.dataset.id);
    TodoStore.destroy(id);
  },

  render: function () {
    return (
      <div>
        <TodoDetailView todo={this.props.todo} todoList={this}/>

      </div>
    )
  }
});

var TodoDetailView = React.createClass({
  getInitialState: function () {
    return { expanded: false };
  },

  render: function () {

    var body;
     if (this.state.expanded) {
       body = <div>
                <div>{this.props.todo.body}</div>
                <button className="deleteButton" data-id={this.props.todo.id} onClick={this.props.todoList.handleDestroy}>Delete</button>
              </div>;
    }

    return (
      <div className="todoItem group">
        <h3 className="group" onClick={this.toggleBody}>{this.props.todo.title}</h3>
        <div>{body}</div>
        <DoneButton todo={this.props.todo}/>
      </div>
    );
  },

  toggleBody: function () {
    this.setState({ expanded: (this.state.expanded ? false : true )})
  }
});


var TodoForm = React.createClass({
  getInitialState: function () {
    return { title: "", body: "" }
  },

  render: function () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.updateTitle} value={this.state.title} placeholder="title"/>
          <input type="text" onChange={this.updateBody} value={this.state.body} placeholder="body"/>
          <button>Create ToDo</button>
        </form>
      </div>
    );
  },

  updateTitle: function (e) {
    this.setState({ title: e.currentTarget.value });
  },

  updateBody: function (e) {
    this.setState({ body: e.currentTarget.value });
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var todo = {title: this.state.title, body: this.state.body, done: false};
    TodoStore.create(todo);
    this.setState({ title: "", body: "" });
  },

});

var DoneButton = React.createClass ({

  getInitialState: function () {
    return { done: this.props.todo.done ? "Undo" : "Done" };
  },

  render: function () {
    return (
      <button className="doneButton" data-id={this.props.todo.id} onClick={this.handleDone}>{this.state.done}</button>
    );
  },

  handleDone: function (e) {
    var id = parseInt(e.currentTarget.dataset.id);
    TodoStore.toggleDone(id);
    this.props.todo.done = !this.props.todo.done;
    this.setState({ done: (this.state.done === "Done" ? "Undo" : "Done")});
  }


});
