import React, {useState, useEffect} from "react";
import { Table} from "react-bootstrap";

const Results = (returnedData) => {


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
                    <tr>
                    
                    <td>Number of post-sowing herbicides applications</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                
                    <td>Number of applications of insecticides</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    
                    {/* <td colSpan="2">Larry the Bird</td> */}
                    <td>Total amount of nitrogen applied (kg/ha)</td>
                    </tr>

                    <tr>
                    
                    <td>Total amount of phosporus applied (kg/ha)</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                    <tr>
                    
                    <td>Total amount of potassium applied</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                    <tr>
                    
                    <td>Cultivars' group</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                    <tr>
                    
                    <td>Seed treatment</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                    <tr>
                    
                    <td>Conservation agriculture</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>

                    
                </tbody>

                <thead>
                    <tr>
        
                    <th>Yield</th>
                    <th>Current</th>
                    <th>Optimal</th>
                    </tr>
                </thead>
            </Table>
        </div>



        
    )
}

export default Results;