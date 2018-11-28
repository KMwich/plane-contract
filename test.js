const assert = require('assert');
const ganache = require('ganache-cli');
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const provider = ganache.provider({ gasLimit: 8000000 });
const web3 = new Web3(provider);

const codePath = path.resolve(__dirname, "contracts", "planeContract.sol")
const code = fs.readFileSync(codePath, 'utf8')
const { interface , bytecode } = solc.compile(code, 1).contracts[':PlaneContract']

let contract
let accounts

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts()
    contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: '0x' + bytecode, arguments: [accounts]})
        .send({from: accounts[0], gas: 7000000});

    // console.log(await contract.methods.getPlanes().call({from: accounts[0]}))
});

describe('PlaneTest', () => {
    it('deploys a contract', () => {
        assert.ok(contract.options.address);
    });
    it('Get Planes ', async () => {
        const tmp = await contract.methods.getPlanes().call();
        assert.ok(tmp.length === 3 );
    })
    it('Get seats from out of range plane ', async () => {
        try {
            const tmp = await contract.methods.getSeats(3).call();
        } catch(e) {
            assert.ok(e)
        }
    })
    it('Buy Seats out of plane', async () => {
        try {
            const tmp = await contract.methods.buySeat(3,0,0).send({ from: accounts[0], value: 6000 })
        } catch(e) {
            assert.ok(e)
        }
    })
    it('Buy Seats out of seat', async () => {
        try {
            const tmp = await contract.methods.buySeat(0,10,10).send({ from: accounts[0], value: 6000 })
        } catch(e) {
            assert.ok(e)
        }        
    })
    it('Buy Seats invalid price', async () => {
        try {
            const tmp = await contract.methods.buySeat(0,0,0).send({ from: accounts[0], value: 1000 })
        } catch(e) {
            assert.ok(e)
        }        
    })
    it('Buy Seats from reserved seat', async () => {
        const tmp = await contract.methods.buySeat(0,0,0).send({ from: accounts[0], value: 6000 })
        try {
            const tmp = await contract.methods.buySeat(0,0,0).send({ from: accounts[0], value: 6000 })
        } catch(e) {
            assert.ok(e)
        }
    })
});

