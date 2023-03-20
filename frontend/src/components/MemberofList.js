import axios from "axios";
import React, {useEffect, useState} from 'react';
import { useHistory} from "react-router-dom";
import {Card, Button} from 'react-bootstrap'
const MemberOfList = (props) => {
    const [gname, setGname] = useState('')
    const [ gdes, setGdes] = useState('')
    const [ owner, setOwner] = useState('')

    useEffect(() => {
        const load_g = async ()=>{
            setGname(props.glist.filter(g => g.id === props.gid)[0]['name'])
            setGdes(props.glist.filter(g => g.id === props.gid)[0]['description'])
            setOwner(props.glist.filter(g => g.id === props.gid)[0]['owner'])

        }
        load_g()
  
    
      },[])

    const history = useHistory();
    const RouteChange = (np, group_id, group_name, owner)=> {
        let path = np;
        history.push({
            pathname: path,
            state:{ gid: group_id, gname: group_name, owner: owner}
        })
      }
    
    const LeaveGroup = async () =>{
        await axios.delete(`http://127.0.0.1:8000/api/group_member/${props.id}/`)
        props.changeFlag()
    } 

    return(
        <Card className="group-item" style={{width: "18rem"}}>
            <Card.Body>  
                <Card.Title>{gname} </Card.Title>
                <Card.Text>{gdes}</Card.Text>
                <Button onClick={() =>RouteChange('/tasks', props.gid, gname, owner)}variant="secondary"> View</Button>
                <Button onClick={() =>LeaveGroup()} variant="danger"> Leave</Button>
            </Card.Body>  
        </Card>
    )
};

export default MemberOfList;