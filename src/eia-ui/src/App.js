import './App.css';
import React, {useState, useEffect} from 'react'
import MapView from './components/MapView';
import CoordinatesForm from "./components/CoordinatesForm";
import Results from "./components/Results";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Spinner } from "react-bootstrap";

const App = () => {


  const initialDataTable = {

    Number_of_post_sowing_herbicides_applications: ['1', '2454'],
    Number_of_applications_of_insecticides: ['1656', '562'],
    Total_amount_of_nitrogen_applied_kg_ha: ['561', '256'],
    Total_amount_of_phosporus_applied_kg_ha: ['178', '82'],
    Total_amount_of_potassium_applied: ['781', '27'],
    Cultivars_group: ['61', '28'],
    Seed_treatment: ['12', '42'],
    Conservation_agriculture: ['71', '82'],
    Yield: ['155', '72']

  }

  

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [returnedData,  setReturnedData] = useState();
  
  const [error, setError] = useState(null);

  //const urlApi = "https://jsonplaceholder.typicode.com/comments";
  const urlApi = "http://localhost:105/dummy/"

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
      fetch(request).then(async (response) => {
            if (response.ok) {
              setReturnedData(await response.json());
              setError(null);
              setIsLoading(false);
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


  

  return (

    <Container fluid>

      <Row>
      <CoordinatesForm
            selectedPosition={selectedPosition}
            urlApi={urlApi}
            
            setSelectedPosition={setSelectedPosition}
            consumeAPI={consumeAPI}
            setIsLoading={setIsLoading}
            
          />
      </Row>

      <Row className="mt-4">

        <Col>
          <MapView
            selectedPosition={selectedPosition}

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
            returnedData && <Results returnedData={returnedData}/>
          }

        
        </Col>

      

      </Row>
      {
        //consumeAPI(url)
        

      }

      {
        //console.log(returnedData)
      }



    </Container>
   
                
          

  )
}

export default App;
