//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/Context.sol";

/// @title A title that should describe the contract/interface
/// @author fatolu pelumi
/// @notice It allows to create a piggy bank where you can save your assets and withdraw at a predefined time
/// @dev timestamp in seconds

contract KoloContract is Context{
 
    struct Kolo {
        address payable koloOwner;
        uint koloStartDate;
        uint koloDuration;
        uint koloAmount;
        bool status;
    }

    uint public koloId = 1;

    mapping(uint => Kolo)  Kolos;

    event KoloCreated(uint _koloId, address _koloOwner, uint _duration);
    event Deposit(uint _koloId, uint PreviousBalance, uint CurrentBalance);
    

    function createKolo(uint _koloDuration) public payable returns(uint){
        uint id = koloId;
        Kolo storage _kolo = Kolos[id];
        _kolo.koloStartDate = block.timestamp;
        _kolo.koloDuration = _koloDuration;
        //_kolo.koloAmount = msg.value;
        _kolo.koloOwner = payable(_msgSender());
        _kolo.status = true;

        koloId++;

        emit KoloCreated(id,_msgSender(), _koloDuration);
       
        return id;
    }

    function depositToKolo(uint _koloId) public payable{
        require(koloId > _koloId, "koloId must exist");
        require(Kolos[_koloId].status == true, "cannot deposit to a closed kolo");
        uint amount = msg.value;
        uint previousBalance = Kolos[_koloId].koloAmount;
        uint currentBalance = previousBalance + amount;
        Kolos[_koloId].koloAmount = currentBalance;

        emit Deposit(_koloId, previousBalance, currentBalance);
    }

    function withdraw(uint _koloId) public payable returns(bool) {
        require(koloId > _koloId, "koloId must exist");
        require(Kolos[_koloId].status == true, "Kolo is closed");
        require(block.timestamp >= Kolos[_koloId].koloDuration, "cannot withdraw until after kolo expires");
        require(msg.sender == Kolos[_koloId].koloOwner, "only owner of kolo can call this function");
        uint amount = Kolos[_koloId].koloAmount;
        address payable owner = Kolos[_koloId].koloOwner;
        owner.transfer(amount);
        Kolos[_koloId].status = false;

        return true;
    }

    function viewKolo(uint _koloId) public view returns(Kolo memory){
        Kolo memory kolo = Kolos[_koloId];
        return kolo;
    }

    
}