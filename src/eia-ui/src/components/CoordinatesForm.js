import React, {useState, useEffect} from "react";
import { Row, Col, Button, Form, FloatingLabel} from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



import '../styles/coordinatesform.css'

const initialFormValues = {
        lat: '',
        lng: '',
        initialMonth: 'Mes inicial',
        finalMonth: 'Mes final'
}

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre",
                "Diciembre"]

const months2 = [
    {value: "Enero", label: "enero"},
    {value: "Febrero", label: "febrero"}
]

const animatedComponents = makeAnimated();


const CoordinatesForm = ({selectedPosition, urlApi, setSelectedPosition, consumeAPI, setIsLoading}) => {

    
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect(() => {
    

        if(selectedPosition){

            const changedFormValues = {
                ...formValues,
                lat: selectedPosition.lat,
                lng: selectedPosition.lng
            }
            setFormValues(changedFormValues);
        }
        else{
            //setFormValues(initialFormValues);
        }
    
    }, [selectedPosition]);

    


    const onFormSubmit = (e) =>{
        e.preventDefault()
        setIsLoading(true);
        consumeAPI(urlApi, formValues);
        //localStorage.setItem('formValues',  JSON.stringify(formValues));
    }
    
    // const handleSubmit = (e) => {

    //     const changedFormValues = {
    //         ...formValues,
    //         [e.target.name] : e.target.value
    //     }
        
        
    // }

    const handleInitialMonthSelect = (e) => {

        
        
        const changedMonthsValues = {
            ...formValues,
            initialMonth: e
        }
        setFormValues(changedMonthsValues);

    }

    const handleFinalMonthSelect = (e) => {

        
        
        const changedMonthsValues = {
            ...formValues,
            finalMonth: e
        }
        setFormValues(changedMonthsValues);

    }

    const searchApi = (name) => {
        request = "http://localhost:105/farm/"+name

        fetch(request).then(async (response) => {
            if (response.ok) {
              alert(await response.json());
             
            } else{
              //setError(await response.text());
              
            }
          })
          .catch((err) => {
            //setError(err.message);
          });
    }


    return(
        


        <Form onSubmit={onFormSubmit} >

            <Row className="mb-3">
                <h6>Ingresa el nombre de una finca</h6>
                {/* <Form.Group as={Col} controlId="formGridLat">
                    <FloatingLabel controlId="floatingInputLat" label="Latitud">
                        <Form.Control 
                            type="text"
                            placeholder="3.5454845"  
                            value={formValues.lat}
                            
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridLng">
                    <FloatingLabel controlId="floatingInputLng" label="Longitud">
                        <Form.Control 
                            type="text"
                            placeholder="3.5454845"  
                            value={formValues.lng}
                        />
                    </FloatingLabel>
                </Form.Group> */}
                <Form.Group as={Col} controlId="formSearch">
                    <FloatingLabel
                        controlId="searchInput"
                        label="Nombre finca"
                        className="mb-3"
                        onChange={searchApi}
                    >
                        <Form.Control type="text" placeholder="El Zapal" />
                    </FloatingLabel>
                </Form.Group>

                {/* <Form.Group as={Col} controlId="searchSelect">
                    <Select options={months2}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        
                        isMulti 
                        />
                </Form.Group> */}
            </Row>

            <Row>
                <h6>Selecciona un semestre</h6>
                <Form.Group as={Col} controlId="formGridInitialMonth">
                
                    <FloatingLabel controlId="floatingSelectInitialMonth" label={formValues.initialMonth}>
                        <Form.Select 
                            aria-label="Floating label select example"
                            onSelect={handleInitialMonthSelect}
                            
                        >
                            <option>Selecciona un mes</option>
                            {
                            months.map( month => (
                                
                                <option>{month}</option>

                                    )

                                )
                            }
                            
                        </Form.Select>
                    </FloatingLabel>

                </Form.Group>
                <Form.Group as={Col} controlId="formGridFinalMonth">
                
                    <FloatingLabel controlId="floatingSelectInitialMonth" label={formValues.finalMonth}>
                        <Form.Select 
                            aria-label="Floating label select example"
                            onSelect={handleFinalMonthSelect}
                            
                        >
                            <option>Selecciona un mes</option>
                            {
                            months.map( month => (
                                
                                <option value={month}>{month}</option>

                                    )

                                )
                            }
                            
                        </Form.Select>
                    </FloatingLabel>

                </Form.Group>
               
                    
{/* 
                <Col>
                
                    <DropdownButton 
                        className="mb-2"
                        id="dropdown-autoclose-true"
                        title={formValues.initialMonth}
                        name="initialMonth"
                        onSelect={handleInitialMonthSelect}
                        variant="outline-primary"

                    >
                    {
                        months.map( month => (
                            <Dropdown.Item id="initialMonth" eventKey={month}>{month}</Dropdown.Item>

                            )

                        )
                    }
                       

                    </DropdownButton>
                
                </Col>
                <Col>
                
                    <DropdownButton 
                        className="mb-2"
                        id="dropdown-autoclose-true"
                        title={formValues.finalMonth}
                        name="finalMonth"
                        onSelect={handleFinalMonthSelect}
                        variant="outline-primary"

                    >
                    {
                        months.map( month => (
                            <Dropdown.Item id="finalMonth" eventKey={month}>{month}</Dropdown.Item>

                        )

                    )
                }
                       

                    </DropdownButton>

                
                
                </Col> */}
            
                

            </Row>
            <Row className="mt-4 mx-auto" style={{width: '825px'}}>
                <Col
                    className="d-grid gap-2"
                    
                >
                    <Button variant="primary" type="submit" size="lg">
                        Enviar
                    </Button>
                
                </Col>

            </Row>
                

        </Form>


      
    )
}

export default CoordinatesForm;