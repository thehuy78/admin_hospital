import React, { useEffect, useRef, useState } from 'react';

const InputMap = () => {
  const [address, setAddress] = useState('');
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    getAddressFromLatLng(lat, lng);
  };

  const getAddressFromLatLng = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  };

  useEffect(() => {
    const initMap = () => {
      // Sử dụng tọa độ mặc định cho New York
      const center = { lat: 10.8231, lng: 106.6297 }; // New York
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 10,
      });

      // Thêm sự kiện click cho bản đồ
      window.google.maps.event.addListener(mapRef.current, 'click', handleMapClick);
    };

    // Tạo script để tải Google Maps API
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;

    // Đặt hàm initMap vào cửa sổ để Google Maps có thể gọi
    window.initMap = initMap;

    // Thêm script vào document
    document.body.appendChild(script);

    // Dọn dẹp khi component bị unmount
    return () => {
      document.body.removeChild(script);
      delete window.initMap;
    };
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
      <div>
        <h2>Address: {address}</h2>
      </div>
    </div>
  );
};

export default InputMap;
