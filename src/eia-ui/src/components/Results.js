import React, {useState, useEffect} from "react";
import { Table} from "react-bootstrap";

const Results = (returnedData) => {
    
    let returnedDataFixed = returnedData.returnedData;

    useEffect(() => {
        returnedDataFixed = returnedData.returnedData;
        
        
      }, [returnedData]);


    

    
    return(

        <div >

            <h6>Resultados</h6>
            <Table striped bordered hover size="sm">
                
                <thead>
                    <tr>
        
                    <th>Predictors</th>
                    <th>Current</th>
                    <th>Optimal</th>
                    </tr>
                </thead>
                <tbody>

                
                    {   //Se recorre el objeto (que eran un json antes de estar en este componente) y se ponen los datos en la tabla
                        Object.keys(returnedDataFixed.predictors).map((predictor, i)=>(

                            <tr>
                                <td>{predictor}</td>
                                <td>{returnedDataFixed.predictors[predictor].current}</td>
                                <td>{returnedDataFixed.predictors[predictor].optimal}</td>
                            </tr>
                            )

                        )
                    }
                

                    
                </tbody>

                <thead>
                    <tr>
        
                    <th>Yield</th>
                    <th>{returnedDataFixed['yield'].current}</th>
                    <th>{returnedDataFixed['yield'].optimal}</th>
                    </tr>
                </thead>
            </Table>
        </div>



        
    )
}

export default Results;