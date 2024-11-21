import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {AutoSizer, List} from 'react-virtualized';
import axios from 'axios';
import { log } from 'console';
import { loadSelected, removeSelected, saveSelected } from './selected';
import ItemRow from './ItemRow';


const styleCol: any = {
  textWrap: 'wrap',
  textOverflow: 'ellipsis',
  overflowX: 'clip',
  overflowY: 'clip',
  height: '100px',
  cursor: 'pointer'
}

const onSave = async (text: string) => {
  if(text.trim() === '') {
    return;
  }
  await navigator.clipboard.writeText(text);
  toast(text, {
    autoClose: 100,
    
  })
}

const onLink = (text: string) => {
  if(text.trim() === '') {
    return;
  }
  window?.open(text, '_blank')?.focus();
}


const getStr = (d: Date) => {
  return `${(d.getDate()).toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear().toString()}`;
}

enum SortType {
  create,
  profit,
  mc,
  tag,
}

const length = 14;
function App() {
  const [filter, setFilter] = useState('');
  //const [DATES, setDATES] = useState<>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(getStr(new Date()));
  const [data, setData] = useState<PayloadToken[]>([]);
  const [typeSort, setTypeSort] = useState(SortType.create);
  const [tags, setTags] = useState<number[]>([]);
  const [isSelected, setIsSelected] = useState(false);

  const addTag = (tag: number) => {
    setTags(tags => {
      if(tags.includes(tag)) {
        removeSelected('vanya', tag, currentDate);
        return tags.filter(item => item !== tag)
      }
      const newTags = [...tags, tag]
      saveSelected('vanya', tag, currentDate);
      return newTags;
    });
  }

  useEffect(() => {
    const handle = async (data: string) => {
      const res = await import(`./data/vanya/${data}.json`);      
      const arr = res.default as PayloadToken[];

      setData(arr.map((item, i) => {
        return {
          ...item, tag: i + 1,
        }
      }))
      
      setTags(loadSelected('vanya', currentDate));
    }
    
    if(currentDate === '') {
      return;
    }

    document.title = 'VANYA ' + currentDate;
    handle(currentDate);
  }, [currentDate]);

 
  useEffect(() => {
    const d = new Date(2024, 8, 4);
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


  const filterData = data.filter(item => {
    const isIn = isSelected ? tags.includes(item.tag) : true;
    if(!isIn) {
      return false;
    }
    const isName = item?.name?.toLocaleLowerCase().includes(filter) || item?.symbol?.toLocaleLowerCase().includes(filter) || item?.description?.toLocaleLowerCase().includes(filter);
    return isIn && isName;     
   });

    const sortData = (filterData  as any).toSorted((a, b) => {
      if(typeSort === SortType.create) {
        return +a.created_timestamp - +b.created_timestamp;
      }
      if(typeSort === SortType.mc) {
        if(!!a.mc && !!b.mc) 
          return b.mc - a.mc;
        return -1;
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

                      overscanRowCount={4} rowRenderer={item => {
                    return <ItemRow iData={[]} intersectionInfo={{
                      max: 0,
                      min: 0,
                      result: {
                        
                      }
                    }} type="vanya" addTag={addTag} tags={tags} setValueDate={() => null} currentDate={currentDate} key={sortData[item.index].tag} style={item.style} item={sortData[item.index] as any} />
                }} />
              }
            }
      </AutoSizer>
        
      <button style={{
        width: '100px',
        height: '30px',
        position: 'absolute',
        top: '150px',
        zIndex: 100,
        right: 0
      }} onClick={() => {
        listRef.current?.scrollToRow(0)
      }}>top</button>
       <button style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '190px',
        zIndex: 100
      }} onClick={() => {
        listRef.current?.scrollToRow(sortData.length - 1)        
      }}>bottom</button>

        <button style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '230px',
        zIndex: 100
      }} onClick={() => {
        setTypeSort(SortType.create)
      }}>Time</button>
       <button style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '270px',
        zIndex: 100
      }} onClick={() => {
        setTypeSort(SortType.profit)
      }}>Profit</button>
       <button style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '310px',
        zIndex: 100
      }} onClick={() => {
        setTypeSort(SortType.mc)
      }}>MC</button>
       <button style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '350px',
        zIndex: 100
      }} onClick={() => {
        setTypeSort(SortType.tag)
      }}>tag</button>
       <a href='/meme' style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '440px',
        zIndex: 100
      }} >MEME</a>
      <a href='/vanya' style={{
       position: 'absolute',
       right: 0,
       width: '100px',
       height: '30px',
       top: '480px',
       zIndex: 100
     }} >VANYA</a>
    </div>
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