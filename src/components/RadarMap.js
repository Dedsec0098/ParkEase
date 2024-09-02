import React from 'react';
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';
import './RadarMap.css';
import mockData from '../assets/mockData.json';

// Dummy data for detailed view (to be replaced with actual data)
const detailedData = {
  "Parking A": { owner: "John Doe", vehicleType: "Car", hoursAvailable: "24/7" },
  "Parking B": { owner: "Jane Smith", vehicleType: "Bike", hoursAvailable: "9 AM - 6 PM" },
  "Parking C": { owner: "Alice Johnson", vehicleType: "Car", hoursAvailable: "24/7" },
  // Add more as needed
};

class RadarMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showParkingMarkers: false,
      selectedLocationName: '',
      showModal: false,
      modalContent: null,
    };
  }

  componentDidMount() {
    const apiKey = 'prj_test_pk_c930b0ad7045f6ed46872536a3fd6582d0e3619c'; 
    Radar.initialize(apiKey);

    this.map = Radar.ui.map({
      container: 'map',
      style: 'radar-dark-v1',
      center: [80.04411, 12.82113], 
      zoom: 13,
    });

    Radar.ui.autocomplete({
      container: 'autocomplete',
      showMarkers: true,
      markerColor: '#0000ff', // Blue for autocomplete suggestions
      responsive: true,
      width: '400px',
      maxHeight: '600px',
      placeholder: 'Search address...',
      limit: 8,
      minCharacters: 3,
      near: '12.82109, 80.04409',
      onSelection: (address) => {
        const coordinates = address.geometry.coordinates;
        const [lng, lat] = coordinates;
        const locationName = address.text || 'Selected Location';

        if (this.marker) {
          this.marker.setLngLat([lng, lat]);
        } else {
          this.marker = Radar.ui.marker({
            color: '#ff0000', // Red for selected location
            popup: {
              html: `<div style="
              text-align: center;
              color: black;
              background-color: white; 
              border-radius: 5px;
              padding: 10px; 
            ">
            <h3 style="margin: 0; font-size: 16px;">${locationName}</h3>
            <p style="margin: 5px 0 0; font-size: 14px;">This is the location you selected.</p>
          </div>`,
              offset: [0, -10], 
            }
          })
          .setLngLat([lng, lat])
          .addTo(this.map);
        }

        this.map.setCenter([lng, lat]);
        this.map.setZoom(14);

        this.setState({ 
          showParkingMarkers: true,
          selectedLocationName: locationName,
        });
      },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showParkingMarkers && !prevState.showParkingMarkers) {
      mockData.parkingLocations.forEach(location => {
        Radar.ui.marker({
          color: '#0000ff', // Blue for parking locations
          popup: {
            html: `<div style="
            text-align: center;
            color: black;
            background-color: white; 
            border-radius: 5px;
            padding: 10px; 
          ">
          <h3 style="margin: 0; font-size: 16px;">${location.title}</h3>
          <p style="margin: 5px 0 0; font-size: 14px;">Capacity: ${location.capacity} vehicles</p>
          <p style="margin: 5px 0 0; font-size: 14px;">Distance: ${location.distanceFromUser} meters</p>
          <button class="read-more-btn" data-location="${location.title}" style="
            background-color: #007bff; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            padding: 5px 10px; 
            cursor: pointer;
          ">Read More</button>
        </div>`,
            offset: [0, -10], 
          }
        })
        .setLngLat([location.longitude, location.latitude])
        .addTo(this.map);
      });

      // Add event listener after markers are added
      this.map.getCanvas().addEventListener('click', this.handleReadMoreClick);
    }
  }

  handleReadMoreClick = (event) => {
    const button = event.target.closest('.read-more-btn');
    if (button) {
      const locationName = button.getAttribute('data-location');
      const details = detailedData[locationName];
      if (details) {
        this.setState({
          showModal: true,
          modalContent: details,
        });
      }
    }
  };

  closeModal = () => {
    this.setState({ showModal: false, modalContent: null });
  };

  render() {
    const { showModal, modalContent, selectedLocationName } = this.state;

    return (
      <div id="map-container" style={{ width: '80%', height: '500px', margin: '0 auto', position: 'relative' }}>
        <div id="autocomplete" className="search-container"></div>
        <div id="map" style={{ height: '100%', width: '100%' }}></div>

        {showModal && modalContent && (
          <div id="modal" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}>
            <h3>Details for {selectedLocationName}</h3>
            <p><strong>Owner:</strong> {modalContent.owner}</p>
            <p><strong>Vehicle Type:</strong> {modalContent.vehicleType}</p>
            <p><strong>Hours Available:</strong> {modalContent.hoursAvailable}</p>
            <button onClick={this.closeModal} style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}>Close</button>
          </div>
        )}
      </div>
    );
  }
}

export default RadarMap;
