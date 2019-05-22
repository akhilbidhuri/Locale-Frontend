import React, {Component} from 'react';
import './App.css';
import FileUp from './components/fileupload';
import {Column} from 'simple-flexbox';
import Result from './components/results';
import { connect } from 'react-redux';
import Loader from './components/loader';
class App extends Component{
render(){
  return (
    <div>
      <Column horizontal="center">
      <h1 className='heading'>Locale.ai</h1>
      <FileUp/>
      {this.props.request &&
      <div style={{marginTop:'3%'}}>
        <Loader/>
      </div>
      }
      {this.props.result.length>0 && 
      <Result result={this.props.result}/>
      }
      </Column>
    </div>
  );
}
}
const mapStateToProps = state => {
  return state
}
export default connect(mapStateToProps)(App);
