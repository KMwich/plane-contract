This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `geth --datadir ./eth --miner.gasprice "1" --networkid 2018 --port 30306 --nodiscover --ws --wsapi "db,personal,eth,net,web3,debug" --wsorigins="*"  --wsaddr="localhost" --wsport 8546 console`

Run Go Ethereum on "ws://localhost:8546"