import React, { Component } from 'react';
import { Avatar, Grid, Card, CardMedia, Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import './UserProfile.css';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
import PostView from '../PostView/PostView';
import Masonry from 'react-masonry-css'
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: [],
      followers: 0,
      followings: 0,
      showPostView: false,
      editMode: false,
      editedUser: {
        fullname: '',
        email: '',
        bio: ''
      }
    };
  }

  componentDidMount() {
    // Fetch user data, user posts, followers, and followings
    this.fetchUserData();
    this.fetchUserPosts();
    this.fetchFollowersCount();
    this.fetchFollowingsCount();
    
  }

  fetchUserData = () => {
    // Perform an API call to fetch user data
    const userId = JSON.parse(localStorage.getItem("users")).userId; // Assuming the user ID is passed as a prop
    fetch(`http://localhost:8080/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ user: data, editedUser: { fullname: data.fullname, email: data.email, bio: data.bio } });
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  fetchUserPosts = () => {
    // Perform an API call to fetch user posts
    const userId = JSON.parse(localStorage.getItem("users")).userId; // Assuming the user ID is passed as a prop
    fetch(`http://localhost:8080/post/${userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ posts: data });
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
      });
  }

  fetchFollowersCount = () => {
    // Perform an API call to fetch the number of followers for the user
    const userId = JSON.parse(localStorage.getItem("users")).userId; // Assuming the user ID is passed as a prop
    fetch(`http://localhost:8080/${userId}/followers`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ followers: data.length });
      })
      .catch(error => {
        console.error('Error fetching followers count:', error);
      });
  }

  fetchFollowingsCount = () => {
    // Perform an API call to fetch the number of followings for the user
    const userId = JSON.parse(localStorage.getItem("users")).userId; // Assuming the user ID is passed as a prop
    fetch(`http://localhost:8080/${userId}/following`)
      .then(response => response.json())
      .then(data => {
        this.setState({ followings: data.length });
      })
      .catch(error => {
        console.error('Error fetching followings count:', error);
      });
  }

  handleImageUpload = event => {
    const image = event.target.files[0];
  
    if (image === null || image === undefined) return;
  
    const StorageRef = ref(storage, `profile/${image.name}`);
    const uploadTask = uploadBytesResumable(StorageRef, image);
    const userId = JSON.parse(localStorage.getItem("users")).userId;
    
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Handle progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress:', progress);
      },
      error => {
        // Handle error
        console.error('Upload error:', error);
      },
      () => {
        // Upload complete
        console.log('Upload complete');
  
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          console.log('File available at', downloadURL);
  
          // Create a new status object
          const payload = {
            "email" : this.state.user.email,
            "fullname" :this.state.user.fullname,
            "password" : this.state.user.password,
            "userId" : this.state.user.userId,
            "username" : this.state.user.username,
            "bio" : this.state.user.bio,
            "userProfilePath" : downloadURL,
          };
  
          const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          };
  
          fetch(`http://localhost:8080/put/${userId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data);
            })
            .catch(error => {});

            fetch(`http://localhost:8080/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ user: data });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        });
      }
    );
  }
  togglePostView = () => {
    this.setState(prevState => ({
      showPostView: !prevState.showPostView
    }));
  }

  handleSaveChanges = () => {
    const { user, editedUser } = this.state;
    const userId = JSON.parse(localStorage.getItem("users")).userId;
  
    const payload = {
      ...user,
      bio:editedUser.bio,
      fullname: editedUser.fullname,
      email: editedUser.email,
      // Add other fields that you want to update
    };
    console.log(payload);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
  
    fetch(`http://localhost:8080/put/${userId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.toggleEditMode();
        // Handle successful update
      })
      .catch(error => {
        console.error('Error updating user details:', error);
        // Handle error
      });
  }

  toggleEditMode = () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode
    }));
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      editedUser: {
        ...prevState.editedUser,
        [name]: value
      }
    }));
    console.log(this.state.editedUser);
  }

  handleFollowUser = () => {
    const { user } = this.state;
    const userId = JSON.parse(localStorage.getItem("users")).userId;
    const userIdToFollow = user.id; // Assuming user id is available in the user object

    fetch(`http://localhost:8080/users/${userId}/follow?userIdToFollow=${userIdToFollow}`, {
      method: 'POST',
    })
      .then(() => {
        this.fetchFollowersCount(); // Update followers count
      })
      .catch(error => {
        console.error('Error following user:', error);
      });
  }

  handleUnfollowUser = () => {
    const { user } = this.state;
    const userId = JSON.parse(localStorage.getItem("users")).userId;
    const userIdToUnfollow = user.id; // Assuming user id is available in the user object

    fetch(`http://localhost:8080/users/${userId}/unfollow?userIdToUnfollow=${userIdToUnfollow}`, {
      method: 'POST',
    })
      .then(() => {
        this.fetchFollowersCount(); // Update followers count
      })
      .catch(error => {
        console.error('Error unfollowing user:', error);
      });
  }

  render() {
    const { user, posts, followers, followings, showPostView, editMode, editedUser } = this.state;
    const breakpointColumnsObj = {
      default: 3,
      1100: 3,
      700: 2,
      500: 1
    };
    // Render a loading state while data is being fetched
    if (!user || !posts) {
      return <div>Loading...</div>;
    }

    const isCurrentUser = user.userId === JSON.parse(localStorage.getItem("users")).userId;

    return (
      <div className="page-container">
        <div className="user-profile__container">
          <div className='user-profile'>
            {/* User profile header */}
            <div className="user-profile__header">
              <label className='avatar-box' htmlFor="avatar-upload">
                <img style={{ width: '400px', height: '650px',marginTop:"auto" }} src={user.userProfilePath} className="user-profile__avatar" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={this.handleImageUpload}
                />
              </label>
            </div>

            {/* User details */}
            <div className="user-profile__details-container">
              <div className="user-profile-inner-container">
                <div className='user-profile-name'>
                  <div className="user-profile__username">{user.username}</div>
                  <div style={{justifyContent:"center", alignItems:"center", marginTop:"5px"}}>
                    {isCurrentUser && !editMode ? (
                      <div className="user-profile__edit-profile">
                        <IconButton onClick={this.toggleEditMode} >
                          <EditIcon />
                        </IconButton>
                      </div>
                    ) : isCurrentUser && editMode ? (
                      <div className="user-profile__edit-profile">
                        <IconButton onClick={this.handleSaveChanges}>
                          <SaveIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div className="user-profile__follow-actions">
                        <Button variant="contained" color="primary" onClick={this.handleFollowUser}>Follow</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleUnfollowUser}>Unfollow</Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='align'>
                  <div className="user-profile__details">
                    <div className="user-profile__label">Followers </div>
                    <div className="user-profile__label">Following </div>
                  </div>
                  <div className="user-profile__details">
                    <div className="name">{followings}</div>
                    <div className="name">{followers}</div>
                  </div>
               </div>
               <div className='align'>
                  {editMode ? (
                    <React.Fragment>
                      <div className="user-profile__details">
                        <div className="user-profile__label Label">Name: </div>
                        <input
                          type="text"
                          name="fullname"
                          value={editedUser.fullname}
                          onChange={this.handleInputChange}
                        />
                      </div>
                      <div className="user-profile__details">
                        <div className="user-profile__label Label">Email: </div>
                        <input
                          type="text"
                          name="email"
                          value={editedUser.email}
                          onChange={this.handleInputChange}
                        />
                      </div>
                      <div className="user-profile__details">
                        <div className="user-profile__label Label">Bio: </div>
                        <input
                          type="text"
                          name="bio"
                          value={editedUser.bio}
                          onChange={this.handleInputChange}
                        />
                      </div>
                      {/* Add more user details here */}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className='user-profile-detail-outer'>
                        <div className='user-profile-detail-box'>
                          <div className="user-profile__details">
                            <div className="user-profile__label Label">Name </div>
                            <div className="user-profile__label Label">Email </div>
                          </div>
                          <div className="user-profile__details">
                            <div className="name">{user.fullname}</div>
                            <div className="name">{user.email}</div>
                          </div>
                        </div>
                        <div className='user-bio'>
                          <div>{user.bio}</div>
                        </div>
                      </div>
                      {/* Add more user details here */}
                    </React.Fragment>
                  )}
                </div>
              </div> 
            </div>
          </div> 

          {/* Post grid */}
          <Box sx={{ maxWidth: 1700, height: "auto" }}>
            <ImageList variant="masonry" sx={{ columnCount: { md: '3 !important', lg: '5 !important', xl: '6 !important' } }} gap={15}>
              {posts.map((post) => (
                <Link to={`/post/${post.postId}`} key={post.postId}>
                  <ImageListItem style={{ borderRadius: "5%" }}>
                    <img
                      component="img"
                      alt="Post Image"
                      src={`${post.postPath}?w=248&fit=crop&auto=format`}
                      loading='lazy'
                      style={{ borderRadius: "4%" }}
                    />
                  </ImageListItem>
                </Link>
              ))}
            </ImageList>
          </Box>
        </div>

        {/* Toggle PostView component */}
        {showPostView && (
          <PostView togglePostView={this.togglePostView} />
        )}
      </div>
    );
  }
}

export default UserProfile;