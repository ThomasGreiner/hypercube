/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var Database = new (function() {
  var _db;

  this.init = function() {
    var dbSize = 12 * 1024 * 1024; //12MB
    _db = openDatabase("visualizer", "0.01", "Hypercube Visualizer", dbSize);
    
    _db.transaction(function(tx) {
      tx.executeSql(
        "create table if not exists nodes(id integer primary key asc, name text, url text unique, posX float, posY float, cluster_id integer, foreign key(cluster_id) references clusters(id) on delete cascade)",
        [],
        null,
        Database.onError
      );

      tx.executeSql(
        "create table if not exists clusters(id integer primary key asc, name text, cluster_id integer, posX float, posY float, foreign key(cluster_id) references clusters(id) on delete cascade)",
        [],
        null,
        Database.onError
      );
    });
  }

  this.getNodes = function(clusterId, callback) {
    if(clusterId) {
      execute("select * from nodes where cluster_id=? union select *, '' as url from clusters where cluster_id=?", [clusterId, clusterId], callback);
    } else {
      //root cluster
      execute("select * from nodes where cluster_id is null union select *, '' as url from clusters where cluster_id is null", [], callback);
    }
  }

  this.insertNode = function(cluster, node, attr) {
    var nData = node.toJSON();
    var cData = cluster && cluster.toJSON();

    var statement = "";
    var args = [];
    if(nData.url) {
      statement = "insert into nodes(name, url, cluster_id, posX, posY) values (?, ?, ?, ?, ?)";
      args = [nData.name, nData.url, (cData && cData.id) || null, attr.x, attr.y];
    } else {
      statement = "insert into clusters(name) values (?)";
      args = [nData.name];
    }

    _db.transaction(function(tx) {
      tx.executeSql(
        statement,
        args,
        function(tx, rs) {
          node.id = rs.insertId;
        },
        Database.onError
      );
    });
  }

  this.moveNode = function(id, x, y) {
    execute("update nodes set posX=?, posY=? where id=?", [x, y, id]);
  }

  this.updateNode = function(node) {
    //...
  }

  this.removeNode = function(node) {
    //...
  }
  
  function execute(statement, args, callback) {
    _db.transaction(function(tx) {
      tx.executeSql(
        statement,
        args,
        function(tx, rs) {
          var res = [];
          var len = rs.rows.length;
          for(var i=0; i<len; i++) {
            res.push(rs.rows.item(i));
          }
          if(typeof(callback)=="function") callback(res);
        },
        Database.onError
      );
    });
  }

  this.onError = function(tx, e) {
    console.error(e.message);
  }
})();
