import React, { Component } from 'react';
import "./InfoSection.css";
import { Avatar } from '@material-ui/core';
import imageSrc from "../../images/pp1.png"

class InfoSection extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    componentDidMount() {
        // Retrieve user details from local storage
        const userDetails = localStorage.getItem("users");
        if (userDetails) {
            const { username, userProfilePath, Bio } = JSON.parse(userDetails);
            this.setState({ username, userProfilePath, Bio});
        }
    }
    render() { 
        return ( 
        <div>
            <div className="info__container">
                <Avatar 
                    src={this.state.userProfilePath} 
                    className="info__image"
                    sx={{ objectFit: "contain" }} // Set objectFit to "contain"
                />
                <div className="info_content">
                    <div className="info_username">{this.state.username}</div>
                    <div className="info_description"> {this.state.Bio}</div>
                </div>
            </div>
        </div> );
    }
}
 
export default InfoSection;
