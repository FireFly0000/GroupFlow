import axios from "axios";
import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Button, Card, Dropdown} from "react-bootstrap";
import {useLocation} from 'react-router-dom';
import TaskList from "../components/TaskList";
import "../task.css"

function Tasks(){
  const [addingUser, setAddingUser] = useState(false)
  const [adding, setAdding] = useState(false)
  const [flag, setFlag] = useState(false)
  const [TList, setTaskList] = useState([])
  const [newTitle, setNewtitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newStat, setNewStat] = useState('')
  const [members, SetMembers] = useState([])
  const [allUser, setAllUser] = useState([])
  const [newMember, setNewMember] = useState('')

  const location = useLocation();
  const state = location.state

  const changeFlag = () =>{
    setFlag(!flag)
  }
  useEffect(() => {
    const load_g = async ()=>{
      
      axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(result =>{
        setTaskList(result.data)
      })

      await axios.get('http://127.0.0.1:8000/api/group_member/')
      .then(result =>{
        SetMembers(result.data)
      })

      let result = await axios.get('http://127.0.0.1:8000/api/users/')
      await setAllUser(result.data)

    }
    load_g()
  }, [flag])

  const AddTask =  async () =>{
    var today = new Date();
    let ndd_field = newDueDate.split('-')
    let ndd = new Date(ndd_field[0] + ', ' + ndd_field[1] + ', ' + ndd_field[2])
    let formField = new FormData()
    let inval_date = true

    if(today.toString().slice(0, 16) === ndd.toString().slice(0, 16) || today.getTime() < ndd.getTime()){
      formField.append('title', newTitle)
      formField.append('description', newDescription)
      formField.append('status', newStat)
      formField.append('due_date', newDueDate)
      formField.append('group', state.gid)

        await axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/tasks/',
            data: formField
        }).then(res =>{
          console.log(res.data)
        }).catch(err =>{
          console.log(err)   
        })
        setNewStat('')
        inval_date = false
    }
    if (inval_date){
        alert("date cannot be in the pass")
    }
    else{
      changeFlag()
      setAdding(false)
    }
  }

  const AddMember =  async () =>{
    let NotFound = true
    let i = 0
    let j = 0
    let au = [...allUser]
    
    if(newMember === state.owner){
      alert("user is already a member")
      return
    }

    for(j in members){
      if(members[j]['members'] === newMember && members[j]['groups'] === state.gid){
        alert("user is already a member")
        return
      }
    }

    for (i in au){
      if (au[i]['username'] === newMember){
        
        let formField = new FormData()
        formField.append('groups', state.gid)
        formField.append('members', au[i]['username'])

        await axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/group_member/',
          data: formField
        })
        NotFound = false
        break
      }
    }
    if(NotFound){
      alert("Username does not exist")
    }
    else{
      changeFlag()
      setAddingUser(false)
    }
  }
  return(
    <Container className="Home">
        <h3> Welcome to {state.gname}</h3>
        <h3> Owner: {state.owner}</h3>
        <div>
        {
          <>
            <h4 className="members"> Members:</h4>
            {members?.filter(member => member.groups === state.gid).map(member =><h4 className="members" key = {member.id}> {member.members}, </h4>)}
          </>
        }
        </div>
        <br></br>
        <br></br>
        <br></br>

        <Card bg = "secondary" text="white" className="group-item" style={{width: "50rem"}}>
          <Card.Body>
          { addingUser === false ?
            <>
              <Button onClick={()=> setAddingUser(true)}>Add user</Button>
            </>
          :
            <>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" id="name" onChange={(e) => setNewMember(e.target.value)}/>
              <br></br>
              <Button variant = "danger" onClick={()=>AddMember()}>Submit</Button>
              <br></br>
              <br></br>
              <Button variant = "danger" onClick={()=> setAddingUser(false)}>Cancel</Button>
            </>
          }
          </Card.Body>
        </Card>

        <Card bg = "secondary" text="white" className="group-item" style={{width: "50rem"}}>
            <Card.Body>  
            { adding === false ?
                <>
                  <Button variant="primary" onClick={()=> setAdding(true)}> Add Task </Button>
                </>
            :
                <>
                <Form.Label>Title</Form.Label>
                <Form.Control  type="text" id="title" onChange={(e) => setNewtitle(e.target.value)}/>
                <Form.Label>Description</Form.Label>
                <Form.Control  type="text" id="description" onChange={(e) => setNewDescription(e.target.value)}/>
                <Form.Label>Due date</Form.Label>
                <br></br>
                <input bg='blue' type="date" onChange={e=> setNewDueDate(e.target.value)}/>
                <br></br>
                <br></br>
                <Dropdown variant="secondary">
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {newStat}
                    </Dropdown.Toggle>

                    <Dropdown.Menu bg="secondary">
                        <Dropdown.Item onClick={() =>setNewStat('IN PROGRESS')}>IN PROGRESS</Dropdown.Item>
                        <Dropdown.Item onClick={() =>setNewStat('STUCK')}> STUCK</Dropdown.Item>
                        <Dropdown.Item onClick={() =>setNewStat('COMPLETED')}>COMPLETED</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <br></br>
                <Button variant="danger" onClick={()=> AddTask()}> Submit </Button>
                <Button variant="danger" onClick={()=> setAdding(false)}> Cancel</Button>
                </>
            }
            </Card.Body>  
        </Card>
        <br></br>
        <Row>
        {TList?.filter(task => task.group === state.gid).map((task) =>{
            return( 
                <Col key = {task.id}>
                    <TaskList key = {task.id - 1} id = {task.id} title = {task.title} description = {task.description} 
                     status = {task.status} due_date = {task.due_date} gid ={state.gid} changeFlag = {changeFlag}/>
                    <br key = {task.id + 1}></br>
                </Col>
            )})}
        </Row>
    </Container>
  )
}

  export default Tasks;