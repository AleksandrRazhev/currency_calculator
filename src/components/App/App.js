import React, { useState, useEffect } from 'react';

import './app.scss';

const arrValute = ['usd', 'eur', 'gbp', 'cny', 'jpy', 'czk', 'sek', 'tjs'];

const arrObjValute = arrValute.map(item => {
  const obj = {};
  obj.valute = item.toUpperCase();
  return obj;
});

const App = (props) => {

  const [number, setNumber] = useState(props.dollars);
  
  useEffect(() => {
    console.log('use effect')

    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(response => response.json())
      .then(data => {
        arrObjValute.forEach(item => {
          Object.entries(data.Valute).forEach(i => {
            if (i[0] === item.valute) {
              item.rate = i[1].Value;
              item.name = i[1].Name;
              item.nominal = i[1].Nominal;
            }
          });
        })
      });
  }, []);

  function calcNumber(valute) {
    valute = valute.toString().toUpperCase();
    arrObjValute.forEach(item => {
      if (valute === item.valute) {
        const usd = arrObjValute.filter(item => item.valute === 'USD')[0].rate;
        setNumber(number => (props.dollars * usd / item.rate * item.nominal).toFixed(2));
      }
    })
  }

  return (
    <div className="app">
      <div className="counter">{number}</div>
      <div className="controls">
        {arrValute.map((item, i) => <button key={i} onClick={() => calcNumber(item)}>{item.toUpperCase()}</button>)}
      </div>
    </div>
  )
}

export default App;
