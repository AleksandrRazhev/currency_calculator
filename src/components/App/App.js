import React, { useState, useEffect } from 'react';

import './App.scss';

const App = (props) => {
  const arrValute = ['usd', 'eur', 'gbp', 'cny', 'jpy', 'czk', 'sek', 'tjs'];

  const [number, setNumber] = useState(props.dollars);

  const arrObjValute = arrValute.map(item => {
    const obj = {};
    obj.valute = item.toUpperCase();
    const [rate, setRate] = useState(null);
    obj.rate = rate;
    obj.setRate = setRate;
    const [name, setName] = useState(null);
    obj.name = name;
    obj.setName = setName;
    const [nominal, setNominal] = useState(null);
    obj.nominal = nominal;
    obj.setNominal = setNominal;
    return obj;
  });

  useEffect(() => {
    console.log('use effect')

    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(response => response.json())
      .then(data => {
        arrObjValute.forEach(item => {
          Object.entries(data.Valute).forEach(i => {
            if (i[0] === item.valute) {
              item.setRate(() => i[1].Value);
              item.setName(() => i[1].Name);
              item.setNominal(() => i[1].Nominal);
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
