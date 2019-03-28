let nodeSize = 50, messagesSize = 20;
var networkStartX = nodeSize, networkStartY = nodeSize, totalSelected = 0, timestamp = 0;
var messages, selecteds;

function setup() {
  createCanvas(networkStartX + 15*nodeSize + 1 + 400, networkStartY + 15*nodeSize + 1);

  input = createInput();
  input.position(width / 4, height + 10);
  button = createButton("Send :)");
  button.position(width / 4 + 173, height + 10);
  button.mouseClicked(send);

  messages = new Array();
  selecteds = new Array();
  network = new Array(15);
  for (var i = 0; i < 15; i ++) {
    network[i] = new Array(15);
    for (var j = 0; j < 15; j ++)
      network[i][j] = new Node(j + 1);
  }
}

function mouseClicked() {
  var i = int((mouseY - networkStartY) / nodeSize), j = int((mouseX - networkStartX) / nodeSize);
  if (i < 0 || j < 0 || i >= 15 || j >= 15) return;
  if (!network[i][j].selected) selecteds.push(createVector(i, j));
  else {
    for (var k = 0; k < selecteds.length; k ++)
      if (i == selecteds[k].x && j == selecteds[k].y) {
        selecteds.splice(k, 1);
        break;
      }
  }
  network[i][j].selected = !network[i][j].selected;
}

function send() {
  if (selecteds.length != 2 || isNaN(input.value()) || network[selecteds[0].x][selecteds[0].y].overloaded()) {
    console.log("Bicho, não, tá? NÃO");
    return;
  }
  messages.push(new Message(messages.length + 1, int(input.value()), selecteds[0], selecteds[1]));
  // for (var i = 0; i < 2; i ++)
  //   network[selecteds[i].x][selecteds[i].y].selected = false;
  // selecteds.splice(0, 2);
}

function draw() {
  background(255, 255, 255);
  textSize(nodeSize / 2); textAlign(CENTER, CENTER);
  for (var i = 1; i <= network.length; i ++) text(i, nodeSize / 2, i * nodeSize + (nodeSize / 2));
  for (var i = 1; i <= network.length; i ++) text(i, i * nodeSize + (nodeSize / 2), nodeSize / 2);
  push();
    translate(networkStartX, networkStartY);
    for (var i = 0; i < network.length; i ++)
      for (var j = 0; j < network[i].length; j ++) {
        push();
          translate(j * nodeSize, i * nodeSize);
          network[i][j].display();
        pop();
      }
  pop();
  push();
    translate(width - 400, 0);
    for (var i = 0; i < messages.length; i ++) {
      messages[i].update();
      messages[i].display();
      translate(0, messagesSize);
    }
  pop();
}
