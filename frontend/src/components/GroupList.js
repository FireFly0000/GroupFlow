//import axios from "axios";
import {Card, Button, Form} from 'react-bootstrap'
const GroupList = (props) => {
    return(
        <Card className="group-item" style={{width: "18rem"}}>
            <Card.Body>  
                <Card.Title>{props.name} </Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <Button variant="secondary"> View</Button>
                <Button variant ="danger"> Delete </Button>
            </Card.Body>  
        </Card>
    )
};

export default GroupList;