pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

contract PlaneContract {
    address owner;
    
    struct Seat {
        address owner;
        bool forSale;
        uint price;
    }
    
    struct Plane {
        address owner;
        string time;
        Seat[40] seats;
    }
    
    Plane[3] public planes;
    
    event SeatOwnerChanged(
        uint plane,
        uint row,
        uint column
    );
    
    constructor() public {
        owner = msg.sender;
        for (uint p = 0; p < 3; p ++) {
            if (p == 0) {
                planes[p].owner = 0xcc936022fee0ab209ada8f464b0fa9599046d2aa;
                planes[p].time = "10:00 - 11:00";
            } else if (p == 1) {
                planes[p].owner = 0x2d8d79f433665712596cf7ad52bbafc3dabf5724;
                planes[p].time = "12:00 - 13:00";
            } else {
                planes[p].owner = 0x53311a323c5ab9df9ae920dd51ebfd5ca58db82a;
                planes[p].time = "14:00 - 15:00";
            }
            
            for (uint i = 0; i < 10; i++) {
                for (uint j = 0; j < 4; j++) {
                    planes[p].seats[i * 4 + j].forSale = true;
                    planes[p].seats[i * 4 + j].price = (i > 3)?4000:6000;
                }
            }
        }
    }
    
    function getPlanes() public view returns(string[] memory) {
        string[] memory time = new string[](3);
        for (uint p = 0; p < 3; p++) {
            time[p] = planes[p].time;
        }
        
        return (time);
    }
    
    function getSeats(uint index) public view returns(address[] memory, bool[] memory, uint[] memory) {
        address[] memory addrs = new address[](40);
        bool[] memory available = new bool[](40);
        uint[] memory price = new uint[](40);
        
        for (uint i = 0; i < 10; i++) {
            for (uint j = 0; j < 4; j++) {
                addrs[i * 4 + j] = planes[index].seats[i * 4 + j].owner;
                available[i * 4 + j] = planes[index].seats[i * 4 + j].forSale;
                price[i * 4 + j] = planes[index].seats[i * 4 + j].price;
            }
        }
        
        return (addrs, available, price);
    }
    
    function buySeat(uint index, uint row, uint column) public payable {
        Seat storage seat = planes[index].seats[row * 4 + column];
        
        require(msg.sender != seat.owner && seat.forSale && msg.value >= seat.price);
        
        require(((seat.owner == 0x0)? planes[index].owner: seat.owner).send(msg.value));

        seat.owner = msg.sender;
        seat.forSale = false;
        
        emit SeatOwnerChanged(index, row, column);
    }
}