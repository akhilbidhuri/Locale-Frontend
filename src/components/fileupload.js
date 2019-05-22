import React, {Component} from 'react';
import store from '../datastore/store';
import {REQUEST,RESULT_RECIEVED} from '../datastore/actions';
import '../../node_modules/filepond/dist/filepond.min.css';
class fileup extends Component {
    fileReader;
    componentDidMount(){
        const uploadButton = document.querySelector('.browse-btn'); 
        const fileInfo = document.querySelector('.file-info');
        const realInput = document.getElementById('real-input');
        uploadButton.addEventListener('click', () => {
            realInput.click();
          });
          realInput.addEventListener('change', () => {
            const name = realInput.value.split(/\\|\//).pop();
            const truncated = name.length > 20 
              ? name.substr(name.length - 20) 
              : name;
            
            fileInfo.innerHTML = truncated;
          });
    }
    handleFileRead = e =>{
        const content = this.fileReader.result;
        //console.log(content)
        store.dispatch({type:RESULT_RECIEVED, payload: content.split("\n").slice(0, 1000)})
    }
    handleFileChosen = (file) =>{
        store.dispatch({type:REQUEST})
        this.fileReader = new FileReader();
        this.fileReader.onloadend = this.handleFileRead;
        this.fileReader.readAsText(file);
    }
    render(){
        return (
        <div className="cont">
        <h1 className='subheading' style={{textAlign:'center'}}>Upload CSV</h1>
        <div className="input-container">
            <input type="file" accept=".csv" id="real-input" onChange={e => this.handleFileChosen(e.target.files[0])}/>
            <button className="browse-btn">
                Browse Files
            </button>
            <span className="file-info">Upload a file</span>
        </div>
        </div>
        )
    }    
}

export default fileup;