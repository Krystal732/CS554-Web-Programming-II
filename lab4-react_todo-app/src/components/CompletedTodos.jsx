function CompletedTodos({item, toggleCompleted}) {
    const buttonClick = () => {
        toggleCompleted(item);
    };
    return (
      <div>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <p>Due Date:{item.due}</p>
        <p>Completed:{item.completed}</p>
        <br />
        <button onClick={buttonClick}>Mark Incomplete</button>
      </div>
    );
  }
  
  export default CompletedTodos;
  