import React from "react";
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class MainNav extends React.Component {
    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#home">Plane</a>
                    </Navbar.Brand>
                </Navbar.Header>

                <Nav pullRight>
                    {
                        this.props.userId ?
                            <NavItem eventKey={5} href="#">
                                {this.props.userId}
                            </NavItem>
                            : null
                    }
                    {
                        this.props.userId ?
                            null :
                            <NavItem eventKey={1} onClick={this.props.onLoginClicked}>
                                Login
                            </NavItem>
                    }
                    {
                        this.props.userId ?
                            <NavItem eventKey={4} onClick={this.props.onLogoutClicked}>
                                Log Out
                            </NavItem> 
                            : null
                    }
                </Nav>
            </Navbar>
        );
    }
}

export default MainNav;