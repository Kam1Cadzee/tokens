function interpolate(value: number, inputArray: number[], outputArray: number[]) {
    // First, find where our value sits in the inputArray
    for (let i = 0; i < inputArray.length - 1; i++) {
      if (value >= inputArray[i] && value <= inputArray[i + 1]) {
        // Calculate the ratio of the difference between the value and the current input
        // point to the difference between the next input point and the current input point.
        const ratio = (value - inputArray[i]) / (inputArray[i + 1] - inputArray[i]);
        
        // Use that ratio to interpolate between the current output point and the next output point.
        return outputArray[i] + ratio * (outputArray[i + 1] - outputArray[i]);
      }
    }
  
    // If the value is outside the range of inputArray, we can choose to return some default value,
    // or handle it in some other specific way. For simplicity, let's just return the nearest boundary value.
    if (value < inputArray[0]) {
      return outputArray[0];
    } else if (value > inputArray[inputArray.length - 1]) {
      return outputArray[outputArray.length - 1];
    }
  
    // In case the inputArray doesn't properly handle the value (which should be covered by above),
    // return a fallback or an indication of an error.
    return null; // or throw new Error('Value is out of bounds');
  }
  
  // Testing the function with the provided example
  
  // Expected output: 0.5
  
  export default interpolate;