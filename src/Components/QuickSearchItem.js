import React from "react";
import "./Styles/home.css";
import { withRouter } from "react-router-dom";

const container1 = {
  height: "500px",
  background: "url('./Assets/banner.avif') no-repeat center/cover",
};

class QuickSearchItem extends React.Component {
    handleNavigate = (mealtype_id,name) => {
        const locationId = sessionStorage.getItem('locationId');
        console.log(locationId);
        if(locationId){
          this.props.history.push(`/filter?mealtype=${mealtype_id}&name=${name}&location=${locationId}`);
        }else{

          this.props.history.push(`/filter?mealtype=${mealtype_id}&name=${name}`);
        }

        
      };
  render() {
    const {name , image , content,mealtype_id} = this.props.quickSearchItemData;
    return (
      <>
        <div
          className="col-xl-4 col-lg-4 col-md-6 col-sm-11"
          onClick={()=>this.handleNavigate(mealtype_id,name)}
        >
          <div className="card">
            <img src={image} alt="image not found" />
            <div className="content1 p-2">
              <h2>{name}</h2>
              <p>{content}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(QuickSearchItem);
