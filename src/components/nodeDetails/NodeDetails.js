import React, { useState, useEffect } from 'react';
import './NodeDetails.css'

const NodeDetails = (props) => {


    return(
        <div className="card">
        <div className="card-header chart-header">
            {props.node.name}
        </div>
        <div className="card-body chart-content">
            <p>Node ID: {props.node.id}</p>
            <p>Latitide: {props.node.lat}</p>
            <p>Longitude: {props.node.lon}</p>
            <p>Description: {props.node.desc}</p>
        </div>
        </div>
    )
}

export default NodeDetails