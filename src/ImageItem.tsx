import React from "react";

type Props = {
    number: number;
    currentDate: string;
    addTag: (n: number) => void;
    type: string;
  }
  const ImageItem = ({number, currentDate, addTag, type}: Props) => {
  
      return <img
      onClick={() => {
        addTag(number);
      }}
      className="image"
      src={`http://localhost:3001/${type}/${number}/${currentDate}`} // use normal <img> attributes as props
      />
  }

  export default ImageItem;