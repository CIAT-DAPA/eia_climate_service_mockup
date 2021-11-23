import "../styles/mapview.css";
import React, { useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Button } from "react-bootstrap";

import icon from "./IconLocation";
import { Container } from "react-bootstrap";


const MapView = ({selectedPosition, setSelectedPosition}) => {


  const [initialPosition, setInitialPosition] = useState(null);
  

  //initial position
  const InitialLocationMarker = () => {
    const map = useMap();
    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setInitialPosition(e.latlng);
        map.setView(e.latlng, map.getZoom());
      });
    }, []);
    
    return initialPosition === null ? null : (
        
      <Marker position={initialPosition} icon={icon}>
        <Popup>
          <center>Estás aquí</center> <br />
          Coordenadas: <br />
          <b>Latitud</b>: {initialPosition.lat}<br />
          <b>Longitud</b>: {initialPosition.lng}<br />
        </Popup>
      </Marker>
    );

  }

  const SelectedMarker = () => {

    // const map = useMap();
    // useEffect(() => {
    //   map.locate().on("locationfound", function (e) {
    //     setSelectedPosition(e.latlng);
    //     map.setView(e.latlng, map.getZoom());
        
    //   });
    // }, []);

    const mapClick = useMapEvents({
        click(e) {                             
          setSelectedPosition(e.latlng);
          
          //map.setView(e.latlng, map.getZoom());         
        },            
    })

    return selectedPosition === null ? null : ( 
        <Marker position={selectedPosition} icon={icon}>
        <Popup>
          <center>Ubicación seleccionada</center> <br />
          Coordenadas: <br />
          <b>Latitud</b>: {selectedPosition.lat}<br />
          <b>Longitud</b>: {selectedPosition.lng}<br />

          {/* <Button 
            className="mt-2" 
            size ="sm" 
            variant="outline-primary"
          >
            Seleccionar coordenadas
          </Button> */}
        </Popup>
      </Marker>
    );   
    
  }

  return (

    

        <MapContainer
          center={selectedPosition ? selectedPosition : initialPosition} 
          zoom={14}
        >
          {
            !selectedPosition && <InitialLocationMarker/>
          }

          <SelectedMarker/> 
          <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          
        </MapContainer>



   


 
    
  );
}
export default MapView;

  