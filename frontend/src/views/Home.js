import axios from "axios";
import React, {useEffect, useState} from 'react';
import GroupList from '../components/GroupList'
import MemberOfList from '../components/MemberofList'
import useAxios from "../utils/useAxios";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Button } from "react-bootstrap";


function Home(){
    const [flag, setFlag] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [memberOf, setMemberOf] = useState([])
    const [username, setUsername] = useState(0)
    const api = useAxios();
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDescription, setNewGroupD] = useState('')

    const changeFlag = () =>{
      setFlag(!flag)
    }
    useEffect(() => {
      const load_g = async ()=>{
        

        const un = await api.get("/username/");
        setUsername(un.data.response);

        let res1 = await axios.get('http://127.0.0.1:8000/api/groups/')
        await setGroupList(res1.data)


        let res2 = await axios.get('http://127.0.0.1:8000/api/group_member/')
        await setMemberOf(res2.data)

        
      }
      load_g()

  
    }, [flag])

    const AddGroup = async () =>{
        let formField = new FormData()

        formField.append('name', newGroupName)
        formField.append('description', newGroupDescription)
        formField.append('owner', username)

        await axios({
            method: 'post',
            url: 'api/groups/',
            data: formField
        }).then(res =>{
            console.log(res.data)
        })
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
        {groupList?.filter(group => group.owner === username).map((group) =>{
            return( 
                <Col key = {group.id}>
                    <GroupList key = {group.id - 1} id = {group.id} name = {group.name} description = {group.description} owner = {group.owner} changeFlag = {changeFlag}/>
                    <br key = {group.id + 1}></br>
                </Col>
            )})}
        </Row>
        <hr></hr>
        <h3> You are a member of</h3>
        <Row xs={1} lg={3}>
        {memberOf?.filter(group => group.members === username).map((group) =>{
            return( 
                <Col key = {group.id}>
                    <MemberOfList key = {group.id - 1} id = {group.id} gid = {group.groups} changeFlag = {changeFlag} glist = {groupList}/>
                    <br key = {group.id + 1}></br>
                </Col>
            )})

        }

        </Row>
        
    </Container>
      )
  }

  export default Home;