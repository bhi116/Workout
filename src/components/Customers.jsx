import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Addcustomer from "./addCustomer";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';


ModuleRegistry.registerModules([AllCommunityModule]);


export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const gridRef = useRef();
    const [open, setOpen] = useState(false);


    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data._embedded.customers))
    }

    const saveCustomer = (customer) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(response => fetchData())
        .catch(err => console.error(err))
    }

    const deleteCustomer = (url) => {
        if (window.confirm("Are you sure?")) {
        fetch(url, {method: 'DELETE'})
        .then(res => {
            setOpen(true);
            fetchData()})
        .catch(err => console.error(err))
      }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const columns = [
        {headerName: 'Firstname', field: 'firstname'},
        {headerName: 'Lastname', field: 'lastname'},
        {headerName: 'Streetaddress', field: 'streetaddress'},
        {headerName: 'Postcode', field: 'postcode'},
        {headerName: 'City', field: 'city'},
        {headerName: 'Email', field: 'email'},
        {headerName: 'Phone', field: 'phone'},
        //{headerName: '', field: 'edit', filter: false, sortable: false, width: 100,
        //    cellRenderer: (params) => <Editcar updateCar={updateCar} car={params.data} />
        //},
        {headerName: '', filter: false, sortable: false, width: 100, field: '_links.self.href',
           cellRenderer: (params) => 
            <Button size="small" color="secondary" onClick={() => deleteCustomer(params.value)}>Delete</Button>
        }
      ]

    return (
        <div>
            <h1>Customers</h1>
            <Addcustomer saveCustomer={saveCustomer} />
            <div style={{ height: '600px', width: '99vw'}}>
                <AgGridReact 
                    ref={gridRef}
                    onGridReady={ params => gridRef.current = params.api }
                    rowData={customers}
                    columnDefs={columns}
                    rowSelection={{ mode: 'singleRow', checkboxes: false }}
                    pagination={true}       
                    paginationPageSize={10}
                    paginationPageSizeSelector={[5, 10, 25, 50]} 
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message="Customer deleted"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            ></Snackbar>
        </div>
    ) 

    
}