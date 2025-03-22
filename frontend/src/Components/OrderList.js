import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/orders/${id}`);
      fetchOrders(); // Refresh the order list after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Delivery Method</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.contactNumber}</TableCell>
                <TableCell>{order.deliveryMethod}</TableCell>
                <TableCell>
                  <ul>
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.product} - Quantity: {product.quantity} - Price: ${product.price}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderList;