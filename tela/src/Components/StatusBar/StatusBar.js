import React, { Component } from 'react';
import "./StatusBar.css";
import { Avatar } from '@material-ui/core';
import statusimg from "../../images/pp1.png";
import uploadimage from "../../images/statusadd.png";
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusList: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch('http://localhost:8080/status')
      .then(response => response.json())
      .then(data => {
        this.setState({ statusList: data });
      });
  }

  uploadStatus = (event) => {
    let image = event.target.files[0];
    const thisContext = this;
    if (image === null || image === undefined) return;
    const StorageRef = ref(storage, `status/${image.name}`);
    const uploadTask = uploadBytesResumable(StorageRef, image);
    // Perform your upload logic here
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle progress
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress:', progress);
      },
      (error) => {
        // Handle error
        console.error('Upload error:', error);
      },
      () => {
        // Upload complete
        console.log('Upload complete');
        
        // Get the download URL of the uploaded file
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          
          // Create a new status object
          const payload = {
            "statusId": Math.floor(Math.random()*100000).toString(),
            "userId": JSON.parse(localStorage.getItem("users")).userId,
            "path": downloadURL,
            "userName": JSON.parse(localStorage.getItem("users")).username,
            "timeStamp": new Date().getTime()
          };

          const requestOptions ={
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(payload),
          }

          fetch("http://localhost:8080/status",requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    thisContext.getData();
                })
                .catch(error =>{
    
                })
        });
      }
    );
    // Dummy implementation for demonstration
    setTimeout(() => {
      const statusId = Math.floor(Math.random() * 100000).toString();
      const userId = JSON.parse(localStorage.getItem("users")).uid;
      const timeStamp = new Date().getTime();
      const newItem = {
        statusId,
        userId,
        path: statusimg,
        timeStamp
      };

      this.setState(prevState => ({
        statusList: [newItem, ...prevState.statusList]
      }));
    }, 1000);
  }

  render() {
    return (
      <div>
        <div className="statusbar__container">
          <div className="fileupload">
            <label htmlFor="file-upload-status">
              <img className="statusbar__upload" src={uploadimage} width="55px" height="55px" alt="Upload" />
            </label>
            <input id="file-upload-status" onChange={this.uploadStatus} type="file" />
          </div>
          {this.state.statusList.map((item, index) => (
            <div className="status" key={item.statusId}>
              <Avatar className="statusbar__status" src={item.path} />
              <div className="statusbar__text">{item.userName}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default StatusBar;
