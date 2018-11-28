import React from 'react';
import { Thumbnail } from 'react-bootstrap';
import Ether from '../img/ethereum.png';

class Landing extends React.Component {
    render() {
        return (
            <div className="text-center landing">
                <Thumbnail src={Ether} alt="242x200">
                    <h3>Private Blockchain Tutorial</h3>
                    <p>Login or Sign up to continue</p>
                </Thumbnail>
            </div>
        );
    }
}

export default Landing;