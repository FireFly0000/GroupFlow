import axios from "axios";
import { useHistory } from "react-router-dom";
import {Card, Button} from 'react-bootstrap'
const GroupList = (props) => {
    const history = useHistory();
    const RouteChange = (np, group_id, group_name, owner)=> {
        let path = np;
        history.push({
            pathname: path,
            state:{ gid: group_id, gname: group_name, owner: owner}
        })
      }

    const DeleteGroup = async () =>{
        await axios.delete(`http://127.0.0.1:8000/api/groups/${props.id}/`)
        props.changeFlag()
    }

    return(
        <Card className="group-item" style={{width: "18rem"}}>
            <Card.Body>  
                <Card.Title>{props.name} </Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <Button onClick={() =>RouteChange('/tasks', props.id, props.name, props.owner)}variant="secondary"> View</Button>
                <Button onClick={() => DeleteGroup()} variant ="danger"> Delete </Button>
            </Card.Body>  
        </Card>
    )
};

export default GroupList;