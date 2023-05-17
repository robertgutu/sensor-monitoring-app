
import {useState, useEffect} from 'react';
import { rtdb } from '../../firebase-config';
import {ref, set, get, child} from 'firebase/database';
import './AddNodes.css'
import { errAlert } from '../../components/Alerts/Alerts';
import { ToastContainer} from 'react-toastify';

function AddNodes(){

    const [nodes, setNodes] = useState([])
    const [isNodesLoaded,setIsNodesLoaded] = useState(false)
    const [error,setError] = useState(false)

    const [nodeId,setNodeId] = useState(null)
    const [nodeName, setNodeName] = useState("")
    const [nodeLat,setNodeLat] = useState(null)
    const [nodeLon,setNodeLon] = useState(null)
    const [nodeDesc, setNodeDesc] = useState("")

    const fetchNodes= async () => {
        const dbRef = ref(rtdb, '/');
        get(child(dbRef, `/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const temp_nodes = Object.values(snapshot.val())
                console.log("nodes",temp_nodes);
                setNodes(temp_nodes)
            } else {
                console.log("No data available");
            }
        }).catch((err) => {
            console.error(err);
            setError(err)
        }).finally(() => {
            setIsNodesLoaded(true)
        })
    }

    

    useEffect(() => {
        fetchNodes()
    },[])

    const triggerSubmit = (e) =>{
        e.preventDefault();

        /* console.log("nodeId", nodeId)
        console.log("nodeName", nodeName);
        console.log("nodeLat",nodeLat)
        console.log("nodeLon",nodeLon)
        console.log("nodeDesc",nodeDesc) */

        if(nodeId === null || nodeLat === null || nodeLat === "" || nodeLon === null || nodeLon === "" || nodeDesc === "" || nodeName === ""){
            errAlert("Please fill all mandatory fields")
        }else if(nodes.find(el => el.id === nodeId)){
            errAlert("Node ID already used!")
        }else if(nodeName.length < 5){
            errAlert("Node name is too short!")
        }else if(nodeLat < -90 || nodeLat > 90){
            errAlert("Latitude value is out of range")
        }else if(nodeLon < -180 || nodeLon > 180){
            errAlert("Longitude value is out of range")
        }else{
            postNewNode(nodeId,nodeName,nodeLat,nodeLon,nodeDesc)
        } 
    }

    const postNewNode = (id,name,lat,lon,desc) => {
        /* console.log("nodeId", id)
        console.log("nodeName", name);
        console.log("nodeLat",lat)
        console.log("nodeLon",lon)
        console.log("nodeDesc",desc) */

        set(ref(rtdb, `node_${id}/`), {
            id:id,
            name:name,
            lat:lat,
            lon: lon,
            desc:desc,
        }).then(() => {
            console.log("Data saved successfully!")
        }).catch((error) => {
            console.error(error)
        });

        window.location.reload(false);
    }   

    if(isNodesLoaded){
        if(error){
            return(<div>Something went wrong while fetching nodes data</div>)
        }else{
            return(
                <div className="formWrapper" >
                    
                        <form className="myCustomForm">
                            <div className="mb-3">
                                <label className="form-label">Node ID *</label>
                                <input type="number" className="form-control" id="idInput" value={nodeId} onChange={(e) => e.target.value === "" ? setNodeId(null) : setNodeId(parseInt(e.target.value))}/>
                                {/* {nodeId === null ? <div className="form-text">Please enter a node ID that is not already in use.</div> : null} */}
                                <div className="form-text">Enter a node ID that is not already in use. (Used ID's:{nodes.map((e,index) => {
                                    if(index !== nodes.length-1){
                                        return `${e.id},`
                                    }else{
                                        return `${e.id}`
                                    }
                                    
                                })})</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Name *</label>
                                <input type="text" className="form-control" id="descInput" onChange={(e) => setNodeName(e.target.value)}/>
                                {/* {nodeDesc === "" ? <div className="form-text">Please enter a description</div> : null} */}
                                <div className="form-text">Enter a name for this node (minimum 5 characters)</div>
                                
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Latitude *</label>
                                <input type="number" className="form-control" id="latInput" onChange={(e) => setNodeLat(parseFloat(e.target.value))}/>
                                {/* {nodeLat === null ? <div className="form-text">Please enter a valid latitude value</div> : null} */}
                                <div className="form-text">Set a valid latitude value between -90 and +90 !</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Longitude *</label>
                                <input type="number" className="form-control" id="lonInput"  onChange={(e) => setNodeLon(parseFloat(e.target.value))}/>
                                {/* {nodeLon === null ? <div className="form-text">Please enter a valid longitude value</div> : null} */}
                                <div className="form-text">Set a valid longitude value between -180 and +180 !</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description *</label>
                                <textarea type="text" className="form-control" id="descInput"  onChange={(e) => setNodeDesc(e.target.value)}/>
                                {/* {nodeDesc === "" ? <div className="form-text">Please enter a description</div> : null} */}
                                <div className="form-text">Enter a short description for this node</div>
                                
                            </div>
                            <button onClick={(e) => triggerSubmit(e)} className="btn btn-secondary float-right" 
                             disabled={nodeId === null || nodeLat === null || nodeLon === null || nodeDesc === "" || nodeName === "" ? true : false} >
                                Submit
                            </button>
                        </form>
                    
                </div>
            )
        }
    }else{
        return(
            <div>Loading</div>
        )
    }
    
}

export default AddNodes;