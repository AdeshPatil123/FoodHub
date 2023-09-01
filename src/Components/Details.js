import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./Styles/detail.css";
import queryString from "query-string";
import axios from "axios";
import Modal from "react-modal";

const customStyles = {
  content: {
    marginTop: "30px",
    top: "45%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurant: {},
      arr: [],
      thumbnail: [],
      menuItem: [],
      galleryModelIsOpen: false,
      menuModelIsOpen: false,
      orderModelIsOpen: false,
      subTotal: 0,
      myMenu: [],
    };
  }

  componentDidMount = async () => {
    const qs = queryString.parse(this.props.location.search);
    const { restaurants } = qs;
    console.log(restaurants);

    const result = await axios({
      method: "GET",
      url: `https://food-hub-backend-ndi9.vercel.app/getRestaurantById/${restaurants}`,
      headers: { "Content-Type": "application/json" },
    });

    this.setState({ restaurant: result.data.restaurants });
    this.setState({
      arr: result.data.restaurants.cuisine.map((key, value) => {
        return key.name;
      }),
    });
    this.setState({
      thumbnail: result.data.restaurants.thumb.map((i) => {
        return i;
      }),
    });
    console.log(this.state.thumbnail);
    this.state.thumbnail.map((i) => {
      console.log(i);
    });
  };

  handleOrder = async (resID) => {
    console.log(resID);
    const ID = resID;
    const menucard = await axios({
      method: "GET",
      url: `https://food-hub-backend-ndi9.vercel.app/menu/${ID}`,
      headers: { "Content-Type": "application/json" },
    });
    this.setState({
      menuItem: menucard.data.Menu,
      myMenu: menucard.data.mymenu,
      menuModelIsOpen: true,
    });
    // console.log(this.state.myMenu)
  };

  addItems = (index, operation_type) => {
    // console.log(index,operation_type);
    // const {myMenu} = this.state;
    // console.log(myMenu[0][index]);

    console.log(this.state.subTotal);
    let total = 0;
    let { myMenu } = this.state;
    // console.log(myMenu[index])
    // let a = index;
    const items = [...myMenu];
    const item = items[index];
    console.log(item);

    if (operation_type == "add") {
      item.qty = item.qty + 1;
      // console.log(item.qty);
    } else {
      item.qty = item.qty - 1;
      // console.log(item.qty);
    }
    items[index] = item;
    items.map((i) => {
      total += i.qty * i.price;
      console.log(total);
    });
    this.setState({ myMenu: items, subTotal: total });
  };

  handleOrderNow = () => {
    console.log("handle payment");
    this.setState({
      orderModelIsOpen: true,
    });
  };



  // payment start 
  buildForm = (details) => {
    const { action, params } = details;
    if (!params) {
      console.error('No params data provided.');
      return null;
    }
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', action);
    Object.keys(params).forEach(key => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', JSON.stringify(params[key]));
        form.appendChild(input);
    });
    return form;
}

postTheInformationTOPaytm = (info) => {
    const form = this.buildForm(info);
    document.body.appendChild(form);
    form.submit();
    form.remove();
}

getCheckSum = (data) => {
    return fetch(`https://food-hub-backend-ndi9.vercel.app/payment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    }).then(result => {
        return result.json();
    }).catch(err => {
        console.log(err);
    })
}

paymentHandler = () => {
    const data = {
        amount: this.state.subTotal,
        email: 'nilesh687@gmail.com',
        mobileNo: '9999999999',
    };

    this.getCheckSum(data)
        .then(result => {
            let information = {
                action: 'https://securegw-stage.paytm.in/order/process',
                params: result
            }
            this.postTheInformationTOPaytm(information);
        })
        .catch(err => {
            console.log(err);
        })
}

  //payment ends


  render() {
    const {
      restaurant,
      arr,
      thumbnail,
      menuItem,
      myMenu,
      orderModelIsOpen,
      menuModelIsOpen,
      subTotal,
    } = this.state;

    return (
      <>
        <div className="container-fluid crausal1">
          <Carousel showThumbs={false}>
            {thumbnail.map((i) => {
              return (
                <div className="imgcont">
                  <img className="img-2" src={i} />
                </div>
              );
            })}
          </Carousel>
          <h2 className="menuName">{restaurant.name}</h2>
          <div className="btnbox">
            <button
              className="btn-3 btn btn-danger"
              type="button"
              onClick={() => this.handleOrder(restaurant.restaurant_id)}
            >
              Place online Order
            </button>
          </div>

          <div className="tab-wrapper">
            <Tabs selectedTabClassName="tab">
              <TabList>
                <Tab>
                  <b>Overview</b>
                </Tab>
                <Tab>
                  <b>Contact</b>
                </Tab>
              </TabList>

              <TabPanel className="container2">
                <h3 className="phNo">About this place</h3>
                <h4 className="cuisineH">Cuisine</h4>

                <p className="head">
                  {arr.map((item) => {
                    return <span>&nbsp;&nbsp;{item}&nbsp;</span>;
                  })}
                </p>
                <h4>Average cost</h4>
                <p className="address">
                  &#8377;{restaurant.min_price} for two people (approx)
                </p>
              </TabPanel>
              <TabPanel className="container2">
                <h4 className="phNo">Phone Number</h4>
                <p className="Mob">+91 {restaurant.contact_number}</p>
                <h4 id="head">{restaurant.name}</h4>
                <address className="address">
                  Shop1, plotD,{restaurant.locality}
                  <br />, Pune, Maharashtra 411001
                </address>
              </TabPanel>
            </Tabs>
          </div>
        </div>

        <Modal isOpen={menuModelIsOpen} style={customStyles}>
          <div className="menuhead">
            <h3>{restaurant.name}</h3>
            <h4>Sub Total:{subTotal}</h4>
            <button className="btn btn-danger" onClick={this.paymentHandler}>
              Pay Now
            </button>
            <button
              className="remove"
              onClick={() =>
                this.setState({ menuModelIsOpen: false, subTotal: 0 })
              }
            >
              <i class="fa-solid fa-x"></i>
            </button>
          </div>
          <div className="restList row">
            {myMenu.map((elem, index) => {
              return (
                <>
                  <div className="card22">
                    <div className="info">
                      <h3>{elem.name}</h3>
                      <h4>{elem.price}</h4>
                      <p>{elem.desc}</p>
                      {/* {elem.qty} */}
                    </div>
                    <div className="imagecont">
                      <img src={elem.image}></img>
                      {elem.qty == 0 ? (
                        <div>
                          <button
                            className="btn btn-secondary add"
                            onClick={() => this.addItems(index, "add")}
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <div className="addNumber">
                          <button
                            className="btn btn-secondary n1"
                            onClick={() => this.addItems(index, "subtract")}
                          >
                            -
                          </button>
                          <span>{elem.qty}</span>
                          <button
                            className="btn btn-secondary"
                            onClick={() => this.addItems(index, "add")}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </Modal>

        <Modal isOpen={orderModelIsOpen} style={customStyles}>
        <div>
        <button
              className="remove"
              onClick={() => this.setState({ orderModelIsOpen: false })}
            >
              <i class="fa-solid fa-x"></i>
            </button>
        </div>
          <div className="orderhead">
            <h5>{restaurant.name}</h5>
          </div>
          <div className="orderForm">
            <form>
              <input type="text" required placeholder="Name.."/>
              <input type="email" required placeholder="Email.."/>
              <input type="number" required placeholder="Phone Number.."/>
              <input type="text" required placeholder="Address"/>
              <input type="number" value={subTotal}/>
              <input className="btn btn-success" type="submit" value="Proceed"/>
            </form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Details;
