class Ball {
  static all = [];
  static isMoving = true;

  constructor() {
      Ball.all.push(this)
      this.number = Ball.all.length;
      this.el = this.create();
      this.intervalId = -1;
      this.coordinates = [
          Math.random() * (Canvas.rect.width - this.diameter),
          Math.random() * (Canvas.rect.height - this.diameter)
      ];
      this.direction = Math.floor(Math.random() * 360);
      this.speed = Math.ceil(Math.random() * 10);
      this.toggleMotion();
      Table.addRow(this);
      Table.render(this);
  }

  //coordinates as array like [x,y]
  get coordinates() { return this._coordinates }
  set coordinates([x,y]) {
      this._coordinates = [x,y];
      this.el.style.left = x + 'px';
      this.el.style.bottom = y + 'px';
  }

  create() {
      const el = document.createElement("div")
      el.innerHTML = `<div class="ball-count">${this.number}</div>`
      el.className = "ball"

      const R = Math.floor(23 + Math.random() * 80)
      el.style.width = R + 'px';
      el.style.height = R + 'px';

      this.color = {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255)
      };
      el.style.background = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;

      this.diameter = R;
      Canvas.bg.append(el);

      return el
  }

  move() {
      const distance = this.speed
      const [x,y] = this.coordinates;
      this.coordinates = [
          x + distance * Math.cos(toRadians(this.direction)),
          y + distance * Math.sin(toRadians(this.direction))
      ]
      this.bounceIfOnEdges()
  }

  bounceIfOnEdges() {
      const [x,y] = this.coordinates;
      const width = Canvas.rect.width - this.diameter;
      const height = Canvas.rect.height - this.diameter;

      if (x < 0 || x > width) {
          this.direction = toDegrees(Math.atan2(Math.sin(toRadians(this.direction)), -Math.cos(toRadians(this.direction))));
          if (x < 0) this.coordinates = [0, y]
          else if (x > width) this.coordinates = [width, y]
      }

      if (y < 0 || y > height) {
          this.direction = toDegrees(Math.atan2(-Math.sin(toRadians(this.direction)), Math.cos(toRadians(this.direction))));
          if (y < 0) this.coordinates = [x, 0]
          else if (y > height) this.coordinates = [x, height]
      }
  }

  static handleStartStop() {
      Ball.isMoving = !Ball.isMoving;
      Ball.all.forEach(b => { b?.toggleMotion()})
  }

  toggleMotion() {
      clearInterval(this.intervalId)
      if (Ball.isMoving) {
          this.intervalId = setInterval(() => {
              this.move();
              Table.render(this)
          }, 10)
      }
  }

  destroy() {
      this.el.remove();
      this.row.remove();
      const index = Ball.all.findIndex(x => x?.number == this.number);
      Ball.all[index] = null;

      delete this;
  }

  static destroyAll() {
      Ball.all.forEach(ball => { ball?.destroy()})
      Ball.all = [];
  }
}

class Canvas {
  static bg = document.querySelector("#bounce-bg")

  static get rect () {
      return this.bg.getBoundingClientRect()
  }
}

class Table {
  static tbody = document.querySelector("tbody")

  static render(ball) {
      const [,,,x,y,dir] = ball.row.children;
      x.innerText = ball.coordinates[0].toFixed(2);
      y.innerText = ball.coordinates[1].toFixed(2);
      dir.innerText = Math.round(ball.direction);
  }

  static addRow(ball) {
      const row = document.createElement("tr")
      row.innerHTML = `
          <td>${ball.number}</td>
          <td>
              <div class="color-td" style="background:rgb(${ball.color.r}, ${ball.color.g}, ${ball.color.b});"></div>
          </td>
          <td>${ball.diameter}</td>
          <td></td>
          <td></td>
          <td>${ball.direction}</td>
          <td>${ball.speed}</td>
      `;
      const td = document.createElement("td");
      td.innerHTML = '<button class="btn btn-sm btn-danger">×</button>';
      td.style.color = "red";
      td.onclick = () => ball.destroy();
      row.appendChild(td);
      document.querySelector("tbody").appendChild(row);
      ball.row = row;
  }
}

const toRadians = a => a * Math.PI / 180
const toDegrees = r => (360 + r * (180 / Math.PI)) % 360