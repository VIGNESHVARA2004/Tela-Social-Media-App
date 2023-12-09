import React, { Component } from 'react';
import "./MainContent.css";
import Grid  from '@material-ui/core/Grid';
import StatusBar from '../StatusBar/StatusBar';
import MainPage from '../Mainpage/MainPage';
import InfoSection from '../InfoSection/InfoSection';
import Suggestions from '../Suggestions/Suggestions';
import Message from '../Message/Message';


class MainContent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <Grid container cols={5} columGap={3} justifyContent="center">
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <InfoSection />
                        <Suggestions />
                    </Grid>
                    <Grid item xs={4} className="maincontent__container">
                        <div>
                            <StatusBar/>
                            <MainPage/>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <Message/>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            </div>
         );
    }
}
 
export default MainContent;