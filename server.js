const express = require('express');



const app = express();
const bodyParser = require('body-parser');
const pg = require('pg');
const cors= require('cors')
app.use(cors())

// Parse the request body as JSON
app.use(bodyParser.json());
app.get('/',  function (req,res){
  res.send('hello')
});
// Save the coordinates to the database
app.post('/save-point', function(req, res) {
  // Connect to the database
  const client = new pg.Client({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  client.connect();
  const pointGeom = `POINT(${req.body.lng} ${req.body.lat})`;
  // Insert the coordinates into the table
  client.query(
    'INSERT INTO points (shape_id, point) VALUES ($1, $2)',
    [req.body.shape_id, pointGeom],
    function(error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log('point geometry inserted successfully!');
      }
    }
    );
  });

// post for the line shape
  app.post('/save-line', function(req, res) {
    // Connect to the database
    const client = new pg.Client({
      host: '',
    user: '',
    password: '',
    database: ''
    });
    client.connect();
    const lineGeom = `LINESTRING(${req.body.coord.map(c => `${c[0]} ${c[1]}`).join(', ')})`;
    // Insert the coordinates into the table
    console.log(req.body.coord)
    client.query(
      'SELECT ST_GeomFromText($1, 4326)',
      [lineGeom],
      function(error, result) {
        if (error) {
          console.error(error);
        } else {
          // Insert the line geometry into the table
          client.query(
            'INSERT INTO lines (id, geom) VALUES ($1, $2)',
            [req.body.id, result.rows[0].st_geomfromtext],
            function(error, result) {
              if (error) {
                console.error(error);
              } else {
                console.log('Line geometry inserted successfully!');
              }
            }
          );
        }
      }
    );
    });


app.post('/save-polygon', function(req, res) {
   // Connect to the database
   const client = new pg.Client({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  client.connect();
  const polyGeom = `POLYGON((${req.body.coord[0].map(c => `${c[0]} ${c[1]}`).join(', ')}))`;
  console.log(req.body.coord[0])
  client.query(
    'SELECT ST_GeomFromText($1, 4326)',
    [polyGeom],
    function(error, result) {
      if (error) {
        console.error(error);
      } else {
        // Insert the polygon geometry into the table
        client.query(
          'INSERT INTO polygons (id, geom) VALUES ($1, $2)',
          [req.body.id, result.rows[0].st_geomfromtext],
          function(error, result) {
            if (error) {
              console.error(error);
            } else {
              console.log('polygon geometry inserted successfully!');
            }
          }
      );
    }
  }
);

});
// ******************** gETTING COORDINATES FROM DATABASE**************************




app.get('/api/points/:id', (req, res) => {
  const client = new pg.Client({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  client.connect();
  const id = req.params.id;
  
  client.query(
    'SELECT ST_AsText(point) FROM points WHERE shape_id = $1',
    [id],
    (error, result) => {
      if (error) {
        console.error(error);
        res.send({ error });
      } else {
        // Send the point geometry as a text representation to the client
        res.send({ geom: result.rows[0] });
      }
    }
  );
});


app.get('/api/lines/:id', (req, res) => {
  const client = new pg.Client({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  client.connect();
  const id = req.params.id;
  
  client.query(
    'SELECT ST_AsText(geom) FROM lines WHERE id = $1',
    [id],
    (error, result) => {
      if (error) {
        console.error(error);
        res.send({ error });
      } else {
        // Send the point geometry as a text representation to the client
        res.send({ geom: result.rows[0] });
      }
    }
  );
});


app.get('/api/polygons/:id', (req, res) => {
  const client = new pg.Client({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  client.connect();
  const id = req.params.id;
  
  client.query(
    'SELECT ST_AsText(geom) FROM polygons WHERE id = $1',
    [id],
    (error, result) => {
      if (error) {
        console.error(error);
        res.send({ error });
      } else {
        // Send the point geometry as a text representation to the client
        res.send({ geom: result.rows[0] });
        
      }
    }
  );
  
});

  
  // Start the server
  app.listen(3000, function() {
    console.log('Server listening on port 3000');
  });