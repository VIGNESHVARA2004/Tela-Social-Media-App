import React, { Component } from 'react';
import "./MainPage.css";
import Post from '../Post/Post';
import uploadImage from "../../images/upload.png";
import {storage} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            postArray:[],
            progressBar: "",
         }
    }

    componentDidMount(){
        this.getPost();
    }

    getPost=()=>{ //API
        const thisContext=this;

        fetch('http://localhost:8080/post')
            .then(response => response.json())
            .then(data => {
                thisContext.setState({postArray: data});
        });

        console.log(JSON.parse(localStorage.getItem("users")).username)
    }

    upload=(event)=>{
        let image=event.target.files[0];
        const thisContext=this;
        if(image == null || image == undefined)
            return;
        const StorageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(StorageRef, image);
        //const uploadTask = storage.ref("images").child(image.name).put(image);
        uploadTask.on(
          "state_changed",
          function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            thisContext.setState({progressBar: progress});
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                console.log("unauthorized");
                break;
              case 'storage/canceled':
                console.log("canceled");
                break;
        
              // ...
        
              case 'storage/unknown':
                console.log("unknown reposonse");
                break;
            }
          },
          function () {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                let payload = {
                    "postId": Math.floor(Math.random()*100000).toString(),
                    "userId": JSON.parse(localStorage.getItem("users")).userId,
                    "postPath": downloadURL,
                    "timeStamp": new Date().getTime(),
                    "likeCount": 0,
                    "userName" : JSON.parse(localStorage.getItem("users")).username,
                }
                console.log(payload)
    
                const requestOptions ={
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body : JSON.stringify(payload),
                }
    
                fetch("http://localhost:8080/post",requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    thisContext.getPost();
                })
                .catch(error =>{
    
                })
                
            })
            }
        );
    }
    
    deletePost = (postId) => {
        this.setState(prevState => ({
            postArray: prevState.postArray.filter(post => post.postId !== postId)
          }));
      };
      
    render() { 
        return ( 
            <div>
                <div className="mainpage__container">  
                    <div className="mainpage__divider"></div>
                    <div className="fileupload">
                        <label for="file-upload" >
                            <img className="mainpage__uploadicon" src={uploadImage} />
                        </label>
                         <input onChange={this.upload} id="file-upload" type="file"/>
                     </div>
                    <div className="mainpage__divider"></div>   
                </div>
                <div className="upload_text">{this.state.progressBar}</div>
                {
                    this.state.postArray.map((item,index)=>(
                        <Post id={item.postId} userName={item.userName} postImage={item.postPath} likes={item.likeCount} userId={item.userId} onDeletePost={this.deletePost}/>
                    ))
                }
            </div>
         );
    }
}
 
export default MainPage;