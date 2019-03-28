class Node {
  constructor(maximumMessages) {
    this.selected = false;
    this.messagesCount = 0;
    this.maximumMessages = maximumMessages;
  }

  overloaded() {
    return(this.messagesCount == this.maximumMessages);
  }

  display() {
    let messagePercentage = (this.maximumMessages - this.messagesCount) / this.maximumMessages;
    if (this.selected === false) fill(255 * (1 - messagePercentage), 255 * messagePercentage, 0);
    else fill(0, 0, 255);

    rect(0, 0, nodeSize, nodeSize);
  }
}