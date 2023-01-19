import { useState, useEffect } from 'react';
import './App.css';
import { Button, Modal } from 'react-bootstrap'
import AtividadeForm from './components/AtividadeForm'
import AtividadeLista from './components/AtividadeLista'
import api from './api/atividade'

function App() {
    const [showAtividadeModal, setShowAtividadeModal] = useState(false);
    const [smShowConfirmModal, setSmShowConfirmModal] = useState(false);
    //const [index] = useState(0)
    const [atividades, setAtividades] = useState([]);
    const [atividade, setAtividade] = useState({id: 0});
    
    const handleAtividadeModal = () => {
        setShowAtividadeModal(!showAtividadeModal);
    }

    const handleConfirmModal = () => {
        setSmShowConfirmModal(!smShowConfirmModal);
    }
    
    const pegarTodasAtividades = async () => {
        const response = await api.get('atividade');
        return response.data;
    }

    useEffect(() => {
        const getAtividades =  async () => {
            const todasAtividades = await pegarTodasAtividades();
            if(todasAtividades) setAtividades(todasAtividades);
        }
        getAtividades();
        //atividades.length <= 0 ? setIndex(1) : setIndex(Math.max.apply(Math, atividades.map(item => item.id)) + 1)
    }, [])

    const addAtividade = async (ativ) => {
        const response = await api.post('atividade', ativ)
        setAtividades([...atividades, response.data]);
        handleAtividadeModal()
    }

    const cancelarAtividade = () => {
        setAtividade({id: 0})
        handleAtividadeModal()
    }

    const atualizarAtividade = async (ativ) => {
        const response = await api.put(`atividade/${ativ.id}`, ativ)
        const { id } = response.data
        setAtividades(atividades.map(item => item.id === id ? response.data : item))
        setAtividade({id: 0})
        handleAtividadeModal()
    }

    const deletarAtividade = async (id) => {
        if (await api.delete(`atividade/${id}`)){

            const atividadesFiltradas = atividades.filter(atividade => atividade.id !== id)
            setAtividades([...atividadesFiltradas]);
        }
    }

    const pegarAtividade = (id) => {
        const atividade = atividades.filter(atividade => atividade.id === id)
        setAtividade(atividade[0]);
        handleAtividadeModal();
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-end mt-2 pb-3 border-bottom border-1">
                <h1 className='m-0 p-0'>
                    Atividade {atividade.id !== 0 ? atividade.id : ''}
                </h1>

                <Button variant="outline-secondary" onClick={handleAtividadeModal}>
                    <i className="fas fa-plus" />
                </Button>
            </div>

            <AtividadeLista
                pegarAtividade={pegarAtividade}
                atividades={atividades}
                handleConfirmModal={handleConfirmModal}
            />

            <Modal show={showAtividadeModal} onHide={() => {
                handleAtividadeModal()
                cancelarAtividade()
            }}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Atividade {atividade.id !== 0 ? atividade.id : ''} 
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AtividadeForm 
                        addAtividade={addAtividade}
                        cancelarAtividade={cancelarAtividade}
                        atualizarAtividade={atualizarAtividade}
                        ativSelecionada={atividade}
                        atividades={atividades}
                    />
                </Modal.Body>
            </Modal>
            
            <Modal 
                size='sm' 
                show={smShowConfirmModal}
                onHide = {handleConfirmModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Excluindo Atividade{' '}
                        {atividade.id !== 0 ? atividade.id : ''} 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir a atividade {atividade.id}?
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <button className='btn btn-outline-success me-2' onClick={() => deletarAtividade(atividade.id)}>
                        <i className='fas fa-check me-2'></i>
                        Sim
                    </button>
                    <button className='btn btn-danger me-2' onClick={() => handleConfirmModal}>
                        <i className='fas fa-times me-2'></i>
                        Não
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default App;
