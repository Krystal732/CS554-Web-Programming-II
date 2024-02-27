function TodoList({item, deleteTodo, toggleCompleted}) {
    const buttonClick = () => {
      handleClick(item);
    };
    return (
      <div>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <p>Due Date:{item.due}</p>
        <p>Completed:{item.completed}</p>
        <br />
        <button onClick={buttonClick}>Delete</button>
        <button onClick={buttonClick}>Complete</button>
      </div>
    );
  }
  
  export default TodoList;
  