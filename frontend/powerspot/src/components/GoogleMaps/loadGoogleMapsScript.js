export const loadGoogleMapsScript = (apiKey) => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = (err) => {
        reject(err);
      };
      document.head.appendChild(script);
    });
  };
  