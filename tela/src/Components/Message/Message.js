import React, { Component } from 'react';
import { Avatar } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import './Message.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      selectedUser: null,
      messages: [],
      messageText: '',
      searchValue: '',
      searchResults: [],
      showSearch: true,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    const userId = JSON.parse(localStorage.getItem("users")).id;
    console.log(userId);
    fetch(`http://localhost:8080/messages/users/${userId}`)
      .then(response => response.json())
      .then(userIds => {
        console.log(userIds);
        const promises = userIds.map(userId => {
          return fetch(`http://localhost:8080/userId/${userId}`)
            .then(response => response.json())
            .catch(error => {
              console.error(`Error fetching user details for user ID ${userId}:`, error);
              return null;
            });
        });

        Promise.all(promises)
          .then(userDetails => {
            const filteredUserDetails = userDetails.filter(user => user !== null);
            this.setState({ userList: filteredUserDetails });
          });
      })
      .catch(error => {
        console.error('Error fetching user IDs:', error);
      });
      console.log(this.state.userList);
  }

  handleUserClick = (user) => {
    const { selectedUser } = this.state;
    const userId = JSON.parse(localStorage.getItem("users")).id;
    // Check if the selected user is the same as the clicked user
    // If true, no need to fetch messages, just update the UI
    if (selectedUser && selectedUser.id === user.id) {
      this.setState({ showSearch: false });
      return;
    }
  
    // Update the selected user and clear messages
    this.setState({
      selectedUser: user,
      messages: [],
      searchResults: [], // Hide the search results when entering a conversation
      showSearch: false,
    });
    
    console.log(user.userId);
    console.log(userId);
    // Fetch messages between the selected user and the clicked user
    fetch(`http://localhost:8080/messages/sender/${user.id}/receiver/${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ messages: data });
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }

  handleSearchChange = (event) => {
    const searchValue = event.target.value;
    this.setState({ searchValue });

    if (searchValue.length >= 1) {
      fetch(`http://localhost:8080/search?keyword=${searchValue}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Search request failed');
          }
          return response.json();
        })
        .then(data => {
          const searchResults = data;
          this.setState({ searchResults });
        })
        .catch(error => {
          console.error('Error occurred during user search:', error);
        });
    } else {
      this.setState({ searchResults: [] });
    }
  };

  handleMessageChange = (event) => {
    this.setState({ messageText: event.target.value });
  }

  handleSendMessage = () => {
    const { selectedUser, messageText } = this.state;
    const userId = JSON.parse(localStorage.getItem("users")).id;

    if (messageText.trim() === '') {
      return;
    }

    const message = {
      senderId: userId,
      receiverId: selectedUser.id, // Replace with the appropriate receiver ID
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Send the message to the server
    // Replace the URL with the appropriate endpoint for sending messages
    fetch('http://localhost:8080/messages/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Message sending failed');
        }
        return response.json();
      })
      .then(data => {
        // Update the messages state with the newly sent message
        this.setState(prevState => ({
          messages: [...prevState.messages, data],
          messageText: '',
        }));
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  }

  handleBackClick = () => {
    this.setState({
      selectedUser: null,
      showSearch: true,
    });
  }

  render() {
    const { userList, selectedUser, messages, messageText, searchValue, searchResults, showSearch } = this.state;

    const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return (
      <div className="message-container">
        <div className="message">
          <h1 className="message__heading">Messages</h1>
          {showSearch && (
            <div className="message__search">
              <input
                type="text"
                placeholder="Search users..."
                value={searchValue}
                onChange={this.handleSearchChange}
              />
              <SearchIcon className="message__search-icon" />
            </div>
          )}
          {selectedUser ? (
            <div className="message__header">
              <div className="message__back-button" onClick={this.handleBackClick}>
                <ArrowBackIcon className="message__back-icon" />
              </div>
              <Avatar src={selectedUser.userProfilePath} alt={selectedUser.username} />
              <div className="message__username">{selectedUser.username}</div>
            </div>
          ) : (
            <div className="message__user-list">
              {searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div
                    className="message__user"
                    key={user.id}
                    onClick={() => this.handleUserClick(user)}
                  >
                    <Avatar src={user.userProfilePath} alt={user.username} />
                    <div className="message__username">{user.username}</div>
                  </div>
                ))
              ) : (
                userList.map(user => (
                  <div
                    className="message__user"
                    key={user.id}
                    onClick={() => this.handleUserClick(user)}
                  >
                    <Avatar src={user.userProfilePath} alt={user.username} />
                    <div className="message__username">{user.username}</div>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedUser && (
            <div className="message__conversation">
              <div className="message__body">
                <ul className="message__list">
                  {sortedMessages.map(message => (
                    <li
                      key={message.id}
                      className={`message__item ${message.senderId == selectedUser.id ? 'message__item--from' : 'message__item--to'}`}
                    >
                      {message.text}
                    </li>
                  ))}
                </ul>
                <div className="message__input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={this.handleMessageChange}
                  />
                  <SendIcon className="message__send-icon" onClick={this.handleSendMessage} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Message;
