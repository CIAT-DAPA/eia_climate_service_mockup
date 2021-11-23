import React, { useEffect, useState} from "react";
import { Marker, Popup, useMap, useMapEvents} from "react-leaflet";
import icon from "./IconLocation";

const SelectedMarker = ({initialPosition, selectedPosition, setInitialPosition, setSelectedPosition}) => {

    const popUpMessages = {
        userLocation: "Estás aquí",
        userSelection: "Punto seleccionado"
    }
    const map = useMap();
    
    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setSelectedPosition(e.latlng);
        map.setView(e.latlng, map.getZoom());
        // const radius = e.accuracy;
        // const circle = L.circle(e.latlng, radius);
        // circle.addTo(map);
        //setBbox(e.bounds.toBBoxString().split(","));
      });
    }, [map]);

    const ClickHandle = () => {
        const map = useMapEvents({
            click(e) {                                
              setSelectedPosition(e.latlng);               
            },            
        })
    }

    var currentPosition = (selectedPosition) ? initialPosition : selectedPosition;

    return selectedPosition === null ? null : (
        
        <Marker position={{lat: selectedPosition.lat, lng: selectedPosition.lng}} icon={icon}>
          <Popup>
            <center>Punto seleccionado</center> <br />
            Coordenadas: <br />
            <b>Latitud</b>: {selectedPosition.lat}<br />
            <b>Longitud</b>: {selectedPosition.lng}<br />
  
  
            
          </Popup>
        </Marker>
      )


}

export default SelectedMarker;