export const getRandomCoordinates = (sizeArea) => {
    let x = Math.floor((Math.random() * sizeArea));
    let y = Math.floor((Math.random() * sizeArea));
    return [x, y];
  }