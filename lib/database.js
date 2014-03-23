/* 
 * Copyright 2012-2014 Thomas Greiner <http://www.greinr.com>
 *
 * The contents of this file are subject to the Artistic License 2.0.
 * The full text can be found in the LICENSE.txt file and at
 * http://www.opensource.org/licenses/artistic-license-2.0
 */

var Datastore = require("nedb");
var path = require("path");

var db;

module.exports = {
  init: function(dataPath) {
    db = new Datastore({
      autoload: true,
      filename: path.join(dataPath, "visualizer.db")
    });
  },

  getNodes: function(clusterId, callback) {
    db.find({
      clusterId: clusterId
    }, function(err, res) {
      var nodes = res.map(function(node) {
        node.id = node._id;
        delete node._id;
        return node;
      });
      callback(nodes);
    });
  },

  insertNode: function(cluster, node, attr) {
    var nData = node.toJSON();
    var cData = cluster && cluster.toJSON();

    var entry = {};
    if (nData.url) {
      entry = {
        name: nData.name,
        url: nData.url,
        clusterId: (cData && "id" in cData) || null,
        posX: attr.x,
        posY: attr.y
      };
    } else {
      entry = {
        name: nData.name,
        clusterId: null,
        posX: attr.x,
        posY: attr.y
      };
    }
    
    db.insert(entry, function(err, entry) {
      if (err) {
        console.error(err);
        return;
      }
      
      node.id = entry._id;
    });
  },

  moveNode: function(id, x, y) {
    if (x === 0 && y === 0)
      return;
    
    db.update({
      _id: id
    }, {
      $set: {
        posX: x,
        posY: y
      }
    });
  }
};
