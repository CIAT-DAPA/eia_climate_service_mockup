import './App.css';
import React, {useState, useEffect} from 'react'
import MapView from './components/MapView';
import CoordinatesForm from "./components/CoordinatesForm";
import Results from "./components/Results";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Spinner } from "react-bootstrap";

const App = () => {


  

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [returnedData,  setReturnedData] = useState([]);
  const [farmData, setFarmData] = useState();
  const [lotesSelected, setLotesSelected] = useState();
  
  const [error, setError] = useState(null);

  //const urlApi = "https://jsonplaceholder.typicode.com/comments";
  const urlApi = "http://localhost:105/dummy/"
  const urlSearch = "http://localhost:105/farm/"

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
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    };
      fetch(request, requestOptions).then(async (response) => {
            if (response.ok) {
              setError(null);
              setIsLoading(false);
              let returnData = await response.json();
              
              const changedReturnedData = [
                ...returnedData,
                returnData
            ]
            setReturnedData(changedReturnedData);
              console.log(returnData);
              return returnData;
              
            } else{
              setError(await response.text());
              return null;
              
            }
          })
          .catch((err) => {
            setError(err.message);
          });
    }
    else{
      alert("Se encuentra sin conexión. Los datos se enviarán cuando se tenga conexión nuevamente")
      localStorage.setItem('formData',  JSON.stringify(formData));
      return null;

    }
    
    
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


  

  return (

    <Container className="mt-4" fluid>

      <Row>
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

        <Col>
          <MapView
            selectedPosition={selectedPosition}
            lotesSelected={lotesSelected}

            setSelectedPosition={setSelectedPosition}
            
          />
      
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
            //returnedData && <Results returnedData={returnedData}/>
          }

        
        </Col>

      

      </Row>
      



    </Container>
   
                
          

  )
}

export default App;
