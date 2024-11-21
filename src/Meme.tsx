import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import meme from './data/meme.json';
import { toast } from 'react-toastify';
import {AutoSizer, List} from 'react-virtualized';
import axios from 'axios';

type TypeMeme = typeof meme[0];

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

const DATA = meme.map((item, index) => {
  return {
    ...item,
    Tag: index + 1,
  }
})

type Props = {
  number: number;
}
const ImageItem = ({number}: Props) => {
    return <img
    className="image"
    src={`http://localhost:3001/memes/${number}`} // use normal <img> attributes as props
    />
}

function Meme() {
  const [filter, setFilter] = useState('');



  useEffect(() => {
    document.title = 'MEME';
  }, []);


  const listRef = useRef<any>()
    const filterData = DATA.filter(item => {
      return item?.Name?.toLocaleLowerCase().includes(filter) || item?.ticker?.toLocaleLowerCase().includes(filter) || item?.descriptioin?.toLocaleLowerCase().includes(filter)
    })
    return <div className='App'>
      <input className='input' value={filter} onChange={e => {
        setFilter(e.target.value.toLocaleLowerCase());
      }} />
      <button style={{
        position: 'absolute',
        right: 0,
        top: '200px',
        zIndex: 100
      }} onClick={() => {
        listRef.current?.scrollToRow(filterData.length - 1)        
      }}>bottom</button>
      <AutoSizer>
            {
              ({ width, height }) => {
                return <List width={width}
                      ref={(ref) => { listRef.current = ref }}
                      height={950}
                      rowHeight={130}
                      rowCount={filterData.length}
                      overscanRowCount={10} rowRenderer={item => {
                    return <ItemRow key={filterData[item.index].Tag} style={item.style} item={filterData[item.index] as any} />
                }} />
              }
            }
      </AutoSizer>
        
      <button style={{
        width: '100px',
        height: '30px',
        position: 'absolute',
        top: '300px',
        zIndex: 100,
        right: 0
      }} onClick={() => {
        listRef.current?.scrollToRow(0)
      }}>top</button>

<a href='/' style={{
        position: 'absolute',
        right: 0,
        width: '100px',
        height: '30px',
        top: '440px',
        zIndex: 100
      }}>MAIN</a>
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

type PropsRow = {
  item: TypeMeme
  style: any;
}
const ItemRow = ({item, style}: PropsRow) => {

  return (
    <div className='row' style={style}>
            <div>{item.Tag}</div>
            <div><ImageItem number={item.Tag!} /></div>
            <div onClick={() => {
              onSave(item.Name)
            }}>{item.Name}</div>
            <div onClick={() => {
              onSave(item.ticker)
            }}>{item.ticker}</div>
            <div onClick={() => {
              onSave(item.descriptioin)
            }} >{item.descriptioin}</div>
            <div
            onDoubleClick={() => {
              onLink(item.twitter)
            }}
             onClick={() => {
              onSave(item.twitter)
            }}>{item.twitter}</div>
            <div
             onDoubleClick={() => {
              onLink(item.telegram)
            }}
             onClick={() => {
              onSave(item.telegram)
            }}
            >{item.telegram}</div>
            <div
             onDoubleClick={() => {
              onLink(item.website)
            }}
             onClick={() => {
              onSave(item.website)
            }}
            >{item.website}</div>
    </div>
  )
}


export default Meme;


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
