import React from "react";
import "./Styles/home.css";
import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";
import axios from "axios";

class Home extends React.Component {

    constructor(){
        super();
        this.state={
            locations:[],
            mealtypes:[]
        }
    }

    componentDidMount(){
        sessionStorage.clear();
        axios({
            method:'GET',
            url:"https://food-hub-backend-ndi9.vercel.app/getAllLocations",
            headers:{'Content-Type':'application/json'}
        })
        .then(response =>{
            // console.log(response)
            this.setState({
                locations:response.data.locations
            })
        })
        .catch(err => console.log(err))


        axios({
            method:'GET',
            url:"https://food-hub-backend-ndi9.vercel.app/getAllMealTypes",
            headers:{'Content-Type':'application/json'}
        })
        .then(response =>{
            // console.log(response)
            this.setState({
                mealtypes:response.data.mealtypes
            })
            // console.log(this.state.mealtypes)
        })
        .catch(err => console.log(err))

    }

    
    render() {

        const {locations, mealtypes} = this.state;

        return (
            <>
        
                <Wallpaper locationsData ={locations}  />
                <QuickSearch 
                    quickSearchData = {mealtypes}
                />
            </>
        )
    }
}

export default Home;