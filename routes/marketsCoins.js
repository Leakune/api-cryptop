const marketRoutes = (app, fs) => {
  // variables
  const dataPath = './data/marketsCoins.json';
  let id = 3;

  // helper methods
  const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            throw err;
        }

        callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

      fs.writeFile(filePath, fileData, encoding, (err) => {
          if (err) {
              throw err;
          }

          callback();
      });
  };

  // READ (All)
  app.get('/marketsCoins', (req, res) => {
    readFile(data => {
      res.send(data);
    }, true);
  });

  // READ (one)
  app.get('/marketsCoins/:id', (req, res) => {
    readFile(data => {
      const found = data.find(market => market.ID == req.params.id);
      if(!found) {
        return res.status(404).end();
      }
      //res.json(found);
      res.send(found);
      }, true);
  });

  // UPDATE
  app.put('/marketsCoins/:id', (req, res) => {
    if(req.body.ID === undefined ||
      req.body.NAME === undefined ||
      req.body.PRICE_USD === undefined ||
      req.body.PRICE_EUR === undefined ||
      req.body.IMAGEURL === undefined) {
        return res.status(400).end();
    }
    readFile(data => {
      const found = data.find(market => market.ID == req.params.id);
      if(!found) {
        return res.status(404).end();
      }
      //TODO test data[found]
      // const userId = req.params["id"];
      // data[userId] = req.body;
      data.found.ID = req.body.ID,
      data.found.NAME = req.body.NAME,
      data.found.PRICE_USD = req.body.PRICE_USD,
      data.found.PRICE_EUR = req.body.PRICE_EUR,
      data.found.IMAGEURL = req.body.IMAGEURL,
      data.found.COMMENTS = req.body.COMMENTS,

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(201).send(`market id:${req.params.id} updated`);
      });
    }, true);
  });
  
  // CREATE
  app.post('/marketsCoins', (req, res) => {
    if(req.body.NAME === undefined ||
      req.body.PRICE_USD === undefined ||
      req.body.PRICE_EUR === undefined) {
        return res.status(400).end();
    }
    readFile(data => {
      data.push({
        "ID" : ++id,
        "NAME" : req.body.NAME,
        "PRICE_USD" : req.body.PRICE_USD,
        "PRICE_EUR" : req.body.PRICE_EUR,
        "IMAGEURL" : req.body.IMAGEURL,
        "COMMENTS" : req.body.COMMENTS
      });
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(201).send('new market added');
    });
    }, true);
  });
  // app.post('/users', (req, res) => {

  //   readFile(data => {
  //       // Note: this isn't ideal for production use. 
  //       // ideally, use something like a UUID or other GUID for a unique ID value
  //       const newUserId = Date.now().toString();

  //       // add the new user
  //       data[newUserId.toString()] = req.body;

  //       writeFile(JSON.stringify(data, null, 2), () => {
  //           res.status(200).send('new user added');
  //       });
  //   },
  //       true);
  // });

  // DELETE
  app.delete('/marketsCoins/:id', (req, res) => {
    readFile(data => {
      const deleteId = parseInt(req.params.id);
      const foundIndex = data.findIndex((market) => market.ID === deleteId);
      if(foundIndex === -1) {
        return res.status(404).end();
      }
      data.splice(foundIndex, 1);
      res.status(204).end();
    }, true);
  });
};

module.exports = marketRoutes;