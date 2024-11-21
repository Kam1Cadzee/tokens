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
import { MemeStatistic, Statistic } from './types/Statistic';
import useThrottle from './useThrottle';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import interpolate from './interpolation';

const getStr = (d: Date) => {
  return `${(d.getDate()).toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear().toString()}`;
}

enum SortType {
  create,
  profit,
  mc,
  tag,
}
const TICKETS = [
  'him',
  'rizz'
  // 'ia',
  // 'HODL',
  // 'HOLD',
  // "IDK",
  // "BTC",
  // "ATH",
  // "PUSH",
  // "PUMP",
  // "NFS",
  // "NFT",
  // "NBA",
  // "KFC",
  // "HTML",
  // "HTTP",
  // "HTTPS",
  // "SHIT",
  // "ROFL",
  // "LMAO",
  // 'SPY',
  // "GEM",
  // 'ETH',
  // "CIA",
  // "FBI",
  // "RECT",
  // "REKT",
  // "ID",
  // 'TRADE',
  // "DOG",
  // "CAT",
  // "ASS",
  // "fomo",
  // "moon",
  // "tv",
  // "chad",
  // "aped",
  // "SEND",
  // "SAD",
  // "WHALE",
  // "lfg",
  // 'fps',
  // 'hard',
  // 'wtf',
  // 'SSD',
  // 'LORD',
  // 'LOAD',
  // 'roi',
  // 'cex',
  // 'rai',
  // 'ai',
  // 'ascii',
  // 'ia',
  // 'amd','fiat',
  // '1mb',
  // '1gb',
  // '1tb',
  // 'vr',
  // 'ar',
  // 'btw',
  // 'META',
  // 'goat',
  // 'pvp',
  // 'koth',
  // 'lofi',
  // 'mimi',
  // 'pnl',
  // 'saw',
  // 'swa',
]
const length = 80;
function App() {
  const [filter, setFilter] = useState('');
  //const [DATES, setDATES] = useState<>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(getStr(new Date()));
  const [data, setData] = useState<PayloadToken[]>([]);
  const [typeSort, setTypeSort] = useState(SortType.create);
  const [tags, setTags] = useState<number[]>([]);
  const [isSelected, setIsSelected] = useState(false);
  const [valueDate, setValueDate] = useState(0);
  const [mc, setMC] = useState(36);
  const [statistic, setStatisctic] = useState<{time: string, token: number}[]>([]);
  const [intersectionData, setIntersectionData] = useState<MemeStatistic[]>([]);
  const [intersection, setIntersection] = useState(0);
  const [isFarm, setIsFarm] = useState(false);
  const [timeTraders, setTimeTraders] = useState(15 * 60 * 1000);
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
  
  const strTimeTraders = useMemo(() => {
    const minutes = timeTraders / 1000 / 60;
    return `${Math.floor(minutes / 60)}:${minutes % 60}`
  }, [timeTraders]);

  const addTag = (tag: number) => {
    setTags(tags => {
      if(tags.includes(tag)) {
        removeSelected('now', tag, currentDate);
        return tags.filter(item => item !== tag)
      }
      const newTags = [...tags, tag]
      saveSelected('now', tag, currentDate);
      return newTags;
    });
  }

  useEffect(() => {
    const handle = async (data: string) => {
      const res2 = await axios(`http://localhost:3001/json/${data}/${timeTraders}/true/${mc}`);       
      const arr2 = res2.data as MemeStatistic[];
      console.log('arr2', arr2);
      
      setIntersectionData(arr2);
    }
    
    if(currentDate === '') {
      return;
    }

    handle(currentDate);
  }, [timeTraders, currentDate, mc]);

  useEffect(() => {
    const handle = async (data: string) => {
      const res = await axios(`http://localhost:3001/json/${currentDate}`);     
      console.log('res', res.data.length);
        
      const arr = res.data as PayloadToken[];
      
      const obj: any = {};

      setData(arr.map((item, i) => {
        
        return {
          ...item, tag: i + 1,
        }
      }));

      console.log('Object', Object.values(obj).filter(item => item.count >= 2));
      

      setTags(loadSelected('now', currentDate));
      
      
    }
    
    if(currentDate === '') {
      return;
    }

    document.title = 'now ' + currentDate;
    handle(currentDate);
  }, [currentDate]);

  useEffect(() => {      
    const slot = 1 * 60 * 60 * 1000;
      
    const object = data.reduce((a, b) => {
      const time = +b.created_timestamp;
      const diff = time % slot;
      const res = time - diff;
      if(a[res]) {
        a[res] += 1;
      }
      else {
        a[res] = 1;
      }
      return a;
    }, {});
    const array: any[] = Object.entries(object).map(item => {
      const hour = new Date(+item[0]).getHours();

      return {time: `${hour.toString().padStart(2, '0')}:00`, token: item[1]};
      
    })
    setStatisctic(array.filter((item, i) => i >= 1 && item.token >= 5));
  }, [data, mc]);

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


  const listRef = useRef<any>();

  const filterIntersectionData = intersectionData.filter(item => {
    return item.intersection <= intersection;
  });

  const intersectionInfo = useMemo(() => {
    let min = 0;
    let max = 0;

    const result = intersectionData.reduce((a, b) => {
      a[b.mint] = {
        intersection: b.intersection,
        buys: b.buys,
      };
      min = Math.min(min, b.intersection);
      max = Math.max(max, b.intersection);
      return a;
    }, {} as any);

    return {
      result,
      min,
       max
    }
  }, [intersectionData]);

  const iData = useMemo(() => {
    return data.map(item => {
      return {
        ...item,
        intersection: intersectionInfo.result[item.mint]?.intersection ?? 100,
        buys: intersectionInfo.result[item.mint]?.buys ?? 0,
      }
    })
  }, [intersectionInfo])
  
  const filterData = iData.filter(item => {
    if(typeSort !== SortType.profit ? +item.created_timestamp < valueDate : +item.created_timestamp >= valueDate) {
       return false;
    }

   if(isSelected) {
    return tags.includes(item.tag);
   }

    if(isFarm) {
      return TICKETS.some(ticket => {
        return ticket.toLocaleLowerCase() === item?.symbol?.toLocaleLowerCase();
      }) 
    }
    // if(intersection !== 0) {
    //   if(item.intersection > intersection) {
    //     return false;
    //   }
    // }
      // const isIn = isSelected ? filterIntersectionData.some(iItem => iItem.mint === item.mint) : true;
      // if(!isIn) {
      //   return false;
      // }

      const name = item?.name ?? '';
      const symbol = item?.symbol ?? '';
      const description = item?.description ?? '';

      const isName = filter !== '' ? (`${name}${symbol}`).toLocaleLowerCase().includes(filter) : true;
      return isName;     
    });

    const sortData = (filterData as any).toSorted((a, b) => {
      if(typeSort === SortType.create) {
        return +a.created_timestamp - +b.created_timestamp;
      }
      if(typeSort === SortType.mc) {
        return +b.mc - +a.mc
      }
      if(typeSort === SortType.profit) {
        return b.profit - a.profit;
      }
      if(typeSort === SortType.tag) {
        return b.tag - a.tag;
      }
      return 0;
    })

    return <div className='App'>
    <div className='dates'>
      {
        dates.map(date => {
          const title = date.replace('.20', '.');

          return <button style={{
            backgroundColor: date === currentDate ? '#611231' : undefined,
            color:  date === currentDate ? 'white' : undefined,
          fontSize:  date === currentDate ? '22px' : undefined,
          padding: 0
          }} onClick={() => {
            setCurrentDate(date)
          }} key={date}>{title}</button>
        })
      }
    </div>
    <div style={{
      marginTop: '59px'
    }} className='dates'>
      {
        statistic.map(item => {
          return <p style={{
            fontSize: '12px',
            marginLeft: '4px'
          }}>|{item.time} - {item.token}|</p>
        })
      }
    </div>
      <input className='input' value={filter} onChange={e => {
        setFilter(e.target.value.toLocaleLowerCase());
      }} />
     
      <AutoSizer key={currentDate}>
            {
              ({ width, height }) => {
                return <List width={width}
                      ref={(ref) => { listRef.current = ref }}
                      height={950}
                      rowHeight={130}
                      rowCount={sortData.length}
                    estimatedRowSize={130}

                      overscanRowCount={10} rowRenderer={item => {
                    return <ItemRow intersectionInfo={intersectionInfo} iData={filterIntersectionData} type='files' setValueDate={setValueDate} addTag={addTag} tags={tags} currentDate={currentDate} key={sortData[item.index].tag} style={item.style} item={sortData[item.index] as any} />
                }} />
              }
            }
      </AutoSizer>
        
      <button style={getStyle(150)} onClick={() => {
        listRef.current?.scrollToRow(0)
      }}>top</button>
       <button  style={getStyle(190)} onClick={() => {
        listRef.current?.scrollToRow(sortData.length - 1)        
      }}>bottom</button>

        <button style={getStyle(230)} onClick={() => {
        setTypeSort(SortType.create)
      }}>Time</button>
       <button   style={getStyle(270)} onClick={() => {
        setTypeSort(SortType.profit)
      }}>Profit</button>
       <button   style={getStyle(310)} onClick={() => {
        setTypeSort(SortType.mc)
      }}>MC</button>
       <button   style={getStyle(350)} onClick={() => {
        setTypeSort(SortType.tag)
      }}>tag</button>
       <a href='/meme' style={getStyle(440)} >MEME</a>
      <a href='/vanya' style={getStyle(480)} >VANYA</a>
     <input   style={getStyle(520)} type='checkbox' checked={isSelected} onChange={e => {
        setIsSelected(!isSelected);
     }} />
    <input step={20 * 60 * 1000} value={valueDate} onChange={e => {
      setValueDate(+e.target.value);
    }} min={minDate.getTime()} max={maxDate.getTime()} style={getStyle(560)} type="range" />
     <p style={getStyle(580)} >{new Date(valueDate).toLocaleTimeString()}</p>
     <a href='/statistics'  style={getStyle(640)} >statistics</a>
     <input step={1} value={intersection} onChange={e => {
      setIntersection(+e.target.value);
    }} min={0} max={30}   style={getStyle(700)} type="range" />
     <p style={getStyle(720)} >intersection: {intersection}</p>
    <Slider step={20 * 60 * 1000} defaultValue={timeTraders} onChangeComplete={e => {
           setTimeTraders(e as any);
    }} min={10 * 60 * 1000} max={300 * 60 * 1000}   style={getStyle(780)} />
     <p style={getStyle(780)} >Time traders: {strTimeTraders}</p>
     <input   style={getStyle(810)} type='checkbox' checked={isFarm} onChange={e => {
        setIsFarm(!isFarm);
     }} />
      <input step={0.5} value={mc} onChange={e => {
      setMC(+e.target.value);
    }} min={32} max={69}   style={getStyle(830)} type="range" />
     <p style={getStyle(850)} >{mc} MC</p>
    </div>
}

const getStyle = (top: number) => {
  return {
    position: 'absolute',
    right: 0,
    width: '240px',
    height: '30px',
    top: top + 'px',
    zIndex: 100
  } as any;
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

export default App;


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
