/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import * as dotenv from 'dotenv';
dotenv.config();
import WebSocket from 'ws';
import { AppConfig } from './constants/Constants';
import { TradeData } from './types/TradeData';

// const wss = new WebSocket("wss://api.bitkub.com/websocket-api/market.trade.thb_btc,market.ticker.thb_btc,market.trade.thb_eth,market.ticker.thb_eth",{
//       headers : {
//         token: "xxx"
//       }
//   });

let symbol = ['doge', 'btc', 'eth', 'kub'];
let isTicker = false;
var ss = symbol.map((v) => {
  let types = isTicker ? 'ticker' : 'trade';
  return `market.${types}.thb_${v.toLowerCase()}`;
});

const wss = new WebSocket(`${AppConfig.API_URL}/${ss.join(',')}`, {
  headers: {
    token: 'xx',
  },
});

wss.onopen = () => {
  console.log('connect webSocket');
};

wss.onerror = (error: any) => {
  console.error('WebSocket Error ' + JSON.stringify(error, null, 4));
};
wss.onmessage = (e: any) => {
  var count = (e.data.match(/{/g) || []).length;
  console.log(`indexOff: ${count}`);
  if (count > 1) {
    // sometime server return array not standard
    var resF = JSON.parse(`[${e.data.replace('}\n', '},')}]`);
    resF.forEach((v: TradeData) => {
      console.log(new Date());
      console.log(`<<<<<<<<<< ${v.stream} >>>>>>>>>>`);
      console.log(JSON.stringify(v, null, 4));
    });
  } else {
    var res = JSON.parse(e.data) as TradeData;
    console.log(new Date());
    console.log(`<<<<<<<<<< ${res.stream} >>>>>>>>>>`);
    console.log(JSON.stringify(res, null, 4));
  }
};

wss.on('connection', function connection() {
  console.log('connection');
});

wss.on('close', function close() {
  console.log('disconnected');
});

// Ref : https://github.com/bitkub/bitkub-official-api-docs/blob/master/websocket-api.md
