import React, {Component} from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import Leaflet from 'leaflet';
import store from '../datastore/store';
import {REQUEST} from '../datastore/actions'
import Start from '../static/start.png'
import End from '../static/end.png'
import {Row, Column} from 'simple-flexbox'
import CanvasJSReact from './canvasjs-2.3.1/canvasjs.react'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var models = {}
var start = new Leaflet.icon({
    iconUrl: Start,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new Leaflet.Point(30, 20),
});
var end = new Leaflet.icon({
    iconUrl: End,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new Leaflet.Point(30, 20),
});

class map extends Component{
    constructor(props) {
        super(props);
        this.state = {
          points: [],
          indexes:[],
          avg :[],
          mobile: 0,
          online: 0,
          time:[]
        };
      }
    componentWillMount(){
        let np = this.props.points;
        let tcount={};
        np = np.map(i=>i.split(","))
        let indexes = np[0].filter((i)=>
            i.match(/_lat/) || i.match(/_long/)
         )
        indexes = indexes.map(i=>np[0].indexOf(i))
        var x = 0, y = 0, c=0, online = 0, mobile = 0;
        for(let i =1;i<np.length;i++){
            if(!tcount[np[i][9].split(" ")[1].split(":")[0]])
            tcount[np[i][9].split(" ")[1].split(":")[0]] = 1
           else
           tcount[np[i][9].split(" ")[1].split(":")[0]] = tcount[np[i][9].split(" ")[1].split(":")[0]] + 1 
            if(!models[np[i][2]])
             models[np[i][2]] = 1
            else
             models[np[i][2]] = models[np[i][2]] + 1 
            if(np[i][11]==1){
                online++;
            }
            else if(np[i][12]==1){
                mobile++;
            }
            //console.log("online, mobile::",online, mobile)
            //console.log(np[i][indexes[2]], np[i][indexes[2]]!='NULL', np[i][indexes[3]], np[i][indexes[3]]!='NULL')
            if(np[i][indexes[0]]!=='NULL' && np[i][indexes[2]]!=='NULL' && np[i][indexes[1]]!=='NULL' && np[i][indexes[3]]!=='NULL')
            {
                //console.log(x, y)
                c++;
                x += Number(np[i][indexes[0]]) + Number(np[i][indexes[2]]);
                y += Number(np[i][indexes[1]]) + Number(np[i][indexes[3]]);
            }
        }
        x = x/(c*2)
        y = y/(c*2)
        let ct = [];
        for(let i in tcount){
            ct.push({x:i, y:tcount[i]})
        }
        this.setState({time:ct})
        this.setState({online: online, mobile: mobile})
        this.setState({avg:[x, y]})
        this.setState({indexes:indexes})
        this.setState({points:np.slice(1,)})
    }
    componentDidMount(){
        store.dispatch({type:REQUEST})
    }
    render(){
        var dps = [];
        for(let i in models){
            dps.push({label:i, y:models[i]})
        }
        const options2 = {
            width:250,
			theme: "light2", // "light1", "dark1", "dark2"
			animationEnabled: true,
			zoomEnabled: true,
			title: {
				text: "Frequencies of rides at different times"
			},
			axisY: {
				includeZero: false
            },
            axisX:{
                maximum: 24
            },
			data: [{
				type: "area",
				dataPoints: this.state.time
			}]
		}
        const options1 = {
            width: 250,
            height: 300,
			title: {
				text: "Car Models"
            },
            axisX:{
                title:"Car models"
            },
            axisY:{
                title:"Number of cars"
            },
			data: [
			{
				type: "column",
				dataPoints: dps
			}
			]
        }
        const options = {
            width: 250,
			animationEnabled: true,
			title: {
				text: "Mode of Booking"
			},
			subtitles: [{
				text:  (this.state.online/(this.state.online+this.state.mobile)*100)+"% Online",
				verticalAlign: "center",
				fontSize: 24,
				dockInsidePlotArea: true
			}],
			data: [{
				type: "doughnut",
				showInLegend: true,
				indexLabel: "{name}: {y}",
				dataPoints: [
					{ name: "Mobile Site", y: this.state.mobile },
					{ name: "Online", y: this.state.online }
				]
			}]
		}
        return(
            <div style={{margin:'2%'}}>
            <Column style={{width:'100%'}}>
            <Row>
                <Column style={{width:'100%'}}>
                <Map
                center={this.state.avg}
                zoom={10} >
                 <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                    {
                        this.state.points.map(items=>(
                            items[this.state.indexes[0]]!=='NULL' && items[this.state.indexes[1]]!=='NULL' &&
                                <Marker
                                    icon={start}
                                    key={items[this.state.indexes[0]]} 
                                    position = {[items[this.state.indexes[0]], items[this.state.indexes[1]]]}
                                >
                                </Marker>
                        ))
                    }
                    {
                        this.state.points.map(items=>(
                            items[this.state.indexes[2]]!=='NULL' && items[this.state.indexes[3]]!=='NULL' &&
                                <Marker
                                    icon={end}
                                    key={items[this.state.indexes[2]]} 
                                    position = {[items[this.state.indexes[2]], items[this.state.indexes[3]]]}
                                >
                                </Marker>
                        ))
                    }
                </Map>
                <div>
                    <p className="subheading" style={{ fontSize:'110%'}}><span style={{color:'#158eff'}}>Blue</span> Shows pickup points.</p>
                    <p className="subheading" style={{ fontSize:'110%'}}><span style={{color:'#ff5212'}}>Red</span> Shows drop points.</p>
                </div>
                </Column>
                </Row>
                <Row>
                <CanvasJSChart options = {options}
				    /* onRef={ref => this.chart = ref} */
                />
                <CanvasJSChart options = {options1}
                /*onRef={ref => this.chart = ref}*/
			    />
                <CanvasJSChart options = {options2}
                /*onRef={ref => this.chart = ref}*/
			    />
                </Row>                
                </Column>
            </div>
        )
    }
}
export default map;