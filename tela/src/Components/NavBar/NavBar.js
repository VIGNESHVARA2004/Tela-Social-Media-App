import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Grid from '@material-ui/core/Grid';
import Logo from '../imgs/Logo.svg';
import home from '../../images/home.svg';
import message from '../../images/message.svg';
import find from '../../images/find.svg';
import react from '../../images/love.svg';
import Avatar from '@material-ui/core/Avatar';
import pp from '../../images/pp1.png';

class NavBar extends Component {
  state = {
    searchValue: '',
    searchResults: [],
  };

  handleSearchChange = (event) => {
    const searchValue = event.target.value;
    this.setState({ searchValue });

    if (searchValue.length >= 1) {
      fetch(`http://localhost:8080/search?keyword=${searchValue}`)
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error('Search request failed');
          }
          return response.json();
        })
        .then((data) => {
          const searchResults = data;
          console.log(data);
          this.setState({ searchResults });
        })
        .catch((error) => {
          console.error('Error occurred during user search:', error);
        });
    } else {
      this.setState({ searchResults: [] });
    }
  };
  handleSearchResultClick = () => {
    this.setState({ searchValue: '', searchResults: [] });
  };

  render() {
    const { searchValue, searchResults } = this.state;

    return (
      <div>
        <div className="navbar__barContent">
          <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={3}>
              <Link to="/" className="navbar__link"> 
                <img className="navbar_logo" src={Logo} width="60px" alt="Logo" />
              </Link>
            </Grid>
            <Grid item xs={3}>
              <form>
                <input
                  type="text"
                  className="navbar__searchBar"
                  placeholder="Search"
                  value={searchValue}
                  onChange={this.handleSearchChange}
                />
              </form>
            </Grid>
            <Grid item xs={3} style={{ display: 'flex' }}>
              <Link to="/MainContent" className="navbar__link"> 
                <img className="navbar__img" src={home} width="25px" alt="Home" />
              </Link>
              <Link to="/Message" className="navbar__link"> 
                <img className="navbar__img" src={message} width="25px" alt="Message" />
              </Link>
              <img className="navbar__img" src={find} width="25px" alt="Find" />
              <Link to="/Notification">
              <img className="navbar__img" src={react} width="25px" alt="React" />
              </Link>
              <Link to="/user-profile" className="navbar__link"> 
                <Avatar
                  src={pp}
                  className="navbar__img"
                  style={{ maxWidth: '25px', maxHeight: '25px' }}
                  alt="Profile"
                />
              </Link>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </div>
        <div className="searchResults">
          {searchResults.map((user) => (
            <div key={user.id}>
              <Link to={`/user/${user.userId}`} className="userLink" onClick={this.handleSearchResultClick}>
                <Avatar src={user.userProfilePath} className="userAvatar" alt={user.name} />
                <span>{user.username}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default NavBar;
