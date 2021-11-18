const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// View Users
exports.view = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM store WHERE status = "active"', (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from store table: \n', rows);
  });
}

// Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // User the connection
  connection.query('SELECT * FROM store WHERE item LIKE ? OR store LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from store table: \n', rows);
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { item, store, quantity, comments } = req.body;
  let searchTerm = req.body.search;

  // User the connection
  connection.query('INSERT INTO store SET item = ?, store = ?, quantity = ?, comments = ?', [item, store, quantity, comments], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'item added successfully.' });
    } else {
      console.log(err);
    }
    console.log('The data from store table: \n', rows);
  });
}


// Edit user
exports.edit = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM store WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from store table: \n', rows);
  });
}


// Update User
exports.update = (req, res) => {
  const { item, store, quantity, comments } = req.body;
  // User the connection
  connection.query('UPDATE store SET item = ?, store = ?, quantity = ?, comments = ?', [item, store, quantity, comments, req.params.id], (err, rows) => {

    if (!err) {
      // User the connection
      connection.query('SELECT * FROM store WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it
        
        if (!err) {
          res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
        } else {
          console.log(err);
        }
        console.log('The data from store table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from store table: \n', rows);
  });
}

// Delete User
exports.delete = (req, res) => {

  // Delete a record

  // User the connection
  // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

  //   if(!err) {
  //     res.redirect('/');
  //   } else {
  //     console.log(err);
  //   }
  //   console.log('The data from user table: \n', rows);

  // });

  // Hide a record

  connection.query('UPDATE store SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('Item successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from store table are: \n', rows);
  });

}

// View Users
exports.viewall = (req, res) => {

  // User the connection
  connection.query('SELECT * FROM store WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from store table: \n', rows);
  });

}