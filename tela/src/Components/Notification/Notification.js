import React, { Component } from 'react';
import { Avatar } from '@material-ui/core';
import "./Notification.css";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      userAvatars: {} // New state to store user avatars
    };
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = () => {
    // Fetch notifications for the current user
    const userId = JSON.parse(localStorage.getItem("users")).userId; // Replace with the actual user ID
    fetch(`http://localhost:8080/notifications/${userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ notifications: data }, () => {
          this.getAvatars();
        });
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }

  getAvatars = () => {
    const { notifications } = this.state;
    const avatarPromises = notifications.map(notification =>
      fetch(`http://localhost:8080/user/${notification.senderId}`)
        .then(response => response.json())
    );

    Promise.all(avatarPromises)
      .then(data => {
        const userAvatars = {};
        console.log(data);
        data.forEach(user => {
          userAvatars[user.userId] = user.userProfilePath;
        });

        this.setState({ userAvatars });
      })
      .catch(error => {
        console.error('Error fetching user avatars:', error);
      });
  }

  render() {
    const { notifications, userAvatars } = this.state;
  
    return (
      <div className="noti-page-container">
        <div className="notifications__container">
          <div className="notifications__header">
            <div>Notifications</div>
          </div>
          <div className="notifications__body">
            {notifications.map(notification => (
              <div className="notification__item" key={notification.notificationId}>
                <div className="notification__avatar">
                  <Avatar  src={`${userAvatars[notification.senderId]}`} />
                </div>
                <div className="notification__message">{notification.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Notification;
