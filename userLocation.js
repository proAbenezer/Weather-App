export default class USERLOCATION {
  constructor() {
    this.options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    };
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          reject("ERROR: Sorry, can't get user location");
        },
        this.position
      );
    });
  }
}
