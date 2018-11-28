const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const express = require('express');
const ganache = require('ganache-cli');

var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    next();
});

const provider = ganache.provider({ gasLimit: 8000000 });
const web3 = new Web3(provider);

let contract;

const codePath = path.resolve(__dirname, "contracts", "planeContract.sol")
const code = fs.readFileSync(codePath, 'utf8')
const {bytecode,interface} = solc.compile(code, 1).contracts[':PlaneContract']

web3.eth.getAccounts().then(accounts => {
    console.log(accounts);
    (new web3.eth.Contract(JSON.parse(interface)).deploy({data: '0x' + bytecode, arguments: [accounts]}).send({from: accounts[0], gas: 8000000}))
        .then(res => {
            contract = res
            app.listen(8080, () => console.log(`listening on port 8080!`))
        }).catch(err => console.log(err))
})

app.post('/login', (req, res) => {
    web3.eth.getAccounts()
        .then(accounts => {
            if (accounts.includes(req.body.address)) {
                res.sendStatus(200)
            } else {
                res.sendStatus(403)
            }
        }).catch(err => res.sendStatus(403))
})

app.post('/flights', (req, res) => {
    contract.methods.getPlanes().call({ from: req.body.address })
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            console.error(err)
        })
})

app.post('/getSeats', (req, res) => {
    contract.methods.getSeats(req.body.plane).call({ from: req.body.address })
        .then(result => {
            var row = []
            for(var i = 0; i < 10; i++) {
                var column = []
                for(var j = 0; j < 4; j++) {
                    column.push({address: result[0][i * 4 + j] , forSale: result[1][i * 4 + j], price: +result[2][i * 4 + j]})
                }
                row.push(column)
            }
            res.status(200).send(row)
        }).catch(err => {
            console.error(err)
        })
})

app.post('/buySeat', (req, res) => {
    var count = 0
    req.body.seats.forEach(seat => {
        contract.methods.buySeat(req.body.plane, seat[0], seat[1]).send({ from: req.body.address, value: seat[2] })
            .then(result => {
                count++
                if (count === req.body.seats.length) {
                    res.sendStatus(200)
                }
            }).catch(err => {
                count++
                if (count === req.body.seats.length) {
                    res.sendStatus(200)
                }
            })
    })
})
