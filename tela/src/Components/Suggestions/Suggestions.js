import React, { Component } from 'react';
import "./Suggestions.css"
import { Avatar } from '@material-ui/core';
import imageSrc1 from '../../images/pp1.png'
import imageSrc2 from '../../images/pp2.png'
import imageSrc3 from '../../images/pp3.jpeg'

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    };
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('users'));
    if (currentUser) {
      this.getUsers(currentUser);
    }
  }

  getUsers = (currentUser) => {
    fetch('http://localhost:8080/get')
      .then(response => response.json())
      .then(data => {
        // Filter out the current user from the userList
        const filteredUserList = data.filter(user => user.userId !== currentUser.userId);
        this.setState({ userList: filteredUserList });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

  render() {
    return (
      <div>
        <div className="suggestions__container">
          <div className="suggestions__header">
            <div>Suggestions For You</div>
          </div>
          <div className="suggestions__body">
            {this.state.userList.map((user, index) => (
              <div className="suggestions__friends" key={user.id}>
                <Avatar src={user.userProfilePath} className="suggestions__image" />
                <div className="suggestions__username">{user.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Suggestions;
