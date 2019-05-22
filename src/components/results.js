import React, {Component} from 'react'
import Map from './map'
class result extends Component{

    render(){
        return(
            <div className="cont" style={{marginTop:'5%', marginBottom:'5%',  width:'90vw'}}>
                <h1 className="heading" style={{textAlign:'center'}}>Results</h1>
                <Map points={this.props.result}/>
            </div>
        )
    }
}
export default result;