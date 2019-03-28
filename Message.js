let dj = [-1, -1, -1, 0, 0, 1, 1, 1], di = [-1, 0, 1, -1, 1, -1, 0, 1];

class Message {
  constructor(messageID, data, origin, destination) {
    this.messageID = messageID;
    this.timestamp = 0;
    this.data = data;
    this.origin = origin;
    this.destination = destination;
    this.position = this.origin;
    network[origin.x][origin.y].messagesCount ++;
    this.visited = new Array(15);
    this.nextInPath = new Array(15 * 15); this.nextInPath[0] = -1;
    this.pathIt = 0;
    for (var i = 0; i < 15; i ++) this.visited[i] = new Array(15);
  }

  update() {
    this.timestamp ++;
    if (this.timestamp == (this.data + 5*this.position.x)) {
      this.timestamp = 0;
      if (!(this.position.x == this.destination.x && this.position.y == this.destination.y))
        this.move();
    }
  }

  invalid(i, j) {
    return(i < 0 || j < 0 || i >= 15 || j >= 15 || this.visited[i][j] || network[i][j].overloaded());
  }

  canReachDestinationDFS(i, j, depth) {
    if (depth > 0 && this.invalid(i, j)) return(false);
    if (i == this.destination.x && j == this.destination.y) return(true);
    this.visited[i][j] = true;
    this.sortDirections();
    for (var k = 0; k < 8; k ++) {
      if (this.canReachDestinationDFS(i + di[k], j + dj[k], depth + 1)) {
        this.nextInPath[depth] = createVector(i + di[k], j + dj[k]);
        return(true);
      }
    }
    // this.visited[i][j] = false;
    return(false);
  }

  canReachDestinationBFS(i, j) {
    var queue = new Queue();
    queue.push([i, j, new Array()]); var first = 0;
    while (!queue.empty()) {
      var u = queue.pop();
      i = u[0], j = u[1];
      if (first ++ && this.invalid(i, j)) continue;
      this.visited[i][j] = true;
      if (i == this.destination.x && j == this.destination.y) {
        this.nextInPath = u[2];
        return(true);
      }
      for (var k = 0; k < 8; k ++) {
        var p = new Array();
        for (var kk = 0; kk < u[2].length; kk ++)
          p.push(u[2][kk]);
        p.push(createVector(i + di[k], j + dj[k]));
        queue.push([i + di[k], j + dj[k], p]);
      }
    }
    return(false);
  }

  sortDirections() {
    var idiff = int((this.destination.x - this.position.x) / abs(this.destination.x - this.position.x)), jdiff = int((this.destination.y - this.position.y) / abs(this.destination.y - this.position.y));
    if (idiff === NaN) idiff = 0;
    if (jdiff === NaN) jdiff = 0;
    var directions = new Array(8);
    for (var i = 0; i < 8; i ++) directions.push(createVector(di[i], dj[i], (2 - abs(idiff - di[i])) + (2 - abs(jdiff - dj[i]))));
    directions.sort(function(x, y) {
      if (x.z > y.z) return(-1);
      else if (x.z < y.z) return(1);
      else return(0);
    });
    for (var i = 0; i < 8; i ++) di[i] = directions[i].x, dj[i] = directions[i].y;
  }

  findNewPath() {
    for (var i = 0; i < 15; i ++)
      for (var j = 0; j < 15; j ++)
        this.visited[i][j] = false;
    this.sortDirections();
    return(this.canReachDestinationBFS(this.position.x, this.position.y));
  }

  invalidPath() {
    var now = this.position, i = this.pathIt;
    while (now.x != this.destination.x || now.y != this.destination.y) {
      if (i > 0 && network[now.x][now.y].overloaded())
        return(true);
      now = this.nextInPath[i ++];
    }
    return(false);
  }

  move() {
    if (this.nextInPath[0] == -1 || this.invalidPath()) {
      if (!this.findNewPath()) return;
      this.pathIt = 0;
    }

    network[this.position.x][this.position.y].messagesCount --;
    let ni = this.nextInPath[this.pathIt].x, nj = this.nextInPath[this.pathIt].y;
    this.position = createVector(ni, nj);
    this.pathIt ++;
    network[ni][nj].messagesCount ++;
  }

  display() {
    fill(0, 0, 0);
    textSize(messagesSize);
    textAlign(LEFT, TOP);
    text(this.messageID + "(" + this.data + "): " + (this.position.x + 1) + ", " + (this.position.y + 1), 0, 0);
    // text(this.messageID + "(" + this.data + "): " + (this.position.x + 1) + ", " + (this.position.y + 1) + " || " + this.timestamp + "/" + (this.data + 5*this.position.x), 0, 0);
  }
}