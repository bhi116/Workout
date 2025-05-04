import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Addtraining from './Addtraining';


ModuleRegistry.registerModules([AllCommunityModule]);


export default function Customers() {

    const [trainings, setTrainings] = useState([]);
    const gridRef = useRef();
    const [open, setOpen] = useState(false);


    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
        .then(response => response.json())
        .then(data => {
            const Trainings = data._embedded.trainings;
    
            // haetaan asiakkaan nimi
            const customerFetches = Trainings.map(training =>
              fetch(training._links.customer.href)
                .then(response => response.json())
                .then(customer => ({
                  ...training,
                  customerName: `${customer.firstname} ${customer.lastname}`
                }))
            );

            Promise.all(customerFetches).then(trainingsWithCustomers => {
            setTrainings(trainingsWithCustomers);
            });
        })
        .catch(error => console.error("Virhe datan haussa:", error));
    }

    // poista harjoitus
    const deleteTraining = (url) => {
        if (window.confirm("Are you sure?")) {
        fetch(url, {method: 'DELETE'})
        .then(response => {
            setOpen(true);
            fetchData()})
        .catch(err => console.error(err))
      }
    }

    // tallennetaan uusi harjoitus
    const saveTraining = (training) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
        .then(response => fetchData())
        .catch(err => console.error(err))
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };
    
    const columns = [
        {headerName: 'Date', field: 'date', valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Duration', field: 'duration'},
        {headerName: 'Activity', field: 'activity'},
        {headerName: 'Customer', field: 'customerName'},
        {headerName: '', filter: false, sortable: false, width: 100,
            field: '_links.self.href', cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            cellRenderer: (params) => 
           <Button size="small" color="secondary" onClick={() => deleteTraining(params.value)}>Delete</Button>
        }
        
    ]
    

    return (
        <div>
            <h1>Trainings</h1>
            <Addtraining saveTraining={saveTraining} />
            <div style={{ height: '600px', width: '99vw'}}>
                <AgGridReact 
                    ref={gridRef}
                    onGridReady={ params => gridRef.current = params.api }
                    rowData={trainings}
                    columnDefs={columns}
                    rowSelection={{ mode: 'singleRow', checkboxes: false }}
                    pagination={true}       
                    paginationPageSize={10}
                    paginationPageSizeSelector={[5, 10, 25, 50]}
                    rowHeight={60}  
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message="Training deleted"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            ></Snackbar>
        </div>
    ) 

    
}