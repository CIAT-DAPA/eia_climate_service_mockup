import "../styles/mapview.css";
import React, { useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl} from "react-leaflet";
import {Container} from "react-bootstrap";
import "leaflet/dist/leaflet.css";


import icon from "./IconLocation";



const MapView = ({selectedPosition, lotesSelected, setSelectedPosition}) => {


  const [initialPosition, setInitialPosition] = useState(null);
  const defaultPosition = [4.891201, -75.180664]
  

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

  
    const mapClick = useMapEvents({
        click(e) {                             
          setSelectedPosition(e.latlng);
          
                
        },            
    })

    return selectedPosition === null ? null : ( 
        <Marker position={selectedPosition} icon={icon}>
        <Popup>
          <center>Ubicación seleccionada</center> <br />
          Coordenadas: <br />
          <b>Latitud</b>: {selectedPosition.lat}<br />
          <b>Longitud</b>: {selectedPosition.lng}<br />
        </Popup>
      </Marker>
    );   
    
  }

  return (

    
    <Container  fluid>

        <MapContainer
          //center={selectedPosition ? selectedPosition : initialPosition}
          center={{lat: defaultPosition[0], lng: defaultPosition[1]}}
          zoom={5}
          scrollWheelZoom={false}
        >
          

          <LayersControl>
            {
              lotesSelected && lotesSelected.map(lote => 

              <Marker position={{lat: lote.value[1], lng: lote.value[2]}} icon={icon}>
                <Popup>
                  <center>Lote: {lote.label}</center> <br />
                  Coordenadas: <br />
                  <b>Latitud</b>: {lote.value[1]}<br />
                  <b>Longitud</b>: {lote.value[2]}<br />
                </Popup>
              </Marker>
                
              )
            }
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name= "Satellite View">
              <TileLayer
                
                url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                maxZoom= {20}
                subdomains={['mt1','mt2','mt3']}
              />
            </LayersControl.BaseLayer>

          </LayersControl>
          
          
        </MapContainer>
    </Container>



   


 
    
  );
}
export default MapView;

  