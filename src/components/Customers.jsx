import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Addcustomer from "./addCustomer";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Editcustomer from "./Editcustomer";


ModuleRegistry.registerModules([AllCommunityModule]);


export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const gridRef = useRef();
    const [open, setOpen] = useState(false);


    useEffect(() => fetchData(), []);

    // haetaan kaikki asiakkaat
    const fetchData = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data._embedded.customers))
    }


    // tallennetaan uusi asiakas
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


    // poista asiakas
    const deleteCustomer = (url) => {
        if (window.confirm("Are you sure?")) {
        fetch(url, {method: 'DELETE'})
        .then(response => {
            setOpen(true);
            fetchData()})
        .catch(err => console.error(err))
      }
    }

    // päivitetään asiakkaan tiedot
    const updateCustomer = (customer, url) => {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(response => fetchData())
        .catch(err => console.error(err))
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
        {headerName: '', field: 'edit', filter: false, sortable: false,
            width: 100, cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            cellRenderer: (params) => <Editcustomer updateCustomer={updateCustomer}
            customer={params.data} />
        },
        {headerName: '', filter: false, sortable: false, width: 100,
            field: '_links.self.href', cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
           cellRenderer: (params) => 
            <Button size="medium" color="secondary" onClick={() => deleteCustomer(params.value)}>Delete</Button>
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
                    rowHeight={60} 
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message="Customer deleted"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            ></Snackbar>
        </div>
    ) 

    
}