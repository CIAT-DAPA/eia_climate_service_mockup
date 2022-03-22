import React, {useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal'

const Glossary = () => {

    const [modalShow, setModalShow] = useState(false);


    const GlossaryModal = (props) => {

        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Glosario de factores de manejo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Definiciones</h4>
                    <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        );
    }



    return (
        <>
            <Button variant="outline-secondary" onClick={() => setModalShow(true)}>
                Glosario
            </Button>

            <GlossaryModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>

    );
}
export default Glossary;