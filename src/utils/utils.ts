
let bookImages = [""];



export function isAccessTokenPresent() {
    return !!localStorage.getItem('access_token');
}

export function getRandomImg(){
    let images: string[] = [
      '../../../assets/book1.png',
      '../../../assets/book2.png',
      '../../../assets/book3.png',
      '../../../assets/book4.png',
      '../../../assets/book5.png',
      '../../../assets/book6.png',
      '../../../assets/book7.png',
      '../../../assets/book8.png',
      '../../../assets/book9.png'
    ];
      console.log("Random Images",images[Math.floor(Math.random() * images.length)]);
      return images[Math.floor(Math.random() * images.length)];
  }