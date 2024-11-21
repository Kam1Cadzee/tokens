import React, { useMemo } from "react";
import { PayloadToken } from "./Vanya";
import ImageItem from "./ImageItem";
import { toast } from "react-toastify";
import { MemeStatistic } from "./types/Statistic";
import interpolate from "./interpolation";

type PropsRow = {
    item: PayloadToken;
    style: any;
    currentDate: string;
    tags: number[];
    addTag: (n: number) => void;
    setValueDate: (n: number) => void;
    type: 'files' | 'vanya' | 'memes';
    iData: MemeStatistic[];
    intersectionInfo: {
      result: {
        [name: string]: {
          intersection: number;
          buys: number;
        };
      },
      min: number;
       max: number;
    }
  }


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

  const ItemRow = ({item, style,currentDate, tags, addTag, setValueDate, type, iData, intersectionInfo}: PropsRow) => {
  
    // const isInteract = useMemo(() => {
    //   return iData.some(iItem => iItem.mint === item.mint);
    // }, [iData]);

    const color = useMemo(() => {
        const data = intersectionInfo.result[item.mint]?.intersection;
        
        if(data === undefined) {
          return 'hsl(233, 100%, 69%)';
        }

        //hsl(113, 100%, 69%)

        const H = interpolate(data, [intersectionInfo.min, intersectionInfo.max], [100, 0]);

        
        if(H !== null) {
          return `hsl(${H}, 100%, 69%)`
        }

        return 'hsl(233, 100%, 69%)';
    }, [intersectionInfo]);


    return (
      <div className='row' style={{
        ...style,
        backgroundColor: tags.includes(item.tag) ? 'rgb(247 87 216)' : color
      }}>
              <div onClick={() => {
                addTag(item.tag)
              }}>{item.tag}</div>
              <div><ImageItem type={type} addTag={addTag} currentDate={currentDate} number={item.tag!} /></div>
              <div onClick={() => {
                onSave(item.name)
              }}>{item.name}
              <p>({'\n' + intersectionInfo.result[item.mint]?.intersection} / {intersectionInfo.result[item.mint]?.buys})</p></div>
              <div onClick={() => {
                onSave(item.symbol)
              }}>{item.symbol}</div>
              <div>Buy: {item.initBuy?.toFixed(2)}</div>
              <div>MC: {item.mc?.toFixed(2)}</div>
              <div>Profit: {item.profit?.toFixed(2)}</div>
              {/* <div>{item.initBuy?.toFixed(2)}</div>  
              <div>{item.profit?.toFixed(2)}</div>
               <div>{item.percentage?.toFixed(2)}%</div>
               <div>{item.duration / 1000}</div>   */}
              <div onClick={() => {
                setValueDate(+item.created_timestamp);
              }}
              >{new Date(+item.created_timestamp).toLocaleTimeString()}</div>
              <div onClick={() => {
                onSave(item.description)
              }} >{item.description}</div>
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
              
              
               <div onClick={() => {
                onLink(item.url)
               }} style={{
                color: 'blue'
               }}>LINK</div>
      </div>
    )
  }

  export default ItemRow;