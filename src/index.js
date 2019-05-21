import React, { Component } from "react";
import { render } from "react-dom";
import io from 'socket.io-client';
import Canvas from './Canvas';
import CanvasSlave from './CanvasSlave';

class DrawZone extends Component {
  constructor(props) {
    super(props);
    this.state ={isDrawer: true}
    this.onChangeRole = this.onChangeRole.bind(this);
    }
    newDrawing(data){
        this.setState((prevState)=>({...prevState, data}));
    }   
    draw(){
        this.socket.emit('mouse', this.state.data);
    }
    onChangeRole = () =>{
      this.setState((prevState)=>({isDrawer: !prevState.isDrawer}))
    }

  render() {
    const { isDrawer } = this.state;
    return (
      <div>
        {/* <button onClick={this.onChangeRole}>change role</button>
        <p>You are: {(this.state.isDrawer)? ("Drawer"):("Listener")}</p> */}
        
          <div >
            drawer: 
            <Canvas/>
          
            Copy: 
            <CanvasSlave/>
          </div>
      </div>
    );
  }
}

render(<DrawZone />, document.getElementById('root'));