import { List } from 'react-virtualized';

const rowCount = 5000;
const listHeight = 400;
const rowHeight = 50;
const rowWidth = 700;

const list = Array(rowCount).fill('').map((val, idx) => {
  return {
    id: idx,
    name: 'John Doe',
    image: 'http://via.placeholder.com/40',
    text: 'asdasd' + idx
  }
});

function renderRow({ index, key, style }: any) {
    return (
      <div key={key} style={style} className="row">
        <div className="image">
          <img src={list[index].image} alt="" />
        </div>
        <div className="content">
          <div>{list[index].name}</div>
          <div>{list[index].text}</div>
        </div>
      </div>
    );
  }
  
  function Ex() {
    return (
      <div className="App">
        <div className="list">
          <List
            width={rowWidth}
            height={listHeight}
            rowHeight={rowHeight}
            rowRenderer={renderRow}
            rowCount={list.length}
            overscanRowCount={3} />
        </div>
      </div>
    );
  }
  
  export default Ex;