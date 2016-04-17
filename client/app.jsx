import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

var socket = io();

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

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: ''};
  }

  onKey(e) {
    this.setState({message: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let {message} = this.state;
    socket.emit('chat message', message);
    this.setState({message: ''});
  }

  render() {
    return(
      <div id='chat_box'>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            onChange={this.onKey.bind(this)}
            value={this.state.message}
          />
        </form>
      </div>
    )
  }
}

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
  }
  componentDidMount() {
    socket.on('chat message', this.messageReceived.bind(this));
  }
  messageReceived(text) {
    let {messages} = this.state;
    messages.push(text);
    if(messages.length > 3) {
      messages.shift();
    }
    this.setState({messages});
  }
  render() {
    return (
      <div id='game'>
        <ul>
          <MessageList messages={this.state.messages}/>
        </ul>
        <ChatBox/>
      </div>
    )
  }
}

ReactDOM.render(
  <ChatWindow/>,
  document.getElementById('game-frame')
);
