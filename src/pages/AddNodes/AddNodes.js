
import {useState, useEffect} from 'react';
import { rtdb } from '../../firebase-config';
import {ref, get, child} from 'firebase/database';
import './AddNodes.css'

function AddNodes(){

    const [nodes, setNodes] = useState([])
    const [isNodesLoaded,setIsNodesLoaded] = useState(false)
    const [error,setError] = useState(false)

    const [nodeId,setNodeId] = useState(null)
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
        console.log("nodeId", typeof nodeId)
        console.log("nodeLat",nodeLat)
        console.log("nodeLon",nodeLon)
        console.log("nodeDesc",nodeDesc)
        
    }

    if(isNodesLoaded){
        if(error){
            return(<div>Something went wrong while fetching nodes data</div>)
        }else{
            return(
                <div className="formWrapper" >
                    
                        <form className="myCustomForm">
                            <div className="mb-3">
                                <label className="form-label">Node ID</label>
                                <input type="number" className="form-control" id="idInput" onChange={(e) => e.target.value === "" ? setNodeId(null) : setNodeId(e.target.value)}/>
                                {/* {nodeId === null ? <div className="form-text">Please enter a node ID that is not already in use.</div> : null} */}
                                <div className="form-text">Please enter a node ID that is not already in use. (Used ID's:{nodes.map((e,index) => {
                                    if(index !== nodes.length-1){
                                        return `${e.id},`
                                    }else{
                                        return `${e.id}`
                                    }
                                    
                                })})</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Latitude</label>
                                <input type="number" className="form-control" id="latInput" onChange={(e) => setNodeLat(e.target.value)}/>
                                {/* {nodeLat === null ? <div className="form-text">Please enter a valid latitude value</div> : null} */}
                                <div className="form-text">Please enter a valid latitude value</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Longitude</label>
                                <input type="number" className="form-control" id="lonInput"  onChange={(e) => setNodeLon(e.target.value)}/>
                                {/* {nodeLon === null ? <div className="form-text">Please enter a valid longitude value</div> : null} */}
                                <div className="form-text">Please enter a valid longitude value</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea type="number" className="form-control" id="descInput"  onChange={(e) => setNodeDesc(e.target.value)}/>
                                {/* {nodeDesc === "" ? <div className="form-text">Please enter a description</div> : null} */}
                                <div className="form-text">Enter a short description for this node</div>
                                
                            </div>
                            <button onClick={(e) => triggerSubmit(e)} className="btn btn-secondary" 
                            /* disabled={nodeId === null || nodeLat === null || nodeLon === null || nodeDesc === "" ? true : false} */ >
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