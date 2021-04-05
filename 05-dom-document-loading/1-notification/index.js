export default class NotificationMessage {
  static activeMessage;

  constructor(message, {
    duration = 2000,
    type = 'success'
  } = {}) {

    if (NotificationMessage.activeMessage) {
      NotificationMessage.activeMessage.remove();
    }
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
           ${this.message}
          </div>
        </div>
      </div>
        `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    NotificationMessage.activeMessage = this.element;
  }

  show(elem = document.body) {
    elem.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
