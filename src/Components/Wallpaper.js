import axios from "axios";
import React from "react";
import { withRouter } from "react-router-dom";

const container1 = {
    "height":"500px",
    "background": "url('./Assets/banner.avif') no-repeat center/cover"
}

class Wallpaper extends React.Component{
    constructor(){
        super();
        this.state = {
            restaurants:[],
            inputText:'',
            suggestations:[],
            restName:''
        }
    }

    handleLocation = async (event)=>{
        const locationId = event.target.value;
        sessionStorage.setItem("locationId",locationId)
        console.log(locationId);
        const response =await axios({
            method:'GET',
            url:`https://food-hub-backend-ndi9.vercel.app/restaurant/${locationId}`,
            headers:{'Content-Type':'application/json'}
        })
            this.setState({restaurants : response.data.restaurants})
        
    }

    handleSearch = (event)=>{
        let inputText = event.target.value;
        const { restaurants } = this.state;
        const suggestations = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));

        // const suggestations = restaurants.filter(item => item.name.toLowerCase() ===(inputText.toLowerCase()));

        this.setState({suggestations:suggestations , inputText:inputText});

        console.log(this.state.suggestations , this.state.inputText);
    }

    showSuggestion = ()=>{
        const {suggestations, inputText } = this.state;

        if(suggestations.length == 0 && inputText == undefined){
            return null;
        }
        if(suggestations.length >0 && inputText==''){
            return null;
        }
        if(suggestations.length == 0 && inputText){
            return <ul style={{zIndex:"1000"}}>
                <li className="list-group-item">No  search found</li>
            </ul>
        }

        return(
            <ul>
                {
                    suggestations.map((item,index)=>(<li className="list-group-item li1" key={index} style={{zIndex:"1000"}} onClick={()=>this.selectingRestaurant(item)}>{item.name}-{item.locality},{item.city}</li>))
                }
            </ul>
        )
    }

    selectingRestaurant = (resObj)=>{
        console.log('detail')
        this.props.history.push(`/details?restaurants=${resObj._id}`)
    }

    
    render(){

        

        const {locationsData} = this.props;
        // console.log(locationsData)

        return(
            <>
             <div className="container-fluid container1" style={container1}>

                <div className="row d-flex justify-content-center align-items-center" style={{ "height": "100%" }}>
                        <div
                            className="col-xl-8 col-lg-9 col-md-10 col-sm-12 py-5 d-flex flex-column justify-content-center align-items-center content1">
                            <div className="logo1 mb-3">
                            <h2><span>Food</span>Hub</h2>
                            </div>
                            <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                            <div className=" row col-12 d-flex justify-content-around p-2">

                                <div className="col-xl-6 col-lg-6 col-md-10 col-sm-12 mb-2">
                                    <select className="form-select locations" onChange={this.handleLocation} >
                                        <option value="caption">--select city--</option>
                                        {locationsData.map((item)=>{
                                            return <option value={item.location_id}>{item.name},{item.city}</option>
                                        })}
                                        

                                    </select>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-10  col-sm-12  mb-2">

                                    <span style={{ "position": "absolute", "paddingLeft": "1.2rem", "marginTop": "7px" }}>
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <input type="search" id="srh" className="form-control me-2" placeholder="search for restaurant" onChange={this.handleSearch} />
                                    {this.showSuggestion()}
                                </div>

                            </div>
                        </div>
                    </div>
             </div>
            </>
        )
    }
}

export default withRouter(Wallpaper);