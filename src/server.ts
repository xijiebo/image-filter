import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const url = require('url');
  const querystring = require('querystring');
  app.get('/filteredimage', 
          async ( req, res ) => {
                  let image_url = req.query.image_url;
                                    
                  if(!isValidUrl(image_url)) {
                    console.error("Invalid URL " + image_url);    
                    res.send("Invalid Image URL: " + image_url);
                    return;
                  } 
                  try {
                    let fileName = await filterImageFromURL(image_url);
                    res.sendFile(fileName);

                    res.on('finish', function() {    
                          deleteLocalFiles([fileName]);                
                      });
                    }
                    catch (error) {
                      res.status(500);
                      res.send("Invernal Server Error")
                    }
                                  
  } );
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();