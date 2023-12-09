import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, ImageList, ImageListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './UserProfileView.css';

const UserProfileView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch the user data for the specified userId
    fetch(`http://localhost:8080/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUser(data);
        setFollowers(data.followers.length);
        setFollowings(data.followings.length);
      })
      .catch(error => {
        console.error('Error retrieving user data:', error);
      });

    fetch(`http://localhost:8080/post/${userId}`)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
      });
      console.log(posts);
  }, [userId]);

  return (
    <div className="view-page-container">
      {user && (
        <div className="view-user-profile__container">
            <div className="view-user-profile">
                <div className="view-user-profile__header">
                <img
                    style={{ width: '400px', height: '650px', marginTop: 'auto' }}
                    src={user.userProfilePath}
                    className="user-profile__avatar"
                    alt="User Avatar"
                />
                </div>
                <div className="view-user-profile__details-container">
                    <div className="view-user-profile-inner-container">
                        <div className="view-user-profile-name">
                            <div className="view-user-profile__username">
                            {user.username}
                            </div>
                        </div>
                        <div className="view-align">
                            <div className="view-user-profile__details">
                                <div className="view-user-profile__label">Followers</div>
                                <div className="view-user-profile__label">Following</div>
                            </div>
                            <div className="view-user-profile__details">
                            <div className="view-name">{followings}</div>
                            <div className="view-name">{followers}</div>
                            </div>
                        </div>
                        <div className="view-align">
                            <div className="view-user-profile-detail-outer">
                                <div className="view-user-profile-detail-box">
                                    <div className="view-user-profile__details">
                                        <div className="view-user-profile__label Label">
                                            Name
                                        </div>
                                        <div className="view-user-profile__label Label">
                                            Email
                                        </div>
                                    </div>
                                    <div className="view-user-profile__details">
                                        <div className="view-name">{user.fullname}</div>
                                        <div className="view-name">{user.email}</div>
                                    </div>
                                </div>
                                <div className="view-user-bio">{user.bio}</div>
                                <div className="follow-button">
                                    <Link to="#" className="follow-link">
                                        Follow
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Post grid */}
            <Box sx={{ maxWidth: 1700, height: "auto" }}>
              <Grid container spacing={3}>
                {posts.map((post) => (
                  <Grid item key={post.postId} xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Link to={`/post/${post.postId}`}>
                      <div style={{ position: "relative", borderRadius: "5%" }}>
                        <img
                          component="img"
                          alt="Post Image"
                          src={`${post.postPath}?w=248&fit=crop&auto=format`}
                          loading="lazy"
                          style={{ borderRadius: "4%", width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>

        </div>
      )}
    </div>
  );
};

export default UserProfileView;
