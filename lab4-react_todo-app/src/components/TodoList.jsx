function TodoList(props) {
    const list = props.items.filter(item => !item.completed);

    const btnClick = (item) => {
        props.toggleCompleted(item);
      };
      const deleteBtn = (id) => {
        props.deleteTodo(id);
      };
    return (
      <div>
        {list.map((item) => (
            <div key={item.id}>
                <h1>{item.title}</h1>
                <p>{item.description}</p>
                <p>Due Date:{item.due}</p>
                <p>Completed:{item.completed? 'Yes' : 'No'}</p> 
                <br />
                <button onClick={() => btnClick(item)}>Complete</button>
                <button onClick={() => deleteBtn(item.id)}>Delete</button>

            </div>
        ))}
      </div>
    );
  }
  
  export default TodoList;
  