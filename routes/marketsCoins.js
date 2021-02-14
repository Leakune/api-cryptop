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
    readFile(data => {
      const found = data.find(market => market.ID == req.params.id);
      if(!found) {
        return res.status(404).end();
      }
      //TODO test data[found]
      const userId = req.params["id"];
      data[userId] = req.body;
      res.status(204).end();
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
        ...req.body
      });
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send('new market added');
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