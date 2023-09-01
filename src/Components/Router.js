import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Filter from "./Filter";
import Details from "./Details";
import Nav1 from "./Nav1";




function Router(){
    return(
        <BrowserRouter>
        <Route path="*" component={Nav1} />
            <Route exact path="/" component={Home} />
            <Route path="/filter" component={Filter} />
            <Route path="/details" component={Details} />

        </BrowserRouter>
    )
}
    
export default Router;