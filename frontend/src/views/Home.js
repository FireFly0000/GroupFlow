import axios from "axios";
import React, {useEffect, useState} from 'react';
import GroupList from '../components/GroupList'
import useAxios from "../utils/useAxios";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import '../Home.css'

function Home(){
    const [flag, setFlag] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [user_id, setUserid] = useState(0)
    const [username, setUsername] = useState(0)
    const api = useAxios();
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDescription, setNewGroupD] = useState('')

    const changeFlag = () =>{
      setFlag(!flag)
    }
    useEffect(() => {
      const load_g = async ()=>{
        
        const id = await api.get("/userID/");
        setUserid(id.data.response);

        const un = await api.get("/username/");
        setUsername(un.data.response);

        axios.get('http://127.0.0.1:8000/api/groups/')
        .then(result =>{
            setGroupList(result.data)
        })
        
      }
      load_g()

  
    }, [flag])

    const AddGroup = async () =>{
        let formField = new FormData()

        formField.append('name', newGroupName)
        formField.append('description', newGroupDescription)
        formField.append('owner', user_id)

        await axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/groups/',
            data: formField
        }).then(res =>{
            console.log(res.data)
        })
        setNewGroupName('')
        setNewGroupD('')
        changeFlag()
    }

    return(
    <Container className="Home">
        <Row>
            <Col xs={12} md={8}>
                <h3>Create New Group</h3>
                <Form.Label>Group Name</Form.Label>
                <Form.Control type="text" id="name" onChange={(e) => setNewGroupName(e.target.value)}/>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" id="Description" onChange={(e) => setNewGroupD(e.target.value)}/>
                <br></br>
                <Button onClick={() => AddGroup()}> Create Group</Button>
            </Col>
        </Row>
        <hr></hr>
        <h3> Welcome {username}, Groups you own</h3>
        <Row xs={1} lg={3}>
        {groupList?.filter(group => group.owner === user_id).map((group) =>{
            return( 
                <Col>
                    <GroupList key = {group.id - 1} name = {group.name} description = {group.description} changeFlag = {changeFlag}/>
                    <br></br>
                </Col>
            )})}
        </Row>
    </Container>
      )
  }

  export default Home;