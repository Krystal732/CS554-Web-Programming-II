function AddTodo(props) {
    function checkAndTrimString(s, varName) {
        if (typeof s !== "string") {
            alert(`${varName} is not a string`);
            return false;
        }
        s = s.trim()
        if(s.length === 0){
            alert(`String must not be empty`);
            return false;
        }
        return s
      }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        let title = document.getElementById('title').value;
        let description = document.getElementById('description').value;
        let due = document.getElementById('due').value;
        //validation..
        title = checkAndTrimString(title, "Title")
        if(!title) return
        if(title.length < 5){
            alert(`title, ${title}, must be greater than 5 chars`)
            return 
        }

        description = checkAndTrimString(description, "description")
        if(!description) return
        if(description.length < 25){
            alert(`description, ${description}, must be greater than 25 chars`)
            return 
        }
        
        due = checkAndTrimString(due, "due date")

        if(!due)return 

        let date = new Date(due)
        if (isNaN(date.getTime()) || date < new Date()) {
            alert(`Due date,  ${due}, must be a valid date after today`)
            return
        }

        let month = date.getMonth() + 1
        let day = date.getDate()
        let year = date.getFullYear()

        due = month + '/' + day + '/' + year;





    
        let item = {
            title,
            description,
            due, 
            completed:false
        }

        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due').value = '';

        props.addTodo(item)
      };
    
    return (
      <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            id='title'
            type='text'
            placeholder='Title'
          />
        </label>
        <label>
          Description:
          <input
            id='description'
            type='textarea'
            placeholder='Description'
          />
        </label>
        <label>
          Due:
          <input
            id='due'
            type='date'
            placeholder='Due'
          />
        </label>

        <input type='submit' value='Submit' />
      </form>
      </div>
    );
  }
  
  export default AddTodo;
  