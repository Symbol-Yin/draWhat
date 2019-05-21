import React, { Component } from "react";
import socketIoClient from 'socket.io-client';


class CanvasSlave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDrawing: false,
            data: null,
            currentX: 0,
            currentY: 0,
        };
    }

    componentDidMount() {
        const socket = socketIoClient("http://127.0.0.1:8080");        
        const canvas = this.refs.canvas_slave;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        this.setState({ context: ctx })
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
        // Connect to server by socket.io
        socket.on("Start Drawing", this.startToDraw);
        socket.on("Drawing", this.drawing);
        socket.on("Stop Drawing", this.stopDrawing);
    }

    startToDraw = (data) => {
        const canvas = this.refs.canvas_slave;
        const rect = canvas.getBoundingClientRect();
        this.setState({ isDrawing: true, currentX: data.currentX, currentY: data.currentY });
    }

    drawing = (data) => {
        const canvas = this.refs.canvas_slave;
        const rect = canvas.getBoundingClientRect();
        if (this.state.isDrawing) {
            this.drawLine(this.state.currentX, this.state.currentY, data.newX, data.newY);
            this.setState({ currentX: data.newX, currentY: data.newY });
        }
    }

    stopDrawing = (data) => {
        const canvas = this.refs.canvas_slave;
        const rect = canvas.getBoundingClientRect();
        if (this.state.isDrawing) {
            this.drawLine(this.state.currentX, this.state.currentY, data.newX, data.newY);
            this.setState({ isDrawing: false, currentX: 0, currentY: 0 })
        }
    }

    drawLine = (x1, y1, x2, y2) => {
        const canvas = this.refs.canvas_slave;
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
                <canvas ref="canvas_slave"  width={600} height={600} />
            </div>
        )
    }
}

export default CanvasSlave