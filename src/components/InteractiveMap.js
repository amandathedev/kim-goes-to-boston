import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import './InteractiveMap.scss';

const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 42.3601,
  lng: -71.0589,
};

const InteractiveMap = () => {
  const [markers, setMarkers] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [pointsInput, setPointsInput] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkers([...markers, { position: location, task: taskInput, points: pointsInput }]);
        setTaskInput('');
        setPointsInput('');
      } else {
        console.error('No geometry information available for the selected place');
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={libraries}>
      <div className="map-wrapper">
        <div className="input-container">
          <input
            type="text"
            placeholder="Task description"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <input
            type="number"
            placeholder="Points"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
          />
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input type="text" placeholder="Enter a location" />
          </Autocomplete>
          <p>Enter a location and add a task marker</p>
        </div>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position} label={marker.task} />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default InteractiveMap;
