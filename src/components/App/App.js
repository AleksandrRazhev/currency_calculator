import React, { useState, useEffect } from 'react';

import './app.scss';

const App = () => {

  const [valute, setValute] = useState('USD');
  const [money, setMoney] = useState(139.98);
  const [number, setNumber] = useState(money);
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

  function calcNumber(valute) {
    valute = valute.toString().toUpperCase();
    arrObjValute.forEach(item => {
      if (valute === item.valute) {
        const usd = arrObjValute.filter(item => item.valute === 'USD')[0].rate;
        setNumber(number => (money * usd / item.rate * item.nominal).toFixed(2));
        setValute(valute => item.valute);
      }
    })
  }

  function getValue(e) {
    const rate = arrObjValute.filter(item => valute === item.valute)[0].rate;
    const nominal = arrObjValute.filter(item => valute === item.valute)[0].nominal;
    const usdRate = arrObjValute.filter(item => 'USD' === item.valute)[0].rate;;
    const calculated = rate * e.target.value / usdRate / nominal;

    setMoney(money => money = calculated)
  }

  return (
    <div className="app">
      <div className="counter">{number}</div>
      <form
        className="counter"
        onSubmit={(e) => e.preventDefault()}
      >
        <label>
          <input
            autoFocus
            type="number"
            placeholder='enter number'
            onBlur={(event) => getValue(event)}
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
