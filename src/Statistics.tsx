import React, { useEffect, useMemo, useRef, useState } from 'react';

import './App.css';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {AutoSizer, List} from 'react-virtualized';
import axios from 'axios';
import { log } from 'console';
import { loadSelected, removeSelected, saveSelected } from './selected';
import ReactSlider from 'react-slider';
import ItemRow from './ItemRow';
import { Statistic } from './types/Statistic';
// @ts-ignore
import { LineChart } from '@mui/x-charts/LineChart';
import { AxisConfig, ChartsXAxisProps, MakeOptional, ScaleName } from '@mui/x-charts/internals';
import { LineSeriesType } from '@mui/x-charts';

const getStr = (d: Date) => {
  return `${(d.getDate()).toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear().toString()}`;
}

const length = 17;
function Statistics() {
  const [dates, setDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(getStr(new Date()));
  const [data, setData] = useState<Statistic[]>([]);
  const [valueDate, setValueDate] = useState(0);
  
  useEffect(() => {
    const handle = async (data: string) => {
      const res = await axios(`http://localhost:3001/statistic/${currentDate}`)   
      console.log('res', res);
       
      const arr = res.data as Statistic[];

      setData(arr);
      if(getStr(new Date()) === currentDate) {
        setValueDate(Date.now() - 4 * 60 * 60 * 1000);
      }
      else {
        setValueDate(0);
      }
    }
    
    if(currentDate === '') {
      return;
    }

    document.title = 'static ' + currentDate;
    handle(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const d = new Date();
     d.setDate(d.getDate() -length);

    const arr = Array.from({
      length: length
     })
      .map((_ , i) => {
          d.setDate(d.getDate() + 1); 

          return getStr(d)
      });

      setDates(arr);
  }, []);


    return <div>
    <div className='dates'>
      {
        dates.map(date => {
          return <button style={{
            backgroundColor: date === currentDate ? '#611231' : undefined,
            color:  date === currentDate ? 'white' : undefined,
          fontSize:  date === currentDate ? '22px' : undefined,
          }} onClick={() => {
            setCurrentDate(date)
          }} key={date}>{date}</button>
        })
      }
    </div>
    <BlackStatic valueDate={valueDate} setValueDate={n => {
      setValueDate(n);
    }} currentDate={currentDate} key={5} defaultData={data} time={7 * 60 * 1000} />
    <BlackStatic valueDate={valueDate} setValueDate={n => {
      setValueDate(n);
    }}  currentDate={currentDate} key={30} defaultData={data} time={20 * 60 * 1000} include={{
      buys: true,
      profitTokens: true,
      tokens: true,
      percentage: true,
      traders: false,
    }} />
     <BlackStatic valueDate={valueDate} setValueDate={n => {
      setValueDate(n);
    }} currentDate={currentDate} key={5} defaultData={data} time={45 * 60 * 1000} />
    </div>
}

type Props = {
  defaultData: Statistic[];
  time: number;
  include?: {
    tokens?: boolean;
    profitTokens?: boolean;
    buys?: boolean;
    traders?: boolean;
    percentage?: boolean;
    intersection?: boolean;
  };
  currentDate: string;
  valueDate: number;
  setValueDate: (n: number) => void;
}

type Chart1 = {
  [name: string]: {
    time: number;
    tokens: number;
    profitTokens: number;
    buys: number;
    traders: Set<string> | string[];
    mc: number;
    intersection: number;
  }
}

const BlackStatic = ({defaultData, currentDate, time,setValueDate, valueDate, include = {
  buys: true,
  percentage: true,
  profitTokens: true,
  tokens: true,
  traders: true,
  intersection: false,
}}: Props) => {
  const [data, setData] = useState(defaultData);
  const [isFarm, setIsFarm] = useState(true);
  const [isUnique, setIsUnique] = useState(false);
  const [mc, setMc] = useState(36);
  const [chart1, setChart1] = useState<Chart1>({});
  const {maxDate, minDate} = useMemo(() => {
    const [d, m, y] = currentDate.split('.').map(a => +a);
    const min = new Date();
    min.setFullYear(y);
    min.setMonth(m - 1);
    min.setDate(d - 1);
    min.setHours(23, 50, 0, 0);

    const max = new Date();
    max.setFullYear(y);
    max.setMonth(m - 1);
    max.setDate(d);
    max.setHours(23, 59, 59, 0);

    setValueDate(min.getTime());
    
    return {
      maxDate: max,
      minDate: min
    }
  }, [currentDate]);

  useEffect(() => {
    const result = data.reduce((a, b) => {
      const creation = +b.creation;
      const diff = creation % time;
      const res = creation - diff;

      if(a[res]) {
        a[res].tokens += 1;
        a[res].buys += b.buys;
        a[res].mc += (b.mc >= mc ? b.mc : 0)
        a[res].profitTokens += (b.mc >= mc ? 1 : 0);
        a[res].traders = isUnique ? new Set([ ...a[res].traders, ...b.traders ]) : [ ...a[res].traders, ...b.traders ];
        a[res].intersection += b.intersection;
      }
      else {
        a[res] = {
          tokens: 1,
          time: res,
          profitTokens: b.mc >= mc ? 1 : 0,
          buys: b.buys,
          traders: isUnique ? new Set(b.traders) : b.traders,
          mc: b.mc,
          intersection: b.intersection,
        }
      }

      return a;
    }, {} as Chart1);
    
    setChart1(result);
  }, [time, data, mc, isUnique]);

  useEffect(() => {
    console.log('isFarm, defaultData, valueDate');
    
    setData(defaultData.filter(item => {
      if(+item.creation < valueDate) {
        return false;
     }
      return isFarm ? true : item.isFarm === false;
    }))
  }, [isFarm, defaultData, valueDate]);

  const chart1Data = React.useMemo(
    () => {
      const xAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[] = [
        {
          data: Object.values(chart1).map(item => item.time),
          valueFormatter(value, context) {
            const date = new Date(value);
            return date.toLocaleTimeString();
          },
          
        }
      ];

      const series: any[] = [
      ];


      if(include.intersection) {
        series.push({
          data: Object.values(chart1).map(item => item.intersection / item.tokens),
          label: 'Intersection',
          color: 'black'
        })
      }

      if(include.buys) {
        series.push({
          data: Object.values(chart1).map(item => item.buys / item.tokens),
          label: 'Buys',
          color: '#007f0d66'
        })
      }
      if(include.percentage) {
        series.push({
          data: Object.values(chart1).map(item => item.profitTokens * 100  / item.tokens),
          label: 'Percentage',
          color: '#f18b37'
        })
      }
      if(include.profitTokens) {
        series.push({
          data: Object.values(chart1).map(item => item.profitTokens),
          label: 'Profit Tokens',
          color: '#02e1fd'
        })
      }
      if(include.tokens) {
        series.push({
          data: Object.values(chart1).map(item => item.tokens),
          label: 'Tokens',
          color: '#cdd4ce'
        })
      }
      
      if(include.traders) {
        series.push({
          data: Object.values(chart1).map(item => (isUnique ? item.traders.size : item.traders.length)  / item.profitTokens),
          label: 'Traders',
          color: '#ad82cc66'
        })
      }

      return {
        xAxis, series
      }
    },
    [chart1]
  )

  return (
    <div
    style={{
      marginRight: '20px',
      marginLeft: '20px'
    }}
  >
    <label> <input  style={{
      left: '10px',
      width: '100px',
      height: '30px',
     }}  type='checkbox' checked={isFarm} onChange={e => {
        setIsFarm(!isFarm);
     }} />{isFarm ? 'Фарм токени вкл' : 'Фарм токени викл'}</label>
   
    <label> <input  style={{
      left: '10px',
      width: '100px',
      height: '30px',
     }}  type='checkbox' checked={isUnique} onChange={e => {
      setIsUnique(!isUnique);
     }} />{isUnique ? 'Унікальні трейдери вкл' : 'Унікальні трейдери викл'}</label>
    <label>
    <input step={0.5} value={mc} onChange={e => {
      setMc(+e.target.value);
    }} min={30} max={70}   style={{
       width: '280px',
     }} type="range" />
     {mc}
    </label>
    <input step={20 * 60 * 1000} value={valueDate} onChange={e => {
      setValueDate(+e.target.value);
    }} min={minDate.getTime()} max={maxDate.getTime()}   style={{
       width: '300px',
     }} type="range" />
      <LineChart
        xAxis={chart1Data.xAxis}
        grid={{
          horizontal: true,
          vertical: true,
        }}
        series={chart1Data.series}
        height={420}

      />
    </div>
  )
}

export type PayloadToken = {
  tag: number;
  created_timestamp: string;
  description: string;
  symbol: string;
  name: string;
  image_uri: string;
  twitter: string;
  telegram: string;
  website: string;
  profit: number;
  percentage: number;
  mint: string;
  url: string;
  initBuy: number;
  duration: number;
  mc: number;
}

export default Statistics;


/*



function social() {

const obj = {
    "Name": "",
    "ticker": "",
    "descriptioin": "",
    "twitter": "",
    "telegram": "",
    "website": ""
}
    document.querySelectorAll("body > main > div.md\\:block.hidden.mt-16.p-4.mb-16 > div.flex.space-x-8.mt-4 > div.w-1\\/3.grid.gap-4.h-fit.w-fit > div.w-\\[350px\\].bg-transparent.text-gray-400.rounded-lg.border.border-none.grid.gap-4 > div.flex.gap-4 a").forEach(item => {
        obj[item.text.replace('[', '').replace(']', '')] = item.href;
    });

     const text = document.querySelector("body > main > div.md\\:block.hidden.mt-16.p-4.mb-16 > div.flex.space-x-8.mt-4 > div.w-1\\/3.grid.gap-4.h-fit.w-fit > div.w-\\[350px\\].bg-transparent.text-gray-400.rounded-lg.border.border-none.grid.gap-4 > div.gap-3.h-fit.items-start.flex > div > div.font-bold.text-sm")
    .textContent;

        
      const regex = /\(ticker: (\S+)\)/;
      const match = text.match(regex);

      if (match) {
          const ticker = match[1];

          obj.ticker = ticker;
      }

      const regex2 = /^(.*?)\s*\(/;
      const match2 = text.match(regex2);

      if (match2) {
          const Name = match2[1];

          obj.Name = Name;
      }


      const desc = document.querySelector("body > main > div.md\\:block.hidden.mt-16.p-4.mb-16 > div.flex.space-x-8.mt-4 > div.w-1\\/3.grid.gap-4.h-fit.w-fit > div.w-\\[350px\\].bg-transparent.text-gray-400.rounded-lg.border.border-none.grid.gap-4 > div.gap-3.h-fit.items-start.flex > div > div.text-xs.text-gray-400").
      textContent;

      obj.descriptioin = desc;
        console.log(JSON.stringify(obj));
      setTimeout(() => {
          navigator.clipboard.writeText(JSON.stringify(obj))
          .then(() => {
            console.log("OK")
          })
      }, 1000);
      
}
social()


*/
