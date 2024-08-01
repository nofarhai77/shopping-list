import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline} from '@mui/material';
import './App.css';

// Create RTL theme
const theme = createTheme({
  direction: 'rtl',
});

function App() {
  // State to manage the input values and items list
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);

  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleAddClick = () => {
    if (product && category !== '') {
      const updatedItems = [...items];
      const itemIndex = updatedItems.findIndex(item => item.product === product && item.category === category);

      if (itemIndex > -1) {
        updatedItems[itemIndex].count += 1;
      } else {
        updatedItems.push({ product, category, count: 1 });
      }

      setItems(updatedItems);
	  // Clear input fields
      setProduct('');
      setCategory('');
    }
  };

  const handleRemoveClick = (productToRemove, categoryToRemove) => {
    const updatedItems = items.map(item => 
      item.product === productToRemove && item.category === categoryToRemove
        ? { ...item, count: item.count - 1 }
        : item
    ).filter(item => item.count > 0);

    setItems(updatedItems);
  };

  // Send items list to the server
  const saveItemsToDatabase = async () => {
    try {
      const response = await fetch('https://desired-database.com/save-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Items saved successfully:', result);
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const categoryNames = [
    'בשר ודגים',
    'גבינות',
    'ירקות ופירות',
    'מאפים',
    'מוצרי ניקיון'
  ];

  // Map that stores item counts per category
  const categoryCounts = categoryNames.reduce((acc, categoryName, index) => {
    const itemCounts = items
      .filter(item => item.category === index)
      .reduce((itemAcc, item) => {
        itemAcc[item.product] = (itemAcc[item.product] || 0) + item.count;
        return itemAcc;
      }, {});

    acc[index] = {
      itemCounts,
      totalCount: Object.values(itemCounts).reduce((a, b) => a + b, 0)
    };
    return acc;
  }, {});

  // Calculate the total number of items of all categories
  const totalItems = Object.values(categoryCounts).reduce((sum, category) => sum + category.totalCount, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <h1>רשימת קניות</h1>
          <div style={{ textAlign: 'left', width: '100%', marginLeft: '720px' }}>
            <h5>סה"כ מוצרים: {totalItems}</h5>
          </div>

          <Stack direction="row" alignItems="center">
            <TextField
              id="product"
              variant="outlined"
              label="מוצר"
              value={product}
              onChange={handleProductChange}
              inputProps={{ min: 0, style: { textAlign: 'center' } }}
              sx={{ marginLeft: 4 }}
            />
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              sx={{ marginLeft: 4 }}
            >
              <MenuItem value="">
                <em>בחר קטגוריה</em>
              </MenuItem>
              <MenuItem value={0}>בשר ודגים</MenuItem>
              <MenuItem value={1}>גבינות</MenuItem>
              <MenuItem value={2}>ירקות ופירות</MenuItem>
              <MenuItem value={3}>מאפים</MenuItem>
              <MenuItem value={4}>מוצרי ניקיון</MenuItem>
            </Select>
            <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={handleAddClick}>
              הוסף
            </Button>
          </Stack>

          <h3>סל הקניות</h3>

          <TableContainer sx={{ width: 500 }} component={Paper}>
            <Table sx={{ width: 500 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {categoryNames.map((name, index) => (
                    <TableCell key={index} align="right">
                      {name} ({categoryCounts[index]?.totalCount || 0})
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {categoryNames.map((_, categoryIndex) => (
                    <TableCell key={categoryIndex} align="right">
                      {Object.entries(categoryCounts[categoryIndex]?.itemCounts || {}).map(([itemName, count]) => (
                        <div key={itemName}>
                          {itemName}: {count}
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemoveClick(itemName, categoryIndex)}
                            sx={{ marginLeft: 1 }}
                          >
                            הסר
                          </Button>
                        </div>
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={saveItemsToDatabase}>
              שמור בבסיס הנתונים
            </Button>
          </Stack>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
