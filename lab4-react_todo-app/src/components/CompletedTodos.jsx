function CompletedTodos(props) {
    const completed = props.items.filter(item => item.completed);
    const btnClick = (item) => {
        props.toggleCompleted(item);
      };
    
    return (
      <div>
        {completed.map((item) => (
            <div key={item.id}>
                <h1>{item.title}</h1>
                <p>{item.description}</p>
                <p>Due Date:{item.due}</p>
                <p>Completed:{item.completed? 'Yes' : 'No'}</p> 
                <br />
                <button onClick={() => btnClick(item)}>Mark Incomplete</button>
            </div>
        ))}
      </div>
    );
  }
  
  export default CompletedTodos;
  