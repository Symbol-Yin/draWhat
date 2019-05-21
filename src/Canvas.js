import React, { Component } from "react";
import socketIoClient from 'socket.io-client';

class Canvas extends Component {
    constructor(props){
        const socket = socketIoClient("http://127.0.0.1:8080");        
        super(props);
        this.state = {
            isDrawing: false,
            data: null,
            currentX: 0,
            currentY: 0,
            socket: socket,
        };
        this.startToDraw = this.startToDraw.bind(this);
        this.drawing = this.drawing.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.drawLine = this.drawLine.bind(this);
    }
    componentDidMount() {
        const canvas = this.refs.canvas;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        this.setState({context: ctx})
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            ctx.closePath();
        }
        for (let x = 0; x < canvas.height; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.strokeStyle = 'black';

    }

     startToDraw = (event) => {
        const canvas = this.refs.canvas;
        const rect = canvas.getBoundingClientRect();
        const newX = event.clientX - rect.left;
        const newY = event.clientY - rect.top;
        console.log("newX: " + newX + " newY: " + newY);
        this.setState({isDrawing: true, currentX: newX, currentY: newY});
        this.state.socket.emit("Start Drawing", {newX, newY})
    }

    drawing = (event) => {
        const canvas = this.refs.canvas;
        const rect = canvas.getBoundingClientRect();
        if (this.state.isDrawing) {
            const newX = event.clientX - rect.left;
            const newY = event.clientY - rect.top;
            this.drawLine(this.state.currentX, this.state.currentY, newX, newY);
            this.setState({currentX: newX, currentY: newY});
            this.state.socket.emit("Drawing", {newX, newY})
          }
    }

    stopDrawing =  (event) => {
        const canvas = this.refs.canvas;
        const rect = canvas.getBoundingClientRect();
        if(this.state.isDrawing){
            const newX = event.clientX - rect.left;
            const newY = event.clientY - rect.top;
            this.drawLine(this.state.currentX, this.state.currentY, newX, newY);
           this.setState({isDrawing: false, currentX: 0, currentY: 0})
           this.state.socket.emit("Stop Drawing", {newX, newY})
        }
    }

    drawLine = (x1, y1, x2, y2) => {
        const canvas = this.refs.canvas;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }

    render() {
        return (
            <div>
                <canvas ref="canvas"  onMouseDown={this.startToDraw}  onMouseMove={this.drawing} onMouseUp={this.stopDrawing} width={600} height={600} />
            </div>
        )
    }
}
export default Canvas

// const sample = {"lines":[{"points":[{"x":276.4165199040196,"y":119.74009547761054},{"x":269.39292902426996,"y":124.86089451699196},{"x":259.0493688486777,"y":135.10861101443288},{"x":246.57309509221278,"y":149.73860056707323},{"x":234.44415850606512,"y":165.83319836144625},{"x":220.83654767923872,"y":183.1353014081413},{"x":216.34127229698458,"y":188.54341948491614},{"x":205.6997984308946,"y":200.84741535677963},{"x":196.4978509140663,"y":210.56954059075775},{"x":193.99991619576144,"y":213.05884155858615},{"x":186.3416989296123,"y":219.52156079007128},{"x":180.73894357645236,"y":224.00493435697814},{"x":179.44875851997662,"y":224.93778850850137},{"x":175.80016052102386,"y":227.43704887048222},{"x":174.37802648323424,"y":228.32182833967752},{"x":172.88161705385096,"y":229.1696124655056}],"brushColor":"#ac7a71","brushRadius":10}],"width":400,"height":400}
