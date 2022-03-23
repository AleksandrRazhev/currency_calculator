import React, { useState, useEffect } from 'react';

import './app.scss';

const App = () => {

  const [valute, setValute] = useState('USD');
  const [number, setNumber] = useState(101);
  const [arrValute] = useState(['usd', 'eur', 'gbp', 'cny', 'jpy', 'czk', 'sek', 'tjs']);
  const [arrObjValute, setArrObjValute] = useState();

  useEffect(() => {
    console.log('use effect')

    const arr = arrValute.map(item => {
      const obj = {};
      obj.valute = item.toUpperCase();
      return obj;
    });

    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(response => response.json())
      .then(data => {
        arr.forEach(item => {
          Object.entries(data.Valute).forEach(i => {
            if (i[0] === item.valute) {
              item.rate = i[1].Value;
              item.name = i[1].Name;
              item.nominal = i[1].Nominal;
            };
          });
        });
        setArrObjValute(st => st = arr);
      });
  }, [arrValute]);

  function calcNumber(nextValute) {
    nextValute = nextValute.toString().toUpperCase();
    const current = arrObjValute.filter(item => item.valute === valute)[0];
    const next = arrObjValute.filter(item => item.valute === nextValute)[0];
    const nextNumber = ((current.rate / current.nominal) / (next.rate / next.nominal)) * number;
    setValute(valute => nextValute);
    setNumber(number => nextNumber.toFixed(2));
  }

  function getValue(e) {
    setNumber(number => number = e.target.value)
    console.log('getValue');
  }

  return (
    <div className="app">
      <form
        className="counter"
        onSubmit={(e) => e.preventDefault()}
      >
        <label>
          <input
            autoFocus
            type="number"
            placeholder='enter number'
            onChange={getValue}
            value={number}
          />
        </label>
      </form>
      <div className="controls">
        {arrValute.map((item, i) => {
          return (
            <button
              key={i}
              style={item.toUpperCase() === valute ? { 'color': '#b71c1c', 'textShadow': '1px 1px 2px' } : null}
              onClick={() => calcNumber(item)}
            >{item.toUpperCase()} </button>
          )
        })}
      </div>
    </div>
  )
}

export default App;
