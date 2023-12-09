import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardMedia, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import love from "../../images/love.svg";
import comment from "../../images/comment.svg";
import share from "../../images/share.svg";
import { useParams } from 'react-router-dom';
import './PostView.css';

const PostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentList, setCommentList] = useState([]);

  const fetchPostData = () => {
    fetch(`http://localhost:8080/post/id/${postId}`)
      .then(response => response.json())
      .then(data => {
        setPost(data);
      })
      .catch(error => {
        console.error('Error fetching post data:', error);
      });

    fetch(`http://localhost:8080/comments/${postId}`)
      .then(response => response.json())
      .then(data => {
        setCommentList(data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  };

  useEffect(() => {
    fetchPostData();
  }, []);

  const handleCloseButtonClick = () => {
    window.history.back(); // Go back to the previous page
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-view__container">
      {/* Blurred Background */}
      <div className="post-view__background" />

      {/* Post */}
      <Card style={{ minWidth: 600, maxWidth: 1000, maxHeight:700, margin: '0 auto' }} className="post-view__card">
        <CardMedia
          component="img"
          alt="Post Image"
          height="600"
          image={post.postPath}
          style={{
            width: '80%',
            maxWidth: 600,
            backgroundColor: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            objectFit: 'contain',
            margin: '0 auto',
          }}
          className="post-view__media"
        />

        {/* Close Button */}
        <IconButton className="post-view__close-button" 
          onClick={handleCloseButtonClick}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: '1',
          }}>
          <Close className="post-view__close-icon" 
          style={{
            width: '24px',
            height: '24px',
            fill: '#fff',
          }}/>
        </IconButton>

        <div className="post-view__content">
          <div className="post-view__header">
            <Avatar className="post-view__avatar" src="" />
            <div className="post-view__username">{post.userName}</div>
          </div>
          <div className="post-view__analytics">
            <div className="post-view__react-icons">
              <img src={love} className="post-view__react-icon" alt="Love" />
              <img src={comment} className="post-view__react-icon" alt="Comment" />
              <img src={share} className="post-view__react-icon" alt="Share" />
            </div>
            <div className="post-view__likes">{post.likes} Likes</div>
          </div>
          <div className="post-view__comments">
            {commentList.map((comment, index) => (
              <div key={index} className="post-view__comment">
                <span className="post-view__comment-username">{comment.userName}</span>
                <span className="post-view__comment-text">{comment.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostView;