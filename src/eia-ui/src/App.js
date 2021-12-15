import './App.css';
import React, {useState, useEffect} from 'react'
import MapView from './components/MapView';
import CoordinatesForm from "./components/CoordinatesForm";
import Results from "./components/Results";
import Charts from "./components/Charts"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Spinner } from "react-bootstrap";

const App = () => {


  

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [returnedData,  setReturnedData] = useState();
  const [farmData, setFarmData] = useState();
  const [lotesSelected, setLotesSelected] = useState();
  const [cuantitativeData, setCuantitativeData] = useState();
  
  const [error, setError] = useState(null);

  //const urlApi = "https://jsonplaceholder.typicode.com/comments";
  const urlApi = "http://localhost:105/dummy"
  const urlSearch = "http://localhost:105/farm/"
  const urlCuantitativeData = "http://localhost:105/cuantitative_data"

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // const setOnline = (event) => {
  //   console.log('We are online!');
  //   isOnline(true);
  // };
  // const setOffline = (event) => {
  //   console.log('We are offline!');
  //   isOnline(false);
  // };

  // Register the event listeners
  useEffect(() => {
    window.addEventListener('online', ()=> {
      setIsOnline(true);

      if(!returnedData){
        let formValues = JSON.parse(localStorage.getItem('formData'));
        consumeAPI(urlApi, formValues);
      }
      //console.log('We are online!');
    });
    window.addEventListener('offline', ()=> {
      setIsOnline(false);
      //console.log('We are offline!');
    });
    
  }, []);

  const consumeAPI = (request, formData) => {
    
    if(isOnline){
      
      fetch(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      }).then(async (response) => {
            if (response.ok) {
              setReturnedData(await response.json());
              setError(null);
              setIsLoading(false);
              getCuantitativeData(); //Datos para las tablas
            } else{
              setError(await response.text());
              
            }
          })
          .catch((err) => {
            setError(err.message);
          });
    }
    else{
      alert("Se encuentra sin conexión. Los datos se enviarán cuando se tenga conexión nuevamente")
      localStorage.setItem('formData',  JSON.stringify(formData));

    }
    
    
    return returnedData;
  };

const searchApi = (name) => {
  let request = urlSearch+name

  fetch(request).then(async (response) => {
      if (response.ok) {
        //console.log(await response.json());
        setFarmData(await response.json());
       
      } else{
        setError(await response.text());
        
      }
    })
    .catch((err) => {
      setError(err.message);
    });
}

const getCuantitativeData = () => {
  let request = urlCuantitativeData;

  fetch(request).then(async (response) => {
    if (response.ok) {
      //console.log(await response.json());
      setDataFormat(await response.json());
     
    } else{
      setError(await response.text());
      
    }
  })
  .catch((err) => {
    setError(err.message);
  });

}

const setDataFormat = (data) => {
  

  let scatterDataFormatted = 
  [
    {key: 'DIST_PLANTAS', values:[]}, 
    {key: 'DIST_SURCOS', values:[]}, 
    {key: 'NUM_SEMILLAS', values:[]},
    {key: 'OBJ_RDT', values:[]}, 
    {key: 'POBLACION_20DIAS', values:[]}, 
    {key: 'RDT', values:[]},
    {key: 'SEM_POR_SITIO', values:[]},
    {key: 'area_fie', values:[]},
    {key: 'humidity_percentage_har', values:[]}
  ]

  

  for(const d in data) {
    
    for(const k in scatterDataFormatted){
      

      switch(scatterDataFormatted[k].key){
        case 'DIST_PLANTAS':
          scatterDataFormatted[k].values.push({"x": data[d].DIST_PLANTAS, "y": data[d].production_har});
          break;

        case 'DIST_SURCOS':
          scatterDataFormatted[k].values.push({"x": data[d].DIST_SURCOS, "y": data[d].production_har});
          break;
        
        case 'NUM_SEMILLAS':
          scatterDataFormatted[k].values.push({"x": data[d].NUM_SEMILLAS, "y": data[d].production_har});
          break;

        case 'OBJ_RDT':
          scatterDataFormatted[k].values.push({"x": data[d].OBJ_RDT, "y": data[d].production_har});
          break;
        
        case 'POBLACION_20DIAS':
          scatterDataFormatted[k].values.push({"x": data[d].POBLACION_20DIAS, "y": data[d].production_har});
          break;

        case 'RDT':
          scatterDataFormatted[k].values.push({"x": data[d].RDT, "y": data[d].production_har});
          break;
        
        case 'SEM_POR_SITIO':
          scatterDataFormatted[k].values.push({"x": data[d].SEM_POR_SITIO, "y": data[d].production_har});
          break;
        
        case 'area_fie':
          scatterDataFormatted[k].values.push({"x": data[d].area_fie, "y": data[d].production_har});
          break;
        
        case 'humidity_percentage_har':
          scatterDataFormatted[k].values.push({"x": data[d].humidity_percentage_har, "y": data[d].production_har});
          break;
        
        default:
  

      }
     
    

    }
  }
  setCuantitativeData(scatterDataFormatted);

}


  

  return (

    <Container className="mt-4" fluid>

      <Row>
      <h4 className="mb-4">Ingreso de datos</h4>
      <CoordinatesForm
            selectedPosition={selectedPosition}
            urlApi={urlApi}
            farmData={farmData}
            lotesSelected={lotesSelected}
            returnedData={returnedData}
            
            setReturnedData={setReturnedData}
            setSelectedPosition={setSelectedPosition}
            consumeAPI={consumeAPI}
            setIsLoading={setIsLoading}
            searchApi={searchApi}
            setLotesSelected={setLotesSelected}
            
          />
      </Row>

      <Row className="mt-4">
      <h4 className="mb-4">Resultados de optimización, mapa y tabla</h4>

        <Col>
          <h6>En el mapa podrá ver la ubicación de los lotes seleccionados</h6>
          <MapView
            selectedPosition={selectedPosition}
            lotesSelected={lotesSelected}

            setSelectedPosition={setSelectedPosition}
            
          />

          <Row>
            {
              cuantitativeData && <Charts className="mt-4"
                              cuantitativeData={cuantitativeData}
                              />
            }

          </Row>
          

            
      
        </Col>

        <Col>
          
          {
            isLoading &&
              <Row className="row justify-content-center mt-4 mb-4">
                <Spinner animation="border" role="status" variant="success">
                  <span className="visually-hidden">Cargando...</span></Spinner>
                <Spinner animation="border" role="status" variant="light">
                  <span className="visually-hidden">Cargando...</span></Spinner>
                <Spinner animation="border" role="status" variant="dark">
                  <span className="visually-hidden">Cargando...</span></Spinner>
                
              </Row> 
          }

          {
            returnedData && <Results returnedData={returnedData} lotes={lotesSelected}/>
          }

         

        
        </Col>

      

      </Row>
      



    </Container>
   
                
          

  )
}

export default App;
