// Import the required modules
import fs from "fs";
import express, { json } from "express";

// Create an express app
const app = express();

// Use the express.json middleware to parse the request body as JSON
app.use(express.json());

// Define a route to get all the data from the JSON file
app.get("/api/posts", (req, res) => {
  // Read the data from the file
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json("Error reading data.json file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Define a route to get a single data item by its id from the JSON file
app.get("/api/posts/:id", (req, res) => {
  // Get the id parameter from the request
  const id = parseInt(req.params.id);
  // Read the data from the file
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json("Error reading data.json file");
    } else {
      const dataArray = JSON.parse(data);
      const index = dataArray.findIndex((item) => item.id === id);
      if (index === -1) {
        res.status(404).json("Data not Found");
      } else {
        res.json(dataArray[index]);
      }
    }
  });
});

// Define a route to create a new data item and add it to the JSON file
app.post("/api/posts", (req, res) => {
  // Get the data from the request body

  const newData = req.body;
  // Read the data from the file
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json("Error reading data.json file");
    } else {
      const dataArray = JSON.parse(data);
      const newId = dataArray[dataArray.length - 1].id;
      newData.id = newId + 1;
      newData.created_at = new Date().toLocaleString();
      dataArray.push(newData);
      fs.writeFile("data.json", JSON.stringify(dataArray), (err) => {
        if (err) {
          res.status(500).json("Error While writing data into data.json file.");
        } else {
          res.status(201).json(newData);
        }
      });
    }
  });
});

// Define a route to update an existing data item by its id in the JSON file
app.put("/api/posts/:id", (req, res) => {
  // Get the id parameter from the request
  const id = parseInt(req.params.id);
  // Get the updated data from the request body
  const updatedData = req.body;
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json("Error reading data form data.json file");
    } else {
      const dataArray = JSON.parse(data);
      const index = dataArray.findIndex((item) => item.id === id);
      if (index === -1) {
        res.status(404).json("Data not found");
      } else {
        dataArray[index] = { ...dataArray[index], ...updatedData };
        fs.writeFile("data.json", JSON.stringify(dataArray), (err) => {
          if (err) {
            res.status(500).json("Error writing data.json file");
          } else {
            res.json(dataArray[index]);
          }
        });
      }
    }
  });
});

// Define a route to delete a data item by its id from the JSON file
app.delete("/api/posts/:id", (req, res) => {
  // Get the id parameter from the request
  const id = parseInt(req.params.id);
  // Read the data from the file
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json("Error reading data.json file");
    } else {
      const dataArray = JSON.parse(data);
      const index = dataArray.findIndex((item) => item.id === id);
      if (index === -1) {
        res.status(404).json("Data not found");
      } else {
        const deletedData = dataArray.splice(index, 1);
        fs.writeFile("data.json", JSON.stringify(dataArray), (err) => {
          if (err) {
            res.status(500).json("Error writing data.json file");
          } else {
            res.json(deletedData);
          }
        });
      }
    }
  });
});

// Start the server on port 8080
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
