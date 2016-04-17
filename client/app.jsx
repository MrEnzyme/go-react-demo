import React from 'react';
import ReactDOM from 'react-dom';

var socket = io();
$('form').submit(function(){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});

class MessageList extends React.Component {
	render() {
		return (
			<div>
			{
				this.props.messages.map(message => <Message text={message}/>)
			}
			</div>
		)
	}
}

class Message extends React.Component {
	render() {
		return <li>{this.props.text}</li>;
	}
}

class ChatWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {messages: []};
	}
	componentDidMount() {
		socket.on('chat message', this.addMessage.bind(this));
	}
	addMessage(text) {
		let {messages} = this.state;
		messages.push(text);
		if(messages.length > 3) {
			messages.shift();
		}
		this.setState({messages});
	}
	render() {
		return (
			<ul>
			  <MessageList messages={this.state.messages}/>
			</ul>
		)
	}
}

ReactDOM.render(<ChatWindow/>, document.getElementById('game'));
