import React, { Component } from 'react';
import "./Post.css";
import { Avatar } from '@material-ui/core';
import postimage from "../../images/post.jpg"; 
import love from "../../images/love.svg"; 
import FavoriteIcon from '@material-ui/icons/Favorite';
import comment from "../../images/comment.svg"; 
import share from "../../images/share.svg";
import DeleteIcon from '@material-ui/icons/Delete';
import { storage } from '../firebase';
import {ref, deleteObject} from 'firebase/storage';



class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            commentList: [],
            likes: 0,
            isLiked: false
        }
    }
    

    componentDidMount() {
        this.getComments();
        this.getLikeCount();
        console.log(this.props);
    }


    getComments=()=>{ 
        fetch('http://localhost:8080/comments/'+this.props.id)
            .then(response => response.json())
            .then(data => {
                this.setState({commentList: data});
                console.log(data);
        });
        
    }
    deleteImageFromFirebase(imagePath) {
      // Create a reference to the image file
      const imageRef = ref(storage,`${imagePath}`);
      // Delete the image file
      return deleteObject(imageRef);
    };

    deletePost = () => {
      // Delete the image from Firebase Storage
      this.deleteImageFromFirebase(this.props.postImage)
        .then(() => {
          // Image deleted successfully
          console.log('Image deleted');
    
          // Make a DELETE request to delete the post
          fetch(`http://localhost:8080/post/${this.props.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          }).then(()=>{this.props.onDeletePost(this.props.id);})
    });
    }    


    deleteComment = (commentId) => {
      // Make a DELETE request to delete the comment
      console.log(commentId);
      fetch(`http://localhost:8080/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          // Comment deleted successfully
          console.log('Comment deleted:', data);
    
          // Optionally, you can update the UI to remove the deleted comment from the list
          // For example, you can trigger a callback function passed as a prop to update the parent component's state
          if (this.props.onDeleteComment) {
            this.props.onDeleteComment(commentId);
          }
        })
        .catch(error => {
          console.error('Error deleting comment:', error);
        });
    }
    

    getLikeCount = () => {
        fetch('http://localhost:8080/post/like/' + this.props.id)
            .then(response => response.json())
            .then(data => {
                this.setState({ likes: data });
            })
            .catch(error => {
                console.error('Error fetching like count:', error);
            });
    }

    updateLikeCount = () => {
      const { isLiked } = this.state;
      const likeCount = isLiked ? this.state.likes - 1 : this.state.likes + 1;
  
      const requestOptions = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
      };
  
      // Update the URL and request method as per your API endpoint for updating the like count
      fetch(`http://localhost:8080/post/like/${this.props.id}?likeCount=${likeCount}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState(prevState => ({
            likes: likeCount,
            isLiked: !prevState.isLiked
          }));
  
          // Create or delete a notification for liking a post
          const recipientId = this.props.userId;
          const senderId = JSON.parse(localStorage.getItem("users")).userId;
          const senderName = JSON.parse(localStorage.getItem("users")).username;
  
          if (!isLiked) {
            const notificationPayload = {
              recipientId: recipientId,
              message: `Your post is Liked by ${senderName}`,
              postId: this.props.id,
              senderId: senderId
            };
  
            // Make a POST request to create the notification
            fetch('http://localhost:8080/notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(notificationPayload)
            })
              .then(response => response.json())
              .then(data => {
                // Notification created successfully
                console.log('Notification created:', data);
              })
              .catch(error => {
                console.error('Error creating notification:', error);
              });
          } else {
            // Make a DELETE request to delete the notification
            fetch(`http://localhost:8080/notifications?senderId=${senderId}&postId=${this.props.id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            })
              .then(response => response.json())
              .then(data => {
                // Notifications deleted successfully
                console.log('Notifications deleted:', data);
              })
              .catch(error => {
                console.error('Error deleting notifications:', error);
              });

          }
        })
        .catch(error => {
          console.error('Error updating like count:', error);
        });
    }
  

    submitComment = (event) => {
      if (event.key === "Enter") {
        let comment = event.currentTarget.value;
        if (comment !== null || comment !== undefined) {
          let payload = {
            "commentId": Math.floor(Math.random() * 1000000).toString(),
            "userId": JSON.parse(localStorage.getItem("users")).userId,
            "postId": this.props.id,
            "timeStamp": new Date().getTime(),
            "comment": comment,
            "userName": JSON.parse(localStorage.getItem("users")).username,
          };
  
          const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          };
  
          fetch("http://localhost:8080/comments", requestOptions)
            .then(response => response.json())
            .then(data => {
              this.getComments();
  
              // Create a notification for adding a comment
              const recipientId = this.props.userId;
              const senderId = JSON.parse(localStorage.getItem("users")).userId;
              const senderName = JSON.parse(localStorage.getItem("users")).username;
  
              const notificationPayload = {
                recipientId: recipientId,
                message: `You received a comment on your post from ${senderName}`,
                postId: this.props.id,
                senderId: senderId,
                commentId: data.commentId,
              };
  
              // Make a POST request to create the notification
              fetch('http://localhost:8080/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationPayload)
              })
                .then(response => response.json())
                .then(data => {
                  // Notification created successfully
                  console.log('Notification created:', data);
                })
                .catch(error => {
                  console.error('Error creating notification:', error);
                });
            })
            .catch(error => {
              console.error('Error submitting comment:', error);
            });
        }
        event.currentTarget.value = null;
      }
    }

    render() {
        const { commentList, likes, isLiked } = this.state;

        return (
          <div className="post__container">
          {/* Header */}
          <div className="post__header">
            <Avatar className="post__image" src="" />
            <div className="post__username">{this.props.userName}</div>
            {/* Delete post button */}
           <DeleteIcon className="post__delete-icon" onClick={this.deletePost} />
          </div>
        
          {/* Image */}
          <img className="post__image" src={this.props.postImage} alt="Post" />
        
          {/* Analytics */}
          <div className="post__analytics">
            <div>
            <FavoriteIcon
              className={`post_reacticon ${isLiked ? 'active' : ''}`}
              onClick={this.updateLikeCount}
            />
              <img src={comment} className="post_reactimage" alt="Comment" />
              <img src={share} className="post_reactimage" alt="Share" />
            </div>
            <div className="post__likes">
              {likes} likes
            </div>
          </div>
        
          {/* Comment Section */}
          <div className="post__comments">
            {commentList.slice(0, 4).map((item) => (
              <div key={item.commentId} className="post_comment">
                {item.userName}: {item.comment}
                {/* Delete comment button */}
                <DeleteIcon className="post__delete-icon" onClick={() => this.deleteComment(item.commentId)} />
              </div>
            ))}
            <input type="text" onKeyPress={this.submitComment} className="post__commentbox" placeholder="Add a comment..." />
          </div>
        </div>
        );
    }
}
 
export default Post;