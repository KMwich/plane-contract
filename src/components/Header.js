import React from "react";
import { Jumbotron, FormControl } from 'react-bootstrap';
import { getFlights, getSeats, buySeat } from '../Connect'
import seatImg from './seat.png'
import check from './check.png'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checklist: []}
        this.getFlight()
    }

    getFlight() {
        getFlights(this.props.userId)
            .then(res => {
                var state = this.state;
                state.flights = res
                this.setState(state)
                this.onFlightChange(0)
            })
    }

    onFlightChange(event) {
        if (typeof event !== "number") {
            event = +event.target.value
        }
        getSeats(this.props.userId, event)
            .then(res => {
                console.log(res)
                var state = this.state;
                state.seats = res;
                state.plane = event;
                state.checklist = [];
                this.setState(state);
            })
    }

    selectSeat(e) {
        e = +e.target.id
        var state = this.state
        const index = [Math.floor(e / 4), e % 4, this.state.seats[Math.floor(e / 4)][e % 4].price]

        const i = state.checklist.findIndex(e => index[0] === e[0] && index[1] === e[1])

        if (i === -1) {
            if (state.seats[index[0]][index[1]].forSale) {
                state.checklist.push(index)
            }
        } else {
            state.checklist.splice(i, 1)
        }
        
        this.setState(state)
    }

    buySeat() {
        buySeat(this.props.userId, this.state.plane, this.state.checklist)
            .then(res => this.onFlightChange(this.state.plane))
    }

    render() {
        return (
            <Jumbotron className="header">
                <form>
                    {
                        this.state.flights ? 
                        <FormControl componentClass="select" onChange={e => this.onFlightChange(e)}>
                            {
                                this.state.flights.map((flight, index) => {
                                    return <option key={index} value={index}> {flight} </option>
                                })
                            }
                        </FormControl> : null
                    }
                </form>
                    {
                        this.state.seats ? 
                            <div className="seat">
                                <div className="price">
                                    <h3>Price</h3>
                                    <div>
                                        <img src={seatImg} className="purple" alt="seat"/>
                                        <p>6000</p>
                                    </div>
                                    <div>
                                        <img src={seatImg} alt="seat"/>
                                        <p>4000</p>
                                    </div>
                                </div>
                                {
                                    this.state.seats.map((row, i) => {
                                        return <div key={i} className="seat-row">
                                            {
                                                row.map((column, j) => {
                                                    return <button key={j} id={i * 4 + j} onClick={e => this.selectSeat(e)} disabled={!column.forSale}>
                                                        <img id={i * 4 + j} src={seatImg} className={column.forSale? (column.price === 6000)? 'purple': null : 'gray'} alt="seat"/>
                                                        {
                                                            this.state.checklist.findIndex(e => i === e[0] && j === e[1]) !== -1 ?
                                                            <img src={check} alt="seat" /> : null
                                                        }
                                                    </button>
                                                })
                                            }
                                        </div>
                                    })
                                }
                            </div> : null
                    }
                    {
                        this.state.checklist.length !== 0 ? 
                            <button className="buy" onClick={() => this.buySeat()}>Buy</button>
                            : null
                    }
            </Jumbotron>
        );
    }
}

export default Header;