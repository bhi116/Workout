import React from "react";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

export default function Addtraining(props) {

    const [open, setOpen] = React.useState(false);
    const [training, setTraining] = React.useState({
        activity: '', duration: '', date: '', customer: ''
    });

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => {
                setCustomers(data._embedded.customers);
                setLoading(false);
            })
            .catch(error => {
                console.error("Virhe asiakastietojen haussa:", error);
                setLoading(false);
            });
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setTraining({...training, [event.target.name]: event.target.value })
    }

    const handleCustomerChange = (event) => {
        const selectedCustomerId = event.target.value;
        console.log('Valittu asiakas ID:', selectedCustomerId);
        setTraining({...training, customer: event.target.value})
    }

    const addTraining = () => {
        props.saveTraining(training);
        handleClose();
    }

    return (
        <div>
            <Button style={{margin: 10}} variant="outlined" onClick={handleClickOpen}>
            Add Training
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Training</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            name="activity"
                            value={training.activity}
                            onChange={e => handleInputChange(e)}
                            label="Activity"
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            name="duration"
                            value={training.duration}
                            onChange={e => handleInputChange(e)}
                            label="Duration"
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            name="date"
                            type="datetime-local"
                            value={training.date}
                            onChange={e => handleInputChange(e)}
                            fullWidth
                        />
                        {loading ? (
                            <p>Loading customers...</p>
                        ) : (
                        <FormControl fullWidth required>
                            <InputLabel>Customer</InputLabel>
                            <Select
                                name="customer"
                                value={training.customer || ''}
                                onChange={e => handleCustomerChange(e)}
                                label="Customer"
                            >
                                {customers.map((customer) => (
                                    <MenuItem key={customer.id} value={customer._links.self.href}>
                                        {`${customer.firstname} ${customer.lastname}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addTraining}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}