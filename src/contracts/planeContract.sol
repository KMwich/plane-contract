pragma solidity ^0.5.0;

contract PlaneContract {
    address owner;
    mapping (address => uint) public balances;
    
    struct Seat {
        address owner;
        bool forSale;
        uint price;
    }
    
    Seat[40] public seats;
    
    event SeatOwnerChanged(
        uint row,
        uint column
    );
    
    event SeatPriceChanged(
        uint row,
        uint column,
        uint price
    );
    
    event SeatAvailabilityChanged(
        uint row,
        uint column,
        uint price,
        bool forSale
    );
    
    constructor() public {
        owner = msg.sender;
        for (uint i = 0; i < 10; i++) {
            for (uint j = 0; j < 4; j++) {
                seats[i * 4 + j].forSale = true;
                seats[i * 4 + j].price = (i > 3)?4000:6000;
            }
        }
    }
    
    function getSeats() public view returns(address[], bool[], uint[]) {
        address[] memory addrs = new address[](40);
        bool[] memory available = new bool[](40);
        uint[] memory price = new uint[](40);
        
        for (uint i = 0; i < 10; i++) {
            for (uint j = 0; j < 4; j++) {
                addrs[i * 4 + j] = seats[i * 4 + j].owner;
                available[i * 4 + j] = seats[i * 4 + j].forSale;
                price[i * 4 + j] = seats[i * 4 + j].price;
            }
        }
        
        return (addrs, available, price);
    }
    
    function saleOwnerSeat(uint row, uint column, uint price) public {
        Seat storage seat = seats[row * 4 + column];
        
        require(msg.sender == seat.owner && price > 0);
        
        seat.forSale = true;
        seat.price = price;
        emit SeatAvailabilityChanged(row, column, price, true);
    }
    
    function cancelSaleSeat(uint row, uint column) public {
        Seat storage seat = seats[row * 4 + column];
        
        require(msg.sender == seat.owner);
        
        seat.forSale = false;
        emit SeatAvailabilityChanged(row, column, seat.price, false);
    }
    
    function buySeat(uint row, uint column) public payable {
        Seat storage seat = seats[row * 4 + column];
        
        require(msg.sender != seat.owner && seat.forSale && msg.value >= seat.price);
        
        if(seat.owner == 0x0) {
            balances[owner] += msg.value;
        }else {
            balances[seat.owner] += msg.value;
        }
        
        seat.owner = msg.sender;
        seat.forSale = false;
        
        emit SeatOwnerChanged(row, column);
    }
    
    function withdrawFunds() public {
        address payee = msg.sender;
            uint payment = balances[payee];
    
            require(payment > 0);
    
            balances[payee] = 0;
            require(payee.send(payment));
    }
    
    
    function destroy() payable public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }
}