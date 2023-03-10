import axios from "axios";
import {Card, Button, Form, Dropdown} from 'react-bootstrap'
import { useState, useEffect } from "react";

const TaskList = (props) => {
    const [background, setBackground] = useState('')
    const [editing, setEditing] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)
    const [newDescription, setNewDescription] = useState(props.description)
    const [newDueDate, setNewDueDate] = useState(props.due_date)
    const [newStat, setNewStat] = useState(props.status)

    const UpdateTask = async () =>{
        var today = new Date();
        let ndd_field = newDueDate.split('-')
        let ndd = new Date(ndd_field[0] + ', ' + ndd_field[1] + ', ' + ndd_field[2])
        let formField = new FormData()

        if(today.toString().slice(0, 16) === ndd.toString().slice(0, 16) || today.getTime() < ndd.getTime()){
            formField.append('title', newTitle)
            formField.append('description', newDescription)
            formField.append('status', newStat)
            formField.append('due_date', newDueDate)
            formField.append('group', props.gid)


            await axios({
                method: 'put',
                url: `http://127.0.0.1:8000/api/tasks/${props.id}/`,
                data: formField
            }).then(res =>{
                console.log(res.data)
            }).catch(err =>{
                console.log(err)
            })
        }
        else{
            alert("date cannot be in the pass")
        }

        setNewStat('')
        setEditing(false)
        props.changeFlag()
    }

    const DeleteTask = async () =>{
        await axios.delete(`http://127.0.0.1:8000/api/tasks/${props.id}/`)
        props.changeFlag()
    }
    useEffect(() => {
        const load_status = async ()=>{
            if(props.status === "IN PROGRESS"){
                setBackground("primary")
            }
            else if(props.status === "STUCK"){
                setBackground("danger")
            }
            else if(props.status === "COMPLETED"){
                setBackground("success")
            }

        }
        load_status()
    
      }, [props])


    return(
        <Card bg={background} text="white" className="group-item" style={{width: "50rem"}}>
            <Card.Body>  
            { editing === false ?
                <>
                <Card.Header>{props.title} </Card.Header>
                <Card.Text>{props.description}</Card.Text>
                <Card.Text>Due Date: {props.due_date}</Card.Text>
                <Card.Text>STATUS: {props.status}</Card.Text>
                <Button onClick={() => setEditing(true)} variant="light"> Edit </Button>
                <Button onClick={() => DeleteTask()} variant ="warning"> Delete </Button>
                </>
            :
                <>
                <Form.Label>Description</Form.Label>
                <Form.Control defaultValue={props.title} type="text" id="title" onChange={(e) => setNewTitle(e.target.value)}/>
                <Form.Label>Description</Form.Label>
                <Form.Control defaultValue={props.description} type="text" id="description" onChange={(e) => setNewDescription(e.target.value)}/>
                <Form.Label>Due date</Form.Label>
                <br></br>
                <input defaultValue={props.due_date} type="date" onChange={e=> setNewDueDate(e.target.value)}/>
                <br></br>
                <br></br>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {newStat}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() =>setNewStat('IN PROGRESS')}>IN PROGRESS</Dropdown.Item>
                        <Dropdown.Item onClick={() =>setNewStat('STUCK')}> STUCK</Dropdown.Item>
                        <Dropdown.Item onClick={() =>setNewStat('COMPLETED')}>COMPLETED</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <br></br>
                <Button variant="light" onClick={()=> UpdateTask()}> Done </Button>
                <br></br>
                <br></br>
                <Button variant="light" onClick={()=> setEditing(false)}> Cancel </Button>
                </>
            }
            </Card.Body>  
        </Card>
    )
};

export default TaskList;